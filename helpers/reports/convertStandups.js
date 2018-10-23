const log = require('../../logger')('custom:convertStandups');
const _ = require('lodash');
const standupReport = require('../standups/getStandupReport');

module.exports = function convertStandups(standups) {
  const attachments = [];

  _.each(standups, (standup) => {
    attachments.push(standupReport(standup));
  });

  return attachments;
}
