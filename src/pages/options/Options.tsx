import React, { useState } from "react";
import "@pages/options/Options.css";

function Options() {
  const [saved, setSaved] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const apiKey = formData.get("apiKey");

    chrome.storage.sync.set({ apiKey }, () => {
      setSaved(true);
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Mem API Key: <input name="apiKey" type="text" placeholder="API KEY" />
        </label>
        <button type="submit">Save</button>
      </form>
      {saved && <p>Saved!</p>}
    </>
  );
}

export default Options;
