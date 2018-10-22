//
// this process will edit the reminder time for a channel:
//

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

  // bot.botkit.storage.channels.get(message.channel, (err, chan) => {
  //   if (!chan) {
  //     bot.reply(message, `I experienced an error finding this channel: ${err}`);
  //     log.error('channel is not present!');
  //   } else {
  //     log.info('channel is present');

  //     if (chan.standup.reminderTime) {
  //       const newReminderTime = timeHelper.getReminderFormat(chan.standup.time, reminderMinutes);
  //       chan.standup.reminderTime = newReminderTime;
  //       chan.reminderMinutes = reminderMinutes;

  //       bot.botkit.storage.channels.save(chan, (error, channel) => {
  //         if (error) {
  //           bot.reply(message, `I experienced an error updating this channels standup: ${error}`);
  //           log.error(error);
  //         } else {
  //           bot.reply(
  //             message,
  //             common.standupInfoBlob(channel)+
  //             `\n:thumbsup: :standup: Successfully Updated :thumbsup:`
  //           );
  //           log.info(`reminder is set for ${timeHelper.getDisplayFormat(channel.standup.reminderTime)} :thumbsup:`);
  //           log.info(`channel has been successfully updated`);
  //           log.info(channel);
  //         }
  //       });
  //     } else {
  //       bot.reply(message, `There's no standup scheduled yet. Create one before setting a reminder.`);
  //     }
  //   }
  // });
}

function attachSkill(controller) {
  controller.hears(['remind(er)? (\\d*)'],['direct_mention'], setReminder);
  log.verbose('ATTACHED');
};

module.exports = {
  setReminder,
  attachSkill,
};
