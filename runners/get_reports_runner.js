//
// this process kicks off the reporting process for all channels
//

const log = require('../logger')('custom:report_runner:');
const _ = require('lodash');
const timeHelper = require('../helpers/time.js');
const channelReportHelper = require('../helpers/do_channel_report.js');
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
  log.verbose('Attempting to run channel standup reports :D');

  if (fedHolidays.isAHoliday()) {
    return;
  };

  const where = {
    time: timeHelper.getScheduleFormat(),
    day: timeHelper.getScheduleDay()
  };

  bot.botkit.storage.channels.all(async (err, channels) => {
    if (err) {
      log.error('Encountered error trying to get all channels: ', err);
      return;
    }

    const selected_channels = await collectTimeMatchedChannels(channels, where);

    if (selected_channels.length > 0) {
      log.info(`Reporting standups for ${channels.length} channel(s)`);
      _.each(selected_channels, (channel) => {
        log.verbose('Starting to run channel report for '+channel.id);
        channelReportHelper.doChannelReport(bot, channel.id);
      });
    } else {
      log.verbose('There are no channels eligible for reporting - PEACE');
    }
  });
}

module.exports = function (bot) {
  return function () {
    runReports(bot);
  };
};
