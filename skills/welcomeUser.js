const log = require('../logger')('custom:welcomeUser');

function attachSkill(controller) {
  controller.on(['user_channel_join,user_group_join'], (bot, message) => {
    bot.reply(message, `Welcome, <@${message.user}>`);
  });
  log.verbose('ATTACHED');
};

module.exports = {
  attachSkill,
};
