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
  getEvents(): object;
  insertEvent(time: number, event: TimerEvent): EventQueueInsertResult;
}

class EventQueue implements EventQueueInterface {
  // uses an object because keys are always sorted ascending
  private events: object;
  // used to create a unique id for each event
  private currentEventId = 0;

  constructor(events: object = {}) {
    this.events = events;
  }

  clear = (): void => {
    this.events = {};
  };

  cleanup = (): void => {
    const currentTime = now();

    for (const time of Object.keys(this.events)) {
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

    event.id = `${this.currentEventId++}`;
    const queuedEvents = this.events[time];

    if (!queuedEvents) {
      this.events[time] = [event];
    } else {
      queuedEvents.push(event);
    }

    return {
      cancel: (): void => this.deleteEvent(time, event.id),
      isNextEvent: time === this.getNextEventTime(),
      timeUntil: time - currentTime
    };
  };

  private deleteEvent = (time: number, eventId: string): void => {
    if (!this.events[time]) return;

    if (this.events[time].length === 1 && this.events[time][0].id === eventId) {
      delete this.events[time];
      return;
    }

    const index = this.events[time].findIndex(
      (x: TimerEvent) => x.id === eventId
    );
    this.events[time].splice(index, 1);
  };

  deleteEventsAtTime = (time: number): void => {
    delete this.events[time];
  };

  getEvents = (): object => this.events;

  getNextEvent = (): Array<TimerEvent> => {
    const nextTime = this.getNextEventTime();

    return nextTime ? this.events[nextTime][0] : null;
  };

  getNextEventTime = (): number => {
    const _now = now();
    const times = Object.keys(this.events);
    const nextTime = times.find(x => Number(x) >= _now);

    return nextTime ? Number(nextTime) : null;
  };
}

export default EventQueue;
