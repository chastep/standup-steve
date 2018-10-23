const log = require('../../logger')('custom:update_interview:');
const timeHelper = require('../time.js');
const _ = require('lodash');
const getStandupReport = require('./getStandupReport.js');
const common = require('../common.js');
const Channel = require('../../repositories/channel');
const User = require('../../repositories/user');
const Standup = require('../../repositories/standup');


function updateStandup(answers, standupToUpdate) {
  const standup = standupToUpdate;
  standup.answers = answers;

  return standup;
};

async function startPrivateUpdateInterview(bot, interviewChannel, interviewUser, userStandupToUpdate) {
  bot.startPrivateConversation({user: interviewUser.id}, function(response, convo) {
    var exited = false;
    const answers = {
      yesterday: null,
      today: null,
      blockers: null,
      wfh: null
    };
    const sections = [
      {
        question: 'What did you do yesterday?',
        answer: userStandupToUpdate.answers.yesterday,
        name: 'yesterday'
      },
      {
        question: `What are you doing today?`,
        answer: userStandupToUpdate.answers.today,
        name: 'today'
      },
      {
        question: `What are your blockers?`,
        answer: userStandupToUpdate.answers.blockers,
        name: 'blockers'
      },
      {
        question: 'WFH today/part of today?',
        answer: userStandupToUpdate.answers.wfh,
        name: 'wfh'
      }
    ];
    
    log.verbose(`starting the update for ${interviewUser.realName} in #${interviewChannel.name}`);
    convo.say(
      `Okay, let's get started! :simple_smile:\n`+
      `*(Say "skip" to skip any of the questions and keep previous answer)*\n`+
      `*(Say "exit" to stop the update)*`
    );

    function checkForExit(response, conversation) {
      if (response.text.match(/^exit$/i)) {
        conversation.messages.length = 0;
        conversation.say(`Okay! I won't record anything right now. :simple_smile:`);
        conversation.next();
        exited = true;
        return true;
      }
      return false;
    };

    _.each(sections, (section) => {
      let message = (
        `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`+
        `*Question* - ${section.question}\n`+
        `*Previous Response* - ${section.answer}\n`+
        `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`+
        `:point_down: New Response? :point_down:`
      );

      convo.ask(message, function(response, conversation) {
        if (!checkForExit(response, conversation)) {
          if (!response.text.match(/^skip$/ig)) {
            answers[section.name] = response.text;
          } else {
            answers[section.name] = section.answer;
          }
          conversation.next();
        }
      })
    });

    convo.on('end', async function(convo) {
      if (convo.status=='completed' && !exited) {
        let updatedStandup = await updateStandup(answers, userStandupToUpdate);
        updatedStandup = await Standup.save(bot, updatedStandup)

        log.info(updatedStandup);
        log.verbose(`standup info recorded for ${updatedStandup.userInfo.realName}`);
        bot.say({
          text: `Thanks! Your standup for #${interviewChannel.name} has been updated and is below:`,
          attachments: [ getStandupReport(updatedStandup) ],
          channel: interviewUser.id
        });
      } else {
        log.verbose(`user exited standup interview`);
        bot.say(`You have exited the standup. Please emoji again on the channel reminder to record a new standup.`);
      }
    })
  })
};

async function updateInterview(bot, interviewChannel, interviewUser) {
  log.verbose(`updating and interview with name/id: ${interviewUser.realName}/${interviewUser.id} for #${interviewChannel.name}`);

  const currentChannel = await Channel.getById(bot, interviewChannel.id);
  const allStandups = await Standup.getAll(bot);
  const userStandups = await common.collectUserStandups(allStandups, interviewUser.id);
  const userStandupToUpdate = userStandups[userStandups.length - 1];

  await startPrivateUpdateInterview(bot, interviewChannel, interviewUser, userStandupToUpdate);
};

module.exports = {
  updateInterview,
};
