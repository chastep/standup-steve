const log = require('../logger')('custom:startDmEmojiInterview:');
const interviewHelper = require('../helpers/standups/doInterview.js');
const Channel = require('../repositories/channel');
const User = require('../repositories/user');

// TODO: user test
async function createNewUser(bot, userId) {
  const userInfo = await User.getInfo(bot, userId);

  if (userInfo.deleted) {
    log.info('user has been deleted');
    return;
  }

  const newUser = {};
  newUser.id = response.userInfo.id;
  newUser.realName = response.userInfo.real_name || response.userInfo.name;
  newUser.timezone = response.userInfo.tz;
  newUser.thumbUrl = response.userInfo.profile.image_72;

  const savedUser = await User.save(bot, newUser);

  log.info('user has been successfully saved');
  log.info(savedUser);
};

async function startDmEmojiInterview(bot, message) {
  log.verbose(`received emoji reaction: ${message.reaction} from ${message.user}`);

  const currentUser = await User.getById(bot, message.user)

  if (!currentUser) {
    await createNewUser(bot, message.user)
  }

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
  attachSkill,
};
