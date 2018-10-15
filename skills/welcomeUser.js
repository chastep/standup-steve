//
// this process will welcome new users to the channel:
//

const log = require('../logger')('custom:welcome_user');

function attachSkill(controller) {
  controller.on(['user_channel_join,user_group_join'], (bot, message) => {
    bot.reply(message, `Welcome, <@${message.user}>`);
  });
  log.verbose('ATTACHED');
};

module.exports = {
  attachSkill,
};
