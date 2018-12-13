const Botmock = require('botkit-mock');
const { joinChannel, fetchChannelNameFromApi } = require('../skills/joinChannel');
const Channel = require('../repositories/channel');
const User = require('../repositories/user');

const controller = Botmock({});
const testBot = controller.spawn({type: 'slack', token: 'test_token'});

describe('join channel funcitonality', () => {
  describe('fetchChannelNameFromApi', () => {
    test('returns an error if message is invalid', async () => {
      const message = { foo: 'bar' };

      await expect(fetchChannelNameFromApi(testBot, message)).rejects.toThrow(TypeError);
    });

    test('returns channel name', async () => {
      const message = {
        channel: 'C0HBYC9SA3'
      };
      const data = {
        'ok': true,
        'channel': {
          'id': 'C0VHNJ7MF',
          'name': 'test1name'
        }
      }
      await testBot.api.setData('conversations.info', data);

      expect(await fetchChannelNameFromApi(testBot, message)).toEqual('test1name');
    });
  });

  describe('joinChannel', () => {
    test('returns an error if message is invalid', () => {
      const message = { foo: 'bar' };

      expect(joinChannel(testBot, message)).rejects.toThrow(TypeError);
    });

    test('creates a channel if it doesnt already exist', async () => {
      const channelsBefore = await Channel.getAll(testBot);
      expect(channelsBefore).toEqual({});

      const message = {
        channel: 'C0VHNJ7MF'
      };
      await joinChannel(testBot, message)

      const channelsAfter = await Channel.getAll(testBot);
      expect(channelsAfter).not.toEqual({});
    });

    test('returns undefined if channel already exists', async () => {
      const message = {
        channel: 'C0VHNJ7MF'
      };
      await joinChannel(testBot, message)
      
      expect(await joinChannel(testBot, message)).toBeUndefined();
    });
  });
});
