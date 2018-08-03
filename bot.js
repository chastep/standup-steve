/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Slack bot built with Botkit.

This bot demonstrates many of the core features of Botkit:

* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
  for a user.

# RUN THE BOT:

  Create a new app via the Slack Developer site:

    -> http://api.slack.com

  Get a Botkit Studio token from Botkit.ai:

    -> https://studio.botkit.ai/

  Run your bot from the command line:

    clientId=<MY SLACK TOKEN> clientSecret=<my client secret> PORT=<3000> studio_token=<MY BOTKIT STUDIO TOKEN> node bot.js

# USE THE BOT:

    Navigate to the built-in login page:

    https://<myhost.com>/login

    This will authenticate you with Slack.

    If successful, your bot will come online and greet you.


# EXTEND THE BOT:

  Botkit has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const schedule = require('node-schedule');

// this is necessary for local development
require('dotenv').config();

// checkout dem kewl env vars
if (!process.env.SLACK_APP_ID || !process.env.SLACK_APP_SECRET || !process.env.PORT) {
  usage_tip();
  process.exit(1);
}

// kick up a new Botkit and debug protocal
const Botkit = require('botkit');
const debug = require('debug')('botkit:main');
const log = require('./logger')('app');

// logger setup
const bkLogger = require('./logger')('botkit');

function bkLog(level) {
  const args = [];
  for (let i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }

  // Remap botkit log levels
  if (level === 'debug') {
    return;
  }
  if (level === 'info') {
    level = 'verbose';
  } else if (level === 'notice') {
    level = 'info';
  }

  let fn; let
    thisObj;
  if (bkLogger[level]) {
    fn = bkLogger[level];
    thisObj = bkLogger;
  } else {
    fn = console.log;
    thisObj = console;
    args.unshift(`[${level}]`);
  }

  fn.apply(thisObj, args);
}

// local dev test
if (process.env.SLACK_TOKEN) {
  var controller = Botkit.slackbot({
    debug: false,
    logger: { log: bkLog },
    storage: require('botkit-storage-mongo')({ mongoUri: process.env.MONGODB_URL }),
  });

  var webserver = require(`${__dirname}/components/express_webserver.js`)(controller);

  controller.spawn({
    token: process.env.SLACK_TOKEN,
    retry: 5,
  }).startRTM((err, bot) => {
    if (err) {
      log.error(err);
      throw new Error(err);
    } else {
      log.info('Connected to RTM');
      bot.identifyBot((err, identity) => {
        log.info(`Bot name: ${identity.name}`);

        // loads all skills present
        const normalizedPath = require('path').join(__dirname, 'skills');
        require('fs').readdirSync(normalizedPath).forEach((file) => {
          require(`./skills/${file}`)(controller);
        });
        log.verbose('All bot skills loaded :D');

        // Set up cron job to check every minute for channels that need a standup report
        botRunners = require('./runners');
        schedule.scheduleJob('* * * * 1-5', botRunners.getReportsRunner(controller));
        schedule.scheduleJob('* * * * 1-5', botRunners.getRemindersRunner(controller));
        log.verbose('All bot jobs scheduled :D');
      });
    }
  });
} else {
  // botkit options, configurable
  const bot_options = {
    clientId: process.env.SLACK_APP_ID,
    clientSecret: process.env.SLACK_APP_SECRET,
    debug: false,
    logger: { log: bkLog },
    scopes: ['bot'],
    studio_token: process.env.BOTKIT_STUDIO_TOKEN,
  };
  // ~~~~~~~~~~~~~
  // going to try and use MongoDB
  // ~~~~~~~~~~~~~
  // Use a mongo database if specified, otherwise store in a JSON file local to the app.
  // Mongo is automatically configured when deploying to Heroku
  if (process.env.MONGOLAB_NAVY_URI) {
    const mongoStorage = require('botkit-storage-mongo')({ mongoUri: process.env.MONGOLAB_NAVY_URI });
    bot_options.storage = mongoStorage;
  } else {
    bot_options.json_file_store = `${__dirname}/.data/db/`; // store user data in a simple JSON format
  }

  // Create the Botkit controller, which controls all instances of the bot with the options defined above.
  var controller = Botkit.slackbot(bot_options);

  controller.startTicking();

  // Set up an Express-powered webserver to expose oauth and webhook endpoints
  var webserver = require(`${__dirname}/components/express_webserver.js`)(controller);

  if (!process.env.SLACK_APP_ID || !process.env.SLACK_APP_SECRET) {
    usage_tip();
    process.exit(1);
  } else {
    webserver.get('/', (req, res) => {
      res.render('index', {
        domain: req.get('host'),
        protocol: req.protocol,
        glitch_domain: process.env.PROJECT_DOMAIN,
        layout: 'layouts/default',
      });
    });
    // Set up a simple storage backend for keeping a record of customers
    // who sign up for the app via the oauth
    require(`${__dirname}/components/user_registration.js`)(controller);

    // Send an onboarding message when a new team joins
    require(`${__dirname}/components/onboarding.js`)(controller);

    // enable advanced botkit studio metrics
    require('botkit-studio-metrics')(controller);

    // loads all skills present
    const normalizedPath = require('path').join(__dirname, 'skills');
    require('fs').readdirSync(normalizedPath).forEach((file) => {
      require(`./skills/${file}`)(controller);
    });
    log.verbose('All bot skills loaded :D');

    // Set up cron job to check every minute for channels that need a standup report
    botRunners = require('./runners');
    schedule.scheduleJob('* * * * 1-5', botRunners.getReportsRunner(controller));
    schedule.scheduleJob('* * * * 1-5', botRunners.getRemindersRunner(controller));
    // schedule.scheduleJob('* * * * 1-5', bot.getReminderRunner(bot));
    log.verbose('All bot jobs scheduled :D');

    // This captures and evaluates any message sent to the bot as a DM
    // or sent to the bot in the form "@bot message" and passes it to
    // Botkit Studio to evaluate for trigger words and patterns.
    // If a trigger is matched, the conversation will automatically fire!
    // You can tie into the execution of the script using the functions
    // controller.studio.before, controller.studio.after and controller.studio.validate
    if (process.env.BOTKIT_STUDIO_TOKEN) {
      controller.on('direct_message,direct_mention,mention', (bot, message) => {
        controller.studio.runTrigger(bot, message.text, message.user, message.channel, message).then((convo) => {
          if (!convo) {
            // no trigger was matched
            // If you want your bot to respond to every message,
            // define a 'fallback' script in Botkit Studio
            // and uncomment the line below.
            controller.studio.run(bot, 'fallback', message.user, message.channel);
          } else {
            // set variables here that are needed for EVERY script
            // use controller.studio.before('script') to set variables specific to a script
            convo.setVar('current_time', new Date());
          }
        }).catch((err) => {
          bot.reply(message, `I experienced an error with a request to Botkit Studio: ${err}`);
          // debug('Botkit Studio: ', err);
          log.error(err);
        });
      });
    } else {
      console.log('~~~~~~~~~~');
      console.log('NOTE: Botkit Studio functionality has not been enabled');
      console.log('To enable, pass in a studio_token parameter with a token from https://studio.botkit.ai/');
    }
  }
}

function usage_tip() {
  console.log('~~~~~~~~~~');
  console.log('Stand Up Steve is HERE, but not working yo!');
  console.log('Check your .env vars');
  console.log('~~~~~~~~~~');
}
