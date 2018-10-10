//
// starts an interview with a user if they add emoji to channel reminder message
//

const log = require('../logger')('custom:emoji_response:');
var doInterview = require('../helpers/standups/do_interview.js');

// needs to be tested
function createNewUser(bot, userId) {
  bot.api.users.info({ user: userId }, async (err, response) => {
    if (err) {
      bot.reply(message, `I experienced an error finding user: ${err}`);
      log.error(err);
    }

    var newUser = {};
    newUser.id = response.user.id;
    newUser.realName = response.user.real_name || response.user.name;
    newUser.timezone = response.user.tz;
    newUser.thumbUrl = response.user.profile.image_72;

    await bot.botkit.storage.users.save(newUser, (err, savedUser) => {
      if (err) {
        bot.reply(message, `I experienced an error saving user: ${err}`);
        log.error(err);
      } else {
        log.info('user has been successfully saved');
        log.info(savedUser);
      }
    });
  });
};

async function startDmEmojiInterview(bot, message) {
  log.verbose(`Got an emoji reaction: ${message.reaction} from ${message.user}`);

  await bot.botkit.storage.users.get(message.user, async (err, response) => {
    if (!response) {
      await createNewUser(bot, message.user)
    }
  });

  bot.botkit.storage.channels.get(message.item.channel, (err, channel) => {
  	if (!channel) {
      log.error('channel is not present!');
    } else {
      log.info('channel is present');
      doInterview(bot, message.item.channel, message.user);
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
