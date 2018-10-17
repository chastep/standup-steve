const log = require('../logger')('custom:get_standup:');
const timeHelper = require('../helpers/time.js');
const common = require('../helpers/common.js');
const _ = require('lodash');
const Channel = require('../repositories/channel');

async function getStandupInfo(bot, message) {
  log.verbose(`heard this request - ${message.match[0]}`);

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
  attachSkill,
};
