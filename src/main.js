import {
  initDb,
  getAlbums,
  getPhotosByAlbum,
  updateAlbumOrder,
  addPhotoToAlbum,
} from './sqlite/db.js';
import { renderAlbumGrid } from './ui/album-grid.js';
import { renderAlbumView } from './ui/album-view.js';
import { attachDragAndDrop } from './ui/drag-drop.js';

const albumList = document.getElementById('album-list');
const albumDetail = document.getElementById('album-detail');
const selectedAlbumTitle = document.getElementById('selected-album-title');
const selectedAlbumSubtitle = document.getElementById('selected-album-subtitle');
const statusElement = document.getElementById('status');
const addPhotosInput = document.getElementById('add-photos');

let albums = [];
let selectedAlbumId = null;

function showStatus(message) {
  statusElement.textContent = message;
}

async function refreshAlbums() {
  albums = await getAlbums();
  renderAlbumGrid(albums, albumList, selectedAlbumId, onAlbumSelect);
  if (selectedAlbumId) {
    const selected = albums.find((album) => album.id === selectedAlbumId);
    if (selected) {
      await showAlbumDetail(selected);
    } else {
      selectedAlbumId = null;
      selectedAlbumTitle.textContent = 'Select an album';
      selectedAlbumSubtitle.textContent = 'View photos in a tile preview.';
      albumDetail.innerHTML = '<p>Choose an album to see its photos.</p>';
    }
  }
}

async function onAlbumSelect(albumId) {
  selectedAlbumId = albumId;
  const selectedAlbum = albums.find((album) => album.id === albumId);
  if (selectedAlbum) {
    await showAlbumDetail(selectedAlbum);
  }
}

async function showAlbumDetail(album) {
  const photos = await getPhotosByAlbum(album.id);
  selectedAlbumTitle.textContent = album.title;
  selectedAlbumSubtitle.textContent = `${album.photoCount} photo${album.photoCount === 1 ? '' : 's'} · ${album.dateLabel}`;
  renderAlbumView(album, photos, albumDetail);
}

async function handleOrderChange(sourceId, targetId) {
  const sourceIndex = albums.findIndex((album) => album.id === sourceId);
  const targetIndex = albums.findIndex((album) => album.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0 || sourceId === targetId) {
    return;
  }

  const reordered = [...albums];
  const [moved] = reordered.splice(sourceIndex, 1);
  reordered.splice(targetIndex, 0, moved);

  const orderUpdates = reordered.map((album, index) => ({ id: album.id, orderIndex: index }));
  await updateAlbumOrder(orderUpdates);
  await refreshAlbums();
  showStatus('Album order updated.');
}

addPhotosInput.addEventListener('change', async (event) => {
  if (!selectedAlbumId) {
    showStatus('Select an album before adding photos.');
    addPhotosInput.value = '';
    return;
  }

  const files = Array.from(event.target.files);
  if (files.length === 0) {
    return;
  }

  showStatus('Adding photos...');
  const selectedAlbum = albums.find((album) => album.id === selectedAlbumId);
  for (const file of files) {
    const thumbnailUrl = await readFileAsDataUrl(file);
    await addPhotoToAlbum({
      albumId: selectedAlbumId,
      thumbnailUrl,
      filename: file.name,
      captureDate: selectedAlbum.dateLabel,
      metadata: JSON.stringify({ size: file.size }),
    });
  }

  addPhotosInput.value = '';
  await refreshAlbums();
  const updated = albums.find((album) => album.id === selectedAlbumId);
  if (updated) {
    await showAlbumDetail(updated);
  }
  showStatus('Photos added locally.');
});

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function initializeApp() {
  try {
    await initDb();
    await refreshAlbums();
    attachDragAndDrop(albumList, '.album-card', handleOrderChange);
    showStatus('Ready. Select an album to view photos.');
  } catch (error) {
    showStatus(`Initialization failed: ${error.message}`);
    console.error(error);
  }
}

initializeApp();
