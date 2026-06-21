/**
 * Maestro — in-place editor.
 *
 * PHP localises maestroData with the precise DOM model (the <li> id for each
 * top-level item, ordered submenu slugs, pristine titles/icons). The editor
 * uses a click-to-select model with no per-item chrome: clicking a row selects
 * it (a subtle highlight) and the whole row is draggable to reorder — there are
 * no drag handles or per-item buttons. A single shared controls panel in the
 * bottom toolbar reflects the selected item. Every change (reorder, rename
 * commit, icon pick, visibility toggle, per-item reset) schedules a debounced
 * full-config POST.
 *
 * The menu is forced to a stable expanded state while editing: body.folded
 * and body.auto-fold are stripped on init and re-stripped if common.js puts
 * them back. The collapse button is neutralised. This is what makes editing
 * work in folded mode without the previous CSS layout fights.
 *
 * jQuery is used only for the sortable drag layer.
 */
( function ( $ ) {
	'use strict';

	if ( typeof window.maestroData === 'undefined' ) {
		return;
	}

	var D = window.maestroData;
	var I = D.i18n;

	// Flat working model: slug -> { title, icon, hiddenRoles, isSub, parent? }.
	// Null-prototype so a menu slug like "__proto__" (plugins register arbitrary
	// strings) can't pollute the prototype or shadow built-ins on lookup.
	var model = Object.create( null );
	var selectedSlug = null;
	var panel = {};        // references into the shared panel
	var statusEl = null;   // status indicator span
	var saveTimer = null;
	var saveInFlight = false;  // a full-replace POST is currently running
	var savePending = false;   // another change arrived mid-flight; save again on land
	var inFlight = null;       // promise that settles when the whole save chain is done

	/* ---------- helpers ---------------------------------------------------- */

	function pristineTop( slug ) {
		return ( D.pristine.top && D.pristine.top[ slug ] ) || { title: '', icon: '' };
	}
	function pristineSub( slug ) {
		return ( D.pristine.sub && D.pristine.sub[ slug ] ) || { title: '' };
	}
	function el( tag, cls, text ) {
		var n = document.createElement( tag );
		if ( cls ) { n.className = cls; }
		if ( text != null ) { n.textContent = text; }
		return n;
	}
	function closePopovers() {
		document.querySelectorAll( '.maestro-popover' ).forEach( function ( p ) { p.remove(); } );
	}
	function speak( message, politeness ) {
		if ( window.wp && window.wp.a11y && typeof window.wp.a11y.speak === 'function' ) {
			window.wp.a11y.speak( message, politeness );
		}
	}
	function cssEscape( s ) {
		if ( window.CSS && window.CSS.escape ) { return window.CSS.escape( s ); }
		return String( s ).replace( /(["\\\]])/g, '\\$1' );
	}
	function liForSlug( slug ) {
		return document.querySelector( '[data-maestro-slug="' + cssEscape( slug ) + '"]' );
	}

	/* ---------- modified-state indicator ----------------------------------- */

	/**
	 * Refresh the non-color "modified" indicator on a menu row.
	 *
	 * Driven by window.maestroLogic.diffItem (pure, unit-tested in Plan 01).
	 * When the item differs from its pristine default:
	 *   - adds class .maestro-modified to the <li>
	 *   - injects a <span class="maestro-modified-badge" aria-hidden="true">•</span>
	 *     glyph (visible, high-contrast) PLUS a sibling
	 *     <span class="screen-reader-text">(modified)</span> (AT-only)
	 * When the item matches its pristine default: removes everything.
	 *
	 * WCAG 1.4.1 (color alone): the glyph provides a perceivable non-color signal.
	 * WCAG 1.4.11 (graphical objects): amber #dba617 on #1d2327 ≈ 5.5:1 contrast.
	 * AT users hear "(modified)" via the screen-reader-text span.
	 */
	function refreshModifiedIndicator( slug ) {
		var m = model[ slug ];
		if ( ! m ) { return; }

		var def = m.isSub ? pristineSub( slug ) : pristineTop( slug );
		var result = window.maestroLogic.diffItem( m, def );

		var li = liForSlug( slug );
		if ( ! li ) { return; }

		if ( result.modified ) {
			li.classList.add( 'maestro-modified' );

			// Append badge/sr-text to the row label — same target updateMenuLabel()
			// uses — so on top-level items with a submenu the badge sits beside the
			// label name rather than after the <ul.wp-submenu>.
			var labelTarget = m.isSub
				? li.querySelector( 'a' )
				: li.querySelector( '.wp-menu-name' );

			if ( labelTarget && ! labelTarget.querySelector( '.maestro-modified-badge' ) ) {
				var badge = el( 'span', 'maestro-modified-badge' );
				badge.setAttribute( 'aria-hidden', 'true' );
				badge.textContent = '•'; // bullet •
				labelTarget.appendChild( badge );
			}
			if ( labelTarget && ! labelTarget.querySelector( '.maestro-modified-sr' ) ) {
				var srText = el( 'span', 'screen-reader-text maestro-modified-sr' );
				srText.textContent = I.modified;
				labelTarget.appendChild( srText );
			}
		} else {
			li.classList.remove( 'maestro-modified' );
			var oldBadge = li.querySelector( '.maestro-modified-badge' );
			if ( oldBadge ) { oldBadge.remove(); }
			var oldSr = li.querySelector( '.maestro-modified-sr' );
			if ( oldSr ) { oldSr.remove(); }
		}
	}

	/* ---------- folded-mode override -------------------------------------- */

	// The menu must edit in its expanded form. Strip folded/auto-fold on init,
	// re-strip if common.js writes them back, and neutralise the collapse
	// control for the duration of the session.
	function forceUnfold() {
		var body = document.body;
		body.classList.remove( 'folded', 'auto-fold' );

		var mo = new MutationObserver( function () {
			if ( body.classList.contains( 'folded' ) || body.classList.contains( 'auto-fold' ) ) {
				body.classList.remove( 'folded', 'auto-fold' );
			}
		} );
		mo.observe( body, { attributes: true, attributeFilter: [ 'class' ] } );

		var collapse = document.getElementById( 'collapse-menu' );
		if ( collapse ) {
			collapse.addEventListener( 'click', function ( e ) {
				e.preventDefault();
				e.stopImmediatePropagation();
			}, true );
		}
	}

	/* ---------- build model + wire the DOM --------------------------------- */

	function init() {
		document.body.classList.add( 'maestro-editing' );
		forceUnfold();

		D.menu.forEach( function ( node ) {
			model[ node.slug ] = {
				title: node.title,
				icon: node.icon,
				hiddenRoles: node.hiddenRoles.slice(),
				isSub: false
			};

			var li = node.liId ? document.getElementById( node.liId ) : null;
			if ( ! li ) { return; }
			li.dataset.maestroSlug = node.slug;
			li.classList.add( 'maestro-item' );
			if ( node.hiddenRoles.length ) { li.classList.add( 'maestro-has-hidden' ); }

			// Submenu children: skip the .wp-submenu-head, then zip by index.
			var subLis = li.querySelectorAll( '.wp-submenu > li:not(.wp-submenu-head)' );
			node.submenu.forEach( function ( child, idx ) {
				// A submenu item can share its slug with the top-level parent —
				// WordPress's self-link convention (Posts + All Posts both map
				// to edit.php). The stored config is slug-keyed, so they are one
				// identity; the top-level entry (which carries the icon) must
				// win. Only create a model entry for a genuinely distinct slug.
				if ( ! model[ child.slug ] ) {
					model[ child.slug ] = {
						title: child.title,
						icon: '',
						hiddenRoles: child.hiddenRoles.slice(),
						isSub: true,
						parent: node.slug
					};
				}
				var sli = subLis[ idx ];
				if ( ! sli ) { return; }
				sli.dataset.maestroSlug = child.slug;
				sli.classList.add( 'maestro-subitem' );
				if ( child.hiddenRoles.length ) { sli.classList.add( 'maestro-has-hidden' ); }
			} );
		} );

		buildToolbar();
		buildFirstRunCue();
		bindMenuSelection();
		initSortables();

		// Refresh indicators for any pre-existing (already-saved) overrides so
		// they show the modified badge immediately on page load, not just after
		// the first mutation.
		Object.keys( model ).forEach( function ( slug ) {
			refreshModifiedIndicator( slug );
		} );
	}

	/* ---------- click-to-select ------------------------------------------- */

	function bindMenuSelection() {
		var menu = document.getElementById( 'adminmenu' );
		if ( ! menu ) { return; }

		menu.addEventListener( 'click', function ( e ) {
			// Suppress navigation on every menu click while editing.
			var a = e.target.closest( 'a' );
			if ( a ) { e.preventDefault(); }

			// Popovers may be placed over the menu region — let them handle their own clicks.
			if ( e.target.closest( '.maestro-popover' ) ) {
				return;
			}

			var li = e.target.closest( 'li.maestro-item, li.maestro-subitem' );
			if ( ! li ) { return; }
			selectItem( li, { focusPanel: true } );
		}, true );

		menu.addEventListener( 'keydown', function ( e ) {
			if ( e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar' ) {
				return;
			}
			if ( e.target.closest( '.maestro-popover' ) ) {
				return;
			}

			var li = e.target.closest( 'li.maestro-item, li.maestro-subitem' );
			if ( ! li ) { return; }
			e.preventDefault();
			selectItem( li, { focusPanel: true } );
		}, true );

		menu.addEventListener( 'keydown', function ( e ) {
			if ( ! e.altKey || ( e.key !== 'ArrowUp' && e.key !== 'ArrowDown' ) ) {
				return;
			}
			// Guard: ignore keypresses inside a popover or form control.
			if ( e.target.closest( '.maestro-popover, input, button' ) ) {
				return;
			}
			// Require a currently selected maestro item.
			if ( ! selectedSlug || ! model[ selectedSlug ] ) {
				return;
			}

			e.preventDefault();

			var m = model[ selectedSlug ];
			var dir = e.key === 'ArrowUp' ? 'up' : 'down';
			var currentSlugs, parentUl;

			if ( m.isSub ) {
				// Submenu scope: siblings under the same parent.
				var parentLi = liForSlug( m.parent );
				parentUl = parentLi ? parentLi.querySelector( '.wp-submenu' ) : null;
				if ( ! parentUl ) { return; }
				currentSlugs = Array.prototype.map.call(
					parentUl.querySelectorAll( 'li.maestro-subitem[data-maestro-slug]' ),
					function ( n ) { return n.dataset.maestroSlug; }
				);
			} else {
				// Top-level scope.
				parentUl = menu;
				currentSlugs = Array.prototype.map.call(
					menu.querySelectorAll( 'li.menu-top.maestro-item[data-maestro-slug]' ),
					function ( n ) { return n.dataset.maestroSlug; }
				);
			}

			var newOrder = window.maestroLogic.reorderMove( currentSlugs, selectedSlug, dir );

			// Detect boundary clamp: order unchanged means the item is already at the edge.
			if ( newOrder.join( '\n' ) === currentSlugs.join( '\n' ) ) {
				var boundaryMsg = dir === 'up'
					? I.moveAtTop.replace( '%s', m.title )
					: I.moveAtBottom.replace( '%s', m.title );
				speak( boundaryMsg, 'assertive' );
				return;
			}

			// Physically move ONLY the selected node by one position. All other nodes —
			// including li.wp-menu-separator and any non-maestro-item children — stay put.
			var selectedNode = liForSlug( selectedSlug );
			var maestroChildren = Array.prototype.slice.call(
				parentUl.querySelectorAll(
					m.isSub
						? 'li.maestro-subitem[data-maestro-slug]'
						: 'li.menu-top.maestro-item[data-maestro-slug]'
				)
			);
			var currentIdx = maestroChildren.indexOf( selectedNode );
			if ( dir === 'up' && currentIdx > 0 ) {
				parentUl.insertBefore( selectedNode, maestroChildren[ currentIdx - 1 ] );
			} else if ( dir === 'down' && currentIdx < maestroChildren.length - 1 ) {
				var afterNode = maestroChildren[ currentIdx + 1 ];
				parentUl.insertBefore( selectedNode, afterNode.nextSibling ); // nextSibling null => appendChild semantics
			}

			// CRITICAL: Re-appending nodes detaches them, dropping focus to <body>.
			// Restore focus to the moved item's anchor so the next Alt+Arrow chains.
			var movedLi = liForSlug( selectedSlug );
			if ( movedLi ) {
				var focusTarget = movedLi.querySelector( 'a' ) || movedLi;
				focusTarget.focus( { preventScroll: true } );
			}

			// Announce the new position politely.
			var newIndex = newOrder.indexOf( selectedSlug ) + 1;
			var total = newOrder.length;
			var movedMsg = I.moved
				.replace( '%1$s', m.title )
				.replace( '%2$s', dir === 'down' ? I.dirDown : I.dirUp )
				.replace( '%3$d', String( newIndex ) )
				.replace( '%4$d', String( total ) );
			speak( movedMsg );

			// Set aria-keyshortcuts on the selected row to aid AT discovery.
			if ( movedLi ) {
				movedLi.setAttribute( 'aria-keyshortcuts', 'Alt+ArrowUp Alt+ArrowDown' );
			}

			// Reuse the existing debounced autosave: buildConfig() reads the new DOM order.
			scheduleAutosave();
		} );
	}

	function selectItem( li, opts ) {
		var slug = li.dataset.maestroSlug;
		if ( ! slug || ! model[ slug ] ) { return; }
		opts = opts || {};

		document.querySelectorAll( '.maestro-selected' ).forEach( function ( n ) {
			n.classList.remove( 'maestro-selected' );
			n.removeAttribute( 'aria-keyshortcuts' );
		} );
		selectedSlug = slug;
		li.classList.add( 'maestro-selected' );
		li.setAttribute( 'aria-keyshortcuts', 'Alt+ArrowUp Alt+ArrowDown' );
		populatePanel( slug );
		closePopovers();
		if ( opts.focusPanel && panel.rename ) {
			try {
				panel.rename.focus( { preventScroll: true } );
			} catch ( err ) {
				panel.rename.focus();
			}
		}
	}

	/* ---------- toolbar + shared controls panel --------------------------- */

	function buildToolbar() {
		var bar = el( 'div', 'maestro-toolbar' );

		// Persistent mode label — NOT a live region, text never changes (UX-03).
		// The aria-hidden dashicon supplies a non-colour shape cue (WCAG 1.4.1).
		var modeEl = el( 'div', 'maestro-mode-label' );
		var modeIcon = el( 'span', 'dashicons dashicons-edit maestro-mode-icon' );
		modeIcon.setAttribute( 'aria-hidden', 'true' );
		modeEl.appendChild( modeIcon );
		modeEl.appendChild( document.createTextNode( I.modeLabel ) );
		bar.appendChild( modeEl );

		// Transient save-status — aria-live, empty at idle so no announcement fires.
		statusEl = el( 'span', 'maestro-status maestro-status-idle' );
		statusEl.setAttribute( 'role', 'status' );
		statusEl.setAttribute( 'aria-live', 'polite' );
		statusEl.setAttribute( 'aria-atomic', 'true' );
		statusEl.textContent = '';   // empty at idle (do NOT set I.idle here)
		bar.appendChild( statusEl );

		// Shared panel — empty/hidden until something is selected.
		var p = el( 'div', 'maestro-panel' );
		p.hidden = true;

		// UX-05: the selected item's name is screen-reader-only — the buttons are
		// self-explanatory and the visible breadcrumb ate horizontal space. Kept in
		// the DOM (populated in populatePanel) so SR users still get item/submenu
		// context; `screen-reader-text` is WordPress admin's always-present SR class.
		var label = el( 'span', 'maestro-panel-label screen-reader-text' );

		// Accessible name for the rename input. WCAG 2.5.3 (Label in Name): the
		// accessible name must contain the VISIBLE label text — which here is the
		// placeholder "Menu label" (the only visible hint when the field is empty) —
		// so speech-control users who say "Menu label" reach this control. A
		// placeholder alone is NOT an accessible name, so the visually-hidden <label>
		// carries the same string.
		var renameLabel = el( 'label', 'screen-reader-text' );
		renameLabel.setAttribute( 'for', 'maestro-rename-field' );
		renameLabel.textContent = I.renamePlaceholder;
		var rename = el( 'input', 'maestro-rename-input' );
		rename.type = 'text';
		rename.id = 'maestro-rename-field';
		rename.placeholder = I.renamePlaceholder;
		rename.addEventListener( 'keydown', function ( e ) {
			if ( e.key === 'Enter' ) {
				e.preventDefault();
				rename.blur();
			} else if ( e.key === 'Escape' ) {
				if ( selectedSlug ) { rename.value = model[ selectedSlug ].title; }
				rename.blur();
			}
		} );
		rename.addEventListener( 'blur', commitRename );

		var iconBtn = el( 'button', 'button maestro-icon-btn' );
		iconBtn.type = 'button';
		iconBtn.textContent = I.icon;
		iconBtn.addEventListener( 'click', function ( e ) {
			e.preventDefault();
			openIconPicker( iconBtn );
		} );

		var visBtn = el( 'button', 'button maestro-vis-btn' );
		visBtn.type = 'button';
		visBtn.textContent = I.visibility;
		visBtn.addEventListener( 'click', function ( e ) {
			e.preventDefault();
			openVisibilityPicker( visBtn );
		} );

		var resetItemBtn = el( 'button', 'button maestro-reset-item' );
		resetItemBtn.type = 'button';
		resetItemBtn.textContent = I.resetItem;
		resetItemBtn.addEventListener( 'click', resetSelected );

		// BUG-02: the rename input comes first so its left edge is fixed and never
		// shifts as the selected item's name length changes; the breadcrumb label
		// (kept for "what is targeted" context) sits to its right.
		p.appendChild( renameLabel );
		p.appendChild( rename );
		p.appendChild( label );
		p.appendChild( iconBtn );
		p.appendChild( visBtn );
		p.appendChild( resetItemBtn );
		bar.appendChild( p );

		panel = {
			root:     p,
			label:    label,
			rename:   rename,
			iconBtn:  iconBtn,
			visBtn:   visBtn,
			resetBtn: resetItemBtn,
		};

		var right = el( 'div', 'maestro-toolbar-right' );

		var resetAll = el( 'button', 'button maestro-reset-all', I.resetAll );
		resetAll.type = 'button';
		resetAll.addEventListener( 'click', doResetAll );

		var exit = el( 'a', 'button maestro-exit', I.exit );
		exit.href = D.exitUrl;
		exit.addEventListener( 'click', onExit );

		right.appendChild( resetAll );
		right.appendChild( exit );
		bar.appendChild( right );

		document.body.appendChild( bar );
	}

	function populatePanel( slug ) {
		var m = model[ slug ];
		if ( ! m ) { return; }
		panel.root.hidden = false;

		var crumb = m.isSub
			? ( ( model[ m.parent ] ? model[ m.parent ].title : m.parent ) + ' › ' + m.title )
			: m.title;
		panel.label.textContent = crumb;

		panel.rename.value = m.title;

		// Icon picker is top-level only; submenu items have no icon column.
		panel.iconBtn.style.display = m.isSub ? 'none' : '';

		// Reflect modified state on the reset button so it is discoverable in
		// context: emphasised when the item is actually modified, subdued otherwise.
		var def = m.isSub ? pristineSub( slug ) : pristineTop( slug );
		var isModified = window.maestroLogic.diffItem( m, def ).modified;
		panel.resetBtn.classList.toggle( 'is-modified', isModified );
	}

	/* ---------- rename (single, idempotent) -------------------------------- */

	function commitRename() {
		if ( ! selectedSlug ) { return; }
		var m = model[ selectedSlug ];
		var raw = panel.rename.value.trim();
		var next = raw || m.title;
		if ( next === m.title ) {
			panel.rename.value = m.title;
			return;
		}
		m.title = next;
		updateMenuLabel( selectedSlug );
		populatePanel( selectedSlug ); // refresh breadcrumb for renamed parents
		refreshModifiedIndicator( selectedSlug );
		scheduleAutosave();
	}

	function updateMenuLabel( slug ) {
		var li = liForSlug( slug );
		if ( ! li ) { return; }
		var m = model[ slug ];
		var target = m.isSub
			? li.querySelector( 'a' )
			: li.querySelector( '.wp-menu-name' );
		if ( target ) { target.textContent = m.title; }
	}

	/* ---------- icon picker (top-level only) ------------------------------- */

	function openIconPicker( anchorBtn ) {
		closePopovers();
		if ( ! selectedSlug || model[ selectedSlug ].isSub ) { return; }

		var slug = selectedSlug;
		var sets = D.iconSets || [];

		var pop = el( 'div', 'maestro-popover maestro-icon-popover' );
		pop.setAttribute( 'role', 'dialog' );
		pop.setAttribute( 'aria-modal', 'true' );
		pop.setAttribute( 'aria-label', I.iconDialog );

		// --- choose an icon, persist, close ---
		function choose( iconId ) {
			model[ slug ].icon = iconId;
			var li = liForSlug( slug );
			if ( li ) { applyIconPreview( li, iconId || 'none' ); }
			closePopovers();
			anchorBtn.focus();
			refreshModifiedIndicator( slug );
			scheduleAutosave();
		}

		// --- search ---
		var search = el( 'input', 'maestro-icon-search' );
		search.type = 'search';
		search.setAttribute( 'aria-label', I.iconSearch );
		search.placeholder = I.iconSearch;
		pop.appendChild( search );

		// --- "no icon" escape hatch ---
		var noneBtn = el( 'button', 'button maestro-icon-none', I.iconNone );
		noneBtn.type = 'button';
		noneBtn.title = I.iconNoneHint;
		if ( ! model[ slug ].icon ) { noneBtn.setAttribute( 'aria-pressed', 'true' ); }
		noneBtn.addEventListener( 'click', function ( e ) { e.preventDefault(); choose( '' ); } );
		pop.appendChild( noneBtn );

		// --- tabs ---
		var tablist = el( 'div', 'maestro-icon-tabs' );
		tablist.setAttribute( 'role', 'tablist' );
		tablist.setAttribute( 'aria-label', I.iconDialog );
		pop.appendChild( tablist );

		var panels = [];
		var tabs   = [];

		sets.forEach( function ( set, si ) {
			var tabId   = 'maestro-tab-' + set.id;
			var panelId = 'maestro-panel-' + set.id;

			var tab = el( 'button', 'maestro-icon-tab', set.label );
			tab.type = 'button';
			tab.id = tabId;
			tab.setAttribute( 'role', 'tab' );
			tab.setAttribute( 'aria-controls', panelId );
			tab.setAttribute( 'aria-selected', si === 0 ? 'true' : 'false' );
			tab.tabIndex = si === 0 ? 0 : -1;
			tablist.appendChild( tab );
			tabs.push( tab );

			var panel = el( 'div', 'maestro-icon-grid' );
			panel.id = panelId;
			panel.setAttribute( 'role', 'tabpanel' );
			panel.setAttribute( 'aria-labelledby', tabId );
			panel.hidden = si !== 0;

			set.icons.forEach( function ( ic ) {
				var b = el( 'button', 'maestro-icon-cell' + ( set.type === 'class' ? ' dashicons ' + ic.class : ' maestro-icon-img' ) );
				b.type = 'button';
				b.title = ic.label;
				b.setAttribute( 'aria-label', ic.label );
				b.dataset.maestroName = ( ic.label || '' ).toLowerCase();
				b.tabIndex = -1;
				if ( model[ slug ].icon === ic.id ) {
					b.classList.add( 'is-current' );
					b.setAttribute( 'aria-pressed', 'true' );
				}
				if ( set.type === 'data' ) {
					var im = el( 'img' );
					im.src = ic.src;
					im.alt = '';
					b.appendChild( im );
				}
				b.addEventListener( 'click', function ( e ) { e.preventDefault(); choose( ic.id ); } );
				panel.appendChild( b );
			} );

			pop.appendChild( panel );
			panels.push( panel );

			tab.addEventListener( 'click', function () { activateTab( si ); } );
		} );

		function activateTab( idx ) {
			tabs.forEach( function ( t, i ) {
				t.setAttribute( 'aria-selected', i === idx ? 'true' : 'false' );
				t.tabIndex = i === idx ? 0 : -1;
				panels[ i ].hidden = i !== idx;
			} );
			tabs[ idx ].focus();
			applyFilter();
		}

		// Arrow-key tab switching (WAI-ARIA tabs pattern).
		tablist.addEventListener( 'keydown', function ( e ) {
			var cur = tabs.findIndex( function ( t ) { return t.getAttribute( 'aria-selected' ) === 'true'; } );
			if ( e.key === 'ArrowRight' ) { e.preventDefault(); activateTab( ( cur + 1 ) % tabs.length ); }
			else if ( e.key === 'ArrowLeft' ) { e.preventDefault(); activateTab( ( cur - 1 + tabs.length ) % tabs.length ); }
		} );

		// Roving arrow-key navigation within the visible grid.
		function visibleCells() {
			var panel = panels.find( function ( p ) { return ! p.hidden; } );
			if ( ! panel ) { return []; }
			return Array.prototype.filter.call( panel.children, function ( c ) { return ! c.hidden; } );
		}
		pop.addEventListener( 'keydown', function ( e ) {
			if ( ! /^Arrow/.test( e.key ) ) { return; }
			if ( ! e.target.classList || ! e.target.classList.contains( 'maestro-icon-cell' ) ) { return; }
			var cells = visibleCells();
			var i = cells.indexOf( e.target );
			if ( i === -1 ) { return; }
			var cols = Math.max( 1, Math.floor( e.target.parentNode.clientWidth / e.target.offsetWidth ) || 8 );
			var next = i;
			if ( e.key === 'ArrowRight' ) { next = Math.min( cells.length - 1, i + 1 ); }
			else if ( e.key === 'ArrowLeft' ) { next = Math.max( 0, i - 1 ); }
			else if ( e.key === 'ArrowDown' ) { next = Math.min( cells.length - 1, i + cols ); }
			else if ( e.key === 'ArrowUp' ) { next = Math.max( 0, i - cols ); }
			if ( next !== i ) {
				e.preventDefault();
				cells[ i ].tabIndex = -1;
				cells[ next ].tabIndex = 0;
				cells[ next ].focus();
			}
		} );

		// Search filter across the active panel; first match becomes tabbable.
		function applyFilter() {
			var q = search.value.trim().toLowerCase();
			var panel = panels.find( function ( p ) { return ! p.hidden; } );
			if ( ! panel ) { return; }
			var firstShown = null;
			Array.prototype.forEach.call( panel.children, function ( c ) {
				var hit = ! q || ( c.dataset.maestroName || '' ).indexOf( q ) !== -1;
				c.hidden = ! hit;
				c.tabIndex = -1;
				if ( hit && ! firstShown ) { firstShown = c; }
			} );
			if ( firstShown ) { firstShown.tabIndex = 0; }
		}
		search.addEventListener( 'input', applyFilter );

		// Escape closes and restores focus; Tab is trapped within the dialog.
		pop.addEventListener( 'keydown', function ( e ) {
			if ( e.key === 'Escape' ) {
				e.preventDefault();
				closePopovers();
				anchorBtn.focus();
				return;
			}
			if ( e.key !== 'Tab' ) { return; }
			var focusable = pop.querySelectorAll(
				'input, button, [tabindex]:not([tabindex="-1"])'
			);
			focusable = Array.prototype.filter.call( focusable, function ( n ) {
				return ! n.hidden && n.offsetParent !== null;
			} );
			if ( ! focusable.length ) { return; }
			var first = focusable[ 0 ];
			var last  = focusable[ focusable.length - 1 ];
			if ( e.shiftKey && document.activeElement === first ) {
				e.preventDefault();
				last.focus();
			} else if ( ! e.shiftKey && document.activeElement === last ) {
				e.preventDefault();
				first.focus();
			}
		} );

		placePopover( pop, anchorBtn );
		applyFilter();
		search.focus();
	}

	// Reflect an icon value into the rendered menu image. The picker only ever
	// supplies dashicons, but reset feeds back the pristine icon, which can be a
	// URL / data-URI / "none" / "" (custom icons are out of scope for the picker
	// but still reachable on reset). Branch so we never push a URL as a CSS class.
	function applyIconPreview( li, icon ) {
		var img = li.querySelector( '.wp-menu-image' );
		if ( ! img ) { return; }

		// Drop every dashicons-* token (including dashicons-before) and the svg
		// marker, so each branch starts from a clean slate. Splitting on
		// whitespace avoids a regex that also matched dashicons-before.
		var keep = img.className.split( /\s+/ ).filter( function ( c ) {
			return c && c.indexOf( 'dashicons-' ) !== 0 && c !== 'svg';
		} );

		function clearBg() {
			img.style.backgroundImage = '';
			img.style.backgroundRepeat = '';
			img.style.backgroundPosition = '';
			img.style.backgroundSize = '';
		}
		function setBg() {
			img.style.backgroundImage = 'url("' + icon.replace( /"/g, '%22' ) + '")';
			img.style.backgroundRepeat = 'no-repeat';
			img.style.backgroundPosition = 'center';
			img.style.backgroundSize = '20px auto';
		}

		// Core gives its own items a menu-icon-* class whose CSS sets
		// background-image:none !important, which hides a custom image icon. Drop
		// it for data-URI/URL icons (mirrors the Replay engine server-side).
		// menu-header.php prints that class on BOTH the <li> and its <a>, so the
		// `.menu-icon-* div.wp-menu-image` rule matches via either ancestor —
		// strip it from both.
		function stripMenuIconClass() {
			[ li, li.querySelector( 'a' ) ].forEach( function ( node ) {
				if ( node ) {
					node.className = node.className.replace( /\bmenu-icon-[\w-]+/g, '' ).replace( /\s+/g, ' ' ).trim();
				}
			} );
		}

		if ( /^dashicons-/.test( icon ) ) {
			// Dashicon glyph: font class, no background image.
			keep.push( 'dashicons-before', icon );
			img.className = keep.join( ' ' );
			clearBg();
		} else if ( /^data:image\//.test( icon ) ) {
			// Base64 image data-URI: borrow core's ".svg" sizing and paint it.
			stripMenuIconClass();
			keep.push( 'svg' );
			img.className = keep.join( ' ' );
			setBg();
		} else if ( /^(https?:\/\/|\/\/|\/)/.test( icon ) ) {
			// URL icon: core would render an <img>; approximate via background.
			stripMenuIconClass();
			img.className = keep.join( ' ' );
			setBg();
		} else {
			// Empty / "none" / "div": no faithful client-side reconstruction, so
			// clear the stale preview. The authoritative icon returns on Exit reload.
			img.className = keep.join( ' ' );
			clearBg();
		}
	}

	/* ---------- visibility picker ----------------------------------------- */

	function openVisibilityPicker( anchorBtn ) {
		closePopovers();
		if ( ! selectedSlug ) { return; }

		var slug = selectedSlug;
		var pop  = el( 'div', 'maestro-popover maestro-vis-popover' );
		pop.setAttribute( 'role', 'dialog' );
		pop.setAttribute( 'aria-modal', 'true' );
		pop.setAttribute( 'aria-label', I.visibility );
		pop.tabIndex = -1;
		pop.appendChild( el( 'p', 'maestro-vis-head', I.hideFrom ) );
		var firstCheckbox = null;

		Object.keys( D.roles ).forEach( function ( roleKey ) {
			var row = el( 'label', 'maestro-vis-row' );
			var cb  = el( 'input' );
			cb.type = 'checkbox';
			cb.value = roleKey;
			cb.checked = model[ slug ].hiddenRoles.indexOf( roleKey ) !== -1;
			if ( ! firstCheckbox ) { firstCheckbox = cb; }
			cb.addEventListener( 'change', function () {
				var set = model[ slug ].hiddenRoles;
				if ( cb.checked ) {
					if ( set.indexOf( roleKey ) === -1 ) { set.push( roleKey ); }
				} else {
					model[ slug ].hiddenRoles = set.filter( function ( r ) { return r !== roleKey; } );
				}
				var li = liForSlug( slug );
				if ( li ) {
					li.classList.toggle( 'maestro-has-hidden', model[ slug ].hiddenRoles.length > 0 );
				}
				refreshModifiedIndicator( slug );
				scheduleAutosave();
			} );
			row.appendChild( cb );
			row.appendChild( document.createTextNode( ' ' + D.roles[ roleKey ] ) );
			pop.appendChild( row );
		} );

		pop.addEventListener( 'keydown', function ( e ) {
			if ( e.key === 'Escape' ) {
				e.preventDefault();
				closePopovers();
				anchorBtn.focus();
				return;
			}
			if ( e.key !== 'Tab' ) { return; }
			var focusable = pop.querySelectorAll(
				'input, button, [tabindex]:not([tabindex="-1"])'
			);
			focusable = Array.prototype.filter.call( focusable, function ( n ) {
				return ! n.hidden && n.offsetParent !== null;
			} );
			if ( ! focusable.length ) { return; }
			var first = focusable[ 0 ];
			var last  = focusable[ focusable.length - 1 ];
			if ( e.shiftKey && document.activeElement === first ) {
				e.preventDefault();
				last.focus();
			} else if ( ! e.shiftKey && document.activeElement === last ) {
				e.preventDefault();
				first.focus();
			}
		} );

		placePopover( pop, anchorBtn );
		( firstCheckbox || pop ).focus();
	}

	/* ---------- per-item reset -------------------------------------------- */

	function resetSelected() {
		if ( ! selectedSlug ) { return; }
		var m   = model[ selectedSlug ];
		var def = m.isSub ? pristineSub( selectedSlug ) : pristineTop( selectedSlug );

		m.title       = def.title || '';
		m.hiddenRoles = [];

		var li = liForSlug( selectedSlug );
		if ( li ) { li.classList.remove( 'maestro-has-hidden' ); }

		if ( ! m.isSub ) {
			m.icon = def.icon || '';
			// Always refresh — when the pristine icon is empty this clears any
			// stale dashicon preview rather than leaving it until reload.
			if ( li ) { applyIconPreview( li, m.icon ); }
		}
		updateMenuLabel( selectedSlug );
		populatePanel( selectedSlug );
		refreshModifiedIndicator( selectedSlug );
		scheduleAutosave();
	}

	/* ---------- popover placement ----------------------------------------- */

	function placePopover( pop, anchorBtn ) {
		document.body.appendChild( pop );
		var r = anchorBtn.getBoundingClientRect();
		// Toolbar lives at the bottom — prefer placing the popover above the
		// anchor so it doesn't overflow off-screen.
		var top = window.scrollY + r.top - pop.offsetHeight - 6;
		if ( top < window.scrollY + 8 ) {
			top = window.scrollY + r.bottom + 4;
		}
		pop.style.top  = top + 'px';
		pop.style.left = ( window.scrollX + r.left ) + 'px';

		setTimeout( function () {
			document.addEventListener( 'click', function handler( e ) {
				if ( ! pop.contains( e.target ) && e.target !== anchorBtn ) {
					pop.remove();
					document.removeEventListener( 'click', handler );
				}
			} );
		}, 0 );
	}

	/* ---------- sortable --------------------------------------------------- */

	function initSortables() {
		// No drag handles: the whole row is draggable. A small distance threshold
		// keeps a plain click as a selection and only starts a drag on real
		// movement. `cancel` keeps a mousedown inside a submenu (or on a form
		// control) from starting a top-level drag, so child reordering is handled
		// solely by the per-submenu sortable below.
		$( '#adminmenu' ).sortable( {
			items:     '> li.menu-top.maestro-item',
			cancel:    '.wp-submenu, input, button',
			distance:  6,
			axis:      'y',
			tolerance: 'pointer',
			stop:      scheduleAutosave
		} );

		$( '#adminmenu .wp-submenu' ).each( function () {
			$( this ).sortable( {
				items:     '> li.maestro-subitem',
				distance:  6,
				axis:      'y',
				tolerance: 'pointer',
				stop:      scheduleAutosave
			} );
		} );
	}

	/* ---------- build payload + autosave ---------------------------------- */

	function buildConfig() {
		// Null-prototype slug-keyed maps: a slug of "__proto__" must not mutate
		// Object.prototype or break JSON serialisation of the payload.
		var cfg = { items: Object.create( null ), top_order: [], sub_order: Object.create( null ) };

		var topLis = document.querySelectorAll( '#adminmenu > li.menu-top.maestro-item[data-maestro-slug]' );

		// Top-level slugs own their identity. A submenu item sharing one of these
		// slugs (WP self-link convention) must not emit a conflicting items entry.
		var topSlugs = Object.create( null );
		topLis.forEach( function ( li ) { topSlugs[ li.dataset.maestroSlug ] = true; } );

		topLis.forEach( function ( li ) {
			var slug = li.dataset.maestroSlug;
			cfg.top_order.push( slug );

			var m    = model[ slug ];
			var def  = pristineTop( slug );
			var diff = window.maestroLogic.diffItem( m, def );
			var entry = {};
			if ( diff.fields.indexOf( 'title' ) !== -1 )       { entry.title = m.title; }
			if ( diff.fields.indexOf( 'icon' ) !== -1 )        { entry.icon  = m.icon; }
			if ( diff.fields.indexOf( 'hiddenRoles' ) !== -1 ) { entry.hidden_roles = m.hiddenRoles; }
			if ( diff.modified )                                { cfg.items[ slug ] = entry; }

			var subLis = li.querySelectorAll( '.wp-submenu > li.maestro-subitem[data-maestro-slug]' );
			if ( subLis.length ) {
				cfg.sub_order[ slug ] = [];
				subLis.forEach( function ( sli ) {
					var sslug = sli.dataset.maestroSlug;
					cfg.sub_order[ slug ].push( sslug );

					// Ordering still records the slug, but a submenu that shares
					// a top-level slug carries no separate override of its own.
					if ( topSlugs[ sslug ] ) { return; }

					var sm    = model[ sslug ];
					var sdef  = pristineSub( sslug );
					var sdiff = window.maestroLogic.diffItem( sm, sdef );
					var se    = {};
					if ( sdiff.fields.indexOf( 'title' ) !== -1 )       { se.title = sm.title; }
					if ( sdiff.fields.indexOf( 'hiddenRoles' ) !== -1 ) { se.hidden_roles = sm.hiddenRoles; }
					if ( sdiff.modified )                                { cfg.items[ sslug ] = se; }
				} );
			}
		} );

		return cfg;
	}

	function setStatus( state ) {
		if ( ! statusEl ) { return; }
		statusEl.className = 'maestro-status maestro-status-' + state;
		statusEl.textContent = window.maestroLogic.modeStatusLabel( state, I );
		if ( state === 'saved' || state === 'error' ) {
			speak( statusEl.textContent );
		}
	}

	function scheduleAutosave() {
		setStatus( 'saving' );
		if ( saveTimer ) { clearTimeout( saveTimer ); }
		saveTimer = setTimeout( doAutosave, 500 );
	}

	function flushAutosave() {
		if ( saveTimer ) {
			clearTimeout( saveTimer );
			saveTimer = null;
		}
		return doAutosave();
	}

	// The endpoint is a full replace, so two POSTs in flight at once can arrive
	// out of order and let an older snapshot overwrite newer edits. Serialise:
	// never overlap requests. If a change lands while a save is running, set a
	// pending flag and fire exactly one more save when the current one settles —
	// that trailing POST carries the latest buildConfig(). The returned promise
	// resolves only after the whole chain (including the trailing save) is done,
	// so onExit can safely await it.
	function doAutosave() {
		saveTimer = null;

		if ( saveInFlight ) {
			savePending = true;
			return inFlight || Promise.resolve();
		}

		saveInFlight = true;
		setStatus( 'saving' );

		inFlight = fetch( D.restUrl, {
			method:      'POST',
			headers:     {
				'Content-Type': 'application/json',
				'X-WP-Nonce':   D.nonce
			},
			credentials: 'same-origin',
			body:        JSON.stringify( { config: buildConfig() } )
		} )
			.then( function ( r ) {
				if ( ! r.ok ) { throw new Error( 'HTTP ' + r.status ); }
				return r.json();
			} )
			.then( function () { return settleSave( true ); } )
			.catch( function () { return settleSave( false ); } );

		return inFlight;
	}

	function settleSave( ok ) {
		saveInFlight = false;
		if ( savePending ) {
			savePending = false;
			return doAutosave(); // captures edits made while the last POST was in flight
		}
		setStatus( ok ? 'saved' : 'error' );
		inFlight = null;
		return null;
	}

	function waitForSaveIdle() {
		if ( saveTimer ) {
			return flushAutosave();
		}
		return inFlight || Promise.resolve();
	}

	function cancelQueuedAutosave() {
		if ( saveTimer ) {
			clearTimeout( saveTimer );
			saveTimer = null;
		}
		savePending = false;
	}

	function doResetAll( e ) {
		e.preventDefault();
		if ( ! window.confirm( I.confirmAll ) ) { return; }

		var button = e.currentTarget;
		if ( button ) { button.disabled = true; }
		setStatus( 'saving' );
		cancelQueuedAutosave();

		( inFlight || Promise.resolve() )
			.then( function () {
				return fetch( D.restUrl, {
					method:      'DELETE',
					headers:     { 'X-WP-Nonce': D.nonce },
					credentials: 'same-origin'
				} );
			} )
			.then( function ( r ) {
				if ( ! r.ok ) { throw new Error( 'HTTP ' + r.status ); }
				window.location.reload();
			} )
			.catch( function () {
				if ( button ) { button.disabled = false; }
				setStatus( 'error' );
			} );
	}

	function onExit( e ) {
		// If there's pending or active work, flush/wait before navigating so nothing is lost.
		if ( saveTimer || inFlight ) {
			e.preventDefault();
			waitForSaveIdle().then( function () {
				window.location.href = D.exitUrl;
			} );
		}
	}

	/* ---------- first-run cue --------------------------------------------- */

	/**
	 * Show a one-time inline hint ("Click a menu item to start editing.") above
	 * the toolbar, gated on a localStorage flag. Dismissible by click or keyboard
	 * (Enter/Space). Does not steal focus. Safe in private-browsing mode.
	 *
	 * Uses i18n strings I.firstRun / I.firstRunDismiss from the localized payload.
	 */
	function buildFirstRunCue() {
		// Gate on the Plan-01 seam. Access window.localStorage INSIDE try/catch:
		// in blocked/partitioned-storage browsers the getter itself throws a
		// SecurityError (before firstRunSeen's own guard can run), which would
		// otherwise escape and abort edit-mode init. Treat any throw as "seen" so
		// the cue is simply skipped for those users.
		var firstRunCueSeen;
		try {
			firstRunCueSeen = window.maestroLogic.firstRunSeen( window.localStorage );
		} catch ( storageErr ) {
			firstRunCueSeen = true;
		}
		if ( firstRunCueSeen ) { return; }

		var cue = el( 'div', 'maestro-firstrun' );
		cue.setAttribute( 'role', 'note' );
		cue.setAttribute( 'aria-label', I.firstRun );

		var text = el( 'span', 'maestro-firstrun-text', I.firstRun );
		var dismissBtn = el( 'button', 'maestro-firstrun-dismiss', I.firstRunDismiss );
		dismissBtn.type = 'button';

		// Pulse the first editable top-level menu item to teach the core gesture.
		// querySelector is called after init() has stamped .maestro-item on all items.
		var firstItem = document.querySelector( '#adminmenu > li.menu-top.maestro-item' );
		if ( firstItem ) {
			firstItem.classList.add( 'maestro-firstrun-pulse' );
			// Motion case: remove the class once the one-shot animation completes.
			firstItem.addEventListener( 'animationend', function onEnd() {
				firstItem.classList.remove( 'maestro-firstrun-pulse' );
				firstItem.removeEventListener( 'animationend', onEnd );
			} );
		}

		function dismiss() {
			try {
				window.localStorage.setItem( 'maestroFirstRunDone', '1' );
			} catch ( storageErr ) {
				// Storage unavailable — still remove the element; just won't persist.
			}
			cue.remove();
			// CRITICAL: under prefers-reduced-motion, animationend never fires, so
			// the pulse class must also be removed here (Pitfall 1 / Plan-03 spec).
			if ( firstItem ) { firstItem.classList.remove( 'maestro-firstrun-pulse' ); }
		}

		dismissBtn.addEventListener( 'click', dismiss );
		dismissBtn.addEventListener( 'keydown', function ( e ) {
			if ( e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar' ) {
				e.preventDefault();
				dismiss();
			}
		} );

		cue.appendChild( text );
		cue.appendChild( dismissBtn );

		// Sit the cue flush above the toolbar regardless of the toolbar's height.
		// UX-07's 44px tap targets make the ≤782px toolbar taller than the CSS
		// default offset (and it can wrap), so measure the real height rather than
		// trusting a fixed value — keeps the cue from being covered by the toolbar.
		var toolbarEl = document.querySelector( '.maestro-toolbar' );
		if ( toolbarEl ) { cue.style.bottom = toolbarEl.offsetHeight + 'px'; }

		document.body.appendChild( cue );
	}

	/* ---------- go --------------------------------------------------------- */

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}

} )( jQuery );
