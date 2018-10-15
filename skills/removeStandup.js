//
// this process will remove a daily standup for a channel, if it exists
//

const log = require('../logger')('custom:remove_standup:');
const timeHelper = require('../helpers/time.js');
const _ = require('lodash');

function removeStandup(bot, message) {
  log.verbose(
    `heard this request: \n`+
    `${message.match[0]}`
  );

  bot.botkit.storage.channels.get(message.channel, (err, channel) => {
    if (!channel) {
      bot.reply(message, `I experienced an error finding this channel: ${err}`);
      log.error('channel is not present!');
    } else {
      log.info('channel is present');

      if (!_.isEmpty(channel.standup)) {
        channel.standup = {};
        bot.botkit.storage.channels.save(channel, (err, channel) => {
          if (err) {
            bot.reply(message, `I experienced an error updating this channel: ${err}`);
            log.error(err);
          } else {
            bot.reply(message, 'Standup removed :thumbsup:');
            log.info('channel standup has been removed');
            log.info(channel);
          }
        });
      } else {
        bot.reply(message, `This channel doesn't have a standup scheduled`);
      }
    }
  });
}

function attachSkill(controller) {
  controller.hears(['(remove|delete) standup'], ['direct_mention'], removeStandup);
  log.verbose('ATTACHED');
}

module.exports = {
  attachSkill,
}
