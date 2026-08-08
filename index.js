const mineflayer = require('mineflayer');

// Variable track karega ki register hua hai ya nahi
let hasRegistered = false; 

const bot = mineflayer.createBot({
  host: process.env.SERVER_IP || 'dynamic-6.magmanode.com',
  port: parseInt(process.env.SERVER_PORT) || 25702,
  onlineMode: false,
  username: process.env.BOT_NAME || 'Bot',
  version: '1.21',
  physicsEnabled: false 
});

bot.on('spawn', () => {
  console.log('Bot spawned. Checking registration status...');

  setTimeout(() => {
    if (!hasRegistered) {
      // Pehli baar register karega
      bot.chat('/register monster123');
      console.log('Attempting to register...');
      
      // Register karne ke baad flag true kar do
      hasRegistered = true; 
    } else {
      // Agli baar se login karega
      bot.chat('/login monster123');
      console.log('Attempting to login...');
    }
  }, 3000); 

  // Anti-AFK
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
  console.log(`Disconnected: ${reason}.`);
  // Bot restart hoga toh 'hasRegistered' phir se false ho jayega, 
  // isliye hum yahan login ka logic rakhenge.
  // Lekin agar server par account ban chuka hai, toh bot ko /login hi bhejna chahiye.
  // Hint: Agar baar-baar register fail ho raha hai, toh code mein 
  // 'hasRegistered' ko manually 'true' karke push kar do.
  
  setTimeout(() => process.exit(1), 5000);
});

bot.on('error', (err) => console.log('Error:', err));
