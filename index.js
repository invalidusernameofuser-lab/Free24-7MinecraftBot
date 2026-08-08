const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: process.env.SERVER_IP || 'dynamic-6.magmanode.com',
  port: parseInt(process.env.SERVER_PORT) || 25702,
  onlineMode: false,
  username: process.env.BOT_NAME || 'Bot',
  version: '1.21',
  physicsEnabled: false 
});

bot.on('spawn', () => {
  console.log('Bot successfully spawned on the server!');

  // Spawn hone ke 3 second baad seedha register command bhej dega
  setTimeout(() => {
    bot.chat('/register monster123');
    console.log('Register command sent to the server.');
  }, 3000); 

  // Keep-alive: Jump every 5 minutes to prevent AFK kicks
  setInterval(() => {
    try {
      if (bot && bot.entity) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 1000);
      }
    } catch (e) {
      console.log('AFK jump error:', e);
    }
  }, 300000);
});

bot.on('chat', (username, message) => {
  console.log(`[Chat] ${username}: ${message}`);
});

bot.on('end', (reason) => {
  console.log(`Bot disconnected. Reason: ${reason}. Reconnecting via Railway...`);
  setTimeout(() => {
    process.exit(1); 
  }, 5000);
});

bot.on('error', (err) => {
  console.log('An error occurred:', err);
});
