const async = require('async');
const _ = require('lodash');
const log = require('../logger')('custom:doChannelReport');
const timeHelper = require('./time');
const createNewChannelReport = require('./createChannelReport');
const Channel = require('../repositories/channel');
const Standup = require('../repositories/standup');

function gatherTodaysStandups(standups) {
  const todaysStandups = [];

  _.each(standups, (standup) => {
    if (timeHelper.datesAreSameDay(standup.date, new Date())) {
      todaysStandups.push(standup);
    }
  });

  return todaysStandups;
}

async function doChannelReport(bot, channel) {
  log.verbose(`attempting to run standup report for #${channel.name}`);

  const currentChannel = await Channel.getById(bot, channel.id);
  log.info('channel is present');

  const allStandups = await Standup.getAll(bot);
  let reportableStandups = [];

  if (allStandups) {
    reportableStandups = await gatherTodaysStandups(allStandups);
  } else {
    log.warn('there are no standups in the db');
    return;
  }

  async.series([
    function (callback) {
      log.info(`creating channel standup report`);
      createNewChannelReport(bot, currentChannel, reportableStandups);
      callback(null);
    }, function () {},
  ]);
};

module.exports = {
  doChannelReport,
};
