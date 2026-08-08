const mineflayer = require('mineflayer');

let bot;
const serverHost = process.env.SERVER_IP || 'dynamic-6.magmanode.com';
const serverPort = parseInt(process.env.SERVER_PORT) || 25702;
const botName = process.env.BOT_NAME || 'AJEEBHAA';

function createBot() {
  console.log(`Connecting to ${serverHost}:${serverPort} as ${botName}...`);

  bot = mineflayer.createBot({
    host: serverHost,
    port: serverPort,
    onlineMode: false,
    username: botName,
    version: '1.21',
    physicsEnabled: false,
    checkTimeoutInterval: 300000 // Timeout 5 minutes kar diya hai taaki server kick na kare
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
    }, 5000); // 5 seconds wait taaki server puri tarah load kar le

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
    console.log(`Bot disconnected. Reason: ${reason}. Reconnecting in 15 seconds...`);
    // Reconnection time 10s se badha kar 15s kar diya hai taaki server spam detect na kare
    setTimeout(() => {
      createBot();
    }, 15000);
  });

  bot.on('error', (err) => {
    console.log('An error occurred:', err);
  });
}

createBot();
