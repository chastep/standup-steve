//
// this process will edit the reminder time for a channel:
//

var log = require('../logger')('custom:set_reminder');
const timeHelper = require('../helpers/time.js');

function setReminder(bot, message) {
  log.verbose(`Heard a request to set a standup reminder: ${message.match[0]}`);

  const reminderMinutes = message.match[2];

  bot.botkit.storage.channels.get(message.channel, (err, chan) => {
    if (!chan) {
      bot.reply(message, `I experienced an error finding this channel: ${err}`);
      log.error('channel is not present!');
    } else {
      log.info('channel is present');

      if (chan.standup.reminderTime) {
        const newReminderTime = timeHelper.getReminderFormat(chan.standup.time, reminderMinutes);
        chan.standup.reminderTime = newReminderTime;

        bot.botkit.storage.channels.save(chan, (error, channel) => {
          if (error) {
            bot.reply(message, `I experienced an error updating this channels standup: ${error}`);
            log.error(error);
          } else {
            bot.reply(message, `Got it. Reminder is set for ${timeHelper.getDisplayFormat(channel.standup.reminderTime)} :thumbsup:`);
            log.info(`Got it. Reminder is set for ${timeHelper.getDisplayFormat(channel.standup.reminderTime)} :thumbsup:`);
            log.info('channel has been successfully updated');
            log.info(channel);
          }
        });
      } else {
        bot.reply(message, `There's no standup scheduled yet. Create one before setting a reminder.`);
      }
    }
  });
}

module.exports = function attachSetReminderListener(controller) {
  controller.hears(['remind(er)? (\\d*)'],['direct_mention'], setReminder);
  log.verbose('ATTACHED');
};
