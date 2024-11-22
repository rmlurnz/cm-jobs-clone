export const pubsub = {
  events: {},
  subscribe: function (eventName, fn) {
    // add to / update event list
    // console.log(`SUBSCRIBED ${eventName}`);
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },
  publish: function (eventName, data) {
    // announce to subs
    // console.log(`BROADCASTING ${eventName} with ${data}`);
    if (this.events[eventName]) {
      this.events[eventName].forEach((f) => {
        f(data);
      });
    }
  },
};
