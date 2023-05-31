const TelegramApi = require('node-telegram-bot-api');
const translate = require('google-translate-api');
const i18next = require('i18next');
const Backend = require('i18next-node-fs-backend');
const token ='5872792155:AAFhsYI7drwe_upOvs_5El2O910iCUfzAi8'
const bot = new TelegramApi(token, {polling: true});
const axios = require('axios');
const fs = require('fs');
const {gameOptions,againOptions} = require('./option');

i18next.use(Backend).init({
    lng: 'en', // Set the default language
    fallbackLng: 'en', // Fallback language if translation is missing
    backend: {
        loadPath: 'path/to/locales/{{lng}}.json', // Path to your translation files
    },
});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Men 0 dan 9 gacha raqamlarni so\'rayapman va siz taxmin qilishingiz kerak');
    const radNumber = Math.floor(Math.random() * 10);
    chats[chatId] = radNumber;
    await bot.sendMessage(chatId, 'Raqamni yuboring', gameOptions);
    await bot.sendSticker(chatId,'https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/192/37.webp')
}
const start = async () => {


    bot.setMyCommands([
        {command: '/start', description: 'Botni ishga tushurish'},
        {command: '/admin', description: 'Admin bilan bog\'lanish'},
        {command: '/info', description: 'Bot haqida malumot'},
        {command: '/game', description: 'Game'},
        {command: '/audio', description: 'Matnni audio formatiga o\'zgartirish'},
        {command: '/help', description: 'Yordam'},

    ]);
    bot.on('message',  async msg => {
        console.log(msg);
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            console.log(msg.from, 'Foydalanuvchi ismi')
            await bot.sendMessage(chatId, `Assalomu alaykum ${msg.from.first_name}  Botga xush kelibsiz ! `)
            const tarjimalanganXabar = i18next.t('hello');
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/192/1.webp');
            return bot.sendMessage(msg.chat.id, tarjimalanganXabar);
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, ` ${msg.from.first_name} ${msg.from.username}  Siz Rustam Pulatov shaxsiy botidasiz bu bot sizga xar qanday qulayliklar keltira oladi `)
        }
        if (text === '/help') {
            return bot.sendMessage(chatId, ` ${msg.from.first_name} ${msg.from.username}  Sizga yordam beraman `)
        }
        if (text === '/admin') {
            return bot.sendContact(chatId, '+998 97-715-16-76', 'Rustam Pulatov');
        }
        if (text === '/game') {
           return  startGame(chatId);
        }
        if (text === '/audio') {
            try {
                const response = await axios.get('https://translate.google.com/translate_tts', {
                    params: {
                        ie: 'UTF-8',
                        q: 'savolingizni text orqali yozing',
                        tl: 'ru',
                        client: 'gtx',
                    },
                    responseType: 'arraybuffer',
                });

                fs.writeFileSync('audio.mp3', response.data);
                bot.sendAudio(chatId, 'audio.mp3');
                console.log('Matn audio fayliga o\'girildi va bot javobi sifatida yuborildi');
            } catch (error) {
                console.error('Hatolik yuz berdi:', error);
            }
        }
        // else {
        //
        //     try {
        //         const response = await axios.get('https://translate.google.com/translate_tts', {
        //             params: {
        //                 ie: 'UTF-8',
        //                 q: msg.text  + "men ham bilmayman hozircha kutib turing ",
        //                 tl: 'ru',
        //                 client: 'gtx',
        //             },
        //             responseType: 'arraybuffer',
        //         });
        //
        //         fs.writeFileSync('audio.mp3', response.data);
        //         bot.sendAudio(chatId, 'audio.mp3');
        //         console.log('Matn audio fayliga o\'girildi va bot javobi sifatida yuborildi');
        //     } catch (error) {
        //         console.error('Hatolik yuz berdi:', error);
        //     }
        // }
        // return bot.sendMessage(chatId, ` ${msg.from.first_name} ${msg.from.username}  Men sizni tushunmayapman iltmos /admin bilan bog'laning `)


    });
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        console.log(msg, 'callback data')
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Siz tog'ri topdingiz ${chats[chatId]}` , againOptions);
        }else {
            return bot.sendMessage(chatId, `Siz notog'ri topdingiz ${chats[chatId]}`,againOptions);
        }
    })
}
start().then(r => console.log('Bot ishga tushdi')).catch(e => console.log(e));
