import { TimerEvent } from "./types";
import { now } from "./utils";

interface EventQueuePushResult {
  isNextEvent: boolean;
  timeUntil: number;
}

interface EventQueueInterface {
  clear(): void;
  cleanup(): void;
  deleteEventsAtTime(time: number): void;
  getNextEventTime(): number;
  getNextEvent(): Array<TimerEvent>;
  insertEvent(time: number, event: TimerEvent): EventQueuePushResult;
}

class EventQueue implements EventQueueInterface {
  // uses an object because keys are always sorted ascending
  private queue: object;

  clear = () => {
    this.queue = {};
  };

  cleanup = () => {
    const currentTime = now();

    for (const time of Object.keys(this.queue)) {
      const _time = Number(time);

      if (_time < currentTime) {
        this.deleteEventsAtTime(_time);
      } else break;
    }
  };

  insertEvent = (time: number, event: TimerEvent) => {
    const currentTime = now();

    if (time < currentTime) {
      console.warn("Cannot insert event into the past.");
      return;
    }

    const queuedEvents = this.queue[time];

    if (!queuedEvents) {
      queuedEvents[time] = [event];
    } else {
      queuedEvents.push(event);
    }

    return {
      isNextEvent: time === this.getNextEventTime(),
      timeUntil: time - currentTime
    };
  };

  deleteEventsAtTime = (time: number) => {
    delete this.queue[time];
  };

  getNextEvent = () => this.queue[Object.keys(this.queue)[0]];

  getNextEventTime = () => Number(Object.keys(this.queue)[0]);
}

export default EventQueue;
