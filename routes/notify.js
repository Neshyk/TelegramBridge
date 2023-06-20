var express = require('express');
var router = express.Router();

const sequelize = require('../database');
const Bot = require('../models/Bot');
const User = require('../models/User');
const TelegramBot = require('node-telegram-bot-api');

// initialize bot and user models
Bot.init(sequelize);
User.init(sequelize);

/* POST send message. */
router.post('/sendMessage', async (req, res) => {
  try {
      const phoneNumber = req.body.phoneNumber;
      const text = req.body.text;
  
      // find user with the provided phone number
      const user = await User.findOne({ where: { phoneNumber: phoneNumber } });
  
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
  
      // find bot (assuming there's only one bot in the system)
      const botModel = await Bot.findOne();
  
      if (!botModel) {
          return res.status(404).json({ message: 'Bot not found' });
      }
  
      const telegramBot = new TelegramBot(botModel.token);
      await telegramBot.sendMessage(user.userId, text);
  
      res.status(200).json({ message: 'Message sent' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
