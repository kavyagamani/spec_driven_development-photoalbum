export function attachDragAndDrop(container, itemSelector, onMove) {
  let dragSourceId = null;

  const clearDragOver = () => {
    container.querySelectorAll('.drag-over').forEach((element) => element.classList.remove('drag-over'));
  };

  container.addEventListener('dragstart', (event) => {
    const item = event.target.closest(itemSelector);
    if (!item) {
      return;
    }
    dragSourceId = item.dataset.id;
    event.dataTransfer.effectAllowed = 'move';
  });

  container.addEventListener('dragover', (event) => {
    const item = event.target.closest(itemSelector);
    if (!item || item.dataset.id === dragSourceId) {
      return;
    }
    event.preventDefault();
    item.classList.add('drag-over');
    event.dataTransfer.dropEffect = 'move';
  });

  container.addEventListener('dragleave', (event) => {
    const item = event.target.closest(itemSelector);
    if (item) {
      item.classList.remove('drag-over');
    }
  });

  container.addEventListener('drop', async (event) => {
    event.preventDefault();
    const item = event.target.closest(itemSelector);
    if (!item || !dragSourceId || item.dataset.id === dragSourceId) {
      clearDragOver();
      return;
    }

    const targetId = item.dataset.id;
    await onMove(dragSourceId, targetId);
    clearDragOver();
  });

  container.addEventListener('dragend', () => {
    clearDragOver();
  });
}
