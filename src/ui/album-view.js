export function renderAlbumView(album, photos, container) {
  if (!album) {
    container.innerHTML = '<p>Select an album to see photo previews.</p>';
    return;
  }

  if (photos.length === 0) {
    container.innerHTML = '<p>This album has no photos yet. Use the Add photos button to import local images.</p>';
    return;
  }

  const photoHtml = photos
    .map(
      (photo) => `
        <article class="photo-tile">
          <img src="${photo.thumbnailUrl}" alt="${photo.filename}" />
          <div class="photo-meta">
            <p>${photo.filename}</p>
            <p>${photo.captureDate}</p>
          </div>
        </article>
      `
    )
    .join('');

  container.innerHTML = `<div class="photo-grid">${photoHtml}</div>`;
}
