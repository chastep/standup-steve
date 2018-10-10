async function collectUserInfo(bot, userId) {
  return await bot.botkit.storage.users.get(userId, async (err, response) => {
    if (err) {
      bot.reply(message, `I experienced an error finding user: ${err}`);
      log.error(`user does not exist ${err}`);
    }
  });
};

module.exports = {
  collectUserInfo: collectUserInfo,
};
