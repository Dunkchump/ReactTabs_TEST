import React, { useRef, useEffect, useState } from "react";
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
  const [tabRefs, setTabRefs] = useState({});

  useEffect(() => {
    const refs = {};
    tabs.forEach((tab) => {
      refs[tab.id] = refs[tab.id] || React.createRef();
    });
    setTabRefs(refs);
  }, [tabs]);

  const { hiddenTabs } = useTabsResize(tabs, tabRefs, tabsListRef);

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

  const pinnedTabs = tabs.filter((tab) => tab.isPinned);
  const unpinnedTabs = tabs.filter((tab) => !tab.isPinned);

  if (!tabs.length) {
    return null;
  }

  return (
    <div
      className={`${styles.tabsContainer} tabs-container`}
      style={{ display: "flex", alignItems: "center" }}
    >
      <div
        className={styles.tabsList}
        ref={tabsListRef}
        style={{ flex: 1, minWidth: 0 }}
      >
        {pinnedTabs.map((tab) => (
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
            ref={tabRefs[tab.id]}
          />
        ))}
        {unpinnedTabs.map((tab) => (
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
            ref={tabRefs[tab.id]}
          />
        ))}
      </div>
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
  );
};

export default TabsContainer;
