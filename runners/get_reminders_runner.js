//
// this process kicks off the reminder process for all selected_channels
//

const log = require('../logger')('custom:reminders_runner');
const _ = require('lodash');
const timeHelper = require('../helpers/time.js');
const fedHolidays = require('@18f/us-federal-holidays');

function collectTimeMatchedChannels(channels, where) {
  const selected = [];
  _.each(channels, (channel) => {
    if (_.isEmpty(channel.standup)) {

    } else if (((parseInt(channel.standup.time) - channel.reminderMinutes) === parseInt(where.time)) && _.includes(channel.standup.days, where.day)) {
      selected.push(channel);
    }
  });
  return selected;
}

function runReminders(bot) {
  log.verbose('Attempting to run channel reminders :D');

  // Don't run if today is a federal holiday
  if (fedHolidays.isAHoliday()) {
    return;
  }

  const where = {
    time: timeHelper.getScheduleFormat(),
    day: _.upperFirst(timeHelper.getScheduleDay()),
  };

  bot.botkit.storage.channels.all(async (err, channels) => {
    if (err) {
      log.error('Encountered error trying to get all channels: ', err);
      return;
    }

    const selected_channels = await collectTimeMatchedChannels(channels, where);

    if (selected_channels.length > 0) {
      log.info(`Sending reminders for ${selected_channels.length} channel(s)`);

      // Iterate over the selected_channels
      _.each(selected_channels, (channel) => {
        const reminder = {
          text: `<!here> :hourglass: There's a standup in ${channel.reminderMinutes} minutes! `
             + 'To submit your standup, DM me! Or, add any emoji to this message and I\'ll DM you to get your standup info.',
          attachments: [],
          channel: channel.id,
        };
        bot.say(reminder, (err, response) => {
        	if (err) {
            log.error('Error sending reminder: ', err);
            return;
          }
        	log.verbose(`Sending channel reminder :D - ${channel.name}`);
          if (!err) {
          	log.info(bot);
            bot.api.reactions.add({
              name: 'wave',
              channel: channel.id,
              timestamp: response.message.ts,
            });
          }
        });
      });
    } else {
    	log.verbose('There are no channels eligible for reminding - PEACE');
    }
  });
}

module.exports = function (bot) {
  return function () {
    runReminders(bot);
  };
};
