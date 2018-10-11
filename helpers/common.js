const timeHelper = require('./time.js');

function standupInfoBlob(channel) {
  return (
    `:point_down: Standup Details :point_down:\n`+
    `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`+
    `Time: ${timeHelper.getDisplayFormat(channel.standup.time)}\n`+
    `Days: ${timeHelper.getDisplayFormatForDays(channel.standup.days)}\n`+
    `Reminder Time: ${timeHelper.getDisplayFormat(channel.standup.reminderTime)}\n`+
    `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
  )
}


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
  standupInfoBlob: standupInfoBlob,
};
