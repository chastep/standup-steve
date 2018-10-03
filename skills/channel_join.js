//
// this process will attempt to join a channel
// and create a channel if it isn't present
//

const log = require('../logger')('botkit:channel_join:');

function fetchChannelNameFromApi(bot, message) {
  return new Promise((res, rej) => {
    bot.api.channels.info({ channel: message.channel }, (err, response) => {
      if (err) {
        return rej(err);
      }
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
  	log.error(`Botkit Studio is shot: ${err}`);
  });
}

function attachJoinChannelListener(controller) {
  controller.on('bot_channel_join', joinChannel);
  log.verbose('ATTACHED');
}

module.exports = attachJoinChannelListener;
