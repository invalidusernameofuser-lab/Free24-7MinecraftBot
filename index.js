const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: process.env.SERVER_IP || 'your_server_ip.aternos.me', // Fetches IP from Railway environment variables
  port: parseInt(process.env.SERVER_PORT) || 25565,
  onlineMode: false, // Set to false for cracked/offline servers
  username: process.env.BOT_NAME || 'AfnanBot',
  version: '1.21' // Minecraft version 1.21
});

bot.on('spawn', () => {
  console.log('Bot successfully spawned on the server!');

  // Wait for 3 seconds after spawning before sending the command
  setTimeout(() => {
    bot.chat('/register monster123 monster123');
    console.log('Register command sent to the server.');
  }, 3000); 

  // Keep-alive mechanism: Jump every 5 minutes to prevent AFK kicks
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 1000);
  }, 300000);
});

// Log server chat and messages to the console
bot.on('chat', (username, message) => {
  console.log(`[Chat] ${username}: ${message}`);
});

bot.on('end', (reason) => {
  console.log(`Bot disconnected. Reason: ${reason}. Reconnecting...`);
  setTimeout(() => {
    process.exit(1); // Railway will automatically restart the app
  }, 5000);
});

bot.on('error', (err) => {
  console.log('An error occurred:', err);
});
