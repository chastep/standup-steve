const moment = require('moment-timezone');
const timezone = process.env.TIMEZONE || 'America/Chicago';

function getTimeFromString(str) {
  var time = str.match(/((\d+|:)*(\s)?((a|p)m)|\d{4})/gi);
  var daysPortion = str.replace(time, '').trim();
  var daysOfTheWeek = [
                        { regex: 'm(o|onday)?', day: 'Monday' },
                        { regex: 't(u|uesday)?', day: 'Tuesday' },
                        { regex: 'w(e|ednesday)?', day: 'Wednesday' },
                        { regex: 'th(ursday)?', day: 'Thursday' },
                        { regex: 'f(r|riday)?', day: 'Friday' }
                      ]
  var weekendDays = [
                      { regex: 'sa(t|urday)?', day: 'Saturday' },
                      { regex: 'su(n|day)?', day: 'Sunday' }
                    ]

  if(time) {
    // Assume incoming strings are in the standard timezone
    time = moment.tz(time[0], ['h:mm a','hmm a','hmma','HHmm','hha','hh a'], timezone);

    var output = {
      time,
      days: [ ]
    };

    if(time.isValid()) {
      var gotOneDay = false;

      var days = [];
      process.env.WEEKEND_DEV ? days = weekendDays : days = daysOfTheWeek;

      days.forEach(function(d) {
        if((new RegExp(`(^|\\s)${d.regex}($|\\s)`, 'i')).test(daysPortion)) {
          output.days.push(d.day);
          gotOneDay = true;
        }
      });

      if(!gotOneDay && !process.env.WEEKEND_DEV) {
        output.days = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' ];
      } else if (!gotOneDay && process.env.WEEKEND_DEV) {
        output.days = [ 'Saturday', 'Sunday' ];
      }

      return output;
    }
  }
  return false;
}

function getScheduleFormat(time) {
  if(!time) {
    time = moment.tz(timezone);
  }
  return moment(time).format('HHmm');
}

function getScheduleDay() {
  return moment().format('dddd').toLowerCase();
}

function getReportFormat(time) {
  if(!time) {
    time = moment();
  }
  return moment.tz(time, timezone).format('YYYY-MM-DD');
}

function getDisplayFormat(time) {
  if(!time) {
    time = moment();
  }

  // For cases where the time is coming directly
  // from the database, it'll be a number.
  if(typeof time === 'number') {
    // Time has to be 4 digits for moment
    // to parse it properly, but a number
    // won't have leading zeroes. Stringify
    // and prepend zeroes as necessary.
    var time = String(time);
    while(time.length < 4) {
      time = '0' + time;
    }
  }

  // Display in the standard timezone
  return moment.tz(time, 'HHmm', timezone).format('h:mm a z');
}

function getDisplayFormatForDaysOfChannel(dow) {
  const days = []
  if (process.env.WEEKEND_DEV) {
    const dow = ['Saturday','Sunday'];
  } else {
    const dow = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
  }
  dow.forEach(function (day) {
    if (channel.get(day.toLowerCase())) {
      days.push(day);
    }
  })
  return getDisplayFormatForDays(days)
}

function getDisplayFormatForDays(days) {
  if(days.length === 5) {
    return 'all weekdays';
  } else if (process.env.WEEKEND_DEV && days.length === 2) {
    return 'both weekend days'
  } else if (days.length <= 1) {
    return days[0] || 'no days';
  }

  const last = days[days.length - 1];
  const rest = days.slice(0, days.length - 1);

  return rest.join(', ') + ' and ' + last;
}

function getCurrentDate () {
  return moment.tz(timezone).format('YYYY-MM-DD');
}

function getCurrentReportDate () {
  return moment.tz(timezone).format('dddd, MMM Do YYYY, h:mma z')
}

function getReminderFormat (time, minutes) {
  if (minutes === null) {
    return null;
  }
  time = String(time);
  while(time.length < 4) {
    time = '0' + time;
  }
  return moment(time,'HHmm').subtract(minutes, 'minutes').format('HHmm');
}

function datesAreSameDay(date1, date2) {
  return getReportFormat(date1) === getReportFormat(date2);
}

module.exports = {
  getTimeFromString,
  getScheduleFormat,
  getScheduleDay,
  getDisplayFormat,
  getDisplayFormatForDays,
  getDisplayFormatForDaysOfChannel,
  getReportFormat,
  getCurrentDate,
  getCurrentReportDate,
  getReminderFormat,
  datesAreSameDay,
};
