const log = require('../../logger')('custom:do_interview:');
const timeHelper = require('../time.js');
const _ = require('lodash');
const getStandupReport = require('./getStandupReport.js');
const updateInterviewHelper = require('./updateInterview.js')
const common = require('../common.js');
const Channel = require('../../repositories/channel');
const User = require('../../repositories/user');
const Standup = require('../../repositories/standup');

async function createNewStandup(answers, interviewChannelId, interviewUserId, bot) {
	const standup = {};
	standup.id = interviewChannelId+'_'+interviewUserId+timeHelper.getReportFormat();
	standup.channel = interviewChannelId;
	standup.date = timeHelper.getReportFormat();
	standup.user = interviewUserId;
	standup.userInfo = await User.getInfo(bot, userId);
  standup.answers = answers;

  return standup;
};

async function startPrivateInterview(bot, userStandups, interviewChannel, interviewUser) {
  bot.startPrivateConversation({user: interviewUser.id}, function(response, convo) {
    const exited = false;
    const answers = {
      yesterday: null,
      today: null,
      blockers: null,
      wfh: null
    };

    if (parseFloat(timeHelper.getScheduleFormat()) >= parseFloat(interviewChannel.standup.time)) {
      log.verbose(`${interviewChannel.name} already reported a standup today`);
      convo.say(`Look's like #${interviewChannel.name} already reported a standup today :shrug:`);
    } else if (userStandups.length && timeHelper.datesAreSameDay(userStandups[userStandups.length - 1].date, new Date())) {
      log.verbose(`${interviewUser.realName} already completed a standup for #${interviewChannel.name} today`);
      convo.say(`Look's like you already recorded a standup for #${interviewChannel.name}. Good Job! :thumbsup:`);
      convo.ask(
        `Would you like to update that response now? :thinking_face:\n`+
        `*(Respond 'yes' to edit or 'no' to exit)*`,
        [
          {
            pattern: bot.utterances.yes,
            callback: function(response, convo) {
              convo.gotoThread('update_thread');
              convo.say(`Okay, let's get started! :simple_smile:`);
              updateInterviewHelper.updateInterview(bot, interviewChannel, interviewUser);
            }
          },
          {
            pattern: bot.utterances.no,
            callback: function(response, convo) {
              convo.gotoThread('no_thread');
            }
          },
          {
            default: true,
            callback(response, convo) {
              convo.gotoThread('bad_response');
            },
          }
        ]
      );
      convo.addMessage({
        action: 'stop',
      }, 'update_thread');
      convo.addMessage({
        text: 'Bye! :wave:',
        action: 'stop',
      }, 'no_thread');
      convo.addMessage({
        text: 'Sorry I did not understand. Say `yes` or `no`',
        action: 'default',
      }, 'bad_response');
    } else {
      log.verbose(`starting the interview for ${interviewUser.realName} in #${interviewChannel.name}`);
      convo.say(
        `Good Morning, Afternoon, or Evening! Let's record your standup for channel: ${interviewChannel.name}\n`+
        `*(Say "skip" to skip any of the questions)*\n`+
        `*(Say "exit" to stop the interview)*`
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

      _.each(common.standupQuestions, (section) => {
        convo.ask(section.question, function(response, conversation) {
          if (!common.checkForExit(response, conversation)) {
            if (!response.text.match(/^skip$/ig)) {
              answers[section.name] = response.text;
            }
            conversation.next();
          }
        })
      });

      convo.on('end', async function(convo) {
        if (convo.status=='completed' && !exited) {
          // TODO: do something useful with the users responses?
          // const res = convo.extractResponses();
          // log.info(res);

          let newStandup = await createNewStandup(answers, interviewChannel.id, interviewUser.id, bot);
          newStandup = await Standup.save(bot, newStandup)

          log.info(newStandup);
          log.verbose(`standup info recorded for ${newStandup.userInfo.realName}`);
          bot.say({
            text: `Thanks! Your standup for #${interviewChannel.name} has been recorded and is below`,
            attachments: [ getStandupReport(newStandup) ],
            channel: interviewUser.id
          });
        } else {
          log.verbose(`user exited standup interview`);
          bot.say(`You have exited the standup. Please emoji again on the channel reminder to record a new standup.`);
        }
      })
    }
  })
};

async function doInterview(bot, interviewChannel, interviewUser) {
	log.verbose(`interview with name/id: ${interviewUser.realName}/${interviewUser.id} for #${interviewChannel.name}`);

  const currentChannel = await Channel.getById(bot, interviewChannel.id);
  const allStandups = await Standup.getAll(bot);
  let userStandups = [];

  if (allStandups) {
    userStandups = await common.collectUserStandups(allStandups, interviewUser.id);
  } else {
    log.warn('there are no standups in the db');
  }

  await startPrivateInterview(bot, userStandups, interviewChannel, interviewUser);
};

module.exports = {
  doInterview,
};
