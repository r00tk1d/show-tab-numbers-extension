chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updateTabNumber") {
      const { tabNumber } = message;
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
  });
  