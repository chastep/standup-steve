const Botmock = require('botkit-mock');
const { getStandupInfo } = require('../skills/getStandupInfo');
const { joinChannel } = require('../skills/joinChannel');
const { createChannelStandup } = require('../skills/createChannelStandup');
const Channel = require('../repositories/channel');
const User = require('../repositories/user');

const controller = Botmock({});
const testBot = controller.spawn({type: 'slack', token: 'test_token'});

const message1 = {
  channel: 'C0VHNJ7MF'
};
const message2 = {
  channel: 'C0VHNJ7MF',
  match: ['when']
};
const message3 = {
  channel: 'C0VHNJ7MF',
  match:
    [ 'create standup 11am',
      'create',
      '11am',
    ]
};
const data = {
  'ok': true,
  'channel': {
    'id': 'C0VHNJ7MF',
    'name': 'test1name'
  }
}

testBot.api.setData('conversations.info', data);
joinChannel(testBot, message1);

describe('get standup info funcitonality', () => {
  describe('getStandupInfo', () => {
    test('replies that there is no standup scheduled if standup is not present', async () => {
      await getStandupInfo(testBot, message2);

      expect(testBot.answers).not.toEqual([]);
      expect(testBot.answers[1].text).toEqual(
        `There's no standup scheduled yet.`,
      );
    });

    test('replies with channel standup info if standup is configured', async () => {
        await createChannelStandup(testBot, message3)

        await getStandupInfo(testBot, message2);

        expect(testBot.answers[3].text).toEqual(
          `:point_down: Standup Details :point_down:\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nTime - 11:00 am CST\nDays - all weekdays\nReminder Time - 10:30 am CST\nChannel Alert Enabled? - true\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
        );
    });
  });
});
