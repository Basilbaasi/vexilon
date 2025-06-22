# Vexilon AI Browser Extension

A local AI assistant that runs in Chrome/Edge using your Flask backend.

## Quick Start Guide

### 1. Start the AI Server
```bash
python server.py //in py folder
```
*Keep this terminal window open - the server must stay running.*

### 2. Load the Extension

**In Chrome/Edge:**
1. Type this in your address bar:
   ```
   chrome://extensions/  (Chrome)
   edge://extensions/    (Edge)
   ```
2. Enable **Developer Mode** (toggle in top-right)
3. Click **"Load unpacked"**
4. Select the folder containing your extension files

### 3. Start Chatting
1. Look for the <img src="https://via.placeholder.com/20" width="20" height="20"> Vexilon icon in your browser toolbar
2. Click it to open the chat window
3. Type your message and press Enter

## Troubleshooting

🔴 **Extension not loading?**
- Make sure you selected the folder containing `manifest.json`
- Check for errors in Developer Tools (Ctrl+Shift+I)

🔴 **Not getting responses?**
- Verify the Flask server is running (you should see activity in the terminal)
- Try accessing http://localhost:5000 directly in your browser

## Alternative Testing Methods

**Quick API Test:**
```javascript
// Paste in browser console
fetch('http://localhost:5000/process', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({message: "Hello AI!"})
}).then(r => r.json()).then(console.log)
```

**Bookmarklet (no extension needed):**
1. Create a new bookmark with this URL:
   ```
   javascript:(function(){prompt('AI Response:',(await(await fetch('http://localhost:5000/process',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:prompt('Your message:')})).json()).response)})()
   ```
2. Click the bookmark to chat

## Files Required
```
your-extension-folder/
├── manifest.json
├── popup.html
└── popup.js
```

*Note: The server must remain running for the extension to work.*
```

Key features of this README:
1. Uses simple emoji-based troubleshooting
2. Provides multiple ways to test the functionality
3. Clear visual hierarchy with bold headers
4. Includes both extension and non-extension methods
5. Shows the required file structure
6. All instructions fit on one screen without scrolling

Would you like me to add any specific details about your particular file structure or configuration?