function generateUUID() {
  return crypto.randomUUID();
}

// Function to prompt the user for a name
function promptForName() {
  const name = "aaa:w";
  return name;
}

// Create the context menu item upon installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveHighlightedText",
    title: "Save Highlighted Text",
    contexts: ["selection"],
  });
});

// Handle context menu item clicks
chrome.contextMenus.onClicked.addListener((info) => {
  console.log(info);
  if (info.menuItemId === "saveHighlightedText") {
    const selectedText = encodeURIComponent(info.selectionText || "");
    chrome.windows.create({
      url: `dist/popup.html?text=${selectedText}`,
      type: "popup",
      width: 400,
      height: 300,
    });
    // const selectedText = info.selectionText;
    // const name = promptForName();
    //
    // if (name) {
    //   const uuid = generateUUID();
    //   const entry = { name, text: selectedText, uuid };
    //
    //   // Retrieve existing entries from storage
    //   chrome.storage.local.get({ savedTexts: [] }, (data) => {
    //     const savedTexts = data.savedTexts;
    //     savedTexts.push(entry);
    //
    //     // Save the updated entries back to storage
    //     chrome.storage.local.set({ savedTexts }, () => {
    //       console.log("Text saved:", entry);
    //     });
    //   });
    // }
  }
});
