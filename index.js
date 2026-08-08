const mineflayer = require('mineflayer');

let bot;
const serverHost = process.env.SERVER_IP || 'dynamic-6.magmanode.com';
const serverPort = parseInt(process.env.SERVER_PORT) || 25702;
const botName = process.env.BOT_NAME || 'HaalandBot_99'; // Unique name rakhein

function createBot() {
  console.log(`Connecting to ${serverHost}:${serverPort} as ${botName}...`);

  bot = mineflayer.createBot({
    host: serverHost,
    port: serverPort,
    onlineMode: false,
    username: botName,
    version: '1.21',
    physicsEnabled: false
  });

  bot.on('spawn', () => {
    console.log('Bot successfully spawned on the server!');

    setTimeout(() => {
      const isRegistered = process.env.IS_REGISTERED === 'true';
      if (!isRegistered) {
        bot.chat('/register monster123 monster123');
        console.log('Sent register command');
      } else {
        bot.chat('/login monster123');
        console.log('Sent login command');
      }
    }, 4000);

    // Anti-AFK Jump every 5 minutes
    setInterval(() => {
      try {
        if (bot && bot.entity) {
          bot.setControlState('jump', true);
          setTimeout(() => bot.setControlState('jump', false), 1000);
        }
      } catch (e) {}
    }, 300000);
  });

  bot.on('end', (reason) => {
    console.log(`Bot disconnected. Reason: ${reason}. Reconnecting in 10 seconds...`);
    // Process exit ki jagah seedha 10 second baad function call karenge taaki loop control mein rahe
    setTimeout(() => {
      createBot();
    }, 10000);
  });

  bot.on('error', (err) => {
    console.log('An error occurred:', err);
  });
}

// Start the bot
createBot();
