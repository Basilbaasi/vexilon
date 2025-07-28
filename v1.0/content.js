// Remove existing if already injected
if (document.getElementById("chat-box")) {
  document.getElementById("chat-box").remove();
}

// Create main chat container
const iconURL = chrome.runtime.getURL("icon.png");

const chatBox = document.createElement("div");
chatBox.id = "chat-box";
chatBox.innerHTML = `
  <div id="chat-header">
    <img src="${iconURL}" alt="Vexilon Icon" id="jarvis-icon" style="width: 16px; height: 16px; margin-right: 8px;"> Vexilon
  </div>
  <div id="chat-messages"></div>
  <div id="chat-input">
    <input type="text" id="chat-text" placeholder="Ask something..." />
    <button id="chat-send">Send</button>
  </div>
`;
document.body.appendChild(chatBox);

// Styles
const style = document.createElement("style");
style.textContent = `
#chat-box {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  max-height: 400px;
  background: #1e1e1e;
  color: white;
  font-family: sans-serif;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 99999;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

#chat-header {
  background: #333;
  padding: 10px;
  cursor: move;
  font-weight: bold;
  user-select: none;
  display: flex;
  align-items: center;
}

#chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

#chat-input {
  display: flex;
  border-top: 1px solid #444;
}

#chat-text {
  flex: 1;
  border: none;
  padding: 10px;
  outline: none;
  background: #2b2b2b;
  color: white;
}

#chat-send {
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
}

#chat-send:hover {
  background: #45a049;
}
`;
document.head.appendChild(style);

// Add messages to chat
function addMessage(text, from = "user") {
  const msg = document.createElement("div");
  msg.style.margin = "5px 0";
  msg.style.whiteSpace = "pre-wrap";
  msg.textContent = `${from === "user" ? "🧑" : "🤖"} ${text}`;
  document.getElementById("chat-messages").appendChild(msg);
  document.getElementById("chat-messages").scrollTop = 9999;
}

// Handle send
document.getElementById("chat-send").addEventListener("click", async () => {
  const inputEl = document.getElementById("chat-text");
  const message = inputEl.value.trim();
  if (!message) return;

  addMessage(message, "user");
  inputEl.value = "";

  try {
    const response = await fetch("http://127.0.0.1:5000/process", {

      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    addMessage(data.response || "❌ No response from server", "bot");
  } catch (err) {
    console.error(err);
    addMessage("❌ Error talking to Python server.", "bot");
  }
});

// Optional: handle Enter key
document.getElementById("chat-text").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.getElementById("chat-send").click();
  }
});

// Drag feature
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

const header = document.getElementById("chat-header");
header.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - chatBox.offsetLeft;
  offsetY = e.clientY - chatBox.offsetTop;
});
document.addEventListener("mouseup", () => { isDragging = false; });
document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    chatBox.style.left = e.clientX - offsetX + "px";
    chatBox.style.top = e.clientY - offsetY + "px";
    chatBox.style.bottom = "auto";
    chatBox.style.right = "auto";
  }
});
