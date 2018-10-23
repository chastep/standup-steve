const log = require('../logger')('custom:getReportsRunner');
const _ = require('lodash');
const timeHelper = require('../helpers/time');
const ChannelReportHelper = require('../helpers/doChannelReport');
const fedHolidays = require('@18f/us-federal-holidays');
const common = require('../helpers/common');
const Channel = require('../repositories/channel');

async function runReports(bot) {
  log.verbose('attempting to run channel standup reports :D');

  if (fedHolidays.isAHoliday()) {
    return;
  };

  const timeAndDay = {
    time: timeHelper.getScheduleFormat(),
    day: timeHelper.getScheduleDay()
  };
  const allChannels = await Channel.getAll(bot);
  const selectedChannels = await common.collectTimeMatchedChannels(allChannels, timeAndDay, 'report');

  if (selectedChannels.length > 0) {
    log.info(`reporting standups for ${selectedChannels.length} channel(s)`);
    _.each(selectedChannels, (channel) => {
      log.verbose(`starting to run channel report for ${channel.id}`);
      ChannelReportHelper.doChannelReport(bot, channel);
    });
  } else {
    log.verbose(`there are no channels eligible for reporting - PEACE`);
  }
}

module.exports = function (bot) {
  return function () {
    runReports(bot);
  };
};
