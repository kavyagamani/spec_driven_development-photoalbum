import initSqlJs from 'sql.js/dist/sql-wasm.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

let db = null;
let SQL = null;
const DB_STORE = 'photo-album-organizer';
const DB_KEY = 'sqlite-db';

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_STORE, 1);
    request.onupgradeneeded = (event) => {
      event.target.result.createObjectStore('sqlite');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function loadSavedDb() {
  const connection = await openIndexedDB();
  const transaction = connection.transaction('sqlite', 'readonly');
  const store = transaction.objectStore('sqlite');
  return new Promise((resolve, reject) => {
    const request = store.get(DB_KEY);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function saveDb(blob) {
  const connection = await openIndexedDB();
  const transaction = connection.transaction('sqlite', 'readwrite');
  const store = transaction.objectStore('sqlite');
  store.put(blob, DB_KEY);
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

function execQuery(sql, params = []) {
  const stmt = db.prepare(sql);
  try {
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      rows.push(row);
    }
    return rows;
  } finally {
    stmt.free();
  }
}

async function persistDb() {
  const data = db.export();
  await saveDb(data.buffer);
}

function createId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

function createSvgThumbnail(label, color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220"><rect width="100%" height="100%" fill="${color}"/><text x="50%" y="55%" fill="#ffffff" font-size="36" font-family="Arial, Helvetica, sans-serif" dominant-baseline="middle" text-anchor="middle">${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function initSchema() {
  db.run(`
    CREATE TABLE albums (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      dateLabel TEXT NOT NULL,
      orderIndex INTEGER NOT NULL,
      photoCount INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  db.run(`
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
  `);

  db.run('CREATE INDEX idx_photos_albumId ON photos(albumId);');
  db.run('CREATE INDEX idx_albums_orderIndex ON albums(orderIndex);');
  await persistDb();
}

async function createAlbum({ title, dateLabel, orderIndex }) {
  const now = new Date().toISOString();
  const id = createId('album');
  db.run(
    'INSERT INTO albums (id, title, dateLabel, orderIndex, photoCount, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?);',
    [id, title, dateLabel, orderIndex, 0, now, now]
  );
  await persistDb();
  return id;
}

async function createPhoto({ albumId, thumbnailUrl, filename, captureDate, metadata }) {
  const now = new Date().toISOString();
  const id = createId('photo');
  db.run(
    'INSERT INTO photos (id, albumId, thumbnailUrl, filename, captureDate, createdAt, metadata) VALUES (?, ?, ?, ?, ?, ?, ?);',
    [id, albumId, thumbnailUrl, filename, captureDate, now, metadata || null]
  );
  db.run('UPDATE albums SET photoCount = (SELECT COUNT(*) FROM photos WHERE albumId = ?) WHERE id = ?;', [albumId, albumId]);
  await persistDb();
  return id;
}

async function initDefaultContent() {
  const albums = await getAlbums();
  if (albums.length > 0) {
    return;
  }

  const firstAlbumId = await createAlbum({ title: 'April 20, 2026', dateLabel: '2026-04-20', orderIndex: 0 });
  const secondAlbumId = await createAlbum({ title: 'April 19, 2026', dateLabel: '2026-04-19', orderIndex: 1 });

  await createPhoto({
    albumId: firstAlbumId,
    thumbnailUrl: createSvgThumbnail('1', '#6366f1'),
    filename: 'sunrise.jpg',
    captureDate: '2026-04-20',
    metadata: JSON.stringify({ description: 'Sunrise preview' }),
  });

  await createPhoto({
    albumId: firstAlbumId,
    thumbnailUrl: createSvgThumbnail('2', '#2563eb'),
    filename: 'picnic.jpg',
    captureDate: '2026-04-20',
    metadata: JSON.stringify({ description: 'Picnic scene' }),
  });

  await createPhoto({
    albumId: secondAlbumId,
    thumbnailUrl: createSvgThumbnail('A', '#15803d'),
    filename: 'forest.jpg',
    captureDate: '2026-04-19',
    metadata: JSON.stringify({ description: 'Forest walk' }),
  });

  await createPhoto({
    albumId: secondAlbumId,
    thumbnailUrl: createSvgThumbnail('B', '#dc2626'),
    filename: 'market.jpg',
    captureDate: '2026-04-19',
    metadata: JSON.stringify({ description: 'Local market' }),
  });
}

export async function initDb() {
  if (db) {
    return db;
  }

  SQL = await initSqlJs({
    locateFile: () => wasmUrl,
  });

  const saved = await loadSavedDb();
  db = saved ? new SQL.Database(new Uint8Array(saved)) : new SQL.Database();

  if (!saved) {
    await initSchema();
  }

  await initDefaultContent();
  return db;
}

export async function getAlbums() {
  await initDb();
  return execQuery('SELECT * FROM albums ORDER BY orderIndex;');
}

export async function getPhotosByAlbum(albumId) {
  await initDb();
  return execQuery('SELECT * FROM photos WHERE albumId = ? ORDER BY createdAt;', [albumId]);
}

export async function updateAlbumOrder(updates) {
  await initDb();
  const transaction = db.exec('BEGIN TRANSACTION;');
  for (const update of updates) {
    db.run('UPDATE albums SET orderIndex = ?, updatedAt = ? WHERE id = ?;', [update.orderIndex, new Date().toISOString(), update.id]);
  }
  db.exec('COMMIT;');
  await persistDb();
}

export async function addPhotoToAlbum({ albumId, thumbnailUrl, filename, captureDate, metadata }) {
  await initDb();
  return createPhoto({ albumId, thumbnailUrl, filename, captureDate, metadata });
}
