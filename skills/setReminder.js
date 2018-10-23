const log = require('../logger')('custom:set_reminder');
const timeHelper = require('../helpers/time.js');
const common = require('../helpers/common.js');
const Channel = require('../repositories/channel');

async function setReminder(bot, message) {
  log.verbose(`heard a request to set a standup reminder: ${message.match[0]}`);

  const reminderMinutes = message.match[2];

  const currentChannel = await Channel.getById(bot, message.channel);

  if (currentChannel.standup.reminderTime) {
    const newReminderTime = timeHelper.getReminderFormat(currentChannel.standup.time, reminderMinutes);
    currentChannel.standup.reminderTime = newReminderTime;
    currentChannel.reminderMinutes = reminderMinutes;

    const updatedChannel = await Channel.save(bot, currentChannel);

    bot.reply(
      message,
      common.standupInfoBlob(updatedChannel)+
      `\n:thumbsup: :standup: Successfully Updated :thumbsup:`
    );
    log.info(`reminder is set for ${timeHelper.getDisplayFormat(updatedChannel.standup.reminderTime)} :thumbsup:`);
    log.info(`channel has been successfully updated`);
    log.info(updatedChannel);
  } else {
    bot.reply(message, `There's no standup scheduled yet. Create one before setting a reminder time.`);
  }
}

function attachSkill(controller) {
  controller.hears(['remind(er)? (\\d*)'],['direct_mention'], setReminder);
  log.verbose('ATTACHED');
};

module.exports = {
  setReminder,
  attachSkill,
};
