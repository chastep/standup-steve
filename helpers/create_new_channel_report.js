// 
// this process creates a new channel report
// 

const log = require('../logger')('custom:create_channel_report:');
// const reportForChannel = require('./reports/for_channel.js');

function createNewChannelReport(bot, channel, standup) {
  let report = reportForChannel(channel, standup);

  log.verbose('Sending report for ' + channel.name);

  const standupNotice = {
    text: `Today's standup for <#${channel.name}> is in this thread :point_down:. ` +
      `If you missed the standup, you can still submit! Just emoji one of my ` +
      `messages in the next few minutes and I'll include you.`,
    attachments: [],
    channel: channel.name
  };

  bot.say(standupNotice, (err, threadResponse) => {
    bot.replyInThread(threadResponse, report, function(err, response) {
      if (err) {
        console.log(err);
      } else {
        channel.update({
          latestReport: response.ts
        });
      }
    });
  });
};

module.exports = {
  createNewChannelReport: createNewChannelReport
};