import { TimerEvent } from "./types";
import { now } from "./utils";

interface EventQueueInsertResult {
  cancel(): void;
  isNextEvent: boolean;
  timeUntil: number;
}

interface EventQueueInterface {
  clear(): void;
  cleanup(): void;
  deleteEventsAtTime(time: number): void;
  getNextEventTime(): number;
  getNextEvent(): Array<TimerEvent>;
  insertEvent(time: number, event: TimerEvent): EventQueueInsertResult;
}

class EventQueue implements EventQueueInterface {
  // uses an object because keys are always sorted ascending
  private queue: object;

  clear = (): void => {
    this.queue = {};
  };

  cleanup = (): void => {
    const currentTime = now();

    for (const time of Object.keys(this.queue)) {
      const _time = Number(time);

      if (_time < currentTime) {
        this.deleteEventsAtTime(_time);
      } else break;
    }
  };

  insertEvent = (time: number, event: TimerEvent): EventQueueInsertResult => {
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
      cancel: (): void => this.deleteEvent(time, queuedEvents.length - 1),
      isNextEvent: time === this.getNextEventTime(),
      timeUntil: time - currentTime
    };
  };

  private deleteEvent = (time: number, index: number): void => {
    if (!this.queue[time]) return;

    if (this.queue[time].length === 1) {
      delete this.queue[time];
      return
    }
    
    this.queue[time].splice(index, 1);
  }

  deleteEventsAtTime = (time: number): void => {
    delete this.queue[time];
  };

  getNextEvent = (): Array<TimerEvent> =>
    this.queue[Object.keys(this.queue)[0]];

  getNextEventTime = (): number => 
    Number(Object.keys(this.queue)[0]);
}

export default EventQueue;
