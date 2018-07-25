var log = require('../logger')('botkit:channel_join');

module.exports = function(controller) {
	log.verbose('Requested to join a channel');

  controller.on('bot_channel_join', function(bot, message) {
  	log.info('Joined channel ' + message.channel);

    controller.studio.run(bot, 'channel_join', message.user, message.channel, message).catch(function(err) {
    	log.error('Error: encountered an error loading onboarding script from Botkit Studio: ' + err);
    });
  });
}
