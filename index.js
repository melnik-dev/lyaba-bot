const TelegramApi = require('node-telegram-bot-api');

const token = '5702141894:AAFV-4OkYCM0c8yimXRK4hKrVooNpx0tqsk'

const bot = new TelegramApi(token, {polling: true})

bot.setMyCommands([
    {command: '/start', description: 'Старт'},
    {command: '/info', description: 'Инфо'},
])

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [
                {text: 'Есть', callback_data: 'yes'},
                {text: 'Нету', callback_data: 'no'},
                {text: 'Позже напеши', callback_data: 'pozji'}
            ],
        ]
    })
}
const kogdaOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [
                {text: 'Когда отдаш?', callback_data: 'kogda'}
            ],
        ]
    })
}

async function nextStep(data, chatId, payload) {
    if (data === 'yes') {
        await bot.sendMessage(chatId, payload.msgYes)
        return bot.sendSticker(chatId, payload.msgStickerYes, kogdaOptions)
    }
    if (data === 'no') {
        await bot.sendSticker(chatId, payload.msgStickerYNo)
        return bot.sendMessage(chatId, payload.msgNo, gameOptions)
    }
    if (data === 'pozji') {
        await bot.sendMessage(chatId, 'Ок')
        return setTimeout(async () => {
            await bot.sendSticker(chatId, payload.msgStickerPozji)
            bot.sendMessage(chatId, payload.msgPozji, gameOptions)
        }, 3000)
    }
    if (data === 'kogda') {
        await bot.sendSticker(chatId, 'CAACAgIAAxkBAAEGcW1jdQZWCcZDQaKTUPWHh4YHZS5sYwACQREAAtvjqEnB6ZNRWXZFmisE')
        return setTimeout(() => {
            bot.sendSticker(chatId, 'CAACAgIAAxkBAAEGcW9jdQaN4VhAnJ1rKrSLJxnWAAE2NH4AAgwQAAKgGrBJtz0ahW4IancrBA')
        }, 3000)
    }
}

const start = () => {
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        if (text === '/start') {
            await bot.sendMessage(chatId, `Привет!`)
            setTimeout(() => {
                bot.sendMessage(chatId, `Пажалуста`, gameOptions)
            }, 1800)
            return bot.sendSticker(chatId, 'CAACAgIAAxkBAAEGb4BjdAZ5feZ8lEocZNx9eFYQt2UKRgACjA8AAhhssEnmqfl6RdaCZisE')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.chat.first_name}`)
        }

        return bot.sendMessage(chatId, `Непонятно!`)
    })

    let step = 1;
    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        let payload = {
            msgYes: 'От души братишка',
            msgStickerYes: 'CAACAgIAAxkBAAEGcEtjdMFyG53bJRgDF1WfkRB54zNzFwAC4RMAAim0qUmM_YP-e4HPoSsE',
            msgNo: 'Бля очень надо. Займещ???',
            msgStickerYNo: 'CAACAgIAAxkBAAEGcFFjdMMBmKQ9UMLca6-p016PhKYITwACwREAAvLY-UsBdQlBmIbAuisE',
            msgPozji: 'Че там,позже уже наступило). Займещ???',
            msgStickerPozji: 'CAACAgIAAxkBAAEGcFNjdMQN9X0VtqOVe41jP79qzDGUVgAC5A0AAiI8sElzeWWZcYr_BSsE',
        }

        if (step === 1) {
            step++
            return nextStep(data, chatId, payload)
        }
        if (step === 2) {
            step++
            payload = {
                msgYes: 'От души братишка',
                msgStickerYes: 'CAACAgIAAxkBAAEGcEtjdMFyG53bJRgDF1WfkRB54zNzFwAC4RMAAim0qUmM_YP-e4HPoSsE',
                msgNo: 'Займещ???',
                msgStickerYNo: 'CAACAgIAAxkBAAEGcGNjdMsMOqpA-RRy_ky_kFwFNZiwmwACCRMAAvSiqElBw5mbEJCXZysE',
                msgPozji: 'Терь точно наступило). Займещ???',
                msgStickerPozji: 'CAACAgIAAxkBAAEGcI1jdN2D189l0_ZqzG1TBPVKejyuEwACWhEAAsl_qUnmH9e-ZTb50isE',
            }
            return nextStep(data, chatId, payload)
        }
        if (step === 3) {
            step = 1
            payload = {
                msgYes: 'От души братишка',
                msgStickerYes: 'CAACAgIAAxkBAAEGcEtjdMFyG53bJRgDF1WfkRB54zNzFwAC4RMAAim0qUmM_YP-e4HPoSsE',
                msgNo: 'Ну ладно',
                msgStickerYNo: 'CAACAgIAAxkBAAEGcXFjdQd9vfm3aJZ76cfRktcgryP_GgAC1BMAAj7o2UkhwgiKtH7dySsE',
                msgPozji: 'Я за Деньгами. Займещ???',
                msgStickerPozji: 'CAACAgIAAxkBAAEGcXNjdQfE8FDF5A24BtWnJCnGzB_DLAACDRMAAiZJ-Ev8IEyznzfVrSsE',
            }
            return nextStep(data, chatId, payload)
        }

        return bot.sendMessage(chatId, `Я ушол!`)
    })
}

start()
