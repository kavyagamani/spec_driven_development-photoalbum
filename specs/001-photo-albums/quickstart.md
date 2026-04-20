# Quickstart: Photo Album Organizer

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open the local Vite URL shown in the terminal.

## Development workflow

- edit `src/index.html`, `src/main.js`, and `src/styles.css`
- keep application logic in `src/ui/` and persistence logic in `src/sqlite/`
- use the native browser drag-and-drop API for album reordering
- keep image previews local and do not upload them to any remote service

## Testing

- Add unit tests under `tests/unit/`
- Add integration tests under `tests/integration/`

## Persistence

- Photo metadata is stored locally in SQLite via browser persistence.
- Images remain local to the client and are not uploaded anywhere.

## Notes

- Use Vite as the build tool and keep dependencies minimal.
- This app is intended to run in modern browsers with support for ES modules and browser storage APIs.
