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
  console.log('Bot successfully spawned!');

  // Anti-AFK Jump (5 minutes)
  setInterval(() => {
    try {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 1000);
    } catch (e) {}
  }, 300000);
});

// Server ke messages sunne ke liye
bot.on('message', (jsonMsg) => {
  const message = jsonMsg.toString();
  console.log(`[Server]: ${message}`);

  // Agar server kahe "register" karne ko
  if (message.toLowerCase().includes('register')) {
    setTimeout(() => {
      bot.chat('/register monster123 monster123');
      console.log('Registered successfully!');
    }, 2000);
  }

  // Agar server kahe "login" karne ko
  if (message.toLowerCase().includes('login')) {
    setTimeout(() => {
      bot.chat('/login monster123');
      console.log('Logged in successfully!');
    }, 2000);
  }
});

bot.on('end', (reason) => {
  console.log(`Disconnected: ${reason}. Restarting...`);
  setTimeout(() => process.exit(1), 5000);
});

bot.on('error', (err) => console.log('Error:', err));
