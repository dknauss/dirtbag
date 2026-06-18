# Style variations

Dirtbag uses WordPress global style variations instead of theme-authored CSS files.

## Available styles

| File | Name | Notes |
| --- | --- | --- |
| `theme.json` | Brutalist / default | Plain default with black truck icon. |
| `styles/minimalist.json` | Minimalist | Sparse readable defaults. |
| `styles/newspaper.json` | Newspaper | Black-and-white print feel. |
| `styles/hi-vis.json` | Hi-vis | Safety yellow and high-contrast accents. |
| `styles/amber-crt.json` | Amber CRT | Dark background with amber icon treatment. |
| `styles/terminal.json` | Terminal | Dark background with green icon treatment. |
| `styles/blueprint.json` | Blueprint | Blueprint palette with intentional amber truck icon. |

## Truck icon colour handling

The pickup truck icon is a transparent image. Colour changes are controlled by a single global-style custom variable:

```json
{
  "settings": {
    "custom": {
      "dirtbag": {
        "truckIconFilter": "none"
      }
    }
  }
}
```

The base `theme.json` uses that variable in one shared rule. Individual style variations only set the variable value.

This avoids the earlier problem where style-specific CSS could stick in the Site Editor style picker and make icon colours appear random.

## Editing styles safely

When changing a style variation:

1. Keep changes in that style’s JSON file.
2. Avoid adding style-specific selectors unless `theme.json` cannot express the change.
3. Do not add CSS files.
4. Run `bin/package-check`.
5. Test switching between all styles in the Site Editor.
