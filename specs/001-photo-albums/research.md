# Research: Photo Album Organizer

## Decision: Use Vite with vanilla HTML/CSS/JavaScript

### Rationale
- The user explicitly requested the application use Vite with a minimal number of libraries.
- Vite supports modern browser development and fast local rebuilds without imposing a UI framework.
- Vanilla HTML/CSS/JS keeps the implementation small and easy to maintain.

### Alternatives considered
- Using a framework like React or Svelte: rejected because it adds significant dependencies and contradicts the minimal library constraint.
- Using a server-based app: rejected because the feature is described as a client-focused organizer with local-only storage.

## Decision: Metadata stored in local SQLite database using WASM

### Rationale
- The user requires SQLite for local metadata persistence.
- Browser-based SQLite via WASM (e.g. `sql.js`) provides a local SQLite-compatible store without remote upload.
- This approach preserves metadata locally while keeping images unuploaded.

### Alternatives considered
- Storing metadata in IndexedDB directly: rejected because the requirement explicitly requests SQLite.
- Using a backend SQLite server: rejected because images must remain local and the app should avoid remote storage.

## Decision: Images remain local and are not uploaded anywhere

### Rationale
- The user explicitly requires local-only image handling.
- The browser File API or File System Access API can import local images and keep them client-side.
- Thumbnails can be generated or displayed from local file blobs, while metadata remains in SQLite.

### Alternatives considered
- Uploading images to a remote service with local metadata references: rejected by requirement.
- Embedding image binaries directly in SQLite: possible but not preferred for performance; better to keep image blobs separate and metadata in SQLite.

## Decision: Use native browser drag-and-drop for album reordering

### Rationale
- Native drag-and-drop requires no extra libraries and meets the minimal dependency requirement.
- It supports a clear desktop interaction model and can be enhanced for touch devices.

### Alternatives considered
- Using a drag-and-drop library: rejected because it would add unnecessary dependencies.
- Implementing keyboard-only reordering only: rejected because the user specifically requested drag-and-drop.
