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
 				log.error('channel is not present');
 				// new channel object
 				channel = {};
 				channel.id = message.channel;
 				channel.standups = [];

 				newStandup = {};
 				newStandup.id = 'standup_' + (channel.standups.length + 1).toString();

 				channel.standups.push(newStandup);

 				controller.storage.channels.save(channel, function(err, channel) {
		 			if (err) {
		        bot.reply(message, 'I experienced an error adding the channel: ' + err);
		      } else {
		      	log.info('channel has been successfully stored');
		      	log.info(channel.standups);
		      }
		 		});
 			} else {
 				log.info('channel is present');

 				newStandup = {};
 				newStandup.id = 'standup_' + (channel.standups.length + 1).toString();

 				channel.standups.push(newStandup);

 				controller.storage.channels.save(channel, function(err, channel) {
 					if (err) {
 						bot.reply(message, 'I experienced an error saving this channel: ' + err);
 						log.error(err);
 					} else {
 						bot.reply(message, 'Got it. Standup scheduled! :thumbsup:');
 						log.info('channel has been successfully saved');
		      	log.info(channel);	
 					}
 				})
 			}
 		});

	});

};