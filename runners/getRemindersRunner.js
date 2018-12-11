const log = require('../logger')('custom:remindersRunner');
const _ = require('lodash');
const timeHelper = require('../helpers/time');
const fedHolidays = require('@18f/us-federal-holidays');
const common = require('../helpers/common');
const Channel = require('../repositories/channel');

async function runReminders(bot) {
  log.verbose('attempting to run channel reminders :D');

  if (fedHolidays.isAHoliday()) {
    return;
  }

  const timeAndDay = {
    time: timeHelper.getScheduleFormat(),
    day: timeHelper.getScheduleDay(),
  };
  const allChannels = await Channel.getAll(bot);
  const selectedChannels = await common.collectTimeMatchedChannels(allChannels, timeAndDay, 'reminder');

  if (selectedChannels.length > 0) {
    log.info(`sending reminders for ${selectedChannels.length} channel(s)`);

    _.each(selectedChannels, (channel) => {
      const alert = (channel.atHereAlert) ? `<!here> ` : ``;
      const reminder = {
        text: 
          `${alert}:hourglass: There's a standup in ${channel.reminderMinutes} minutes! :hourglass:\n`+
          `To submit your standup add any emoji to this message and I'll DM you to get your info.`,
        attachments: [],
        channel: channel.id,
        as_user: true
      };

      bot.api.chat.postMessage(reminder, (err, response) => {
        if (err) {
          log.error(`error sending reminder: ${err}`);
          return;
        }
        log.verbose(`sending channel reminder :D - #${channel.name}`);

        bot.api.reactions.add({
          name: 'wave',
          channel: channel.id,
          timestamp: response.message.ts,
        });
      });
    });
  } else {
    log.verbose(`there are no channels eligible for reminding - PEACE`);
  }
};

module.exports = function (bot) {
  return function () {
    runReminders(bot);
  };
};
