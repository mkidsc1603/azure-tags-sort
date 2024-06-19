console.log("Background script is running");
const chromeContext = chrome;
// context menu
chrome.contextMenus.create({
  id: "azure-tags-sort",
  title: "Azure tags sort descending",
  contexts: ["all"],
});

// on context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "azure-tags-sort") {
    chrome.tabs.sendMessage(tab.id, {
      type: "update-by-menu",
      descending: true,
    });
  }
});
