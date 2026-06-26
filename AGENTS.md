# 02-weather

CLI weather app built with Bun + TypeScript. Uses OpenMeteo (free, no API key).

## Setup & run

```bash
bun install
bun run index.ts
```

## Build binary

```bash
bun build --compile index.ts --outfile dist/weather
```

## Key facts

- **Runtime/package manager**: Bun (not Node/npm). Use `bun` commands, never `npm`/`node`.
- **Entrypoint**: `index.ts` — currently a stub with `console.log("Hello via Bun!")`
- **External APIs**: Geocoding API (lat/lon by city name) → OpenMeteo forecast API
- **No tests, no CI, no linter/formatter config** — add your own if needed
- **Strict TypeScript** with `verbatimModuleSyntax` (use `import type` for type-only imports)
- **Build output** goes to `dist/` (gitignored)
