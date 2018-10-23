class User {
  static getById(bot, id) {
    return new Promise((resolve, reject) => {
      bot.botkit.storage.users.get(id, (error, user) => {
        if (error) {
          reject(error);
        } else {
          resolve(user);
        }
      })
    })
  };

  static getInfo(bot, userId) {
    return new Promise((resolve, reject) => {
      bot.api.users.info({ user: userId }, (error, userInfo) => {
        if (error) {
          reject(error);
        } else {
          resolve(userInfo);
        }
      })
    })
  };

  static save(bot, user) {
    return new Promise((resolve, reject) => {
      bot.botkit.storage.users.save(user, (error, user) => {
        if (error) {
          reject(error);
        } else {
          resolve(user);
        }
      })
    })
  };
};


module.exports = User;
