const {Telegraf} = require('telegraf');
const TelegramApi = require('node-telegram-bot-api');
const token ='5872792155:AAFhsYI7drwe_upOvs_5El2O910iCUfzAi8'
const bot = new TelegramApi(token, {polling: true});
bot.on('message',  msg => {
    console.log(msg)
});
bot.start((ctx) => {
    ctx.reply('Welcome')
});
