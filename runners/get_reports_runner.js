// 
// this process kicks off the reporting process for all channels
// 

var log = require('../logger')('custom:report_runner:');
var _ = require('lodash');
var timeHelper = require('../helpers/time.js');
var channelReportHelper = require('../helpers/do_channel_report.js');
var fedHolidays = require('@18f/us-federal-holidays');

function collectTimeMatchedChannels(channels, where) {
  var selected = []
  _.each(channels, function(channel) {
    if (_.isEmpty(channel.standup)) {
      return;
    } else if (channel.standup.time === where.time && _.includes(channel.standup.days, where.day)) {
      selected.push(channel)
    }
  });
  return selected;
}

function runReports(bot) {
  log.verbose('Attempting to run channel standup reports :D');

  // Don't run if today is a federal holiday
  if(fedHolidays.isAHoliday()) {
    return;
  }

  var where = {
    time: timeHelper.getScheduleFormat(),
    day: timeHelper.getScheduleDay()
  };

  bot.botkit.storage.channels.all(async function(err, channels) {
    if (err) {
      log.error('Encountered error trying to get all channels: ', err);
      return;
    }

    var selected_channels = await collectTimeMatchedChannels(channels, where);

    if(selected_channels.length > 0) {
      log.info('Reporting standups for ' + channels.length + ' channel(s)');

      // Iterate over the channels
      _.each(selected_channels, function(channel) {
        console.log(channel);
        // channelReportHelper.doChannelReport(bot, channel, false);
      });
    } else {
      log.verbose('There are no channels eligible for reporting - PEACE');
    }
  });
}

module.exports = function(bot) {
  return function() {
    runReports(bot);
  };
};
