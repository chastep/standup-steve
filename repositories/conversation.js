class Conversation {
  static getInfo(bot, message) {
    return new Promise((resolve, reject) => {
      bot.api.conversations.info({ channel: message.channel }, (error, channelInfo) => {
        if (error) {
          reject(error);
        } else {
          resolve(channelInfo);
        }
      })
    })
  };
};


module.exports = Conversation;
