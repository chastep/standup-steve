const log = require('../../logger')('custom:for_channel:');
const convertStandups = require('./convertStandups.js');
// const generateFields  = require('./generateFields'); => stat reporting, icebox feature

module.exports = function reportForChannel(channel, standups) {
  const attachableStandups = convertStandups(standups);

  attachableStandups.unshift({
    title: 'Opternative Engineering Team'
    // fields:   generateFields(attachableStandups)
  });

  return {
    channel: channel.name,
    attachments: attachableStandups
  };
}
