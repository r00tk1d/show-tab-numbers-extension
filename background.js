function updateTabNumbers() {
  chrome.windows.getAll({ populate: true }, (windows) => {
    windows.forEach((win) => {
      const tabs = win.tabs;
      const tabCount = tabs.length;
      tabs.forEach((tab, index) => {
        let tabNumber;
        if (index < 8) {
          tabNumber = index + 1;
        } else if (index === tabCount - 1) {
          tabNumber = 9;
        } else {
          tabNumber = null;
        }

        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: addTabNumber,
          args: [tabNumber]
        });
      });
    });
  });
}

function addTabNumber(tabNumber) {
  const tabTitle = document.title;
  const regex = /^\[\d+\] /;
  if (tabNumber !== null) {
    if (!tabTitle.startsWith(`[${tabNumber}] `)) {
      document.title = `[${tabNumber}] ` + tabTitle.replace(regex, '');
    }
  } else {
    document.title = tabTitle.replace(regex, '');
  }
}

// Update tab numbers on various tab events
chrome.tabs.onCreated.addListener(updateTabNumbers);
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' || changeInfo.title) {
    updateTabNumbers();
  }
});
chrome.tabs.onRemoved.addListener(updateTabNumbers);
chrome.tabs.onMoved.addListener(updateTabNumbers);
chrome.tabs.onDetached.addListener(updateTabNumbers);
chrome.tabs.onAttached.addListener(updateTabNumbers);
chrome.tabs.onActivated.addListener(updateTabNumbers);

chrome.runtime.onInstalled.addListener(updateTabNumbers);
chrome.windows.onFocusChanged.addListener(updateTabNumbers);
