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

const log = require('../logger')('custom:sample_taskbot');
const _ = require('lodash');

function sampleTaskbot(controller) {
  // listen for someone saying 'tasks' to the bot
  // reply with a list of current tasks loaded from the storage system
  // based on this user's id
  controller.hears(['tasks', 'todo'],['direct_message'], (bot, message) => {
    // load user from storage...
    controller.storage.users.get(message.user, (err, user) => {
      // user object can contain arbitary keys. we will store tasks in .tasks
      if (!user || !user.tasks || user.tasks.length == 0) {
        bot.reply(message, 'There are no tasks on your list. Say `add _task_` to add something.');
      } else {
        const text = (
          `Here are your current tasks: \n`+
          `${generateTaskList(user)} Reply with \`done _number_\` to mark a task completed.`
        );
        bot.reply(message, text);
      }
    });
  });

  // listen for a user saying "add <something>", and then add it to the user's list
  // store the new list in the storage system
  controller.hears(['add (.*)'],['direct_message,direct_mention,mention'], (bot, message) => {
    const newtask = message.match[1];
    controller.storage.users.get(message.user, (err, user) => {
      if (!user.tasks) user.tasks = [];
      user.tasks.push(newtask);
      controller.storage.users.save(user, (err, saved) => {
        if (err) {
          bot.reply(message, `I experienced an error adding your task: ${err}`);
        } else {
          bot.api.reactions.add({
            name: 'thumbsup',
            channel: message.channel,
            timestamp: message.ts,
          });
        }
      });
    });
  });

  // listen for a user saying "done <number>" and mark that item as done.
  controller.hears(['done (.*)'],['direct_message'], (bot, message) => {
    let number = message.match[1];

    if (isNaN(number)) {
      bot.reply(message, 'Please specify a number.');
    } else {
      // adjust for 0-based array index
      number = parseInt(number) - 1;

      controller.storage.users.get(message.user, async (err, user) => {
        if (!user) {
          user = {};
          user.id = message.user;
          user.tasks = [];
        }

        if (number < 0 || number >= user.tasks.length) {
          bot.reply(message, `Sorry, your input is out of range. Right now there are ${user.tasks.length} items on your list.`);
        } else {
          const item = user.tasks.splice(number, 1);
          await bot.reply(message, `~${item}~`);

          _.pull(user.tasks, item);

          controller.storage.users.save(user, (err, savedUser) => {
            if (err) {
              bot.reply(message, `I experienced an error adding your task: ${err}`);
            } else {
              if (savedUser.tasks.length > 0) {
                bot.reply(message, `Here are your remaining tasks:\n${generateTaskList(savedUser)}`);
              } else {
                bot.reply(message, 'Your list is now empty!');
              }
            }
          })
        }
      });
    }
  });

  // simple function to generate the text of the task list so that
  // it can be used in various places
  function generateTaskList(user) {
    let text = '';

    for (let t = 0; t < user.tasks.length; t++) {
      text = `${text}> \`${t + 1}\`) ${user.tasks[t]}\n`;
    }

    return text;
  }
};

function attachSkill(controller) {
  sampleTaskbot(controller);
  log.verbose('ATTACHED');
};

module.exports = {
  sampleTaskbot,
  attachSkill,
};
