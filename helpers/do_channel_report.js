// 
// this process kicks off the reporting process for all channels
// can either create a new report process or update and exiting channel report
// 

const async = require('async');
const log = require('../logger')('custom:do_channel_report:');
const timeHelper = require('./time.js');
const createNewChannelReport = require('./create_new_channel_report.js');
// const updateChannelReport = require('./updateChannelReport');

function doChannelReport(bot, channel, update) {
  log.verbose('Attempting to run standup report for ' + channel.name);

  bot.botkit.storage.channels.get(channel, function(err, channel) {
    if (!channel) {
      log.error('channel is not present: ' + err);
    } else {
      log.info('channel is present');
      var standup = channel.standup
      async.series([
        function(callback) {
          if (update) {
            log.info('updating exiting channel standup report');
            updateChannelReport(bot, channel, standup, userName);
          } else {
            log.info('creating channel standup report');
            createNewChannelReport(bot, channel, standup);
          }
          callback(null);
        }, function () {}
      ]);
    };
  });
};

module.exports = {
  doChannelReport: doChannelReport
};