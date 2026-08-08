const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: process.env.SERVER_IP || 'dynamic-6.magmanode.com', // Railway environment variable se IP lega
  port: parseInt(process.env.SERVER_PORT) || 25702,
  力和: false, // Online mode false matlab cracked server ke liye
  username: process.env.BOT_NAME || '24/7_Bot',
  version: '1.21' // Minecraft version 1.21
});

bot.on('spawn', () => {
  console.log('Bot successfully server par spawn ho gaya hai!');
  
  // Har 5 minute mein bot thoda move karega taaki AFK kick na ho
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 1000);
  }, 300000);
});

bot.on('chat', (username, message) => {
  if (username === bot.username) return;
  console.log(`[Chat] ${username}: ${message}`);
});

bot.on('end', (reason) => {
  console.log(`Bot disconnect ho gaya. Reason: ${reason}. Phir se connect kar rahe hain...`);
  setTimeout(() => {
    process.exit(1); // Railway isko automatically restart kar dega
  }, 5000);
});

bot.on('error', (err) => {
  console.log('Error aaya:', err);
});
