const log = require('../logger')('custom:startInterview');
const doInterview = require('../helpers/standups/doInterview');

function attachSkill(controller) {
  controller.hears([/\binterview\b/i],['direct_message'], (bot, message) => {
    bot.reply(message, "This functionality is currently under construction :construction_worker: Sit tight!")
    // log.verbose(`Got request to start an interview from ${message.user}`);
    // doInterview(bot, message.channel, message.user);
  });
  log.verbose('ATTACHED');
};

module.exports = {
  attachSkill,
};
