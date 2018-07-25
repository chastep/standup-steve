// 
// this process will create a daily standup that:
// 1. creates a standup object (with relevant attributes)
// 2. saves it in storage
// 3. creates corresponding timers
// 

var log = require('../logger')('create standup');

module.exports = function(controller) {

	controller.hears(['(schedule|create|move) standup (.*)'], 'direct_mention,direct_message', function(bot, message) {
		log.verbose('Heard a request to create a standup:\n' + message.match[0]);
		log.verbose(`~~~~~~~~~~~~~~~~~~`);
		log.verbose(message);
		log.verbose(`~~~~~~~~~~~~~~~~~~`);

		// controller.storage.standups.get(message.channel)

	});

};