//
// this process will attempt to join a channel
// and create a channel if it isn't present
//

const log = require('../logger')('botkit:channel_join:');
const _ = require('lodash');

function createNewUsers(bot, userIds) {
  _.each(userIds, async (userId) => {
    await bot.api.users.info({ user: userId }, async (err, response) => {
      if (err) {
        bot.reply(message, `I experienced an error finding user: ${err}`);
        log.error(err);
      }
      // check to see if existing user and save if so
      await bot.botkit.storage.users.get(response.user.id, (err, usr) => {
        if (err) {
          bot.reply(message, `I experienced an error finding user: ${err}`);
          log.error(err);
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
          log.info('savedUser already exists');
        }
      });
    });
  })
};

function fetchChannelNameFromApi(bot, message) {
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

function joinChannel(bot, message) {
  log.verbose('Requested to join a channel');

  log.info(`Joined channel ${message.channel}`);

  // store channel
  bot.botkit.storage.channels.get(message.channel, async (err, channel) => {
    if (!channel) {
      log.warn('channel does not exist');

      var channel = {};
      channel.id = message.channel;
      channel.name = await fetchChannelNameFromApi(bot, message);
      channel.standup = {};
      channel.reminderMinutes = 30;

      bot.botkit.storage.channels.save(channel, (err, channel) => {
	 			if (err) {
	        bot.reply(message, `I experienced an error joining the channel: ${err}`);
	        log.error(err);
	      } else {
	      	log.info('channel has been successfully saved');
	  			log.info(channel);
	      }
 			});
    } else {
      log.info('channel already exists');
    }
  });

  bot.botkit.studio.run(bot, 'channel_join', message.user, message.channel, message).catch((err) => {
  	log.warn(`Botkit Studio is shot: ${err}`);
  });
}

module.exports = function attachJoinChannelListener(controller) {
  controller.on('bot_channel_join', joinChannel);
  log.verbose('ATTACHED');
};
