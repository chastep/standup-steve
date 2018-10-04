//
// gathers all standup reports into an attachments object
//

const log = require('../../logger')('custom:convert_standups:');
const _ = require('lodash');
const standupReport = require('../standups/get_standup_report.js');

module.exports = function convertStandups(standups) {
  const attachments = [];

  _.each(standups, (standup) => {
    attachments.push(standupReport(standup));
  });

  return attachments;
}
