const log = require('../logger')('custom:createNewChannelReport');
const reportForChannel = require('./reports/forChannel');
const timeHelper = require('./time');

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
