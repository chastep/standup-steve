//
// this process kicks off the new channel report process
//

const log = require('../logger')('custom:create_new_channel_report:');
const reportForChannel = require('./reports/for_channel.js');
const timeHelper = require('./time.js');

module.exports = function createNewChannelReport(bot, channel, standups) {
  const report = reportForChannel(channel, standups);

  log.verbose(`Sending report for ${channel.name}`);

  const standupNotice = {
    text: `:point_down: ${timeHelper.getCurrentReportDate()} Standup :point_down:`,
    // `If you missed the standup, you can still submit! Just emoji one of my ` +
    // `messages in the next few minutes and I'll include you.`,
    attachments: [],
    channel: channel.name,
  };

  bot.say(standupNotice, (err, threadResponse) => {
    bot.replyInThread(threadResponse, report, (err, response) => {
      if (err) {
        log.error(err);
      } else {
        log.verbose(`Report successfully sent for ${channel.name}`);
      }
    });
  });
}
