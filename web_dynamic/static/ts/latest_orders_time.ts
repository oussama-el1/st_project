/**
 * Formats a timestamp into a human-readable time ago string.
 * 
 * The function takes a string representation of a timestamp as input, and
 * returns a string describing the time elapsed since the given timestamp.
 * The string will be in the format of "X time ago", where X is the number of
 * minutes/hours/days, and time is the appropriate plural form of the unit of
 * time.
 * 
 * If the time elapsed is less than a minute, the string will be "now". If
 * the time elapsed is less than an hour, the string will be in the format
 * of "X minute(s) ago". If the time elapsed is less than a day, the string
 * will be in the format of "X hour(s) ago". For all other cases, the
 * function will return the timestamp as a string in ISO format.
 * 
 * @param {string} timestamp - A string representation of a timestamp.
 * @returns {string} A string describing the time elapsed since the given
 * timestamp.
 */
function formatTimeAgo(timestamp: string): string {
    const now = new Date();
    const createdAt = new Date(timestamp);

    if (isNaN(createdAt.getTime())) {
        return 'Invalid date';
    }

    const diff = now.getTime() - createdAt.getTime();

    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;

    if (diff < minute) {
        return 'now';
    } else if (diff < hour) {
        const minutesAgo = Math.floor(diff / minute);
        return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    } else if (diff < day) {
        const hoursAgo = Math.floor(diff / hour);
        return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    } else {
        const daysAgo = Math.floor(diff / day);
        return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    }
}

function refreshTime() {
    const latestOrders = document.querySelectorAll('.hex');
    latestOrders.forEach((value, _key, _parent) => {
        const order = value as HTMLElement;
        const timestamp = order.getAttribute('data-timestamp');
        if (timestamp) {
            console.log(timestamp)
            const formattedTime = formatTimeAgo(timestamp);
            order.innerText = formattedTime;
        }
    });
}

setInterval(refreshTime, 60000); // 60000 milliseconds = 1 minute

refreshTime();
