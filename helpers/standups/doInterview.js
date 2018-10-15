//
// performs the user interview
// there will be a main runner function to kick off the necessary parts of the interview
// 1. will identify user who initiated the interview
// 2. will send the user a private message/start private conversation
// 3. will have set list of question and will iterate through them, posing them to the user
// 4. will gather user responses after each question
// 5. will create standup
// 6. will create standup report and provide to user when conversation is over
//

const log = require('../../logger')('custom:do_interview:');
const timeHelper = require('../time.js');
const _ = require('lodash');
const getStandupReport = require('./getStandupReport.js');
const updateInterview = require('./doUpdateInterview.js')
const common = require('../common.js');

// find all standups for user
function collectUserStandups(standups, interviewUser) {
	var selected = [];
	_.each(standups, (standup) => {
		if (standup.user === interviewUser) {
			selected.push(standup);
		}
	})
	return selected;
};

// create new standup object
async function createNewStandup(answers, interviewChannel, interviewUser, bot) {
	var standup = {};
	standup.id = interviewChannel+'_'+interviewUser+timeHelper.getReportFormat();
	standup.channel = interviewChannel;
	standup.date = timeHelper.getReportFormat();
	standup.user = interviewUser;
	standup.userInfo = await common.collectUserInfo(bot, interviewUser);
  standup.answers = answers;
  return standup;
}

module.exports = function doInterview(bot, interviewChannel, interviewUser) {
	log.verbose(`Preparing for an interview with ${interviewUser} for channel ${interviewChannel}`);

	// find channel
	bot.botkit.storage.channels.get(interviewChannel, (err, channel) => { 
		if (!channel) {
      log.error(`channel is not present: ${err}`);
    } else {
      log.info('channel is present');
      bot.botkit.storage.standups.all(async (err, standups) => {
      	if (err) {
          log.error(`Problem finding all standups: ${err}`);
      	}

      	if (standups) {
      		var userStandups = await collectUserStandups(standups, interviewUser);
      	} else {
      		var userStandups = [];
      		log.warn('There are no standups saved in the db');
      	}

      	bot.startPrivateConversation({user: interviewUser}, function(response, convo) {
      		// user standup conversation variables
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
          // first check to see if standup has already been reported
		      // then check to see if a standup has already been recorded for the day
          if (parseFloat(timeHelper.getScheduleFormat()) >= parseFloat(channel.standup.time)) {
            log.verbose(`${channel.name} already reported a standup today`);
            convo.say(`Look's like channel ${channel.name} already reported a standup today :/`);
          } else if (userStandups.length && timeHelper.datesAreSameDay(userStandups[userStandups.length - 1].date, new Date())) {
	      		log.verbose(`${interviewUser} already completed a standup for ${channel.name} today`);
            convo.say(`Look's like you already recorded a standup for channel: ${channel.name}. Good Job! :thumbsup:`);
            convo.ask(
              `Would you like to update that response now? :thinking_face:\n`+
              `*(Respond 'yes' to edit or 'no' to exit)*`,
              [
                {
                  pattern: bot.utterances.yes,
                  callback: function(response, convo) {
                    convo.gotoThread('update_thread');
                    convo.say(`Okay, let's get started! :simple_smile:`);
                    updateInterview(bot, interviewChannel, interviewUser);
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
			      log.verbose(`starting the interview for ${interviewUser} in ${interviewChannel}`);
			      convo.say(
              `Good Morning, Afternoon, or Evening! Let's record your standup for channel: ${channel.name}\n`+
              `*(Say "skip" to skip any of the questions)*\n`+
              `*(Say "exit" to stop the interview)*`
            );
			      // check for exit function
						function checkForExit(response, conversation) {
							if (response.text.match(/^exit$/i)) {
								conversation.messages.length = 0;
								conversation.say(`Okay! I won't record anything right now. :simple_smile:`);
						    conversation.next();
						    exited = true;
						    return true;
							}
							return false;
						}

						_.each(sections, (section) => {
							convo.ask(section.question, function(response, conversation) {
								if (!checkForExit(response, conversation)) {
									if (!response.text.match(/^skip$/ig)) {
										answers[section.name] = response.text;
									}
									conversation.next();
								}
							})
						});

						convo.on('end', async function(convo) {
							if (convo.status=='completed' && !exited) {
							  // do something useful with the users responses?
							  // var res = convo.extractResponses();
							  // log.info(res);

							  var newStandup = await createNewStandup(answers, interviewChannel, interviewUser, bot);

							  bot.botkit.storage.standups.save(newStandup, function(e, newStand) {
							  	if (e) {
						        log.error(e);
						        bot.reply(message, `I experienced an error saving this user standup: ${e}`);
						      } else {
						      	log.info(newStand);
						        log.verbose(`Standup info recorded for ${newStand.userInfo.realName}`);
                    bot.say({
                      text: `Thanks! Your recorded standup for channel: ${channel.name} is below`,
                      attachments: [ getStandupReport(newStand) ],
                      channel: interviewUser
                    });
						      }
							  })
							} else {
								log.verbose(`user exited standup interview`);
                bot.say(`You have exited the standup. Please emoji again on the channel reminder to record a new standup.`);
							}
						})
			    }
      	})
      })
    }
	});
};
