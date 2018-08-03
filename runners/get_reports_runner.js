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

    } else if (channel.standup.time === where.time && _.includes(channel.standup.days, where.day)) {
      selected.push(channel);
    }
  });
  return selected;
}

function runReports(controller) {
  log.verbose('Attempting to run channel standup reports :D');

  // Don't run if today is a federal holiday
  if (fedHolidays.isAHoliday()) {
    return;
  }

  const where = {
    time: timeHelper.getScheduleFormat(),
    day: timeHelper.getScheduleDay(),
  };

  const bot = controller.spawn({
    clientId: process.env.SLACK_APP_ID,
    clientSecret: process.env.SLACK_APP_SECRET,
  });

  bot.botkit.storage.channels.all(async (err, channels) => {
    if (err) {
      log.error('Encountered error trying to get all channels: ', err);
      return;
    }

    const selected_channels = await collectTimeMatchedChannels(channels, where);

    if (selected_channels.length > 0) {
      log.info(`Reporting standups for ${channels.length} channel(s)`);

      // Iterate over the channels
      _.each(selected_channels, (channel) => {
        console.log(channel);
        // channelReportHelper.doChannelReport(bot, channel, false);
      });
    } else {
      log.verbose('There are no channels eligible for reporting - PEACE');
    }
  });
}

module.exports = function (controller) {
  return function () {
    runReports(controller);
  };
};
