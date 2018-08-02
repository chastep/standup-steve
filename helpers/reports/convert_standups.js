// 
// gathers all standup reports into an attachments object
// 

const _ = require('lodash');
const standupReport = require('../get_standup_report.js');

function createAttachments(standups) {
  let attachments = [];

  _.each(standups, function (standup) {
    attachments.push(standupReport(standup));
  });

  return attachments;
};

module.exports = {
	convertStandups: createAttachments
};
