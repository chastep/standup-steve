const log = require('../logger')('custom:getStandup');
const timeHelper = require('../helpers/time');
const common = require('../helpers/common');
const _ = require('lodash');
const Channel = require('../repositories/channel');

async function getStandupInfo(bot, message) {
  log.verbose(`heard this request: ${message.match[0]}`);

  const currentChannel = await Channel.getById(bot, message.channel);

  log.info('channel is present');

  if (_.isEmpty(currentChannel.standup)) {
    bot.reply(message, 'There\'s no standup scheduled yet.');
  } else {
    bot.reply(message, common.standupInfoBlob(currentChannel));
    log.info(currentChannel.standup);
  }
};

function attachSkill(controller) {
  controller.hears(['^when'], ['direct_mention'], getStandupInfo);
  log.verbose('ATTACHED');
};

module.exports = {
  getStandupInfo,
  attachSkill,
};
