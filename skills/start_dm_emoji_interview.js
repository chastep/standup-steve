// 
// starts an interview with a user if they add emoji to channel reminder message
// 

var log = require('../logger')('custom:emoji_response:');
// var interviewHelper = require('../helpers/do_interview.js');

function startDmEmojiInterview(bot, message) {
	log.verbose(`Got an emoji reaction: ${message.reaction} from ${message.user}`);

	bot.botkit.storage.channels.get(message.channel, function(err, channel) {
  	if (!channel) {
			bot.reply(message, 'I experienced an error finding this channel: ' + err);
			log.error('channel is not present!');
		} else {
			log.info('channel is present');
			log.info(channel);
			log.info(message);
      // interviewHelper(bot, channel, message.user);
      }
    });
}

function attachStartDmEmojiInterviewListener(controller) {
  controller.on('reaction_added', function(bot, message) {
  	bot.indentifyBot(function(err, i) {
  		if (message.item_user === i.id && message.user !== i.id) {
	      startDmEmojiInterview(bot, message);
	    }
  	})
  });
}

module.exports = attachStartDmEmojiInterviewListener;