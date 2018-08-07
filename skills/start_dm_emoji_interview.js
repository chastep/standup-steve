//
// starts an interview with a user if they add emoji to channel reminder message
//

const log = require('../logger')('custom:emoji_response:');
var interviewHelper = require('../helpers/standups/do_interview.js');

function startDmEmojiInterview(bot, message) {
  log.verbose(`Got an emoji reaction: ${message.reaction} from ${message.user}`);

  bot.botkit.storage.channels.get(message.item.channel, (err, channel) => {
  	if (!channel) {
      log.error('channel is not present!');
    } else {
      log.info('channel is present');
      interviewHelper(bot, message.item.channel, message.user);
    }
  });
}

function attachStartDmEmojiInterviewListener(controller) {
  controller.on('reaction_added', (bot, message) => {
  	bot.identifyBot((err, i) => {
  		if (message.item_user === i.id && message.user !== i.id) {
	      startDmEmojiInterview(bot, message);
	    }
  	});
  });
  log.verbose('ATTACHED');
}

module.exports = attachStartDmEmojiInterviewListener;
