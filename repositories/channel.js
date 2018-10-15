class Channel {
  static getById(bot, id) {
    return new Promise((resolve, reject) => {
      bot.botkit.storage.channels.get(id, (error, channel) => {
        if (error) {
          reject(error);
        } else {
          resolve(channel);
        }
      })
    })
  };

  static getInfoById(bot, id) {
    return new Promise((resolve, reject) => {
      bot.api.channels.info(id, (error, userInfo) => {
        if (error) {
          reject(error);
        } else {
          resolve(userInfo);
        }
      })
    })
  };

  static save(bot, channel) {
    return new Promise((resolve, reject) => {
      bot.botkit.storage.channels.save(channel, (error, channel) => {
        if (error) {
          reject(error);
        } else {
          resolve(channel);
        }
      })
    })
  };
};


module.exports = Channel;
