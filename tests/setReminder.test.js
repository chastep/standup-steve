const Botmock = require('botkit-mock');
const { joinChannel } = require('../skills/joinChannel');
const { setReminder } = require('../skills/setReminder');
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
  match:
    [ 'reminder 15',
      'reminder',
      '15'
    ]
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

describe.only('set channel reminder time', () => {
  test('replies that there is no standup scheduled if standup is not present', async () => {
    await joinChannel(testBot, message1);
    await setReminder(testBot, message2);

    expect(testBot.answers).not.toEqual([]);
    expect(testBot.answers[1].text).toEqual(
      `There's no standup scheduled yet. Create one before setting a reminder time.`
    );
  });

  test('sets standup reminder time for existing channel if configured', async () => {
    await joinChannel(testBot, message1);
    await createChannelStandup(testBot, message3)

    const channelsAfter1 = await Channel.getAll(testBot);
    expect(channelsAfter1.C0VHNJ7MF.standup.reminderTime).toEqual('1030');

    await setReminder(testBot, message2);

    const channelsAfter2 = await Channel.getAll(testBot);
    expect(channelsAfter1.C0VHNJ7MF.standup.reminderTime).toEqual('1045');

    expect(testBot.answers[3].text).toEqual(
      'Standup has been successfully updated, please use command \n`@[bot-name] when` to check if info is correct.'
    );
  });
});
