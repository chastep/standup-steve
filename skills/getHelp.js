const log = require('../logger')('custom:getHelp');
const timeHelper = require('../helpers/time');
const _ = require('lodash');

function getHelp(bot, message)  {
  log.verbose(`heard this request - ${message.match[0]}`);
  
  bot.reply(message, 
    `Hello! :wave: Thanks for asking for help, sometimes this stuff can get confusing!\n`+
    `Below you will find a basic overview of how you and I should interact.\n`+
    `(My creator is super weird so you just have to deal with any quirks you encounter)\n`+
    `~~~~~~~~~~~~~CHANNEL BASICS~~~~~~~~~~~~~\n`+
    "_I will provide instruction on how to preform standups in my reminders/standup reports so please feel free to follow those directions (or don't, I'm not the boss :smile:)._\n"+
    ":exclamation: *Make sure to tag `@BOT_NAME` before each command below* :exclamation:\n"+
    "`create|move|schedule standup [time and days]` - schedule/update standup for a channel\n"+
    "`when` - get channel standup info\n"+
    "`reminder [mins]` - set minutes before channel standup time that a reminder should be sent\n"+
    "`remove standup` - remove existing standup (lame)\n"+
    `~~~~~~~~~~~~~~~BOT BASICS~~~~~~~~~~~~~~~\n`+
    "`uptime/debug` - usage stats surrounding my uptime/history/etc.\n"+
    "(I have some hidden features as well, have fun finding them! :wink:)\n"+
    `~~~~~~~~~~~~~~~~DM BASICS~~~~~~~~~~~~~~~\n`+
    "- Activity/interactions in DM land will be dictated by actions taken in channel land as a lot of reminder/standup report logic flows from channel interactions.\n"+
    "- I will ask you questions directly and gather data when you do stuff in the main channel.\n"+
    "- You can always DM me directly with `help` to get a refresher! :smile:\n"+
    `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`+
    ":information_source: If you would like greater detail into my functionality please feel free to poke around my <https://github.com/chastep/standup-steve|github page!> :information_source:\n"+
    `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
  )
};

function attachSkill(controller) {
  controller.hears(['help'],['direct_message'], getHelp);
  log.verbose('ATTACHED');
};

module.exports = {
  attachSkill,
};
