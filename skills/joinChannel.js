const log = require('../logger')('custom:joinChannel');
const _ = require('lodash');
const common = require('../helpers/common');
const Channel = require('../repositories/channel');
const User = require('../repositories/user');

// TODO: deleted user test
function createNewUsers(bot, userIds) {
  _.each(userIds, async (userId) => {
    const userInfo = await User.getInfo(bot, userId);
    const currentUser = await User.getById(bot, userInfo.user.id)

    if (currentUser || userInfo.deleted) {
      log.info('user already exists or has been deleted');
      return;
    } else {
      log.warn('user does not exist');
      await common.newUser(bot, userInfo);
      log.info('user has been successfully saved');
    };
  })
};

async function fetchChannelNameFromApi(bot, message) {
  const channelInfo = await Channel.getInfo(bot, message);

  if (!channelInfo.channel.members.length === 0) await createNewUsers(bot, channelInfo.channel.members);

  return channelInfo.channel.name;
}

async function joinChannel(bot, message) {
  log.verbose('request to join a channel');
  log.info(`attempt to join channel ${message.channel}`);

  const currentChannel = await Channel.getById(bot, message.channel);

  if (currentChannel) {
    log.info('channel already exists');
    return;
  }

  log.warn('channel does not exist');

  const channel = {};
  channel.id = message.channel;
  channel.name = await fetchChannelNameFromApi(bot, message);
  channel.standup = {};
  channel.reminderMinutes = 30;

  const newChannel = await Channel.save(bot, channel);

  bot.reply(message, `Hi everyone in ${newChannel.name}!`);
  log.info('channel has been successfully saved');
  log.info(newChannel);
};

function attachSkill(controller) {
  controller.on(['bot_channel_join'], joinChannel);
  log.verbose('ATTACHED');
};

module.exports = {
  createNewUsers,
  fetchChannelNameFromApi,
  joinChannel,
  attachSkill,
};
