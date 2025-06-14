import { useState, useEffect, useCallback } from "react";

/**
 * Хук для управління адаптивним розміром табів
 * @param {Array} tabs - масив табів
 * @param {number} tabWidth - ширина одного табу
 * @param {number} dropdownButtonWidth - ширина кнопки випадаючого меню
 * @returns {Object} - об'єкт з видимими та прихованими табами
 */
export const useTabsResize = (
  tabs,
  tabWidth = 200,
  dropdownButtonWidth = 40
) => {
  const [visibleTabs, setVisibleTabs] = useState([]);
  const [hiddenTabs, setHiddenTabs] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);

  // Функція для розрахунку видимих табів
  const calculateVisibleTabs = useCallback(() => {
    if (!containerWidth || tabs.length === 0) {
      setVisibleTabs(tabs);
      setHiddenTabs([]);
      return;
    }

    let availableWidth = containerWidth;
    let visibleCount = 0;

    // Спочатку показуємо закріплені таби
    const pinnedTabs = tabs.filter((tab) => tab.isPinned);
    const unpinnedTabs = tabs.filter((tab) => !tab.isPinned);

    // Закріплені таби завжди видимі
    availableWidth -= pinnedTabs.length * tabWidth;
    visibleCount += pinnedTabs.length;

    // Розраховуємо скільки незакріплених табів поміститься
    const maxUnpinnedTabs = Math.floor(availableWidth / tabWidth);

    // Якщо не всі таби поміщаються, залишаємо місце для кнопки dropdown
    const needsDropdown = unpinnedTabs.length > maxUnpinnedTabs;
    const actualMaxUnpinned = needsDropdown
      ? Math.floor((availableWidth - dropdownButtonWidth) / tabWidth)
      : maxUnpinnedTabs;

    const visibleUnpinnedTabs = unpinnedTabs.slice(
      0,
      Math.max(0, actualMaxUnpinned)
    );
    const hiddenUnpinnedTabs = unpinnedTabs.slice(actualMaxUnpinned);

    setVisibleTabs([...pinnedTabs, ...visibleUnpinnedTabs]);
    setHiddenTabs(hiddenUnpinnedTabs);
  }, [containerWidth, tabs, tabWidth, dropdownButtonWidth]);

  // Відстежуємо зміни розміру контейнера
  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector(".tabs-container");
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
    };

    // Встановлюємо початкову ширину
    handleResize();

    // Додаємо обробник зміни розміру вікна
    window.addEventListener("resize", handleResize);

    // Створюємо ResizeObserver для відстеження зміни розміру контейнера
    const resizeObserver = new ResizeObserver(handleResize);
    const container = document.querySelector(".tabs-container");
    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  // Перераховуємо видимі таби при зміні параметрів
  useEffect(() => {
    calculateVisibleTabs();
  }, [calculateVisibleTabs]);

  return {
    visibleTabs,
    hiddenTabs,
    containerWidth,
  };
};

export default useTabsResize;
