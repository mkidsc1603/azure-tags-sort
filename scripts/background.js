const menuItems = [
  {
    id: "tags-sort-desc",
    title: "Sort create date desc",
    payload: { type: "update-by-menu", descending: true },
  },
  {
    id: "tags-sort-asc",
    title: "Sort create date asc",
    payload: { type: "update-by-menu", descending: false },
  },
];

chrome.runtime.onInstalled.addListener(() => {
  menuItems.forEach((item) => {
    chrome.contextMenus.create({
      id: item.id,
      title: item.title,
      contexts: ["all"],
    });
  });
});

// on context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const item = menuItems.find((x) => x.id === info.menuItemId);
  if (item) {
    chrome.tabs.sendMessage(tab.id, { ...item.payload });
  }
});
