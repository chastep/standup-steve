// 
// this process kicks off the reporting process for all channels
// 

var log = require('../logger')('custom:report_runner:');
var _ = require('lodash');
var timeHelper = require('../helpers/time.js');
var channelReportHelper = require('../helpers/do_channel_report.js');
var fedHolidays = require('@18f/us-federal-holidays');

function runReports(bot) {
  var time = timeHelper.getScheduleFormat();

  // Don't run if today is a federal holiday
  if(fedHolidays.isAHoliday()) {
    return;
  }

  var where = {
    time: time
  };

  where[timeHelper.getScheduleDay()] = true;

  // store channel
  bot.botkit.storage.channels.all(function(err, channels) {
    if(channels.length > 0) {
      log.info('Reporting standups for ' + channels.length + ' channel(s)');

      // Iterate over the channels
      _.each(channels, function(channel) {
        console.log(channel);
        // channelReportHelper.doChannelReport(bot, channel.name, false);
      });
    }
  });
}

module.exports = function(bot) {
  return function() {
    runReports(bot);
  };
};
