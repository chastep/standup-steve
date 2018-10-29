const Botmock = require('botkit-mock');
const { createNewStandup, createChannelStandup } = require('../skills/createChannelStandup');
const Channel = require('../repositories/channel');
const User = require('../repositories/user');

const controller = Botmock({});
const testBot = controller.spawn({type: 'slack', token: 'test_token'});

describe('createChannelStandup funcitonality', () => {
  describe('createNewStandup', () => {
    test('creates new standup object for channel', async () => {
      const message = {
        channel: 'C0VHNJ7MF'
      };
      const schedule = {
        time: '1010',
        days: ['Monday', 'Wednesday', 'Friday']
      }
      const testChannel = await Channel.getInfo(testBot, message)
      const newStandup = await createNewStandup(testChannel, schedule)

      expect(newStandup).toEqual({
        id: 'standup_undefined',
        time: '1800',
        reminderTime: '1800',
        days: [ 'Monday', 'Wednesday', 'Friday' ]
      });
    });
  });

  // describe('fetchChannelNameFromApi', () => {
  //   test('returns an error if message is invalid', async () => {
  //     const message = { foo: 'bar' };

  //     await expect(fetchChannelNameFromApi(testBot, message)).rejects.toThrow(TypeError);
  //   });

  //   test('returns channel name', async () => {
  //     const message = {
  //       channel: 'C0HBYC9SA3'
  //     };

  //     expect(await fetchChannelNameFromApi(testBot, message)).toEqual('test1name');
  //   });
  // });

  // describe('joinChannel', () => {
  //   test('returns an error if message is invalid', () => {
  //     const message = { foo: 'bar' };

  //     expect(joinChannel(testBot, message)).rejects.toThrow(TypeError);
  //   });

  //   test('creates a channel if it doesnt already exist', async () => {
  //     const channelsBefore = await Channel.getAll(testBot);
  //     expect(channelsBefore).toEqual({});

  //     const message = {
  //       channel: 'C0VHNJ7MF'
  //     };
  //     await joinChannel(testBot, message)

  //     const channelsAfter = await Channel.getAll(testBot);
  //     expect(channelsAfter).not.toEqual({});
  //   });

  //   test('returns undefined if channel already exists', async () => {
  //     const message = {
  //       channel: 'C0VHNJ7MF'
  //     };
  //     await joinChannel(testBot, message)
      
  //     expect(await joinChannel(testBot, message)).toBeUndefined();
  //   });
  // });
});
