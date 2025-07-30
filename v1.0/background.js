let sessionMemory = [];

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "get-chat") {
    sendResponse(sessionMemory);
  }

  if (msg.type === "append-chat") {
    sessionMemory.push(...msg.data);
    sendResponse({ success: true });
  }

  if (msg.type === "clear-chat") {
    sessionMemory = [];
    sendResponse({ success: true });
  }
});
