var log = require('../logger')('botkit:channel_join:');

function joinChannel(bot, message) {
	log.verbose('Requested to join a channel');

	log.info('Joined channel ' + message.channel);
	log.verbose(message);

		// store channel
		bot.botkit.storage.channels.get(message.channel, function(err, channel) {
			if (!channel) {
				log.error('channel is not present');

				channel = {};
				channel.id = message.channel;
				channel.standup = {};
				channel.reminderMinutes = 60;

				bot.botkit.storage.channels.save(channel, function(err, channel) {
	 			if (err) {
	        bot.reply(message, 'I experienced an error adding the channel: ' + err);
	        log.error(err);
	      } else {
	      	log.info('channel has been successfully saved');
    			log.info(channel);
	      }
	 		})
			}
		});

  bot.botkit.studio.run(bot, 'channel_join', message.user, message.channel, message).catch(function(err) {
  	log.error('Botkit Studio is shot: ' + err);
  });
}

function attachJoinChannelListener(controller) {
	controller.on('bot_channel_join', joinChannel);
	log.verbose('ATTACHED');
};

module.exports = attachJoinChannelListener;
