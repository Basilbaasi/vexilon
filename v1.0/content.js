// Remove existing if already injected
if (document.getElementById("chat-box")) {
  document.getElementById("chat-box").remove();
}

// Create chat box
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

// Add memory support
chrome.runtime.sendMessage({ type: "get-chat" }, (history) => {
  (history || []).forEach(msg => addMessage(msg.text, msg.from));
});

// Add resizable borders
function makeResizable(el) {
  ['top', 'right', 'bottom', 'left'].forEach(side => {
    const resizer = document.createElement('div');
    resizer.className = `resizer resizer-${side}`;
    el.appendChild(resizer);

    resizer.addEventListener('mousedown', function (e) {
      e.preventDefault();
      document.body.style.userSelect = 'none';

      const startX = e.clientX, startY = e.clientY;
      const startW = parseInt(getComputedStyle(el).width), startH = parseInt(getComputedStyle(el).height);
      const startTop = el.getBoundingClientRect().top, startLeft = el.getBoundingClientRect().left;

      function doDrag(e) {
        if (side === 'right') el.style.width = `${startW + e.clientX - startX}px`;
        else if (side === 'bottom') el.style.height = `${startH + e.clientY - startY}px`;
        else if (side === 'left') {
          el.style.width = `${startW - (e.clientX - startX)}px`;
          el.style.left = `${startLeft + (e.clientX - startX)}px`;
        }
        else if (side === 'top') {
          el.style.height = `${startH - (e.clientY - startY)}px`;
          el.style.top = `${startTop + (e.clientY - startY)}px`;
        }
      }

      function stopDrag() {
        document.removeEventListener('mousemove', doDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.body.style.userSelect = '';
      }

      document.addEventListener('mousemove', doDrag);
      document.addEventListener('mouseup', stopDrag);
    });
  });
}
makeResizable(chatBox);

// Add styles
const style = document.createElement("style");
style.textContent = `
  #chat-box {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 320px;
    height: 400px;
    background: #1e1e1e;
    color: white;
    font-family: sans-serif;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    z-index: 99999;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    overflow: hidden;
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
  .resizer {
    position: absolute;
    background: transparent;
    z-index: 1000;
  }
  .resizer-top { top: 0; left: 0; width: 100%; height: 5px; cursor: ns-resize; }
  .resizer-right { top: 0; right: 0; width: 5px; height: 100%; cursor: ew-resize; }
  .resizer-bottom { bottom: 0; left: 0; width: 100%; height: 5px; cursor: ns-resize; }
  .resizer-left { top: 0; left: 0; width: 5px; height: 100%; cursor: ew-resize; }
`;
document.head.appendChild(style);

// Add message to UI
function addMessage(text, from = "user") {
  const container = document.getElementById("chat-messages");
  const msg = document.createElement("div");
  msg.textContent = `${from === "user" ? "🧑" : "🤖"} ${text}`;
  msg.style.margin = "5px 0";
  msg.style.whiteSpace = "pre-wrap";
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

// Send message
document.getElementById("chat-send").addEventListener("click", async () => {
  const input = document.getElementById("chat-text");
  const userText = input.value.trim();
  if (!userText) return;
  input.value = "";
  addMessage(userText, "user");

  try {
    const res = await fetch("http://127.0.0.1:5000/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let botText = "";
    const container = document.getElementById("chat-messages");
    const botMsgEl = document.createElement("div");
    botMsgEl.textContent = "🤖 ";
    botMsgEl.style.margin = "5px 0";
    botMsgEl.style.whiteSpace = "pre-wrap";
    container.appendChild(botMsgEl);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      botText += chunk;
      botMsgEl.textContent = "🤖 " + botText;
      container.scrollTop = container.scrollHeight;
    }

    // Save to memory
    chrome.runtime.sendMessage({
      type: "append-chat",
      data: [
        { text: userText, from: "user" },
        { text: botText, from: "bot" }
      ]
    });

  } catch (err) {
    console.error("Bot error:", err);
    addMessage("❌ Error talking to server", "bot");
  }
});

// Enter key support
document.getElementById("chat-text").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("chat-send").click();
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
