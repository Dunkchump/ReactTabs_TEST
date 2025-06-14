# React Tabs with Drag & Drop

Сучасний React компонент з системою табів, що підтримує drag & drop, закріплення табів та адаптивний дизайн.

## Особливості

- ✨ **Drag & Drop** - перетягування табів для зміни порядку
- 📌 **Закріплення табів** - можливість закріпити важливі таби
- 📱 **Адаптивний дизайн** - автоматичне приховування табів з випадаючим меню
- 💾 **Збереження стану** - автоматичне збереження в localStorage
- 🎨 **Сучасний UI** - стильний інтерфейс з анімаціями
- ⌨️ **Доступність** - підтримка клавіатурної навігації
- 🖱️ **Контекстне меню** - клік правою кнопкою миші для додаткових дій


## 🛠️ Технології

- **React 18** - основний фреймворк
- **React Router DOM** - маршрутизація
- **React Icons** - іконки
- **Vite** - збірка та розробка
- **CSS Modules** - стилізація

## 📋 Структура проекту

```
src/
├── components/
│   └── Tabs/
│       ├── TabsContainer.jsx    # Головний контейнер табів
│       ├── TabItem.jsx          # Окремий таб
│       ├── TabsDropdown.jsx     # Випадаюче меню для прихованих табів
│       └── Tabs.module.css      # Стилі для табів
├── hooks/
│   ├── useTabsManager.js        # Управління станом табів
│   ├── useDragAndDrop.js        # Логіка drag & drop
│   ├── useTabsResize.js         # Адаптивність табів
│   └── useLocalStorage.js       # Робота з localStorage
├── utils/
│   └── tabsHelpers.js           # Допоміжні функції
└── App.jsx                      # Головний компонент
```

## 🎯 Використання

### Базове використання

```jsx
import TabsContainer from './components/Tabs/TabsContainer';

function App() {
  return (
    <div className="app">
      <TabsContainer />
      {/* Ваш контент */}
    </div>
  );
}
```

### Додавання нових табів

Таби налаштовуються в `src/hooks/useTabsManager.js`:

```javascript
const DEFAULT_TABS = [
  { 
    id: "home", 
    title: "Головна", 
    url: "/", 
    isPinned: false, 
    icon: "MdHome" 
  },
  // Додайте свої таби тут
];


 




---

**Зроблено з ❤️ для React спільноти**
