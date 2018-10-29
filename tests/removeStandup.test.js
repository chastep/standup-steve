const Botmock = require('botkit-mock');
const { removeStandup } = require('../skills/removeStandup');
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
  match:
    [ 'remove standup',
      'remove',
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

describe('createChannelStandup', () => {
  test('replies that there is no standup scheduled if standup is not present', async () => {
    await joinChannel(testBot, message1);
    await removeStandup(testBot, message2);

    expect(testBot.answers).not.toEqual([]);
    expect(testBot.answers[1].text).toEqual(
      'There\'s no standup scheduled yet.',
    );
  });

  test('removes standup for existing channel if configured', async () => {
    await joinChannel(testBot, message1);
    await createChannelStandup(testBot, message3)

    const channelsAfter1 = await Channel.getAll(testBot);
    expect(channelsAfter1.C0VHNJ7MF.standup).not.toEqual({});

    await removeStandup(testBot, message2);

    const channelsAfter2 = await Channel.getAll(testBot);
    expect(channelsAfter2.C0VHNJ7MF.standup).toEqual({});

    expect(testBot.answers[3].text).toEqual(
      `Standup removed :thumbsup:`
    );
  });
});
