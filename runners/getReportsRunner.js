//
// this process kicks off the reporting process for all channels
//

const log = require('../logger')('custom:report_runner:');
const _ = require('lodash');
const timeHelper = require('../helpers/time.js');
const doChannelReport = require('../helpers/doChannelReport.js');
const fedHolidays = require('@18f/us-federal-holidays');

function collectTimeMatchedChannels(channels, where) {
  const selected = [];
  _.each(channels, (channel) => {
    if (_.isEmpty(channel.standup)) {
      return;
    } else if (channel.standup.time === where.time && _.includes(channel.standup.days, _.capitalize(where.day))) {
      selected.push(channel);
    }
  });
  return selected;
}

function runReports(bot) {
  log.verbose('attempting to run channel standup reports :D');

  if (fedHolidays.isAHoliday()) {
    return;
  };

  const where = {
    time: timeHelper.getScheduleFormat(),
    day: timeHelper.getScheduleDay()
  };

  bot.botkit.storage.channels.all(async (err, channels) => {
    if (err) {
      log.error(`encountered error trying to get all channels: ${err}`);
      return;
    }

    const selected_channels = await collectTimeMatchedChannels(channels, where);

    if (selected_channels.length > 0) {
      log.info(`reporting standups for ${channels.length} channel(s)`);
      _.each(selected_channels, (channel) => {
        log.verbose(`starting to run channel report for ${channel.id}`);
        doChannelReport(bot, channel.id);
      });
    } else {
      log.verbose(`there are no channels eligible for reporting - PEACE`);
    }
  });
}

module.exports = function (bot) {
  return function () {
    runReports(bot);
  };
};
