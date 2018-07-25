// 
// this process will create a daily standup that:
// 1. creates a standup object (with relevant attributes)
// 2. saves it in storage
// 3. creates corresponding timers
// 

var log = require('../logger')('create standup: ');

module.exports = function(controller) {

	controller.hears(['(schedule|create|move) standup (.*)'], 'direct_mention', function(bot, message) {
		log.verbose('Heard this request: ' + message.match[0]);
		log.verbose(`~~~~~~~~~~~~~~~~~~`);
		log.verbose(message);
		log.verbose(`~~~~~~~~~~~~~~~~~~`);

		controller.storage.channel.get(message.channel, function(err, channel) {
			log.verbose(channel);
		})

	});

};