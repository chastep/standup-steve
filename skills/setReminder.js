const log = require('../logger')('custom:setReminder');
const timeHelper = require('../helpers/time');
const common = require('../helpers/common');
const Channel = require('../repositories/channel');

async function setReminder(bot, message) {
  log.verbose(`heard a request to set a standup reminder: ${message.match[0]}`);

  const reminderMinutes = parseInt(message.match[2]);

  const currentChannel = await Channel.getById(bot, message.channel);

  if (currentChannel.standup.reminderTime) {
    const newReminderTime = timeHelper.getReminderFormat(currentChannel.standup.time, reminderMinutes);
    currentChannel.standup.reminderTime = newReminderTime;
    currentChannel.reminderMinutes = reminderMinutes;

    const updatedChannel = await Channel.save(bot, currentChannel);

    if (updatedChannel.standup) {
      bot.reply(
      message,
      common.standupInfoBlob(updatedChannel)+
      `\n:thumbsup: :standup: Successfully Updated :thumbsup:`
      );
      log.info(`reminder is set for ${timeHelper.getDisplayFormat(updatedChannel.standup.reminderTime)} :thumbsup:`);
      log.info(`channel has been successfully updated`);
      log.info(updatedChannel);
    } else {
      bot.reply(
        message,
        'Standup has been successfully updated, please use command \n'+
        '`@[bot-name] when` to check if info is correct.'
      )
      log.warn(`channel is missing standup info`);
    }
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
