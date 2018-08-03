//
// gathers all standup reports into an attachments object
//

const _ = require('lodash');
const standupReport = require('../get_standup_report.js');

function createAttachments(standups) {
  const attachments = [];

  _.each(standups, (standup) => {
    attachments.push(standupReport(standup));
  });

  return attachments;
}

module.exports = {
  convertStandups: createAttachments,
};
