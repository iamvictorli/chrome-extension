import React, { useState } from "react";

function generateContent({ title, url, tag, notes }) {
  return `#${tag}
Title: ${title} Url: ${url}
${notes}`;
}

function Popup({
  url,
  title,
  html,
}: {
  url: string;
  title: string;
  html: string;
}) {
  const [saveToMem, setSaveToMem] = useState("idle");
  const [memUrl, setMemUrl] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const tag = formData.get("tag");
    const notes = formData.get("notes");

    const content = generateContent({ title, url, tag, notes });

    chrome.storage.sync.get("apiKey", function({ apiKey }) {
      setSaveToMem("saving");
      fetch("https://api.mem.ai/v0/mems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `ApiAccessToken ${apiKey}`,
        },
        body: JSON.stringify({ content }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            setError(data.error.message);
            setSaveToMem("error");
          } else {
            setSaveToMem("saved");
            setMemUrl(data.url);
          }
        })
        .catch((error) => {
          console.error(error);
          setSaveToMem("error");
        });
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Tag: <input name="tag" type="text" placeholder="Tag" autoFocus />
        </label>
        <br />
        <label>
          Notes:{" "}
          <textarea name="notes" rows={5} cols={30} placeholder="Notes" />
        </label>
        <button
          // onClick={() => savePage()}
          disabled={saveToMem === "saving"}
          type="submit"
        >
          {saveToMem === "idle" && "Save to Mem"}
          {saveToMem === "saving" && "Saving to Mem"}
          {saveToMem === "saved" && "Successfully saved to Mem"}
          {saveToMem === "error" && "Retry"}
        </button>
      </form>
      {memUrl && (
        <p>
          Mem Url Saved to{" "}
          <a href={memUrl} target="_blank" rel="noreferrer">
            {memUrl}
          </a>
        </p>
      )}
      {error && <p>Error in saving Mem: {error}</p>}
    </>
  );
}

export default Popup;
