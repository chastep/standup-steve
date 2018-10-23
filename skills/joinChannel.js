const log = require('../logger')('custom:join_channel:');
const _ = require('lodash');
const Channel = require('../repositories/channel');
const User = require('../repositories/user');

function createNewUsers(bot, userIds) {
  _.each(userIds, async (userId) => {
    const userInfo = await User.getInfo(bot, userId);

    const currentUser = await User.getById(bot, userInfo.user.id)

    if (currentUser) {
      log.info('user already exists');
      return;
    }

    log.warn('user does not exist');

    const newUser = {};
    newUser.id = userInfo.user.id;
    newUser.realName = userInfo.user.real_name || userInfo.user.name;
    newUser.timezone = userInfo.user.tz;
    newUser.thumbUrl = userInfo.user.profile.image_72;

    const savedUser = await User.save(bot, newUser);

    log.info('user has been successfully saved');
    log.info(savedUser);
  })
};

async function fetchChannelNameFromApi(bot, message) {
  const channelInfo = await Channel.getInfo(bot, message);

  await createNewUsers(bot, channelInfo.channel.members);

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
  joinChannel,
  attachSkill,
};
