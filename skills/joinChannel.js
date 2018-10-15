//
// this process will attempt to join a channel
// and create a channel if it isn't present
//

const log = require('../logger')('custom:join_channel:');
const _ = require('lodash');
const Channel = require('../repositories/channel');
const User = require('../repositories/user');

function createNewUsers(bot, userIds) {
  _.each(userIds, async (userId) => {
    await bot.api.users.info({ user: userId }, async (err, response) => {
      if (err) {
        bot.reply(message, `I experienced an error finding user: ${err}`);
        log.error(err);
        return;
      }
      // check to see if existing user and save if so
      await bot.botkit.storage.users.get(response.user.id, (err, usr) => {
        if (err) {
          bot.reply(message, `I experienced an error finding user: ${err}`);
          log.error(err);
          return;
        }

        if (!usr) {
          log.warn('user does not exist');

          var newUser = {};
          newUser.id = response.user.id;
          newUser.realName = response.user.real_name || response.user.name;
          newUser.timezone = response.user.tz;
          newUser.thumbUrl = response.user.profile.image_72;

          bot.botkit.storage.users.save(newUser, (err, savedUser) => {
            if (err) {
              bot.reply(message, `I experienced an error saving this user: ${err}`);
              log.error(err);
            } else {
              log.info('user has been successfully saved');
              log.info(savedUser);
            }
          });
        } else {
          log.info('user already exists');
        }
      });
    });
  })
};

function fetchChannelNameFromApi(bot, message) {
  log.info(message);
  return new Promise((res, rej) => {
    bot.api.channels.info({ channel: message.channel }, async (err, response) => {
      if (err) {
        return rej(err);
      }
      await createNewUsers(bot, response.channel.members);
      return res(response.channel.name);
    });
  });
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
