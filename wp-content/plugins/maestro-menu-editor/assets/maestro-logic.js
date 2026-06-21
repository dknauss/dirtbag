/**
 * Maestro pure-logic helpers.
 *
 * Side-effect-free functions used by both the browser (via window.maestroLogic)
 * and the node:test unit suite (via require() / createRequire in .mjs tests).
 *
 * Dual-export guard at the bottom:
 *   - CJS (node:test): module.exports = api
 *   - Browser:         window.maestroLogic = api
 *
 * No build step required. Loaded by class-assets.php as the 'maestro-logic'
 * script handle, which is registered as a dependency of 'maestro' so it lands
 * on the page before maestro.js executes.
 *
 * @package Maestro
 */

/* global module, window */

/**
 * Pure reorder: shift a slug one position in a menu order array.
 *
 * Returns a NEW array (input is never mutated). If the slug is not found, or
 * the move would exceed a boundary, returns a copy of the original unchanged.
 *
 * @param {string[]} order     Current slug order array.
 * @param {string}   slug      The slug to move.
 * @param {string}   direction 'up' (toward index 0) or 'down' (toward end).
 * @return {string[]} New array with the slug shifted one step, or a copy if clamped.
 */
function reorderMove( order, slug, direction ) {
	var arr = order.slice();
	var idx = arr.indexOf( slug );

	if ( idx === -1 ) {
		return arr;
	}

	if ( direction === 'up' ) {
		if ( idx === 0 ) {
			return arr;
		}
		arr[ idx ]       = arr[ idx - 1 ];
		arr[ idx - 1 ]   = slug;
	} else if ( direction === 'down' ) {
		if ( idx === arr.length - 1 ) {
			return arr;
		}
		arr[ idx ]       = arr[ idx + 1 ];
		arr[ idx + 1 ]   = slug;
	}

	return arr;
}

/**
 * Pure diff: report whether a working model item differs from its pristine default.
 *
 * Mirrors the inline diff logic already used in buildConfig() in maestro.js:
 *   - title is modified iff current.title is truthy AND !== pristine.title
 *   - icon is modified iff current.icon is truthy AND !== pristine.icon
 *     (skipped when pristine has no icon key, i.e. submenu items)
 *   - hiddenRoles is modified iff current.hiddenRoles.length > 0
 *
 * @param {{ title: string, icon?: string, hiddenRoles: string[] }} current  Working model item.
 * @param {{ title: string, icon?: string }}                        pristine Pristine default.
 * @return {{ modified: boolean, fields: string[] }}
 */
function diffItem( current, pristine ) {
	var fields = [];

	if ( current.title && current.title !== pristine.title ) {
		fields.push( 'title' );
	}

	// Only compare icon when the pristine entry has an icon key (top-level items).
	// Submenu items have no icon column — pristine.icon will be undefined.
	if ( 'icon' in pristine && current.icon && current.icon !== pristine.icon ) {
		fields.push( 'icon' );
	}

	if ( current.hiddenRoles && current.hiddenRoles.length > 0 ) {
		fields.push( 'hiddenRoles' );
	}

	return { modified: fields.length > 0, fields: fields };
}

/**
 * Pure save-state label: map a transient save-state to display text.
 *
 * Returns the matching string from the injected strings object, or ''
 * for 'idle' (and any unrecognised state) so the save-status element
 * renders nothing. The persistent "Edit Mode" mode label is built
 * separately in the DOM — this function does NOT produce it.
 *
 * @param {string} state   One of 'idle'|'saving'|'saved'|'error'.
 * @param {{ saving: string, saved: string, saveError: string }} strings i18n strings.
 * @return {string} Display text, or '' when idle/unknown.
 */
function modeStatusLabel( state, strings ) {
	if ( state === 'saving' ) { return strings.saving; }
	if ( state === 'saved' )  { return strings.saved; }
	if ( state === 'error' )  { return strings.saveError; }
	return '';
}

/**
 * Pure reset: recompute an item to its pristine state.
 *
 * Returns a NEW object with title, hiddenRoles, and (for top-level items) icon
 * restored to pristine values. Does NOT mutate the input. Does NOT touch the DOM.
 *
 * Mirrors the inline reset logic in resetSelected() in maestro.js:
 *   m.title       = def.title || '';
 *   m.hiddenRoles = [];
 *   if ( ! m.isSub ) m.icon = def.icon || '';
 *
 * @param {{ title: string, icon?: string, hiddenRoles: string[] }} item     Current item state.
 * @param {{ title: string, icon?: string }}                        pristine Pristine default.
 * @param {boolean}                                                 isSub    True for submenu items.
 * @return {{ title: string, hiddenRoles: string[], icon: string }}
 */
function resetItem( item, pristine, isSub ) {
	var result = {
		title:       pristine.title || '',
		hiddenRoles: [],
		icon:        isSub ? '' : ( pristine.icon || '' ),
	};
	return result;
}

/**
 * Pure localStorage gate: has the first-run cue already been seen?
 *
 * Accepts an injected storage stub (e.g. window.localStorage) so the
 * function remains pure and testable without a DOM. Returns true when
 * storage is unavailable (throws) so a blocked storage safely suppresses
 * the cue rather than re-showing it on every load.
 *
 * @param {{ getItem: function(string): string|null }} storage localStorage-like object.
 * @return {boolean} true if the cue has been seen or storage is blocked.
 */
function firstRunSeen( storage ) {
	try {
		return storage.getItem( 'maestroFirstRunDone' ) === '1';
	} catch ( e ) {
		return true;
	}
}

/* ---------- dual-export guard ----------------------------------------- */

var api = {
	reorderMove:     reorderMove,
	diffItem:        diffItem,
	resetItem:       resetItem,
	modeStatusLabel: modeStatusLabel,
	firstRunSeen:    firstRunSeen,
};

if ( typeof module !== 'undefined' && module.exports ) {
	module.exports = api;
}

if ( typeof window !== 'undefined' ) {
	window.maestroLogic = api;
}
