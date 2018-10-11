//
// this process kicks off the reporting process for all channels
// can either create a new report process or update and exiting channel report
//

const async = require('async');
const _ = require('lodash');
const log = require('../logger')('custom:do_channel_report:');
const timeHelper = require('./time.js');
const createNewChannelReport = require('./create_new_channel_report.js');

function gatherTodaysStandups(standups) {
  const todaysStandups = [];

  _.each(standups, (standup) => {
    if (timeHelper.datesAreSameDay(standup.date, new Date())) {
      todaysStandups.push(standup);
    }
  });

  return todaysStandups;
}

module.exports = function doChannelReport(bot, channel_id) {
  log.verbose(`attempting to run standup report for ${channel_id}`);

  bot.botkit.storage.channels.get(channel_id, (err, channel) => {
    if (!channel) {
      log.error(`channel is not present: ${err}`);
    } else {
      log.info('channel is present');
      bot.botkit.storage.standups.all((err, standups) => {
        if (err) {
          log.error(`encountered error trying to get all standups: ${err}`);
        }
        const reportableStandups = gatherTodaysStandups(standups);
        async.series([
          function (callback) {
            log.info(`creating channel standup report`);
            createNewChannelReport(bot, channel, reportableStandups);
            callback(null);
          }, function () {},
        ]);
      });
    }
  });
}
