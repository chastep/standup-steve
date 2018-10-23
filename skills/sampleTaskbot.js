/*

    This is a sample bot that provides a simple todo list function
    and demonstrates the Botkit storage system.

    Botkit comes with a generic storage system that can be used to
    store arbitrary information about a user or channel. Storage
    can be backed by a built in JSON file system, or one of many
    popular database systems.

    See:

        botkit-storage-mongo
        botkit-storage-firebase
        botkit-storage-redis
        botkit-storage-dynamodb
        botkit-storage-mysql

*/

const log = require('../logger')('custom:sampleTaskbot');
const _ = require('lodash');
const User = require('../repositories/user');

function sampleTaskbot(controller) {

  // simple function to generate the text of the task list so that
  // it can be used in various places
  function generateTaskList(user) {
    let text = '';

    for (let t = 0; t < user.tasks.length; t++) {
      text = `${text}> \`${t + 1}\`) ${user.tasks[t]}\n`;
    }

    return text;
  };

  controller.hears(['tasks', 'todo'],['direct_message'], async (bot, message) => {
    const currentUser = await User.getById(bot, message.user)

    if (!currentUser || !currentUser.tasks || currentUser.tasks.length == 0) {
      bot.reply(message, 'There are no tasks on your list. Say `add _task_` to add something.');
    } else {
      const text = (
        `Here are your current tasks: \n`+
        `${generateTaskList(currentUser)} Reply with \`done _number_\` to mark a task completed.`
      );
      bot.reply(message, text);
    }
  });

  controller.hears(['add (.*)'],['direct_message,direct_mention,mention'], async (bot, message) => {
    const newtask = message.match[1];
    const currentUser = await User.getById(bot, message.user)

    if (!currentUser.tasks) currentUser.tasks = [];
    currentUser.tasks.push(newtask);

    const updatedUser = await User.save(bot, currentUser);

    bot.api.reactions.add({
      name: 'thumbsup',
      channel: message.channel,
      timestamp: message.ts,
    });
  });

  // listen for a user saying "done <number>" and mark that item as done.
  controller.hears(['done (.*)'],['direct_message'], async (bot, message) => {
    let number = message.match[1];

    if (isNaN(number)) {
      bot.reply(message, 'Please specify a number.');
      return;
    }
    // adjust for 0-based array index
    number = parseInt(number) - 1;

    const currentUser = await User.getById(bot, message.user)

    if (number < 0 || number >= currentUser.tasks.length) {
      bot.reply(message, `Sorry, your input is out of range. Right now there are ${currentUser.tasks.length} items on your list.`);
    } else {
      const item = currentUser.tasks.splice(number, 1);
      await bot.reply(message, `~${item}~`);

      _.pull(currentUser.tasks, item);

      const updatedUser = await User.save(bot, currentUser);

      if (updatedUser.tasks.length > 0) {
        bot.reply(message, `Here are your remaining tasks:\n${generateTaskList(updatedUser)}`);
      } else {
        bot.reply(message, 'Your list is now empty!');
      }
    }
  });
};

function attachSkill(controller) {
  sampleTaskbot(controller);
  log.verbose('ATTACHED');
};

module.exports = {
  sampleTaskbot,
  attachSkill,
};
