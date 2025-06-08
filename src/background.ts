interface PromptEntry {
  name: string;
  prompt: string;
  id: string;
}

interface StoreState {
  promptList: PromptEntry[];
}

async function replaceProseMirrorSelection() {
  // const texts = options;
  console.log("I am inside");
  const active = document.activeElement;
  if (!(active as any)?.isContentEditable) {
  }
  const sel = window.getSelection();
  console.log(sel);
  const selectedText = sel?.toString();
  console.log({ selectedText });

  if (!selectedText) {
    return;
  }

  if (!sel?.rangeCount) {
    return;
  }

  const { promptList } = (await chrome.storage.local.get({
    promptList: [],
  })) as StoreState;
  console.log({ promptList });

  const foundMatch = promptList.find(
    (op) => op.name.toLowerCase() === selectedText.toLowerCase(),
  );
  console.log("Found match", foundMatch);

  if (!foundMatch) {
    return;
  }
  const range = sel.getRangeAt(0);
  console.log(range);

  // Pick text to insert (e.g., cycle through options)
  // const choice = texts[Math.floor(Math.random() * texts.length)];

  // Use ProseMirror API via document model (if accessible), or fallback to Range:
  range.deleteContents();
  range.insertNode(document.createTextNode(foundMatch.prompt));
  // Move caret to end:
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
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
      url: `popup.html?text=${selectedText}`,
      type: "popup",
      width: 400,
      height: 300,
    });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "autocomplete_prompt") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]?.id) {
        return;
      }
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: replaceProseMirrorSelection,
      });
    });
  }
});
