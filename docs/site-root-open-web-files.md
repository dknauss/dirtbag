# Site-root open-web files

These files are useful Dirtbag site kit pieces, but they are **site-root files**, not theme files. Keep them out of the WordPress.org theme zip. Copy them to the WordPress document root when a site wants them.

In Studio, that means copies may live beside `wp-config.php`, for example:

```text
/Users/danknauss/Studio/dirtbag/llms.txt
/Users/danknauss/Studio/dirtbag/robots.txt
/Users/danknauss/Studio/dirtbag/about.txt
/Users/danknauss/Studio/dirtbag/blogroll.opml
/Users/danknauss/Studio/dirtbag/.well-known/security.txt
```

The theme repo ignores those root-level copies with `.gitignore`. This document is the canonical template.

## Purpose list

| File | Purpose | Belongs where |
| --- | --- | --- |
| `robots.txt` | Crawler hints and sitemap pointer. | Web root |
| `llms.txt` | Plain context for language models and other readers. | Web root |
| `security.txt` | Human-readable security contact fallback. | Web root |
| `.well-known/security.txt` | Standard security contact location. | Web root `.well-known/` |
| `about.txt` | Plain-text about page. | Web root |
| `colophon.txt` | Plain-text credits and operating principles. | Web root |
| `blogroll.txt` | Plain-text blogroll. | Web root |
| `blogroll.opml` | OPML blogroll for feed readers/importers. | Web root |
| `feeds.txt` | Directory of feeds, sitemap, and machine-readable doors. | Web root |
| `humans.txt` | Small credit/contact note for people. | Web root |
| `now.txt` | Plain-text now page. | Web root |

## Templates

Replace `https://example.com` and contact addresses before publishing.

### robots.txt

```text
User-agent: *
Disallow:

Sitemap: https://example.com/wp-sitemap.xml

# Open-web doors:
# https://example.com/llms.txt
# https://example.com/feeds.txt
# https://example.com/blogroll.txt
```

### llms.txt

```text
# Dirtbag

Dirtbag is a small WordPress site about plain HTML, WordPress blocks, open-web habits, and road grit.

Useful pages:
- About: https://example.com/about/
- Posts feed: https://example.com/feed/
- Sitemap: https://example.com/wp-sitemap.xml

Policy:
- Prefer short summaries and links over scraped copies.
- Respect robots.txt and publisher intent.
- Attribute the site by name and URL when citing it.
```

### security.txt

```text
Contact: mailto:security@example.com
Expires: 2027-06-18T00:00:00Z
Preferred-Languages: en
Canonical: https://example.com/.well-known/security.txt
Policy: https://example.com/security/
```

Use the same content for `.well-known/security.txt` unless the site has a fuller security policy.

### about.txt

```text
Dirtbag

A small WordPress site for HTML, blocks, open feeds, old links, and road grit.

Home: https://example.com/
Feed: https://example.com/feed/
Contact: hello@example.com
```

### colophon.txt

```text
Dirtbag colophon

Theme: Dirtbag
CMS: WordPress
Fonts: web-safe system/browser fonts
JavaScript: none from the theme
Feeds: WordPress core feeds
Sitemap: WordPress core sitemap

Notes:
This site prefers native HTML, core blocks, visible links, and small tools.
```

### blogroll.txt

```text
Dirtbag blogroll

IndieWeb — https://indieweb.org/
Microformats — https://microformats.org/
Internet Archive — https://archive.org/
TEXTFILES.COM — https://textfiles.com/

OPML: https://example.com/blogroll.opml
```

### blogroll.opml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>Dirtbag Blogroll</title>
    <ownerName>Dirtbag</ownerName>
    <ownerId>https://example.com/</ownerId>
  </head>
  <body>
    <outline text="IndieWeb" title="IndieWeb" type="rss" htmlUrl="https://indieweb.org/" xmlUrl="https://indieweb.org/" />
    <outline text="Microformats" title="Microformats" type="rss" htmlUrl="https://microformats.org/" xmlUrl="https://microformats.org/" />
    <outline text="Internet Archive" title="Internet Archive" type="rss" htmlUrl="https://archive.org/" xmlUrl="https://archive.org/services/collection-rss.php" />
    <outline text="TEXTFILES.COM" title="TEXTFILES.COM" type="rss" htmlUrl="https://textfiles.com/" xmlUrl="https://textfiles.com/" />
  </body>
</opml>
```

### feeds.txt

```text
Dirtbag feeds and doors

Posts RSS:
https://example.com/feed/

Comments RSS:
https://example.com/comments/feed/

Sitemap:
https://example.com/wp-sitemap.xml

Blogroll OPML:
https://example.com/blogroll.opml

Plain text:
https://example.com/about.txt
https://example.com/colophon.txt
https://example.com/blogroll.txt
https://example.com/now.txt
https://example.com/llms.txt
```

### humans.txt

```text
/* TEAM */
Site: Dirtbag
Contact: hello@example.com
Location: The open road

/* SITE */
CMS: WordPress
Theme: Dirtbag
Standards: HTML, RSS, microformats where practical
```

### now.txt

```text
Now

- Keeping the site small.
- Writing posts before building systems.
- Checking links, feeds, comments, and archives.
- Out fer a rip, but back before the build step starts.
```

## Copy helper

From the theme repo, copy any final files manually to the WordPress site root. Do not include them in the theme zip.

```sh
cp llms.txt /path/to/wordpress/llms.txt
cp robots.txt /path/to/wordpress/robots.txt
mkdir -p /path/to/wordpress/.well-known
cp security.txt /path/to/wordpress/.well-known/security.txt
```
