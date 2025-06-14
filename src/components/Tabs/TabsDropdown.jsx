import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  MdHome,
  MdInfo,
  MdContactPhone,
  MdBuild,
  MdArticle,
  MdSettings,
  MdHelp,
  MdFeedback,
  MdPerson,
  MdNotifications,
  MdStar,
  MdArchive,
  MdDelete,
  MdHistory,
  MdBookmark,
  MdDownload,
} from "react-icons/md";
import styles from "./Tabs.module.css";

const iconMap = {
  MdHome,
  MdInfo,
  MdContactPhone,
  MdBuild,
  MdArticle,
  MdSettings,
  MdHelp,
  MdFeedback,
  MdPerson,
  MdNotifications,
  MdStar,
  MdArchive,
  MdDelete,
  MdHistory,
  MdBookmark,
  MdDownload,
};

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
        className={
          isOpen
            ? `${styles.dropdownButton} ${styles.open}`
            : styles.dropdownButton
        }
        onClick={handleToggleDropdown}
        title={isOpen ? "Hide hidden tabs" : `Show ${tabs.length} hidden tabs`}
        ref={buttonRef}
      >
        <span className={styles.dropdownIcon}>
          <MdKeyboardArrowDown
            style={{
              color: isOpen ? "#fff" : "#7F858D",
              fontSize: 28,
              transform: isOpen ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        </span>
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
              Hidden tabs ({tabs.length})
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
                onDragLeave={(e) => onDragLeave(e, tab)}
                onDrop={(e) => onDrop(e, tab)}
                title={tab.title}
              >
                <div className={styles.dropdownItemContent}>
                  {tab.icon && iconMap[tab.icon] && (
                    <span className={styles.dropdownItemIcon}>
                      {React.createElement(iconMap[tab.icon], {
                        style: { color: "#7F858D", fontSize: 18 },
                      })}
                    </span>
                  )}
                  <span className={styles.dropdownItemTitle}>{tab.title}</span>
                  <div className={styles.dropdownItemActions}>
                    <button
                      className={styles.dropdownPinButton}
                      onClick={(e) => handleTogglePin(e, tab.id)}
                      title={tab.isPinned ? "Unpin tab" : "Pin tab"}
                    >
                      {tab.isPinned ? "📍" : "📌"}
                    </button>
                    <button
                      className={styles.dropdownCloseButton}
                      onClick={(e) => handleCloseTab(e, tab.id)}
                      title="Close tab"
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
