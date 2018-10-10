# Standup Steve

Let's face it, we have all been there, do you ever feel, etc. These are all great ways to start an informercial...which is what I'm going to do RIGHT NOW! 

***bursts through stage door wearing business causal blue button up, khaki dockers, brown loafers, and headset microphone (all bought from Costco)***

HI, I'M CHASTEP "COMMERCIAL" GUY HERE TODAY TO TELL YOU ABOUT AN AMAZING NEW PRODUCT BEING BUILT CALLED STANDUP STEVE!!! 

Let's face it, writing out standup in slack everyday when you aren't present is tedious and time consuming. We could all spend our time in a more constructive and productive way (i.e. actually doing **HARDCORE** development work and "putting the development team on our backs" so to speak). We have all been there, feeling the morning drudge of typing WORDS that form SENTENCES into slack with some sweet `:slack:` and `:standup:` emojis attached to indicate we are in pajamas working from home. NO MORE I SAY. NO MORE MINDLESS MORNING UPDATES TO INDICATE OUR DAILY WORK.

What if I told you there is an amazing new product on its way that will help the entire team (1) automate this daily task, (2) compile and report all user standups, and (3) change the way you perform your professional duties as you know it? What can this amazing product do for YOU? Well, let me welcome to the stage STANDUP STEVE who will tell you about its amazing basic feature set! *(cue roar from audience and studio recorded clapping)*

**HIYA FOLKS, IM STANDUP STEVE. LET ME TELL YAH A BIT ABOUT MYSELF**

## Getting Started

### Botkit
[Botkit](https://botkit.ai/getstarted.html) and its necessary dependencies were installed. [Botkit Slack startup](https://botkit.ai/docs/readme-slack.html#getting-started) was used to wip up a baseline slackbot application. Initial development revolved around getting accustomed to Botkit configuration options. Opted to _NOT_ do an in-depth integration of the [Botkit Studio](https://studio.botkit.ai/signup?code=slackglitch) API so focus of project could be on personal development. Additional Botkit functionality can be found below in the [Botkit Basics](#botkit-basics) section.

### MongoDB
Decided to use MongoDB to mix it up a bit honestly. Botkit also had a nifty [MongoDB storage module](https://github.com/howdyai/botkit-storage-mongo) that is extremely useful. It nicely integrates with Heroku and Heroku's [mLab](https://www.mlab.com/) [connection resource](https://elements.heroku.com/addons/mongolab). This connection helped with local development along with proof-of-concept deployment/hosting on Heroku.

### Local Setup/Development
* Clone this repo
* Copy the `.env.example` and setup the necessary `.env` vars:
  * Follow the [MongoDB install docs](https://docs.mongodb.com/manual/installation/) for `PORT` var.
  * To set `LOG_LEVEL` refer to the [logger readme](https://github.com/erdc-itl/node-logger#readme)
  * `TIMEZONE`? - [here](https://momentjs.com/timezone/docs/)
  * `SLACK_TOKEN` setup can be found in the [Slack documentation](https://api.slack.com/bot-users#creating-bot-user)
* Setup and connect to local MongoDB database. This will be a manual process:
  * Run mongo db locally - `mongod` [process](https://docs.mongodb.com/manual/reference/program/mongod/)
  * Open another terminal window and run `mongo` command to access the mongo shell [commands](https://docs.mongodb.com/manual/mongo/)
  * Create a new DB - `use {new database name}` and use name `MONGODB_URI` var
* Startup local db instance - `monogod`
* Start bot - `npm start` or `npm reload-start` or `node bot.js` or `nodemon bot.js`
  * I recomend using `npm reload-start` or `nodemon bot.js` during local development so changes are reloaded in real time.
* Have fun in Slack talking to Standup Steve

### Development Basics
* [Node](https://nodejs.org/en/) - v10.3.0
* [npm](https://www.npmjs.com/) - 6.3.0
* [Botkit](https://github.com/howdyai/botkit) - ^0.6.16
* [Mongodb](https://www.mongodb.com/) - ^3.1.1


## Botkit Basics

### What's Included
* [Botkit core](https://github.com/howdyai/botkit/blob/master/docs/readme.md#developing-with-botkit) - a complete programming system for building conversational software
* [Botkit Studio API](https://github.com/howdyai/botkit/blob/master/docs/readme-studio.md#function-index) - additional APIs that extend Botkit with powerful tools and APIs
* [Pre-configured Express.js webserver](https://expressjs.com/) including:
   * A customizable "Install my Bot" homepage
   * Login and oauth endpoints that allow teams to install your bot
   * Webhook endpoints for communicating with platforms
* Sample skill modules that demonstrate various features of Botkit
* A customizable onboarding experience for new teams powered by Botkit Studio

### Getting Started

There are a myriad of methods you can use to set up an application on Slack, here are some of your options:

#### Set up your Slack Application 
Once you have setup your Botkit development enviroment, the next thing you will want to do is set up a new Slack application via the [Slack developer portal](https://api.slack.com/). This is a multi-step process, but only takes a few minutes. 

* [Read this step-by-step guide](https://github.com/howdyai/botkit/blob/master/docs/slack-events-api.md) to make sure everything is set up. 

* We also have this [handy video walkthrough](https://youtu.be/us2zdf0vRz0) for setting up this project with Glitch.

Next, get a Botkit Studio token [from your Botkit developer account](https://studio.botkit.ai/) if you have decided to use Studio. 

Update the `.env` file with your newly acquired tokens.

Launch your bot application by typing:

`node .`

Now, visit your new bot's login page: http://localhost:3000/login

Now comes the fun part of [making your bot!](https://github.com/howdyai/botkit/blob/master/docs/readme.md#basic-usage)

#### Customize Storage

By default, the starter kit uses a simple file-system based storage mechanism to record information about the teams and users that interact with the bot. While this is fine for development, or use by a single team, most developers will want to customize the code to use a real database system.

There are [Botkit plugins for all the major database systems](https://github.com/howdyai/botkit/blob/master/docs/readme-middlewares.md#storage-modules) which can be enabled with just a few lines of code.

We have enabled our [Mongo middleware]() for starters in this project. To use your own Mongo database, just fill out `MONGO_URI` in your `.env` file with the appropriate information. For tips on reading and writing to storage, [check out these medium posts](https://botkit.groovehq.com/knowledge_base/categories/build-a-bot)

#### About Botkit

Botkit is a product of [Howdy](https://howdy.ai) and made in Austin, TX with the help of a worldwide community of botheads.


