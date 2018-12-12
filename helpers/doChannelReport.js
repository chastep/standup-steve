const async = require('async');
const _ = require('lodash');
const log = require('../logger')('custom:doChannelReport');
const timeHelper = require('./time');
const common = require('./common');
const createNewChannelReport = require('./createChannelReport');
const Channel = require('../repositories/channel');
const Standup = require('../repositories/standup');

async function doChannelReport(bot, channel) {
  log.verbose(`attempting to run standup report for #${channel.name}`);

  const currentChannel = await Channel.getById(bot, channel.id);
  log.info('channel is present');

  const allStandups = await Standup.getAll(bot);
  let reportableStandups = [];

  if (allStandups) {
    reportableStandups = await common.gatherTodaysStandups(allStandups, currentChannel);
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
