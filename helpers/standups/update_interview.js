//
// updates the user interview
// 1. identify user who initiated the interview
// 2. find users most recent standup
// 3. show user their standup
// 4. will iterate through questions, user can skip or update each response
// 5. will gather user responses after each question
// 6. will update standup
// 7. will show user their standup when complete
//

const log = require('../../logger')('custom:update_interview:');
const timeHelper = require('../time.js');
const _ = require('lodash');
const getStandupReport = require('./get_standup_report.js');

// find last standups for user
function collectLastUserStandup(standups, interviewUser) {
  var selected = [];
  _.each(standups, (standup) => {
    if (standup.user === interviewUser) {
      selected.push(standup);
    }
  })
  return selected[selected.length -1];
};

// find user information
function collectUserInfo(bot, interviewUser) {
  return new Promise((res, rej) => {
    bot.api.users.info({ user: interviewUser }, (err, response) => {
      if (err) {
        return rej(err);
      }
      return res({
        realName: response.user.realName || response.user.name,
        thumbUrl: response.user.profile.image_72
      });
    });
  });
};

// create new standup object
async function updateStandup(answers, standupToUpdate) {
  var standup = standupToUpdate;
  standup.answers = answers;
  return standup;
}

module.exports = function doInterview(bot, interviewChannel, interviewUser) {
  log.verbose('Preparing to update an interview with '+interviewUser+' for channel ' + interviewChannel);

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

        var userStandupToUpdate = await collectLastUserStandup(standups, interviewUser);

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
          
          log.verbose('Starting the update for '+interviewUser+' in '+interviewChannel);
          convo.say(
            'Okay, let\'s get started! :simple_smile:\n'+
            '(Say "skip" to skip any of the questions or "exit" to stop the update)'
          );
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
            convo.say('Your previous response: '+section.answer);
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

              var updatedStandup = await updateStandup(answers, userStandupToUpdate);

              bot.botkit.storage.standups.save(updatedStandup, function(e, updatedStand) {
                if (e) {
                  log.error(e);
                  bot.reply(message, `I experienced an error saving this user standup: ${e}`);
                } else {
                  log.info(updatedStand);
                  log.verbose('Standup info recorded for ' + updatedStand.userInfo.realName);
                  bot.say({
                    text: 'Thanks! Your standup for '+channel.name+' has been updated. It will look like:',
                    attachments: [ getStandupReport(updatedStand) ],
                    channel: interviewUser
                  });
                }
              })
            } else {
              log.verbose('User exited standup interview');
              bot.say('You have exited the standup. Please emoji again on the channel reminder to record a new standup.');
            }
          })
        })
      })
    }
  });
};
