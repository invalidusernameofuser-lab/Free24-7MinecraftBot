const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
  host: process.env.SERVER_IP,       // Railway ke Environment Variables se IP lega
  port: parseInt(process.env.SERVER_PORT) || 25565,
  username: process.env.BOT_NAME || 'YourFree24/7Bot',
  auth: 'offline'
})

bot.on('spawn', () => {
  console.log("Bot successfully Railway par join ho gaya hai!")
  bot.chat('Hello! Main Railway server se live hoon.')
})

bot.on('chat', (username, message) => {
  if (username === bot.username) return
  console.log(`<${username}> ${message}`)
})

bot.on('kicked', (reason) => {
  console.log(`Bot kick ho gaya: ${reason}`)
})

bot.on('error', (err) => {
  console.log('Error:', err)
})
