const Botmock = require('botkit-mock');

const { joinChannel, fetchChannelNameFromApi, createNewUsers } = require('../skills/joinChannel');
const Channel = require('../repositories/channel');
const User = require('../repositories/user');

// const controller = Botmock({});
// const testBot = controller.spawn({type: 'slack', token: 'test_token'});

/*
const testChannel1 = {
  _id: 'mongodb_object_id',
  id: 'test_channel_1_id',
  name: 'test_channel_1',
  standup: {},
  reminderMinutes: 30
};

const testChannel1Info = {
  channel: {
    id: 'test_channel_1_id',
    name: 'test_channel_1',
    members: [],
  },
};

const testChannel2Info = {
  channel: {
    id: 'test_channel_2_id',
    name: 'test_channel_2',
    members: [1,2,3],
  },
};

const testUser1 = {
  id: 1,
  name: 'Test Mctestface'
}

const testUser1Info = {
  user: {
    id: 1,
    name: 'Test Mctestface'
  }
}

const allUsers = jest.fn();
const getTestUserInfo = jest.fn();

const testBot = {
  botkit: {
    storage: {
      channels: {
        get: jest.fn()
      },
      users: {
        all: allUsers,
        save: jest.fn()
      }
    }
  },
  api: {
    channels: {
      info: jest.fn()
    },
    users: {
      info: getTestUserInfo
    }
  }
};
*/

describe('joinChannel funcitonality', () => {
  // beforeEach(() => {
  //   const controller = Botmock({});
  //   const testBot = controller.spawn({type: 'slack', token: 'test_token'});
  // });

  describe('createNewUsers', () => {
    test('returns undefined if no userIds are provided', () => {
      expect(createNewUsers(testBot, [])).toBeUndefined();
    });

    // test('returns nothing if users are already present in the db', async () => {
    //   getTestUserInfo.mockResolvedValueOnce(testUser1Info);
    //   allUsers.mockResolvedValueOnce([1,2,3]);

    //   const usersBeforeCount = User.getAll(testBot).resolves

    //   User.getById = jest.fn().mockResolvedValueOnce(testUser1)

    //   expect(createNewUsers(testBot, testChannel2Info.channel.members)).toBeUndefined();

    //   const usersBefore = await User.getAll(testBot);
    //   expect(channelsBefore).toEqual({});

    //   const message = {
    //     channel: 'C0VHNJ7MF'
    //   };
    //   await joinChannel(testBot, message)

    //   const channelsAfter = await Channel.getAll(testBot);
    //   expect(channelsAfter).not.toEqual({});
    // });
  });

  describe('fetchChannelNameFromApi', () => {
    const controller = Botmock({});
    const testBot = controller.spawn({type: 'slack', token: 'test_token'});

    test('returns an error if message is invalid', () => {
      const message = { foo: 'bar' };
      Channel.getInfo = jest.fn().mockRejectedValueOnce('no channels')

      expect(fetchChannelNameFromApi(testBot, message)).rejects.toEqual('no channels');
    });

    test('returns channel name', async () => {
      // const message = {
      //   channel: 'test_channel_1_id',
      // };
      // Channel.getInfo = jest.fn().mockResolvedValueOnce(testChannel1Info)

      // expect(fetchChannelNameFromApi(testBot, message)).resolves.toEqual(testChannel1Info.channel.name);

      const message = {
        channel: 'C0HBYC9SA3'
      };
      
      expect(await fetchChannelNameFromApi(testBot, message)).toEqual('test1name');
    });
  });

  describe('joinChannel', () => {
    test('returns an error if message is invalid', () => {
      expect.assertions(1);

      const message = { foo: 'bar' };
      Channel.getById = jest.fn().mockRejectedValueOnce('no channels')

      expect(joinChannel(testBot, message)).rejects.toEqual('no channels');
    });

    test('creates a channel if it doesnt already exist', async () => {
      expect.assertions(2);

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
      expect.assertions(1);

      const message = {
        channel: 'C0VHNJ7MF'
      };
      await joinChannel(testBot, message)
      
      expect(await joinChannel(testBot, message)).toBeUndefined();
    })
  });
});
