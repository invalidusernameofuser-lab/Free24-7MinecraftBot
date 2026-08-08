const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Bot State Variables
let bot = null;
let botStatus = "Disconnected";
let currentServer = process.env.SERVER_IP || 'your_server_ip.aternos.me';
let currentPort = parseInt(process.env.SERVER_PORT) || 25565;
let botName = process.env.BOT_NAME || 'MadeByVolorence_OnlineForever';
let lastLogs = [];

function addLog(message) {
  const time = new Date().toLocaleTimeString();
  const logMsg = `[${time}] ${message}`;
  console.log(logMsg);
  lastLogs.unshift(logMsg);
  if (lastLogs.length > 20) lastLogs.pop(); // Keep last 20 logs
}

// Function to start the Minecraft Bot
function startBot() {
  if (bot) {
    try { bot.quit(); } catch(e) {}
  }

  botStatus = "Connecting...";
  addLog(`Connecting to ${currentServer}:${currentPort} as ${botName}...`);

  bot = mineflayer.createBot({
    host: currentServer,
    port: currentPort,
    onlineMode: false,
    username: botName,
    version: '1.21'
  });

  bot.on('spawn', () => {
    botStatus = "Online & Joined";
    addLog('Bot successfully spawned on the server!');

    setTimeout(() => {
      bot.chat('/register monster123 monster123');
      addLog('Sent register command.');
    }, 3000); 

    // Anti-AFK Jump
    setInterval(() => {
      if (bot && botStatus.includes("Online")) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 1000);
      }
    }, 300000);
  });

  bot.on('chat', (username, message) => {
    addLog(`[Chat] ${username}: ${message}`);
  });

  bot.on('end', (reason) => {
    botStatus = `Disconnected (${reason})`;
    addLog(`Bot disconnected. Reason: ${reason}. Reconnecting in 5s...`);
    setTimeout(() => {
      startBot();
    }, 5000);
  });

  bot.on('error', (err) => {
    addLog(`Error: ${err.message}`);
  });
}

// Start the bot initially
startBot();

// --- WEB DASHBOARD ROUTES ---
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Minecraft Bot Control Panel</title>
        <style>
            body { font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 20px; max-width: 800px; margin: auto; }
            .card { background: #1e293b; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
            input, button { padding: 10px; margin: 5px 0; border-radius: 5px; border: none; width: 100%; box-sizing: border-box; }
            input { background: #334155; color: white; }
            button { background: #3b82f6; color: white; font-weight: bold; cursor: pointer; }
            button:hover { background: #2563eb; }
            .logs { background: #090d16; padding: 10px; border-radius: 5px; height: 150px; overflow-y: auto; font-family: monospace; font-size: 12px; color: #38bdf8; }
            .status { font-weight: bold; color: #4ade80; }
        </style>
    </head>
    <body>
        <h1>🤖 Minecraft Bot Dashboard</h1>
        
        <div class="card">
            <h3>Status: <span class="status">${botStatus}</span></h3>
            <p><b>Current Server:</b> ${currentServer}:${currentPort}</p>
            <p><b>Bot Name:</b> ${botName}</p>
        </div>

        <div class="card">
            <h3>Change Server / Reconnect</h3>
            <form action="/update" method="POST">
                <label>Server IP:</label>
                <input type="text" name="ip" value="${currentServer}" required>
                <label>Port:</label>
                <input type="number" name="port" value="${currentPort}" required>
                <label>Bot Name:</label>
                <input type="text" name="name" value="${botName}" required>
                <button type="submit">Save & Reconnect Bot</button>
            </form>
        </div>

        <div class="card">
            <h3>Send Message / Command</h3>
            <form action="/chat" method="POST">
                <input type="text" name="msg" placeholder="Type message or command (e.g. /help)" required>
                <button type="submit">Send</button>
            </form>
        </div>

        <div class="card">
            <h3>Live Logs</h3>
            <div class="logs">${lastLogs.join('<br>')}</div>
        </div>
    </body>
    </html>
  `);
});

app.post('/update', (req, res) => {
  currentServer = req.body.ip;
  currentPort = parseInt(req.body.port);
  botName = req.body.name;
  addLog(`Web Panel: Updating configuration and restarting bot...`);
  startBot();
  res.redirect('/');
});

app.post('/chat', (req, res) => {
  const message = req.body.msg;
  if (bot && botStatus.includes("Online")) {
    bot.chat(message);
    addLog(`[Web Sent] ${message}`);
  }
  res.redirect('/');
});

// Railway requires '0.0.0.0' binding to route web traffic successfully
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Web dashboard running on port ${PORT}`);
});
