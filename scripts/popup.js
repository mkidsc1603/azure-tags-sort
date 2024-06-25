function logInfo() {
  console.info(`[Azure Tags Sort][Popup]`, ...arguments);
}

logInfo("popup.js loaded.");
const descCbx = document.getElementById("descCbx");

chrome.storage.sync.get(["azureTagSortDesc"], function (res) {
  descCbx.checked = res.azureTagSortDesc === "true";

  descCbx.addEventListener("change", function (e) {
    chrome.storage.sync.set({
      azureTagSortDesc: e.target.checked.toString(),
    });
  });
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === "azureTagSortDesc") {
      descCbx.checked = newValue === "true";
    }
  }
});
