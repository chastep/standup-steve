var log = require('../logger')('botkit:channel_join');

module.exports = function(controller) {
	log.verbose('Requested to join a channel');

  controller.on('bot_channel_join', function(bot, message) {
  	log.info('Joined channel ' + message.channel);
  	log.verbose(message);

 		// store channel
 		controller.storage.channels.get(message.channel, function(err, channel) {
 			if (!channel) {
 				log.error('channel is not present');

 				channel = {};
 				channel.id = message.channel;
 				channel.reminderMinutes = 60;

 				controller.storage.channels.save(channel, function(err, channel) {
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

    controller.studio.run(bot, 'channel_join', message.user, message.channel, message).catch(function(err) {
    	log.error('Botkit Studio is shot: ' + err);
    });
  });
}
