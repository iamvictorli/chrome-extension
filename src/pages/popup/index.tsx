import React from "react";
import { createRoot } from "react-dom/client";
import Popup from "@pages/popup/Popup";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/popup");

function init() {
  const appContainer = document.querySelector("#app-container");
  if (!appContainer) {
    throw new Error("Can not find #app-container");
  }
  const root = createRoot(appContainer);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = tabs[0].url;
    const title = tabs[0].title;
    const id = tabs[0].id;
    const data = { url, title, id };
    // root.render(<Popup />);
    chrome.scripting.executeScript(
      {
        target: { tabId: id },
        func: () => {
          return document.documentElement.outerHTML;
        },
      },
      function (result) {
        const html = result[0].result;
        root.render(<Popup url={url} title={title} />);
      }
    );
  });
}

init();
