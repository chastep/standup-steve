var log = require('../logger')('botkit:channel_join');

module.exports = function(controller) {
	log.verbose('Requested to join a channel');

  controller.on('bot_channel_join', function(bot, message) {
  	log.info('Joined channel ' + message.channel);
  	log.verbose(message);

 		// store channel
 		controller.storage.channels.get(message.channel, function(err, channel) {
 			if (!channel) {
 				log.error('channel is not present - ' + err);

 				channel = {};
 				channel.id = messsage.channel;
 				channel.standups = [];

 				controller.storage.channels.save(channel, function(err, saved_channel) {
		 			if (err) {
		        bot.reply(message, 'I experienced an error adding the channel: ' + err);
		        log.error(err);
		      } else {
		      	log.info('channel has been successfully stored - ' + saved_channel);
		      }
		 		})
 			}
 		});

    controller.studio.run(bot, 'channel_join', message.user, message.channel, message).catch(function(err) {
    	log.error('Botkit Studio is shot: ' + err);
    });
  });
}
