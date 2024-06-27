const chromeContext = chrome;

function logInfo() {
  console.info(`[Azure Tags Sort][Content]`, ...arguments);
}
function getDateTimeFromNode(node) {
  return new Date(node.querySelector("time").getAttribute("datetime"));
}

function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  let pivot = arr[arr.length - 1];
  let left = [];
  let right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (getDateTimeFromNode(arr[i]) < getDateTimeFromNode(pivot)) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}

function sortTags(descending = false) {
  const table = document.querySelector(
    "table.repos-file-explorer-tree.bolt-table.bolt-list.body-m.relative.scroll-hidden"
  );

  if (table) {
    const tbody = table.querySelector("tbody");
    const rowItems = table.querySelectorAll("tbody>a");

    if (rowItems.length > 0) {
      const sortedRowItems = quickSort(rowItems);

      if (descending) {
        sortedRowItems.reverse();
      }

      rowItems.forEach((n) => tbody.removeChild(n));
      sortedRowItems.forEach((n) => tbody.appendChild(n));
    }
  }
}

function refreshByStorage() {
  chromeContext.storage.sync.get(["azureTagSortDesc"], function (res) {
    logInfo("storage get azureTagSortDesc", res.azureTagSortDesc);
    sortTags(res.azureTagSortDesc === "true");
  });
}

logInfo("content.js loaded.");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "update") {
    refreshByStorage();
  } else if (request.type === "update-by-menu") {
    chrome.storage.sync.set({
      azureTagSortDesc: request.descending ? "true" : "false",
    });
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    logInfo(
      `Storage key "${key}" in namespace "${namespace}" changed. Old value was "${oldValue}", new value is "${newValue}".`
    );
    if (key === "azureTagSortDesc") {
      // Azure is SPA, make sure is repo tags page
      if (location.href.indexOf("tags") === location.href.length - 4) {
        sortTags(newValue === "true");
      }
    }
  }
});

window.navigation.addEventListener("navigate", (event) => {
  const hrefs = window.location.href.split("/");
  if (hrefs[hrefs.length - 1] === "tags") {
    logInfo(hrefs[hrefs.length - 1]);
    refreshByStorage();
  }
});

refreshByStorage();
