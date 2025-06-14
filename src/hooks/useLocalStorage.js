import { useState, useEffect } from "react";

/**
 * Хук для роботи з localStorage
 * @param {string} key - ключ для збереження в localStorage
 * @param {*} initialValue - початкове значення
 * @returns {[*, function]} - [значення, функція для оновлення]
 */
export const useLocalStorage = (key, initialValue) => {
  // Отримуємо збережене значення з localStorage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Функція для оновлення значення
  const setValue = (value) => {
    try {
      // Дозволяємо value бути функцією для підтримки функціонального оновлення
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      // Зберігаємо в localStorage
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
