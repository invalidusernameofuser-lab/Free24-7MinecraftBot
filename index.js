const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: process.env.SERVER_IP || 'dynamic-6.magmanode.com',
  port: parseInt(process.env.SERVER_PORT) || 25702,
  onlineMode: false,
  username: process.env.BOT_NAME || 'ErlingHaaland',
  version: '1.21',
  physicsEnabled: false
});

// Spawn hone par command bhejte hain
bot.on('spawn', () => {
  console.log('Bot spawned! Sending authentication in 4 seconds...');
  
  setTimeout(() => {
    // Pehle register try karega, agar already registered hai toh server ignore kar dega
    bot.chat('/register monster123');
    console.log('Sent register command');
    
    // 2 second baad login try karega
    setTimeout(() => {
        bot.chat('/login monster123');
        console.log('Sent login command');
    }, 2000);
    
  }, 4000);
});

// Anti-AFK
setInterval(() => {
  if (bot && bot.entity) {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 1000);
  }
}, 300000);

bot.on('end', (reason) => {
  console.log(`Disconnected: ${reason}. Reconnecting...`);
  setTimeout(() => process.exit(1), 5000);
});

bot.on('error', (err) => console.log('Error:', err));
