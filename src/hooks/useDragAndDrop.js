import { useState, useRef } from "react";

/**
 * Хук для реалізації drag and drop функціоналу для табів
 * @param {Array} items - масив елементів для перетягування
 * @param {Function} onReorder - callback функція для зміни порядку
 * @returns {Object} - об'єкт з методами та станом для DnD
 */
export const useDragAndDrop = (items, onReorder) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);
  const draggedElement = useRef(null);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    draggedElement.current = e.target;

    // Встановлюємо стиль для елемента, що перетягується
    e.target.style.opacity = "0.5";

    // Встановлюємо дані для drag
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "";
    setDraggedItem(null);
    setDraggedOverItem(null);
    draggedElement.current = null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e, item) => {
    e.preventDefault();
    if (draggedItem && draggedItem.id !== item.id) {
      setDraggedOverItem(item);
    }
  };

  const handleDragLeave = (e) => {
    // Перевіряємо, чи курсор дійсно покинув елемент
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDraggedOverItem(null);
    }
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetItem.id) {
      return;
    }

    const draggedIndex = items.findIndex((item) => item.id === draggedItem.id);
    const targetIndex = items.findIndex((item) => item.id === targetItem.id);

    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }

    // Створюємо новий масив з переміщеним елементом
    const newItems = [...items];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, removed);

    // Викликаємо callback для оновлення порядку
    onReorder(newItems);

    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  return {
    draggedItem,
    draggedOverItem,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  };
};

export default useDragAndDrop;
