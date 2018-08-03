//
// compiles a report for a individual standup
//

function getStandupReport(standup) {
  const color = '#000000'.replace(/0/g, () => (~~(Math.random() * 16)).toString(16));
  const fields = [];
  if (standup.yesterday) {
    fields.push({
      title: 'Yesterday',
      value: standup.yesterday,
      short: false,
    });
  }
  if (standup.today) {
    fields.push({
      title: 'Today',
      value: standup.today,
      short: false,
    });
  }
  if (standup.blockers) {
    fields.push({
      title: 'Blockers',
      value: standup.blockers,
      short: false,
    });
  }
  if (standup.goal) {
    fields.push({
      title: 'Goal',
      value: standup.goal,
      short: false,
    });
  }

  return {
    title: standup.userRealName,
    fields,
    color,
    thumb_url: standup.thumbUrl,
  };
}

module.exports = {
  standupReport: getStandupReport,
};
