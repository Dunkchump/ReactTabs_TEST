import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./Tabs.module.css";

const TabsDropdown = ({
  tabs,
  activeTabId,
  onActivateTab,
  onCloseTab,
  onTogglePin,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Закриваємо dropdown при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Вычисляем позицию меню при открытии
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right - 220 + window.scrollX, // 220px - примерная ширина меню
        width: rect.width,
      });
    }
  }, [isOpen]);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleTabClick = (tabId) => {
    onActivateTab(tabId);
    setIsOpen(false);
  };

  const handleCloseTab = (e, tabId) => {
    e.stopPropagation();
    onCloseTab(tabId);
  };

  const handleTogglePin = (e, tabId) => {
    e.stopPropagation();
    onTogglePin(tabId);
  };

  return (
    <div className={styles.tabsDropdown}>
      <button
        className={styles.dropdownButton}
        onClick={handleToggleDropdown}
        title={`Показати ${tabs.length} прихованих табів`}
        ref={buttonRef}
      >
        <span className={styles.dropdownIcon}>⋯</span>
        <span className={styles.dropdownCount}>{tabs.length}</span>
      </button>

      {isOpen &&
        ReactDOM.createPortal(
          <div
            className={styles.dropdownMenu}
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: menuPosition.top,
              left: menuPosition.left,
              minWidth: 200,
              zIndex: 1001,
            }}
          >
            <div className={styles.dropdownHeader}>
              Приховані таби ({tabs.length})
            </div>
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`${styles.dropdownItem} ${
                  tab.id === activeTabId ? styles.active : ""
                }`}
                onClick={() => handleTabClick(tab.id)}
                draggable
                onDragStart={(e) => onDragStart(e, tab)}
                onDragEnd={onDragEnd}
                onDragOver={(e) => onDragOver(e, tab)}
                onDragEnter={(e) => onDragEnter(e, tab)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, tab)}
                title={tab.title}
              >
                <div className={styles.dropdownItemContent}>
                  {tab.icon && (
                    <span className={styles.dropdownItemIcon}>{tab.icon}</span>
                  )}
                  <span className={styles.dropdownItemTitle}>{tab.title}</span>
                  <div className={styles.dropdownItemActions}>
                    <button
                      className={styles.dropdownPinButton}
                      onClick={(e) => handleTogglePin(e, tab.id)}
                      title={tab.isPinned ? "Відкріпити таб" : "Закріпити таб"}
                    >
                      {tab.isPinned ? "📍" : "📌"}
                    </button>
                    <button
                      className={styles.dropdownCloseButton}
                      onClick={(e) => handleCloseTab(e, tab.id)}
                      title="Закрити таб"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};

export default TabsDropdown;
