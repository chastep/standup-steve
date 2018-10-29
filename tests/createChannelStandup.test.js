const Botmock = require('botkit-mock');
const { createNewStandup, createChannelStandup } = require('../skills/createChannelStandup');
const { joinChannel } = require('../skills/joinChannel');
const Channel = require('../repositories/channel');
const User = require('../repositories/user');

const controller = Botmock({});
const testBot = controller.spawn({type: 'slack', token: 'test_token'});

describe('create channel standup funcitonality', () => {
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

  describe('createChannelStandup', () => {
    test('returns undefined if a misformed schedule/time is provided', async () => {
      const message = {
        channel: 'C0VHNJ7MF',
        match: ['test1','test2','test3']
      };

      expect(await createChannelStandup(testBot, message)).toBeUndefined();
    });

    test('creates standup for existing channel', async () => {
      const message1 = {
        channel: 'C0VHNJ7MF'
      };
      await joinChannel(testBot, message1)

      const channelsAfter = await Channel.getAll(testBot);
      expect(channelsAfter.C0VHNJ7MF.standup).toEqual({});

      const message2 = {
        channel: 'C0VHNJ7MF',
        match:
          [ 'create standup 11am',
            'create',
            '11am',
          ]
      };
      await createChannelStandup(testBot, message2)

      const channelsAfter2 = await Channel.getAll(testBot);
      expect(channelsAfter2.C0VHNJ7MF.standup).not.toEqual({});
    });
  });
});
