// 
// starts an interview with a user if they add emoji to channel reminder message
// 

var log = require('../logger')('custom:start_interview:');
// var interviewHelper = require('../helpers/do_interview.js');

function startUserInterview(bot, message) {
  log.verbose('Got request to start an interview from '+message.user);
  // helpers.doInterview(bot, message.channel, message.user);
}

function attachListener(controller) {
  controller.hears([/\binterview\b/i],['direct_mention'], function(bot, message) {
    startUserInterview(bot, message);
  });
}

module.exports = attachListener;