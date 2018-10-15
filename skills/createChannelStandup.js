//
// this process will create a daily standup that:
// 1. creates a standup object (with relevant attributes)
// 2. saves it in storage (with relevant attributes)
//

const log = require('../logger')('custom:create_channel_standup');
const timeHelper = require('../helpers/time.js');
const common = require('../helpers/common.js');

function createNewStandup(channel, schedule) {
  const newStandup = {};
  newStandup.id = `standup_${channel.id}`;
  newStandup.time = timeHelper.getScheduleFormat(schedule.time);
  newStandup.reminderTime = timeHelper.getReminderFormat(newStandup.time, channel.reminderMinutes);
  newStandup.days = schedule.days;
  return newStandup;
}

function createChannelStandup(bot, message) {
  log.verbose(
    `heard this request: \n`+
    `${message.match[0]}`
  );

  bot.botkit.storage.channels.get(message.channel, (err, chan) => {
    if (!chan) {
      bot.reply(message, `I experienced an error finding this channel: ${err}`);
      log.error('channel is not present!');
    } else {
      log.info('channel is present');

      const schedule = timeHelper.getTimeFromString(message.match[2]);
      if (schedule !== false) {
        log.info(schedule);

        chan.standup = createNewStandup(chan, schedule);

        bot.botkit.storage.channels.save(chan, (error, channel) => {
          if (error) {
            bot.reply(message, `I experienced an error updating this channels standup: ${error}`);
            log.error(error);
          } else {
            bot.reply(
              message,
              common.standupInfoBlob(channel)+
              `\n:thumbsup: :standup: Successfully Saved :thumbsup:`
            );
            log.info(`standup scheduled for ${message.channel} at ${timeHelper.getDisplayFormat(channel.standup.time)} on ${timeHelper.getDisplayFormatForDays(channel.standup.days)}`);
            log.info(`channel has been successfully saved`);
            log.info(channel);
          }
        });
      } else {
        bot.reply(message, ':x: Incorrect time format! Please try again. :x:');
        log.warn('incorrect time format');
      }
    }
  });
}

function attachSkill(controller) {
  controller.hears(['(schedule|create|move) standup (.*)'], 'direct_mention', createChannelStandup);
  log.verbose('ATTACHED');
};

module.exports = {
  createChannelStandup,
  attachSkill,
}
