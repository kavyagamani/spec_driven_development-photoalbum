# Data Model: Photo Album Organizer

## Entities

### Album
- `id` (string): Unique identifier for the album.
- `title` (string): User-friendly album title, often derived from the date grouping.
- `dateLabel` (string): The display date or date range used to group the album.
- `orderIndex` (integer): Position of the album in the main page ordering.
- `photoCount` (integer): Number of photos contained in the album.
- `createdAt` (string): Timestamp when the album was created.
- `updatedAt` (string): Timestamp when the album metadata was last modified.

### Photo
- `id` (string): Unique identifier for the photo.
- `albumId` (string): Foreign key reference to the parent album.
- `thumbnailUrl` (string): Local URL or blob reference used for preview rendering.
- `filename` (string): Original filename or display name.
- `captureDate` (string): The photo creation or import date.
- `createdAt` (string): Timestamp when the photo was added to the album.
- `metadata` (string): Optional JSON string for additional photo metadata (dimensions, location, tags).

## Relationships

- One `Album` contains many `Photo` records.
- Each `Photo` belongs to exactly one top-level `Album`.
- Albums are flat and do not nest under other albums.

## Validation Rules

- `Album.dateLabel` MUST be present for every album.
- `Album.orderIndex` MUST be unique among visible albums.
- `Photo.albumId` MUST reference an existing album.
- `Photo.thumbnailUrl` MUST be available for visible preview tiles.
- `Album.photoCount` MUST reflect the number of related photos.

## Local Storage Model

### SQLite schema (example)

```sql
CREATE TABLE albums (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  dateLabel TEXT NOT NULL,
  orderIndex INTEGER NOT NULL,
  photoCount INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE photos (
  id TEXT PRIMARY KEY,
  albumId TEXT NOT NULL,
  thumbnailUrl TEXT NOT NULL,
  filename TEXT NOT NULL,
  captureDate TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  metadata TEXT,
  FOREIGN KEY(albumId) REFERENCES albums(id)
);

CREATE INDEX idx_photos_albumId ON photos(albumId);
CREATE INDEX idx_albums_orderIndex ON albums(orderIndex);
```

### Storage strategy

- Persist SQLite database state in browser storage (IndexedDB) or local file handle.
- Store image preview data as local blob URLs or cached thumbnails separate from the SQLite metadata.
