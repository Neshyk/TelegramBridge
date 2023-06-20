const sequelize = require('./database');
const Bot = require('./models/Bot');
const Message = require('./models/Message');
const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/User');

// initialize your bot and message models
Bot.init(sequelize);
Message.init(sequelize);
User.init(sequelize);

async function getUpdates(telegramBot, bot) {
    try {
        const updates = await telegramBot.getUpdates({ offset: bot.lastMessageId + 1 });
        updates.forEach(async (update) => {
            const message = update.message;
            const chatId = message.chat.id;
            const text = message.text;
            const messageId = message.message_id;
            const userId = message.from.id; // user who sent the message

            const [user, created] = await User.findOrCreate({ where: { userId: userId } });
            if (created) {
                console.log(`Added new user: ${userId}`);
            }

            console.log(`Received message from chat ${chatId}: ${text}`);

            // Store the message to the database
            await Message.create({
                message_id: messageId,
                chat_id: chatId,
                text: text,
                message: JSON.stringify(message)
            });

            // Update last_processed_id in the database
            bot.lastMessageId = update.update_id;  // Adjusted this line to use update.update_id instead of messageId
            await bot.save();

            // If the user has shared a contact, store the phone number
            if (message.contact && message.contact.phone_number) {
                user.phoneNumber = message.contact.phone_number;
                await user.save();
                await telegramBot.sendMessage(chatId, 'You phone number was registered successfull.');
                console.log(`Updated phone number for user ${userId}: ${user.phoneNumber}`);
            }
            // If we don't have a phone number for the user, send a request contact button
            if (!user.phoneNumber) {
                const requestContactKeyboard = {
                    reply_markup: {
                        one_time_keyboard: true,
                        resize: false,
                        keyboard: [
                            [{
                                text: "Share Contact",
                                request_contact: true,
                            }],
                        ],
                    },
                };
                await telegramBot.sendMessage(chatId, 'Please share your contact with us before launch the Bot', requestContactKeyboard);
            }
            
        });

        // Use recursive setTimeout to get the next batch of updates
        setTimeout(getUpdates, 1000, telegramBot, bot);
    } catch (err) {
        console.error(err);
    }
}

async function initializeBots() {
    // Ensure the database is in sync
    await sequelize.sync();

    // Retrieve all bots
    const bots = await Bot.findAll();

    // For each bot in the database, create a new TelegramBot instance
    bots.forEach((bot) => {
        const telegramBot = new TelegramBot(bot.token, { polling: false });
        getUpdates(telegramBot, bot);
    });
}

module.exports = initializeBots;