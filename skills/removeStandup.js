//
// this process will remove a daily standup for a channel, if it exists
//

const log = require('../logger')('custom:remove_standup:');
const timeHelper = require('../helpers/time.js');
const _ = require('lodash');
const Channel = require('../repositories/channel');

async function removeStandup(bot, message) {
  log.verbose(`heard this request: ${message.match[0]}`);

  const currentChannel = await Channel.getById(bot, message.channel);

  log.info('channel is present');

  if (_.isEmpty(currentChannel.standup)) {
    bot.reply(message, 'There\'s no standup scheduled yet.');
  } else {
    currentChannel.standup = {};

    const updatedChannel = await Channel.save(bot, currentChannel);

    bot.reply(message, 'Standup removed :thumbsup:');
    log.info('channel standup has been removed');
    log.info(updatedChannel);
  }
}

function attachSkill(controller) {
  controller.hears(['(remove|delete) standup'], ['direct_mention'], removeStandup);
  log.verbose('ATTACHED');
}

module.exports = {
  attachSkill,
}
