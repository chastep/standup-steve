//
// this process creates a new channel report with associated attachements for an individual channel
//

const log = require('../../logger')('custom:for_channel:');
const convertStandups = require('./convert_standups.js');
// const generateFields  = require('./generateFields');

function defaultMessage(channelName) {
  return `Today's standup for <#${channelName}>`;
}

function gatherChannelStandupsAsAttachments(channel, standups) {
  const channelName = channel.name;
  const attachments = convertStandups(standups);

  attachments.unshift({
    fallback: defaultMessage(channelName),
    pretext: defaultMessage(channelName),
    title: 'Summary',
    // fields:   generateFields(attachments)
  });

  return {
    channel: channelName,
    attachments,
  };
}

module.exports = {
  gatherChannelStandupsAsAttachments,
};
