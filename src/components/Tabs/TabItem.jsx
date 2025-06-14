import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
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

const TabItem = ({
  tab,
  isActive,
  isDragged,
  isDraggedOver,
  onActivate,
  onClose,
  onTogglePin,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
}) => {
  const [contextMenu, setContextMenu] = useState(null);
  const tabRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        contextMenu &&
        !(
          (tabRef.current && tabRef.current.contains(e.target)) ||
          (menuRef.current && menuRef.current.contains(e.target))
        )
      ) {
        setContextMenu(null);
      }
    };
    if (contextMenu) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [contextMenu]);

  const handleClick = (e) => {
    e.preventDefault();
    onActivate(tab.id);
  };

  const handleCloseClick = (e) => {
    e.stopPropagation();
    onClose(tab.id);
  };

  const handlePinClick = (e) => {
    e.stopPropagation();
    onTogglePin(tab.id);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      tabId: tab.id,
      isPinned: tab.isPinned,
    });
  };

  const handleTogglePinMenu = (e) => {
    e.stopPropagation();
    if (contextMenu) {
      onTogglePin(contextMenu.tabId);
    }
    setContextMenu(null);
  };

  const tabClass = [
    styles.tabItem,
    isActive ? styles.active : "",
    tab.isPinned ? styles.pinned : "",
    isDragged ? styles.dragged : "",
    isDraggedOver ? styles.draggedOver : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={tabRef}
      className={tabClass}
      draggable
      onClick={() => onActivate(tab.id)}
      onDragStart={(e) => onDragStart(e, tab)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOver(e, tab)}
      onDragEnter={(e) => onDragEnter(e, tab)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, tab)}
      tabIndex={0}
      title={tab.title}
      onContextMenu={handleContextMenu}
    >
      <div className={styles.tabContent}>
        {tab.icon && iconMap[tab.icon] && (
          <span className={styles.tabIcon}>
            {React.createElement(iconMap[tab.icon], {
              style: { color: "#7F858D", fontSize: 18 },
            })}
          </span>
        )}
        <span className={styles.tabTitle}>{tab.title}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button
            className={styles.pinButton}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(tab.id);
            }}
            title={tab.isPinned ? "Unpin tab" : "Pin tab"}
            style={{ display: "none" }}
          >
            {tab.isPinned ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 2L15 10L5 18"
                  stroke="#7F858D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="7"
                  stroke="#7F858D"
                  strokeWidth="2"
                  fill="none"
                />
                <rect x="9" y="5" width="2" height="6" fill="#7F858D" />
              </svg>
            )}
          </button>
          <button
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              onClose(tab.id);
            }}
            title="Close tab"
          >
            ×
          </button>
        </div>
      </div>
      {tab.isPinned && <span className={styles.pinnedIndicator} />}
      {contextMenu &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: contextMenu.y,
              left: contextMenu.x,
              background: "#fff",
              border: "1px solid #e1e5e9",
              borderRadius: 6,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              zIndex: 2000,
              minWidth: 120,
              padding: 0,
            }}
          >
            <button
              style={{
                width: "100%",
                padding: "8px 16px",
                background: "none",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                fontSize: 14,
              }}
              onClick={handleTogglePinMenu}
            >
              {contextMenu.isPinned ? "Unpin tab" : "Pin tab"}
            </button>
          </div>,
          document.body
        )}
    </div>
  );
};

export default TabItem;
