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
      return;
    } else if (channel.standup.reminderTime === where.time && _.includes(channel.standup.days, where.day)) {
      selected.push(channel);
    }
  });
  return selected;
}

function runReminders(bot) {
  log.verbose('attempting to run channel reminders :D');

  if (fedHolidays.isAHoliday()) {
    return;
  }

  const where = {
    time: timeHelper.getScheduleFormat(),
    day: _.upperFirst(timeHelper.getScheduleDay()),
  };

  bot.botkit.storage.channels.all(async (err, channels) => {
    if (err) {
      log.error(`encountered error trying to get all channels: ${err}`);
      return;
    }

    const selected_channels = await collectTimeMatchedChannels(channels, where);

    if (selected_channels.length > 0) {
      log.info(`sending reminders for ${selected_channels.length} channel(s)`);

      // Iterate over the selected_channels
      _.each(selected_channels, (channel) => {
        const reminder = {
          text: 
            `<!here> :hourglass: There's a standup in ${channel.reminderMinutes} minutes! :hourglass:\n`+
            `To submit your standup add any emoji to this message and I'll DM you to get your standup info.`,
          attachments: [],
          channel: channel.id,
          as_user: true
        };
        bot.api.chat.postMessage(reminder, (err, response) => {
        	if (err) {
            log.error(`error sending reminder: ${err}`);
            return;
          }
        	log.verbose(`sending channel reminder :D - ${channel.name}`);
          if (!err) {
            bot.api.reactions.add({
              name: 'wave',
              channel: channel.id,
              timestamp: response.message.ts,
            });
          }
        });
      });
    } else {
    	log.verbose(`there are no channels eligible for reminding - PEACE`);
    }
  });
}

module.exports = function (bot) {
  return function () {
    runReminders(bot);
  };
};
