/**
 * Генерує унікальний ID для табу
 * @param {string} prefix - префікс для ID
 * @returns {string} - унікальний ID
 */
export const generateTabId = (prefix = "tab") => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Валідує об'єкт табу
 * @param {Object} tab - об'єкт табу для валідації
 * @returns {boolean} - true якщо таб валідний
 */
export const validateTab = (tab) => {
  if (!tab || typeof tab !== "object") {
    return false;
  }

  const requiredFields = ["id", "title", "url"];
  return requiredFields.every(
    (field) =>
      tab.hasOwnProperty(field) &&
      typeof tab[field] === "string" &&
      tab[field].trim() !== ""
  );
};

/**
 * Сортує таби: спочатку закріплені, потім незакріплені
 * @param {Array} tabs - масив табів
 * @returns {Array} - відсортований масив табів
 */
export const sortTabs = (tabs) => {
  const pinnedTabs = tabs.filter((tab) => tab.isPinned);
  const unpinnedTabs = tabs.filter((tab) => !tab.isPinned);
  return [...pinnedTabs, ...unpinnedTabs];
};

/**
 * Знаходить наступний активний таб після закриття поточного
 * @param {Array} tabs - масив табів
 * @param {string} closedTabId - ID закритого табу
 * @param {number} closedTabIndex - індекс закритого табу
 * @returns {Object|null} - наступний активний таб або null
 */
export const findNextActiveTab = (tabs, closedTabId, closedTabIndex) => {
  const remainingTabs = tabs.filter((tab) => tab.id !== closedTabId);

  if (remainingTabs.length === 0) {
    return null;
  }

  // Якщо закритий таб не був останнім, беремо таб на тій же позиції
  if (closedTabIndex < remainingTabs.length) {
    return remainingTabs[closedTabIndex];
  }

  // Інакше беремо останній таб
  return remainingTabs[remainingTabs.length - 1];
};

/**
 * Перевіряє чи можна закрити таб
 * @param {Object} tab - об'єкт табу
 * @param {Array} allTabs - всі таби
 * @returns {boolean} - true якщо таб можна закрити
 */
export const canCloseTab = (tab, allTabs) => {
  // Можна закрити будь-який таб, якщо залишається хоча б один
  return allTabs.length > 1;
};

/**
 * Обчислює позицію для вставки табу при drag and drop
 * @param {number} mouseX - позиція миші по X
 * @param {HTMLElement} container - контейнер табів
 * @param {number} tabWidth - ширина табу
 * @returns {number} - індекс для вставки
 */
export const calculateDropPosition = (mouseX, container, tabWidth) => {
  const containerRect = container.getBoundingClientRect();
  const relativeX = mouseX - containerRect.left;
  return Math.floor(relativeX / tabWidth);
};

/**
 * Створює новий таб з дефолтними значеннями
 * @param {Object} tabData - дані для нового табу
 * @returns {Object} - новий об'єкт табу
 */
export const createNewTab = (tabData) => {
  return {
    id: generateTabId(),
    title: tabData.title || "Новий таб",
    url: tabData.url || "/",
    isPinned: tabData.isPinned || false,
    icon: tabData.icon || "📄",
    ...tabData,
  };
};

/**
 * Обрізає назву табу до максимальної довжини
 * @param {string} title - назва табу
 * @param {number} maxLength - максимальна довжина
 * @returns {string} - обрізана назва
 */
export const truncateTabTitle = (title, maxLength = 20) => {
  if (title.length <= maxLength) {
    return title;
  }
  return title.substring(0, maxLength - 3) + "...";
};
