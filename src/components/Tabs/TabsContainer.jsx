import React, { useRef, useEffect } from "react";
import TabItem from "./TabItem";
import TabsDropdown from "./TabsDropdown";
import { useTabsManager } from "../../hooks/useTabsManager";
import { useTabsResize } from "../../hooks/useTabsResize";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import styles from "./Tabs.module.css";

const TabsContainer = () => {
  const {
    tabs,
    activeTabId,
    activateTab,
    closeTab,
    togglePinTab,
    reorderTabs,
  } = useTabsManager();

  const onTogglePin = (tabId) => {
    console.log("onTogglePin called in TabsContainer:", tabId);
    togglePinTab(tabId);
  };

  console.log("Tabs in TabsContainer:", tabs);

  const tabsListRef = useRef(null);
  const tabRefs = useRef({});

  useEffect(() => {
    tabs.forEach((tab) => {
      if (!tabRefs.current[tab.id]) {
        tabRefs.current[tab.id] = React.createRef();
      }
    });
  }, [tabs]);

  const { visibleTabs, hiddenTabs } = useTabsResize(tabs, 200, 40);

  const {
    draggedItem,
    draggedOverItem,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  } = useDragAndDrop(tabs, reorderTabs);

  if (!tabs.length) {
    return null;
  }

  return (
    <div className={`${styles.tabsContainer} tabs-container`}>
      <div className={styles.tabsList} ref={tabsListRef}>
        {visibleTabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            isDragged={draggedItem?.id === tab.id}
            isDraggedOver={draggedOverItem?.id === tab.id}
            onActivate={activateTab}
            onClose={closeTab}
            onTogglePin={togglePinTab}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            ref={tabRefs.current[tab.id]}
          />
        ))}
        {hiddenTabs.length > 0 && (
          <TabsDropdown
            tabs={hiddenTabs}
            activeTabId={activeTabId}
            onActivateTab={activateTab}
            onCloseTab={closeTab}
            onTogglePin={togglePinTab}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
        )}
      </div>
    </div>
  );
};

export default TabsContainer;
