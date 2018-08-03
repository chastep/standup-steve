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
  log.verbose(`Attempting to run standup report for ${channel.name}`);

  bot.botkit.storage.channels.get(channel, (err, channel) => {
    if (!channel) {
      log.error(`channel is not present: ${err}`);
    } else {
      log.info('channel is present');
      bot.botkit.storage.standups.all((err, standups) => {
        if (err) {
          log.error('Encountered error trying to get all standups: ', err);
        }
        // ~~~~~~~~~~~~~~
        // logic here to find all standups (standup responses) for the associated channel
        // ~~~~~~~~~~~~~~
        async.series([
          function (callback) {
            if (update) {
              log.info('updating exiting channel standup report');
              updateChannelReport(bot, channel, standups, userName);
            } else {
              log.info('creating channel standup report');
              createNewChannelReport(bot, channel, standups);
            }
            callback(null);
          }, function () {},
        ]);
      });
    }
  });
}

module.exports = {
  doChannelReport,
};
