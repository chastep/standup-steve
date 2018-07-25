// 
// this process will create a daily standup that:
// 1. creates a standup object (with relevant attributes - TBD)
// 2. saves it in storage (with relevant attributes - TBD)
// 3. creates corresponding timers
// 

var log = require('../logger')('create standup: ');
var timeHelper = require('../helpers').time;

function createNewStandup(channel) {
	newStandup = {};
	newStandup.id = 'standup_' + (channel.standups.length + 1).toString();
	return newStandup;
}

function createStandup(bot, message) {
	log.verbose('Heard this request - ' + message.match[0]);
	// log.verbose(`~~~~~~~~~~~~~~~~~~`);
	// log.verbose(message);
	// log.verbose(`~~~~~~~~~~~~~~~~~~`);

	// store channel
	controller.storage.channels.get(message.channel, function(err, channel) {
		if (!channel) {
			bot.reply(message, 'I experienced an error finding this channel: ' + err);
			log.error('channel is not present!');
		} else {
			log.info('channel is present');
			// new standup object
			channel.standup = createNewStandup(channel);
			// update channel with new standup object
			controller.storage.channels.save(channel, function(err, channel) {
				if (err) {
					bot.reply(message, 'I experienced an error updating this channel: ' + err);
					log.error(err);
				} else {
					bot.reply(message, 'Got it. Standup scheduled! :thumbsup:');
					log.info('channel has been successfully saved');
      		log.info(channel);	
				}
			})
		}
	});
};

function attachCreateStandupListener(controller) {
	controller.hears(['(schedule|create|move) standup (.*)'], 'direct_mention', createStandup);
	log.verbose('ATTACHED');
};

module.exports = attachCreateStandupListener;