const timeHelper = require('./time.js');
const _ = require('lodash');

function standupInfoBlob(channel) {
  return (
    `:point_down: Standup Details :point_down:\n`+
    `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`+
    `Time: ${timeHelper.getDisplayFormat(channel.standup.time)}\n`+
    `Days: ${timeHelper.getDisplayFormatForDays(channel.standup.days)}\n`+
    `Reminder Time: ${timeHelper.getDisplayFormat(channel.standup.reminderTime)}\n`+
    `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
  )
}

function collectUserStandups(standups, interviewUserId) {
  let selected = [];
  _.each(standups, (standup) => {
    if (standup.user === interviewUserId) {
      selected.push(standup);
    }
  })
  return selected;
};

const standupQuestions = [
  {
    question: 'What did you do yesterday?',
    name: 'yesterday'
  },
  {
    question: `What are you doing today?`,
    name: 'today'
  },
  {
    question: `What are your blockers?`,
    name: 'blockers'
  },
  {
    question: 'WFH today/part of today?',
    name: 'wfh'
  }
];

module.exports = {
  standupInfoBlob,
  collectUserStandups,
  standupQuestions,
};
