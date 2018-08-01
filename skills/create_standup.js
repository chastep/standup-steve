// 
// this process will create a daily standup that:
// 1. creates a standup object (with relevant attributes - TBD)
// 2. saves it in storage (with relevant attributes - TBD)
// 3. creates corresponding timers
// 

var log = require('../logger')('custom:create standup:');
var timeHelper = require('../helpers/time.js');

function createNewStandup(channel, schedule) {
	newStandup = {};
	newStandup.id = 'standup_' + (channel.id);
	// time attributes
	newStandup.time = timeHelper.getScheduleFormat(schedule.time);
	newStandup.days = schedule.days;
	return newStandup;
}

function createStandup(bot, message) {
	log.verbose('Heard this request - ' + message.match[0]);

	// store channel
	bot.botkit.storage.channels.get(message.channel, function(err, channel) {
		if (!channel) {
			bot.reply(message, 'I experienced an error finding this channel: ' + err);
			log.error('channel is not present!');
		} else {
			log.info('channel is present');
			// establish standup time from message
			var schedule = timeHelper.getTimeFromString(message.match[2])
			if (schedule !== false) {
				console.log(schedule);
				// new standup object
				channel.standup = createNewStandup(channel, schedule);
				// update channel with new standup object
				bot.botkit.storage.channels.save(channel, function(err, channel) {
					if (err) {
						bot.reply(message, 'I experienced an error updating this channel: ' + err);
						log.error(err);
					} else {
						bot.reply(message, 'Got it. Standup scheduled for ' + timeHelper.getDisplayFormat(channel.standup.time) + ' on ' + timeHelper.getDisplayFormatForDays(channel.standup.days) + ' :thumbsup:')
						log.info('Standup scheduled for ' + message.channel + ' at ' + timeHelper.getDisplayFormat(channel.standup.time) + ' on ' + timeHelper.getDisplayFormatForDays(channel.standup.days));
						log.info('channel has been successfully saved');
	      		log.info(channel);	
					}
				})
			} else {
				bot.reply(message, ':x: Incorrect time format! Please try again. :x:');
				log.error('Incorrect time format');
			}
		}
	});
};

function attachCreateStandupListener(controller) {
	controller.hears(['(schedule|create|move) standup (.*)'], 'direct_mention', createStandup);
	log.verbose('ATTACHED');
};

module.exports = attachCreateStandupListener;