//
// this process will create a daily standup that:
// 1. creates a standup object (with relevant attributes)
// 2. saves it in storage (with relevant attributes)
//

const log = require('../logger')('custom:create_channel_standup');
const timeHelper = require('../helpers/time.js');

function createNewStandup(channel, schedule) {
  const newStandup = {};
  newStandup.id = `standup_${channel.id}`;
  // time attributes
  newStandup.time = timeHelper.getScheduleFormat(schedule.time);
  newStandup.reminderTime = timeHelper.getReminderFormat(newStandup.time, channel.reminderMinutes);
  newStandup.days = schedule.days;
  return newStandup;
}

function createChannelStandup(bot, message) {
  log.verbose(`Heard this request - ${message.match[0]}`);

  // store channel
  bot.botkit.storage.channels.get(message.channel, (err, chan) => {
    if (!chan) {
      bot.reply(message, `I experienced an error finding this channel: ${err}`);
      log.error('channel is not present!');
    } else {
      log.info('channel is present');
      // establish standup time from message
      const schedule = timeHelper.getTimeFromString(message.match[2]);
      if (schedule !== false) {
        log.info(schedule);
        // new standup object
        chan.standup = createNewStandup(chan, schedule);
        // update channel with new standup object
        bot.botkit.storage.channels.save(chan, (error, channel) => {
          if (error) {
            bot.reply(message, `I experienced an error updating this channels standup: ${error}`);
            log.error(error);
          } else {
            bot.reply(message, `Got it. Standup scheduled for ${timeHelper.getDisplayFormat(channel.standup.time)} on ${timeHelper.getDisplayFormatForDays(channel.standup.days)} :thumbsup:`);
            log.info(`Standup scheduled for ${message.channel} at ${timeHelper.getDisplayFormat(channel.standup.time)} on ${timeHelper.getDisplayFormatForDays(channel.standup.days)}`);
            log.info('channel has been successfully updated');
            log.info(channel);
          }
        });
      } else {
        bot.reply(message, ':x: Incorrect time format! Please try again. :x:');
        log.error('Incorrect time format');
      }
    }
  });
}

module.exports = function attachCreateChannelStandupListener(controller) {
  controller.hears(['(schedule|create|move) standup (.*)'], 'direct_mention', createChannelStandup);
  log.verbose('ATTACHED');
};
