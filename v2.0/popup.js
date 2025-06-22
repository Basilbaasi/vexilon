document.getElementById("sendBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const msg = document.getElementById("msgInput").value;

  chrome.tabs.sendMessage(tab.id, { type: "popup-msg", text: msg });
});
