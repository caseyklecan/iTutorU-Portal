export function mergeCalendar(cal1, cal2) {
  var index = 0;
  var isInCal1 = [];
  for (var d in cal2) {
    isInCal1.push(false);
  }

  for (var date in cal1) {
    var key = Object.keys(cal1[date])[0];
    for (var d in cal2) {
      var key2 = Object.keys(cal2[d])[0];
      if (key2 == key) {
        isInCal1[d] = true;
        // we found 2 calendar days with sessions, so merge the sessions
        for (var item in cal2[d][key2].sessions) {
          cal1[date][key].sessions.push(cal2[d][key2].sessions[item]);
        }
        cal1[date][key].sessions.sort(timeComparator);
      }
    }
    index++;
  }

  // this loop adds the calendar items that are not in cal1 but are in cal2
  for (var d in cal2) {
    if (!isInCal1[d]) {
      var key = Object.keys(cal2[d])[0];
      cal1.push({[key]:cal2[d][key]});
    }
  }

  return cal1;
}

export function nextDays(dayIndex, numWeeks, title, timeString) {
  var sessions = [];
  var day = new Date();
  day.setDate(day.getDate() + 7);
  var toAdd = dayIndex - day.getDay();
  day.setDate(day.getDate() + toAdd);
  for (var i = 0; i < numWeeks; i++) {
    sessions.push(convertToDateFormat(day.getFullYear().toString() + "-" + (day.getMonth() + 1).toString() + "-" + day.getDate().toString()));
    day.setDate(day.getDate() + 7);
  }
  console.log(sessions);

  // now translate sessions into the data that the calendar needs
  var items = [];
  for (var i = 0; i < numWeeks; i++) {
    var item = { [sessions[i]] : {
      sessions: [{name: title, time: timeString}]
    }};
    items.push(item);
  }
  console.log(items);

  return items;
}

export function stringToIndex(weekday) {
  switch(weekday) {
    case 'Sun':
      return 0;
    case 'Mon':
      return 1;
    case 'Tues':
      return 2;
    case 'Wed':
      return 3;
    case 'Thurs':
      return 4;
    case 'Fri':
      return 5;
    case 'Sat':
      return 6;
  }
}

function timeComparator(s1, s2) {
  if (s1.time < s2.time) {
    return -1;
    }
    else return 1;
}

function convertToDateFormat(date) {
  if (date.length == 10) {
    return date;
  } else {
      var split = date.split("-");
      var year = split[0];
      var month = split[1];
      var day = split[2];
      if (month.length == 1) {
      month = "0" + month;
      }
      if (day.length == 1) {
      day = "0" + day;
      }
      
      date = year + "-" + month + "-" + day;
      return date;
    }
}
