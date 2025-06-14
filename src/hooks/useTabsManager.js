import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

// Default tabs
const DEFAULT_TABS = [
  { id: "home", title: "Home", url: "/", isPinned: false, icon: "MdHome" },
  {
    id: "about",
    title: "About",
    url: "/about",
    isPinned: false,
    icon: "MdInfo",
  },
  {
    id: "contact",
    title: "Contacts",
    url: "/contact",
    isPinned: false,
    icon: "MdContactPhone",
  },
  {
    id: "services",
    title: "Services",
    url: "/services",
    isPinned: false,
    icon: "MdBuild",
  },
  {
    id: "blog",
    title: "Blog",
    url: "/blog",
    isPinned: false,
    icon: "MdArticle",
  },
  {
    id: "settings",
    title: "Settings",
    url: "/settings",
    isPinned: false,
    icon: "MdSettings",
  },
  { id: "help", title: "Help", url: "/help", isPinned: false, icon: "MdHelp" },
  {
    id: "feedback",
    title: "Feedback",
    url: "/feedback",
    isPinned: false,
    icon: "MdFeedback",
  },
  {
    id: "profile",
    title: "Profile",
    url: "/profile",
    isPinned: false,
    icon: "MdPerson",
  },
  {
    id: "notifications",
    title: "Notifications",
    url: "/notifications",
    isPinned: false,
    icon: "MdNotifications",
  },
  {
    id: "favorites",
    title: "Favorites",
    url: "/favorites",
    isPinned: false,
    icon: "MdStar",
  },
  {
    id: "archive",
    title: "Archive",
    url: "/archive",
    isPinned: false,
    icon: "MdArchive",
  },
  {
    id: "trash",
    title: "Trash",
    url: "/trash",
    isPinned: false,
    icon: "MdDelete",
  },
  {
    id: "history",
    title: "History",
    url: "/history",
    isPinned: false,
    icon: "MdHistory",
  },
  {
    id: "bookmarks",
    title: "Bookmarks",
    url: "/bookmarks",
    isPinned: false,
    icon: "MdBookmark",
  },
  {
    id: "downloads",
    title: "Downloads",
    url: "/downloads",
    isPinned: false,
    icon: "MdDownload",
  },
];

/**
 * Хук для управління табами
 * @returns {Object} - об'єкт з методами та станом для управління табами
 */
export const useTabsManager = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Зберігаємо таби в localStorage
  const [tabs, setTabs] = useLocalStorage("tabs", DEFAULT_TABS);
  const [activeTabId, setActiveTabId] = useState(null);

  // Визначаємо активний таб на основі поточного URL
  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.url === location.pathname);
    if (currentTab) {
      setActiveTabId(currentTab.id);
    }
  }, [location.pathname, tabs]);

  // Функція для активації табу
  const activateTab = useCallback(
    (tabId) => {
      const tab = tabs.find((t) => t.id === tabId);
      if (tab) {
        navigate(tab.url);
        setActiveTabId(tabId);
      }
    },
    [tabs, navigate]
  );

  // Функція для закриття табу
  const closeTab = useCallback(
    (tabId) => {
      const tabIndex = tabs.findIndex((t) => t.id === tabId);
      if (tabIndex === -1) return;

      const newTabs = tabs.filter((t) => t.id !== tabId);
      setTabs(newTabs);

      // Якщо закриваємо активний таб, переключаємося на сусідній
      if (tabId === activeTabId && newTabs.length > 0) {
        let nextTabIndex = tabIndex;

        // Якщо це був останній таб, переходимо до попереднього
        if (nextTabIndex >= newTabs.length) {
          nextTabIndex = newTabs.length - 1;
        }

        const nextTab = newTabs[nextTabIndex];
        if (nextTab) {
          activateTab(nextTab.id);
        }
      }
    },
    [tabs, activeTabId, setTabs, activateTab]
  );

  // Функція для закріплення/відкріплення табу
  const togglePinTab = useCallback(
    (tabId) => {
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === tabId ? { ...tab, isPinned: !tab.isPinned } : tab
        )
      );
    },
    [setTabs]
  );

  // Функція для зміни порядку табів
  const reorderTabs = useCallback(
    (newTabs) => {
      setTabs(newTabs);
    },
    [setTabs]
  );

  // Функція для додавання нового табу
  const addTab = useCallback(
    (newTab) => {
      const tab = {
        id: newTab.id || `tab-${Date.now()}`,
        title: newTab.title,
        url: newTab.url,
        isPinned: newTab.isPinned || false,
        icon: newTab.icon || "📄",
      };

      setTabs((prevTabs) => [...prevTabs, tab]);
      return tab.id;
    },
    [setTabs]
  );

  // Функція для оновлення табу
  const updateTab = useCallback(
    (tabId, updates) => {
      setTabs((prevTabs) =>
        prevTabs.map((tab) => (tab.id === tabId ? { ...tab, ...updates } : tab))
      );
    },
    [setTabs]
  );

  return {
    tabs,
    activeTabId,
    activateTab,
    closeTab,
    togglePinTab,
    reorderTabs,
    addTab,
    updateTab,
  };
};

export default useTabsManager;
