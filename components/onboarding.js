var log = require('../logger')('botkit:onboarding');

module.exports = function(controller) {

  controller.on('onboard', function(bot) {

    log.verbose('Starting an onboarding experience!');

    if (controller.config.studio_token) {
      bot.api.im.open({user: bot.config.createdBy}, function(err, direct_message) {
        if (err) {
          log.error('Error sending onboarding message: ' + err);
        } else {
          controller.studio.run(bot, 'onboarding', bot.config.createdBy, direct_message.channel.id, direct_message).catch(function(err) {
              log.error('Error: encountered an error loading onboarding script from Botkit Studio: ' + err);
          });
        }
      });
    } else {
      bot.startPrivateConversation({user: bot.config.createdBy},function(err,convo) {
        if (err) {
          log.error(err);
        } else {
          convo.say('I am a bot that has just joined your team');
          convo.say('You must now /invite me to a channel so that I can be of use!');
        }
      });
    }
  });
}
