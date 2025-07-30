
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

function makeResizable(el) {
  const resizers = ['top', 'right', 'bottom', 'left'];

  resizers.forEach(side => {
    const resizer = document.createElement('div');
    resizer.className = `resizer resizer-${side}`;
    el.appendChild(resizer);

    resizer.addEventListener('mousedown', function (e) {
      e.preventDefault();
      document.body.style.userSelect = 'none';

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = parseInt(document.defaultView.getComputedStyle(el).width, 10);
      const startHeight = parseInt(document.defaultView.getComputedStyle(el).height, 10);
      const startTop = el.getBoundingClientRect().top;
      const startLeft = el.getBoundingClientRect().left;

      function doDrag(e) {
        if (side === 'right') {
          el.style.width = `${startWidth + e.clientX - startX}px`;
        } else if (side === 'bottom') {
          el.style.height = `${startHeight + e.clientY - startY}px`;
        } else if (side === 'left') {
          el.style.width = `${startWidth - (e.clientX - startX)}px`;
          el.style.left = `${startLeft + (e.clientX - startX)}px`;
        } else if (side === 'top') {
          el.style.height = `${startHeight - (e.clientY - startY)}px`;
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
  width: 32Oops. Hello. What is the? Vertices. In Michelin. In Michelle. How it works? Loan. Yeah. I should have gone there. No. Play. English. In the. Hello. Sedan. I. Right. 0px;
  height: 400px;
  background: #1e1e1e;
  color: white;
  font-family: sans-serif;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  z-index: 99999;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  resize: both;
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

.resizer-top {
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  cursor: ns-resize;
}
.resizer-right {
  top: 0;
  right: 0;
  width: 5px;
  height: 100%;
  cursor: ew-resize;
}
.resizer-bottom {
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  cursor: ns-resize;
}
.resizer-left {
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  cursor: ew-resize;
}

`;
document.head.appendChild(style);

// Scroll-aware message add
function addMessage(text, from = "user") {
  const container = document.getElementById("chat-messages");

  const isAtBottom =
    Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) < 10;

  const msg = document.createElement("div");
  msg.style.margin = "5px 0";
  msg.style.whiteSpace = "pre-wrap";
  msg.textContent = `${from === "user" ? "🧑" : "🤖"} ${text}`;
  container.appendChild(msg);

  if (isAtBottom) {
    container.scrollTop = container.scrollHeight;
  }
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

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    const container = document.getElementById("chat-messages");

    // Create and append bot message
    let botMsg = "";
    const botMsgEl = document.createElement("div");
    botMsgEl.style.margin = "5px 0";
    botMsgEl.style.whiteSpace = "pre-wrap";
    botMsgEl.textContent = "🤖 ";
    container.appendChild(botMsgEl);

    // Detect if user is at bottom before streaming
    const userWasAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 10;

    let userScrolledUp = false;
    const scrollHandler = () => {
      userScrolledUp =
        container.scrollHeight - container.scrollTop - container.clientHeight > 50;
    };
    container.addEventListener("scroll", scrollHandler);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      botMsg += chunk;
      botMsgEl.textContent = "🤖 " + botMsg;

      if (userWasAtBottom && !userScrolledUp) {
        container.scrollTop = container.scrollHeight;
      }
    }

    container.removeEventListener("scroll", scrollHandler);
  } catch (err) {
    console.error("❌ Fetch error:", err);
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
