import moment from 'moment';

// shorthand keys - https://momentjs.com/docs/#/manipulating/add/
// 'ms' must be before 'm' or the regexp matching ignores 'ms'
const momentKeys = [
  'ms',
  'milliseconds',
  's',
  'seconds',
  'm',
  'minutes',
  'h',
  'hours',
  'd',
  'days',
  'w',
  'weeks',
  'M',
  'months',
  'Q',
  'quarters',
  'y',
  'years',
];
const modPartRegexp = `([-+]?\\d+(?:${momentKeys.join('|')}))`;
const modDateRegexp = new RegExp(`${modPartRegexp}`, 'g');
const modDatePeriod = /[a-zA-Z]+/g;

/**
 * Manipulate date
 * If passed in a modify date pattern, e.g. `{+1y-3M}`, it will return a date
 * modified from the start of the current day, e.g. if today is 2020-12-15 and
 * this function is passed in `{+10d}` it will return `2020-12-25`
 * Accepted shorthand dates (see https://momentjs.com/docs/#/manipulating/add/):
 * - y = years
 * - Q = quarters
 * - M = months
 * - w = weeks
 * - d = days
 * - h = hours
 * - m = minutes
 * - s = seconds
 * - ms = milliseconds
 *
 * @param {String} date - modify date pattern or plain date to be returned
 * @param {String} formatTemplate - date format template. Default = 'YYYY-MM-DD';
 *   see https://momentjs.com/docs/#/displaying/format/
 */
const manipulateDate = (date, formatTemplate = 'YYYY-MM-DD') => {
  const modDate = moment().startOf('day');

  modDateRegexp.lastIndex = 0; // reset index
  let mod = modDateRegexp.exec(date || '')?.[0];

  // test & remove unneeded full match
  if (mod) {
    while (mod) {
      const time = parseFloat(mod);
      const period = mod.match(modDatePeriod);
      if (time && period?.length) {
        modDate.add(time, period[0]);
      }
      mod = modDateRegexp.exec(date || '')?.[0];
    }
    return modDate.format(formatTemplate);
  }
  return date;
};

export default manipulateDate;
