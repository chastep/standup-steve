const log = require('../../logger')('botkit:incoming_webhooks');

module.exports = function (webserver, controller) {
  log.verbose('Configured /slack/receive url');

  webserver.post('/slack/receive', (req, res) => {
    // NOTE: we should enforce the token check here
    log.info(`Recieved webhook: ${req}${res}`);
    // respond to Slack that the webhook has been received.
    res.status(200);
    // Now, pass the webhook into be processed
    controller.handleWebhookPayload(req, res);
  });
};
