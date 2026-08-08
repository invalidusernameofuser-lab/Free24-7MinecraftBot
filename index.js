const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: process.env.SERVER_IP || 'dynamic-6.magmanode.com',
  port: parseInt(process.env.SERVER_PORT) || 25702,
  onlineMode: false,
  username: process.env.BOT_NAME || 'FreeMinecraftBot',
  version: '1.21'
});

bot.on('spawn', () => {
  console.log('Bot successfully spawned on the server!');

  // Wait for 3 seconds after spawning, then login
  setTimeout(() => {
    // Agar server par pehle se account hai toh /login use karein:
    bot.chat('/login monster123');
    
    // Agar bilkul naya server hai aur pehli baar register karna hai, toh upar wali line hata kar ye uncomment karein:
    // bot.chat('/register monster123 monster123');
    
    console.log('Login command sent to the server.');
  }, 3000); 

  // Keep-alive: Jump every 5 minutes to prevent AFK kicks
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 1000);
  }, 300000);
});

bot.on('chat', (username, message) => {
  console.log(`[Chat] ${username}: ${message}`);
});

bot.on('end', (reason) => {
  console.log(`Bot disconnected. Reason: ${reason}. Reconnecting via Railway...`);
  setTimeout(() => {
    process.exit(1); // Railway will restart the bot automatically
  }, 5000);
});

bot.on('error', (err) => {
  console.log('An error occurred:', err);
});
