const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: process.env.SERVER_IP || 'dynamic-6.magmanode.com',
  port: parseInt(process.env.SERVER_PORT) || 25702,
  onlineMode: false,
  username: process.env.BOT_NAME || 'haaland',
  version: '1.21',
  physicsEnabled: false
});

bot.on('spawn', () => {
  console.log('Bot successfully spawned on the server!');

  setTimeout(() => {
    // Railway variable check karega ki pehle register hua hai ya nahi
    const isRegistered = process.env.IS_REGISTERED === 'true';

    if (!isRegistered) {
      console.log('First time join: Sending register command...');
      bot.chat('/register haaland haaland');
      
      // Register hone ke turant baad login bhi bhej dete hain
      setTimeout(() => {
        bot.chat('/login haaland');
      }, 2000);
    } else {
      console.log('Already registered: Sending login command...');
      bot.chat('/login haaland');
    }
  }, 4000); 
});

// Anti-AFK: Jump every 5 minutes
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

bot.on('end', (reason) => {
  console.log(`Bot disconnected. Reason: ${reason}. Reconnecting via Railway...`);
  setTimeout(() => {
    process.exit(1); 
  }, 5000);
});

bot.on('error', (err) => {
  console.log('An error occurred:', err);
});
