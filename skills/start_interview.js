//
// starts an interview with a user if they directly mention the bot with the chat `interview` as well
//

const log = require('../logger')('custom:start_interview:');
var interviewHelper = require('../helpers/do_interview.js');

function startUserInterview(bot, message) {
  log.verbose(`Got request to start an interview from ${message.user}`);
  helpers.doInterview(bot, message.channel, message.user);
}

function attachListener(controller) {
  controller.hears([/\binterview\b/i], ['direct_mention'], (bot, message) => {
  	bot.reply(message, "This functionality is not currently activated! :D Please try again later")
    // startUserInterview(bot, message);
  });
}

module.exports = attachListener;
