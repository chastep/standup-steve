const log = require('../../logger')('custom:convert_standups:');
const _ = require('lodash');
const standupReport = require('../standups/getStandupReport.js');

module.exports = function convertStandups(standups) {
  const attachments = [];

  _.each(standups, (standup) => {
    attachments.push(standupReport(standup));
  });

  return attachments;
}
