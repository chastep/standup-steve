# Skillz

## Creating or rescheduling a standup

To create a new standup or reschedule one, first ensure that the bot is in the channel that the standup is for.  Then say:

`@Standup Steve schedule standup for 10am`

Additionally, you can schedule the standups for just certain days of the week:

`@Standup Steve schedule standup for 10am M W F`

Some things to note:

- The standup bot can only work in public channels
- All times are assumed to be in Eastern time
- The time indicates what time the bot will report
- Days of the week are accepted as:
  - M, Mo, Monday
  - T, Tu, Tuesday
  - W, We, Wednesday
  - Th, Thursday
  - F, Fr, Friday
- You can also say "create" or "move" instead of "schedule"

## Setting a standup reminder

Once a standup is scheduled in a channel, you can have it notify the channel some time before the report to remind folks to submit their standups.  To do that, in the channel, say:

`@Standup Steve reminder 10`

This will schedule a reminder for 10 minutes prior to the report.

- The time is always in minutes
- The channel must already have a scheduled standup
- You can also say "remind" instead of "reminder"

## Deleting a standup

To remove a standup and stop reporting on it, in the channel, say:

`@Standup Steve remove standup`

- There is no confirmation, so be sure!
- User standups that have already been recorded will not be deleted
- You can say "delete" instead of "remove"

## Interacting with the bot

Many interactions with the bot are triggered by mentioning the bot by name (i.e. `@Standup Steve`). Sometimes mentioning the bot in the channel is simplistic since you don't have to tell the bot what channel you're talking about.

## Standup info

To find out when the standup is scheduled for a channel, from that channel, say:

`@Standup Steve when`

The bot will let you know if there's not a standup scheduled yet.

## Submit your standup

The currently way to submit a standup is through the emoji response process. A reminder will be sent out to the channel at a set time before the actual standup. You can add an emoji response to one of the bot's reminder messages or any other messages to trigger the interview process.

During the interview, the bot will ask you a series of questions. If you want to skip a question, just respond to it with `skip`. You can also abandon your standup at any time by responding with `exit`.

## Editing your standup

To edit an existing standup you can run the interview again by adding another emoji reaction to a bot's message (if you're happy with certain sections, you can `skip` them to keep them the same).

## Get help

The bot can provide a quick reference to using it.  To trigger the bot's in-Slack help, just say `help` in a DM.
