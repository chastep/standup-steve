const Botmock = require('botkit-mock');
const { joinChannel } = require('../skills/joinChannel');
const { createChannelStandup } = require('../skills/createChannelStandup');
const { toggleHereChannelAlert } = require('../skills/toggleHereChannelAlert');
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
    [ 'toggle alert',
      'toggle',
      'alert'
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

describe.only('toggle here channel alert', () => {
  test('replies that there is no standup scheduled if standup is not present', async () => {
    await joinChannel(testBot, message1);
    await toggleHereChannelAlert(testBot, message2);

    expect(testBot.answers).not.toEqual([]);
    expect(testBot.answers[1].text).toEqual(`There's no standup scheduled yet. Create one before toggling channel alert functionality.`);
  });

  test('sets channel alert for an existing channel', async () => {
    await joinChannel(testBot, message1);
    await createChannelStandup(testBot, message3)

    const channelsAfter1 = await Channel.getAll(testBot);
    expect(channelsAfter1.C0VHNJ7MF.atHereAlert).toEqual(true);

    await toggleHereChannelAlert(testBot, message2);

    const channelsAfter2 = await Channel.getAll(testBot);
    expect(channelsAfter1.C0VHNJ7MF.atHereAlert).toEqual(false);
  });
});
