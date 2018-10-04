//
// compiles a report for a individual standup
//

const log = require('../../logger')('custom:get_standup_report:');

module.exports = function getStandupReport(standup) {
  const color = '#000000'.replace(/0/g, () => (~~(Math.random() * 16)).toString(16));
  const fields = [];
  if (standup.answers.yesterday) {
    fields.push({
      title: 'Yesterday',
      value: standup.answers.yesterday,
      short: false,
    });
  }
  if (standup.answers.today) {
    fields.push({
      title: 'Today',
      value: standup.answers.today,
      short: false,
    });
  }
  if (standup.answers.blockers) {
    fields.push({
      title: 'Blockers',
      value: standup.answers.blockers,
      short: false,
    });
  }
  if (standup.answers.wfh) {
    fields.push({
      title: 'WFH',
      value: standup.answers.wfh,
      short: false,
    });
  }

  return {
    title: standup.userInfo.realName,
    fields,
    color,
    thumb_url: standup.userInfo.thumbUrl,
  };
}
