// 
// this process will remove a daily standup for a channel, if it exists
// 

var log = require('../logger')('custom:remove_standup:');
var timeHelper = require('../helpers/time.js');
var _ = require('lodash');

function removeStandup(bot, message) {
  log.verbose('Heard a request to remove a standup: \n' + message.match[0]);

  bot.botkit.storage.channels.get(message.channel, function(err, channel) {
    if (!channel) {
      bot.reply(message, 'I experienced an error finding this channel: ' + err);
      log.error('channel is not present!');
    } else {
      log.info('channel is present');
      console.log(channel);
      if (!_.isEmpty(channel.standup)) {
        channel.standup = {};
        bot.botkit.storage.channels.save(channel, function(err, channel) {
          if (err) {
            bot.reply(message, 'I experienced an error updating this channel: ' + err);
            log.error(err);
          } else {
            bot.reply(message, 'Standup removed :thumbsup:');
            log.info('Channel standup has been removed');
            log.info(channel);
          }
        })
      } else {
        bot.reply(message, 'This channel doesn\'t have a standup scheduled');
      }
    }
  });
};

function attachRemoveStandupListener(controller) {
  controller.hears(['(remove|delete) standup'],['direct_mention'], removeStandup);
  log.verbose('ATTACHED');
}

module.exports = attachRemoveStandupListener;