//
// starts an interview with a user if they directly mention the bot with the chat `interview` as well
//

const log = require('../logger')('custom:start_interview:');
var doInterview = require('../helpers/standups/do_interview.js');

module.exports = function attachListener(controller) {
  controller.hears([/\binterview\b/i], ['direct_message'], (bot, message) => {
  	bot.reply(message, "This functionality is not currently under construction :construction_worker: Sit tight!")
    // log.verbose(`Got request to start an interview from ${message.user}`);
    // doInterview(bot, message.channel, message.user);
  });
  log.verbose('ATTACHED');
};
