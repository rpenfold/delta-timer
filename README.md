# Delta Timer

Delta-timer is a lightweight tool for scheduling events that are executed via a single timeout at a time. It polls for events at a specified interval, and queues them up if the interval is less than the polling frequency. This is useful in evironments like react-native Android where you cannot set long running timers. Instead you can schedule an event to be executed at a specified time and the delta timer will only use short timers.

## Repeat Events

To schedule an event that repeats you just need to pass in the repeat configuration when scheduling. This is useful for things like checking for app updates, or saving changes at a regular interval. The following is an example of how to schedule a repeating event:

```javascript
const repeatConfig = {
  unit: "minutes", // milliseconds|seconds|minutes|hours|days
  amount: 10
};

deltaTimer.schedule(callback, timestamp, repeatConfig);
```

## Cancelling a Scheduled Event

There may be times that you need to cancel a scheduled event. For instance, if you are relying on delta-timer to update state in a react component, you will want to cancel the event when unmounting the component. The result from the schedule method returns an object containing a cancel callback. See below:

```javascript
componentWillUnmount() {
    this.scheduledEvent.cancel();
}

onClick() {
    this.scheduledEvent = deltaTimer.schedule(...);
}
```
