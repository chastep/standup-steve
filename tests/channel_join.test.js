const { joinChannel } = require('./channel_join');
const Channel = require('../repositories/channel');

const bot = {
  botkit: {
    storage: {
      channels: {
        get: (id, callback) => {
          callback(null, { id, name: 'test' });
        }
      }
    }
  }
};

describe('Join Channel', () => {
  test('returns an existing channel', async () => {
    const message = {
      channel: 'id'
    };

    expect(await joinChannel(bot, message)).toBeUndefined();
  })
});
