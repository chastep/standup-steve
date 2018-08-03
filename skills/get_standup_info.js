//
// this process will get a daily standup for a channel, if it exists
//

const log = require('../logger')('custom:get_standup:');
const timeHelper = require('../helpers/time.js');
const _ = require('lodash');

function getStandupInfo(bot, message) {
  log.verbose(`Heard this request - ${message.match[0]}`);

  bot.botkit.storage.channels.get(message.channel, (err, channel) => {
    if (!channel) {
      bot.reply(message, `I experienced an error finding this channel: ${err}`);
      log.error('channel is not present!');
    } else {
      log.info('channel is present');
      console.log(channel);
      if (_.isEmpty(channel.standup)) {
        bot.reply(message, 'There\'s no standup scheduled yet.');
      } else {
        bot.reply(message, `There's a standup scheduled for ${timeHelper.getDisplayFormat(standup.time)} on ${timeHelper.getDisplayFormatForDays(standup.days)}`);
      }
    }
  });
}

function attachGetStandupListener(controller) {
  controller.hears(['^when'], ['direct_mention'], getStandupInfo);
  log.verbose('ATTACHED');
}

module.exports = attachGetStandupListener;
