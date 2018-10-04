//
// performs the user interview
// there will be a main runner function to kick off the necessary parts of the interview
// 1. will identify user who initiated the interview
// 2. will send the user a private message/start private conversation
// 3. will have set list of question and will iterate through them, posing them to the user
// 4. will gather user responses after each question
// 5. will create and standup
// 6. will create standup report and provide to user when conversation is over
//

const log = require('../../logger')('custom:do_interview:');
const timeHelper = require('../time.js');
const _ = require('lodash');
const getStandupReport = require('./get_standup_report.js');

// should be noted that this current functionality will assume that we have ONE global channel
// would want to setup a queuing functionality in the future if we have multiple channels with a mixed user base

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

// find user information
function collectUserInfo(bot, interviewUser) {
  return new Promise((res, rej) => {
    bot.api.users.info({ user: interviewUser }, (err, response) => {
      if (err) {
        return rej(err);
      }
      return res({
      	realName: response.user.real_name || response.user.name,
      	thumbUrl: response.user.profile.image_72
      });
    });
  });
};

// create new standup object
async function createNewStandup(answers, interviewChannel, interviewUser, bot) {
	var standup = {};
	standup.id = interviewChannel+'_'+interviewUser+timeHelper.getReportFormat();
	standup.channel = interviewChannel;
	standup.date = timeHelper.getReportFormat();
	standup.user = interviewUser;
	standup.userInfo = await collectUserInfo(bot, interviewUser);
  standup.answers = answers;
  return standup;
}

module.exports = function doInterview(bot, interviewChannel, interviewUser) {
	log.verbose('Preparing for an interview with '+interviewUser+' for channel ' + interviewChannel);

	// find channel
	bot.botkit.storage.channels.get(interviewChannel, (err, channel) => { 
		if (!channel) {
      log.error(`channel is not present: ${err}`);
    } else {
      log.info('channel is present');
      bot.botkit.storage.standups.all(async (err, standups) => {
      	if (err) {
      		log.error('Problem finding all standups: ' + err);
      	}

      	if (standups) {
      		var userStandups = await collectUserStandups(standups, interviewUser);
          log.verbose(userStandups);
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
		      // check to see if a standup has already been recorded for the day
		      // if yes then return that standup
	      	if (userStandups.length && timeHelper.datesAreSameDay(userStandups[userStandups.length - 1].date, new Date())) {
	      		log.verbose(interviewUser+' already completed a standup for '+channel.name+' today')
            convo.say(
              'Look\'s like you already recorded a standup for '+channel.name+
              '\n Good Job! :thumbsup:'+
              '\n Functionality to edit past standups is currently under construction :construction_worker: Sit tight!'
            );
	      		// return standup to user in report form
	      		// TODO: Provide them with option to edit existing standup
			    } else {
			      log.verbose('Starting the interview for '+interviewUser+' in '+interviewChannel);
			      convo.say('Good Morning, Afternoon, or Evening! Let\'s record your standup for '+channel.name+'\n (Say "skip" to skip any of the questions or "exit" to stop the interview)');

			      // check for exit function
						function checkForExit(response, conversation) {
							if (response.text.match(/^exit$/i)) {
								conversation.messages.length = 0;
								conversation.say('Okay! I won\'t record anything right now. :simple_smile:');
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
							  // do something useful with the users responses
							  var res = convo.extractResponses();
							  log.info(res);

							  var newStandup = await createNewStandup(answers, interviewChannel, interviewUser, bot);

							  bot.botkit.storage.standups.save(newStandup, function(e, newStand) {
							  	if (e) {
						        log.error(e);
						        bot.reply(message, `I experienced an error saving this user standup: ${e}`);
						      } else {
						      	log.info(newStand);
						        log.verbose('Standup info recorded for ' + newStand.userInfo.realName);
                    bot.say({
                      text: 'Thanks! Your standup for '+channel.name+' is recorded. It will look like:',
                      attachments: [ getStandupReport(newStand) ],
                      channel: interviewUser
                    });
						      }
							  })
							} else {
								log.verbose('User exited standup interview');
								bot.say('You have exited the standup. Please emoji again on the channel reminder to record a new standup.');
							}
						})
			    }
      	})
      })
    }
	});
};
