import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
// reloadOnUpdate("pages/content/style.scss");

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get("apiKey", ({ apiKey }) => {
    if (!apiKey) {
      chrome.runtime.openOptionsPage();
    } else {
      console.log("apiKey is ", apiKey);
    }
  });
});
