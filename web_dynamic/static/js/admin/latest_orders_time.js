"use strict";
function formatTimeAgo(timestamp) {
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
    }
    else if (diff < hour) {
        const minutesAgo = Math.floor(diff / minute);
        return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    }
    else if (diff < day) {
        const hoursAgo = Math.floor(diff / hour);
        return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    }
    else {
        const daysAgo = Math.floor(diff / day);
        return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    }
}
function refreshTime() {
    const latestOrders = document.querySelectorAll('.hex');
    latestOrders.forEach((value, _key, _parent) => {
        const order = value;
        const timestamp = order.getAttribute('data-timestamp');
        if (timestamp) {
            console.log(timestamp);
            const formattedTime = formatTimeAgo(timestamp);
            order.innerText = formattedTime;
        }
    });
}
setInterval(refreshTime, 60000);
refreshTime();
