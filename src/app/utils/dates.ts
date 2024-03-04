type ArgumentTypes = Parameters<typeof Intl.DateTimeFormat>;

// TODO use a date library and display dates according to user locale
const getDateDisplay = (timestamp: string, withTime: boolean = false) => {
  if (!timestamp) {
    return 'N/A';
  }

  let options: ArgumentTypes[1];
  let timeStr = '';

  if (withTime) {
    options = { month: 'long', day: 'numeric' };
    timeStr = ` ${timestamp.slice(11, 16)}`;
  } else {
    options = { year: 'numeric', month: 'long', day: 'numeric' };
  }

  const date = new Date(timestamp);
  return `${new Intl.DateTimeFormat('en-GB', options).format(date)}${timeStr}`;
};

// https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
const timeSinceText = (timestamp: number) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ' years';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes';
  }
  return Math.floor(seconds) + ' seconds';
};

export { getDateDisplay, timeSinceText };