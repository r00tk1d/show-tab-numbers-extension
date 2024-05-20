function updateTabNumbers() {
    chrome.tabs.query({}, (tabs) => {
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
  
  chrome.tabs.onCreated.addListener(updateTabNumbers);
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      updateTabNumbers();
    }
  });
  chrome.tabs.onRemoved.addListener(updateTabNumbers);
  chrome.tabs.onMoved.addListener(updateTabNumbers);
  chrome.tabs.onDetached.addListener(updateTabNumbers);
  chrome.tabs.onAttached.addListener(updateTabNumbers);
  
  chrome.runtime.onInstalled.addListener(updateTabNumbers);
  