const log = require('../logger')('custom:joinChannel');
const _ = require('lodash');
const common = require('../helpers/common');
const Channel = require('../repositories/channel');
const Conversation = require('../repositories/conversation');
const User = require('../repositories/user');

async function fetchChannelNameFromApi(bot, message) {
  const channelInfo = await Conversation.getInfo(bot, message);

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
  channel.atHereAlert = true;

  const newChannel = await Channel.save(bot, channel);

  bot.reply(message, `Hi everyone in ${newChannel.name}!`);
  log.info('channel has been successfully saved');
  log.info(newChannel);
};

function attachSkill(controller) {
  controller.on(['member_joined_channel'], joinChannel);
  log.verbose('ATTACHED');
};

module.exports = {
  fetchChannelNameFromApi,
  joinChannel,
  attachSkill,
};
