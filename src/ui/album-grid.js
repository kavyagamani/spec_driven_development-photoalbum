export function renderAlbumGrid(albums, container, selectedAlbumId, onSelect) {
  const html = albums
    .map(
      (album) => `
        <article class="album-card ${album.id === selectedAlbumId ? 'selected' : ''}" data-id="${album.id}" draggable="true" tabindex="0">
          <div>
            <h3>${album.title}</h3>
            <p>${album.dateLabel} · ${album.photoCount} photo${album.photoCount === 1 ? '' : 's'}</p>
          </div>
          <div class="drag-handle" aria-label="Drag to reorder">≡</div>
        </article>
      `
    )
    .join('');

  container.innerHTML = html;
  container.querySelectorAll('.album-card').forEach((card) => {
    card.addEventListener('click', () => onSelect(card.dataset.id));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect(card.dataset.id);
      }
    });
  });
}
