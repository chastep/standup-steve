const log = require('../logger')('custom:toggleHereChannelAlert');
const timeHelper = require('../helpers/time');
const common = require('../helpers/common');
const Channel = require('../repositories/channel');

async function toggleHereChannelAlert(bot, message) {
  log.verbose(`heard a request to toggle the @here channel alert: ${message.match[0]}`);

  const currentChannel = await Channel.getById(bot, message.channel);

  if (currentChannel.standup.reminderTime) {
    currentChannel.atHereAlert = !currentChannel.atHereAlert;

    const updatedChannel = await Channel.save(bot, currentChannel);

    if (updatedChannel.standup) {
      bot.reply(
        message,
        common.standupInfoBlob(updatedChannel)+
        `\n:thumbsup: :standup: Successfully Updated :thumbsup:`
      );
      (updatedChannel.atHereAlert) ?
        log.info(`@here channel alert is enabled`) :
        log.info(`@here channel alert is disabled`)
      log.info(`channel has been successfully updated`);
      log.info(updatedChannel);
    } else {
      bot.reply(
        message,
        'Standup has been successfully updated, please use command \n'+
        '`@[bot-name] when` to check if info is correct.'
      )
      log.warn(`channel is missing standup info`);
    }
  } else {
    bot.reply(message, `There's no standup scheduled yet. Create one before toggling channel alert functionality.`);
  }
}

function attachSkill(controller) {
  controller.hears(['toggle alert'],['direct_mention'], toggleHereChannelAlert);
  log.verbose('ATTACHED');
};

module.exports = {
  toggleHereChannelAlert,
  attachSkill,
};
