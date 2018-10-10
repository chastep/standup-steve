# Getting Started

## Development Basics

_Please note that these are just some of the required packages needed for Steve to work. Please refer to the `package.json` for more details:
* [Node](https://nodejs.org/en/) - v10.3.0
* [npm](https://www.npmjs.com/) - 6.3.0
* [Botkit](https://github.com/howdyai/botkit) - ^0.6.16
* [Mongodb](https://www.mongodb.com/) - ^3.1.1

## Local Setup/Development Instructions

* Clone this repo
```bash
git clone https://github.com/chastep/standup-steve
cd standup-steve
```

* Copy the `.env.example` and setup the necessary `.env` vars:
```bash
cp .env.example .env
```

The variables in use are:

Name         | Description
------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
SLACK_TOKEN  | Slack API token, generated when you created the bot integration on Slack.  This value is required.
MONGODB_URI  | The MongoDB connection URI for your standup-bot database.  Defaults to `mongodb://localhost:27017/{DATABASE_NAME}`.  The specified database must already exist, but it can be empty.
TIMEZONE     | The timezone for the bot to use, or defaults to `America/New_York`.  Timezone names must be [supported by moment-timezone](http://momentjs.com/timezone/docs/#/data-loading/getting-zone-names/).
LOG_LEVEL    | Numeric value indicating the log level.  10 is verbose, 20 is info, 30 is warning, and 40 is error-only.  Defaults to 10.

* Setup and connect to local MongoDB database. This will be a manual process:
  * Follow the [MongoDB install docs](https://docs.mongodb.com/manual/installation/) to get that fresh MongoDB going.
  * Run mongo db locally - `mongod` [process](https://docs.mongodb.com/manual/reference/program/mongod/)
  * Open another terminal window and run `mongo` command to access the mongo shell [commands](https://docs.mongodb.com/manual/mongo/)
  * Create a new DB - `use {new database name}` and use name `MONGODB_URI` var

## Running

* Start bot - `npm start` or `npm reload-start` or `node bot.js` or `nodemon bot.js`
  * I recomend using `npm reload-start` or `nodemon bot.js` during local development so changes are reloaded in real time.
* Have fun in Slack talking to Standup Steve!

## Disclaimers/Dependency Information

### Botkit
[Botkit](https://botkit.ai/getstarted.html) and its necessary dependencies were installed. [Botkit Slack startup](https://botkit.ai/docs/readme-slack.html#getting-started) was used to wip up a baseline slackbot application. Initial development revolved around getting accustomed to Botkit configuration options. Opted to _NOT_ do an in-depth integration of the [Botkit Studio](https://studio.botkit.ai/signup?code=slackglitch) API so focus of project could be on personal development. Additional Botkit functionality can be found below in the [Botkit Basics](docs/glossary.md) section.

### MongoDB
Decided to use MongoDB to mix it up a bit honestly. Botkit also had a nifty [MongoDB storage module](https://github.com/howdyai/botkit-storage-mongo) that is extremely useful. It nicely integrates with Heroku and Heroku's [mLab](https://www.mlab.com/) [connection resource](https://elements.heroku.com/addons/mongolab). This connection helped with local development along with proof-of-concept deployment/hosting on Heroku.

### Heroku Deployment
* [Heroku Node Project Deployment](https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app)
* I highly recomend using [mLab](https://www.mlab.com/) in tandum with Heroku, makes for easy visualation of data.

