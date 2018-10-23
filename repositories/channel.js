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

  static getInfo(bot, message) {
    return new Promise((resolve, reject) => {
      bot.api.channels.info({ channel: message.channel }, (error, channelInfo) => {
        if (error) {
          reject(error);
        } else {
          resolve(channelInfo);
        }
      })
    })
  };

  static getAll(bot) {
    return new Promise((resolve, reject) => {
      bot.botkit.storage.channels.all((error, allChannels) => {
        if (error) {
          reject(error);
        } else {
          resolve(allChannels);
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
