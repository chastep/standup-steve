// 
// this process will create a daily standup that:
// 1. creates a standup object (with relevant attributes)
// 2. saves it in storage
// 3. creates corresponding timers
// 

var log = require('../logger')('create standup: ');

module.exports = function(controller) {

	controller.hears(['(schedule|create|move) standup (.*)'], 'direct_mention', function(bot, message) {
		log.verbose('Heard this request - ' + message.match[0]);
		log.verbose(`~~~~~~~~~~~~~~~~~~`);
		log.verbose(message);
		log.verbose(`~~~~~~~~~~~~~~~~~~`);

		// store channel
 		controller.storage.channels.get(message.channel, function(err, channel) {
 			if (!channel) {
 				log.error('channel is not present - ' + err);
 				// new channel object
 				channel = {};
 				channel.id = messsage.channel;
 				channel.standups = [];

 				controller.storage.channels.save(channel, function(err, channel) {
		 			if (err) {
		        bot.reply(message, 'I experienced an error adding the channel: ' + err);
		      } else {
		      	log.info('channel has been successfully stored - ' + channel);
		      	log.info(channel.standups);
		      }
		 		});
 			} else {
 				log.info('channel is present - ' + channel);

 				newStandup = {};
 				newStandup.id = 'standup_' + (channel.standups.length + 1).toString();

 				channel.standups.push(newStandup);

 				controller.storage.channels.save(channel, function(err, channel) {
 					if (err) {
 						bot.reply(message, 'I experienced an error saving this channel: ' + err);
 						log.error(err);
 					} else {
 						log.info('channel has been successfully saved - ' + channel);
		      	log.info(channel.standups);	
 					}
 				})
 			}
 		});

	});

};