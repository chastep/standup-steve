const log = require('../logger')('custom:startDmEmojiInterview');
const interviewHelper = require('../helpers/standups/doInterview');
const common = require('../helpers/common');
const Channel = require('../repositories/channel');
const User = require('../repositories/user');

async function createNewUser(bot, userInfo) {
  if (userInfo.deleted) {
    log.info('user already exists or has been deleted');
    return;
  } else {
    log.warn('user does not exist');
    common.newUser(bot, userInfo);
    log.info('user has been successfully saved');
  };
};

async function startDmEmojiInterview(bot, message) {
  log.verbose(`received emoji reaction: ${message.reaction} from ${message.user}`);

  const currentUser = await User.getById(bot, message.user)
  const userInfo = await User.getInfo(bot, message.user);

  if (!currentUser) {
    await createNewUser(bot, userInfo);
  }

  await common.updateUser(bot, currentUser, userInfo);

  const currentChannel = await Channel.getById(bot, message.item.channel);

  interviewHelper.doInterview(bot, currentChannel, currentUser);
}

function attachSkill(controller) {
  controller.on(['reaction_added'], (bot, message) => {
    bot.identifyBot((err, i) => {
      if (message.item_user === i.id && message.user !== i.id) startDmEmojiInterview(bot, message);
    });
  });
  log.verbose('ATTACHED');
}

module.exports = {
  startDmEmojiInterview,
  createNewUser,
  attachSkill,
};
