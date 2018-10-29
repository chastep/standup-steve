const log = require('../logger')('custom:common');
const timeHelper = require('./time.js');
const _ = require('lodash');

function standupInfoBlob(channel) {
  return (
    `:point_down: Standup Details :point_down:\n`+
    `~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`+
    `Time: ${timeHelper.getDisplayFormat(channel.standup.time)}\n`+
    `Days: ${timeHelper.getDisplayFormatForDays(channel.standup.days)}\n`+
    `Reminder Time: ${timeHelper.getDisplayFormat(channel.standup.reminderTime)}\n`+
    `~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
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

function collectTimeMatchedChannels(channels, where, flag) {

  const selected = [];
  _.each(channels, (channel) => {
    if (_.isEmpty(channel.standup)) {
      return;
    } else if (flag === 'reminder' && channel.standup.reminderTime === where.time && _.includes(channel.standup.days, _.capitalize(where.day))) {
      selected.push(channel);
    } else if (flag === 'report' && channel.standup.time === where.time && _.includes(channel.standup.days, _.capitalize(where.day))) {
      selected.push(channel);
    }
  });
  return selected;
}

module.exports = {
  standupInfoBlob,
  collectUserStandups,
  standupQuestions,
  collectTimeMatchedChannels,
};
