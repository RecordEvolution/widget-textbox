# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run build` — bundle `src/widget-textbox.ts` into `dist/` via Rollup.
- `npm run watch` — Rollup in watch mode.
- `npm start` — runs `watch` and `@web/dev-server` concurrently; serves `demo/index.html` (open `/demo/`).
- `npm run types` — regenerate `src/definition-schema.d.ts` from `src/definition-schema.json` via `json2ts`. Run after editing the schema.
- `npm run analyze` — produce custom-elements manifest (LitElement preset).
- `npm run release` — build, regenerate types, `npm version patch` (no `v` prefix), push tags. Tag push triggers `.github/workflows/build-publish.yml` to publish to npm.
- No tests or linter are configured.

Requires Node `>=24.9.0`, npm `>=10.0.2`.

## Architecture

This is a single LitElement web component (`@record-evolution/widget-textbox`) used as a tile in the IronFlock/RESWARM dashboard platform. The repo follows the same pattern as the sibling `widget-*` packages in `ironflock-widgets/`.

**Entry point:** `src/widget-textbox.ts` defines `WidgetTextbox` and registers it as `widget-textbox-versionplaceholder`. The literal string `versionplaceholder` is replaced at build time by `@rollup/plugin-replace` with the `package.json` version, so each published build registers a uniquely versioned custom-element tag. The host application (RESWARM frontend) reads the version from the package and instantiates the matching tag — see `demo/index.html` for the pattern (`unsafeStatic` with the version-suffixed tag name).

**Platform integration contract:** the component receives two reactive properties from the host:
- `inputData: TextboxConfiguration` — typed by `src/definition-schema.d.ts`, generated from `src/definition-schema.json`. The JSON schema is the source of truth: the platform's tile editor renders form controls from it (`order`, `dataDrivenDisabled`, custom `type: "color"` / `"textarea"`), and fields can be bound to backend data sources unless `dataDrivenDisabled` is set.
- `theme: { theme_name, theme_object }` — applied in `registerTheme()`. CSS custom properties `--re-text-color` and `--re-tile-background-color` from the host take precedence over `theme_object` values; user-configured colors in `inputData` then take precedence over the theme.

**Build pipeline:** Rollup with `typescript`, `node-resolve`, `commonjs`, `babel` (bundled helpers), `replace` for the version placeholder. Output is a single ESM bundle at `dist/widget-textbox.js` with sourcemaps. `treeshake.moduleSideEffects: false` is set — be careful adding modules with side effects.

**Local demo:** `demo/index.html` fetches `package.json` to construct the versioned tag, loads `src/default-data.json` as `inputData`, and `demo/themes/light.json` as the theme object. Use this to reproduce platform behavior locally.

## README highlights

The component renders three styled sections — title (`h2`), subtitle (`h3`), body (`p`, `white-space: pre-wrap` so `\n` becomes a line break). Each section is hidden via the `paging` class when its `text` is empty.

## `aiSelection` in `src/definition-schema.json`

The schema root carries an `aiSelection` block next to `title` and `description`. It is **not** JSON Schema and describes no config field — it exists so the IronFlock AI's Widget Builder can pick the right widget for a given shape of data, using knowledge only the widget author has:

```jsonc
"aiSelection": {
  "dataShape": "…what columns this widget consumes and what each one means…",
  "useWhen":   ["…a situation, naming the properties that express it…"],
  "notFor":    ["…a situation this widget is wrong for, naming the widget to use instead…"]
}
```

It is inert everywhere else, and must stay that way: `json2ts` ignores it (the generated `.d.ts` is byte-identical with and without it), the dashboard config editor renders only `schema.properties`, and the AI service's `validate_widget` validates *configs* against the schema, skipping unknown Draft-7 keywords.

When maintaining it:

- `notFor` is the high-value half and the part plain descriptions always omit. Every entry must name the widget that *should* be used, or it rejects without routing.
- Write for an LLM with no other documentation: describe the visible result and the user's intent, not the implementation.
- Prefer entries that discriminate against a *neighbouring* widget. Generic rejections are cheap; the ones that pay are those an author could plausibly get wrong.
- The `notFor` lists are a set across all `widget-*` repos and are meant to be reciprocal — if this widget routes to another for some case, that widget should usually route back for the converse. Changing one side is a cue to check the other.
- Update it whenever a property changes what this widget can *do*, not just how it looks.
