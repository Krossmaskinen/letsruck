let events = localStorage["events"];

events = events ? JSON.parse(events) : [];

export default events;