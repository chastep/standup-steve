const log = require('../logger')('custom:createChannelStandup');
const timeHelper = require('../helpers/time');
const common = require('../helpers/common');
const Channel = require('../repositories/channel');

function createNewStandup(channel, schedule) {
  const newStandup = {};
  newStandup.id = `standup_${channel.id}`;
  newStandup.time = timeHelper.getScheduleFormat(schedule.time);
  newStandup.reminderTime = timeHelper.getReminderFormat(newStandup.time, channel.reminderMinutes);
  newStandup.days = schedule.days;
  return newStandup;
}

async function createChannelStandup(bot, message) {
  log.verbose(`heard this request: ${message.match[0]}`);

  const currentChannel = await Channel.getById(bot, message.channel);

  log.info('channel is present');

  const schedule = timeHelper.getTimeFromString(message.match[2]);

  if (schedule !== false) {
    log.info(schedule);

    currentChannel.standup = createNewStandup(currentChannel, schedule);

    const updatedChannel = await Channel.save(bot, currentChannel);

    bot.reply(
      message,
      common.standupInfoBlob(updatedChannel)+
      `\n:thumbsup: :standup: Successfully Saved :thumbsup:`
    );
    log.info(`standup scheduled for #${updatedChannel.name} at ${timeHelper.getDisplayFormat(updatedChannel.standup.time)} on ${timeHelper.getDisplayFormatForDays(updatedChannel.standup.days)}`);
    log.info(`channel has been successfully saved`);
    log.info(updatedChannel);
  } else {
    bot.reply(message, ':x: Incorrect time format! Please try again. :x:');
    log.warn('incorrect time format');
  }
}

function attachSkill(controller) {
  controller.hears(['(schedule|create|move) standup (.*)'], 'direct_mention', createChannelStandup);
  log.verbose('ATTACHED');
};

module.exports = {
  createChannelStandup,
  attachSkill,
}
