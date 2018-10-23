class Standup {
  static getById(bot, id) {
    return new Promise((resolve, reject) => {
      bot.botkit.storage.standups.get(id, (error, standup) => {
        if (error) {
          reject(error);
        } else {
          resolve(standup);
        }
      })
    })
  };

  static getInfo(bot, message) {
    return new Promise((resolve, reject) => {
      bot.api.standups.info({ standup: message.standup }, (error, standupInfo) => {
        if (error) {
          reject(error);
        } else {
          resolve(standupInfo);
        }
      })
    })
  };

  static getAll(bot) {
    return new Promise((resolve, reject) => {
      bot.botkit.storage.standups.all((error, allStandups) => {
        if (error) {
          reject(error);
        } else {
          resolve(allStandups);
        }
      })
    })
  };

  static save(bot, standup) {
    return new Promise((resolve, reject) => {
      bot.botkit.storage.standups.save(standup, (error, standup) => {
        if (error) {
          reject(error);
        } else {
          resolve(standup);
        }
      })
    })
  };
};


module.exports = Standup;
