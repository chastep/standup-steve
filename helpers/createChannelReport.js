//
// this process kicks off the new channel report process
//

const log = require('../logger')('custom:create_new_channel_report:');
const reportForChannel = require('./reports/forChannel.js');
const timeHelper = require('./time.js');

module.exports = function createNewChannelReport(bot, channel, standups) {
  const report = reportForChannel(channel, standups);

  log.verbose(`sending report for ${channel.name}`);

  const standupNotice = {
    text: `:point_down: ${timeHelper.getCurrentReportDate()} Standup`,
    attachments: [],
    channel: channel.name,
  };

  bot.say(standupNotice, (err, threadResponse) => {
    bot.replyInThread(threadResponse, report, (err, response) => {
      if (err) {
        log.error(err);
      } else {
        log.verbose(`report successfully sent for ${channel.name}`);
      }
    });
  });
}
