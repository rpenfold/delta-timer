import { TimerEvent, RepeatConfig } from "./types";
import { now, calculateRepeatTime, MILLIS_IN_MINUTE } from "./utils";
import EventQueue from "./EventQueue";

interface DeltaTimerInterface {
  checkIsRunning(): boolean;
  clear(): void;
  schedule(
    execute: Function,
    time: number,
    repeat?: RepeatConfig
  ): DeltaTimerScheduleResult;
  stop(): void;
  start(): void;
}

interface DeltaTimerScheduleResult {
  cancel(): void;
}

class DeltaTimer implements DeltaTimerInterface {
  private queue: EventQueue;
  private timeout?: number;
  private pollingFrequency: number;
  private isRunning: boolean;

  constructor(pollingFrequency?: number) {
    this.pollingFrequency = pollingFrequency || MILLIS_IN_MINUTE;
    this.queue = new EventQueue();
    this.isRunning = true;
  }

  /**
   * Processed the next event in the event stack. If there are no events to be
   * invoked within the current polling period it will trigger another polling
   * period. If there is an event to invoke it will queue it up.
   */
  private processNextEvent(): void {
    const nextEvent = this.queue.getNextEvent();

    if (!nextEvent) {
      // Nothing to execute; sleep until an event is queued up
      clearTimeout(this.timeout);
      return;
    }

    const time = nextEvent[0].time;
    const delta = time - now();

    if (delta > this.pollingFrequency) {
      // Next event is beyond polling frequency; poll again
      setTimeout(this.processNextEvent, this.pollingFrequency);
    } else {
      // Prepare to execute upcoming event
      this.timeout = setTimeout(() => {
        nextEvent.forEach(this.executeEvent);
        this.queue.deleteEventsAtTime(time);
        this.processNextEvent();
      }, delta);
    }
  }

  /**
   * Executes event and creates next iteration if repeat is configured on event
   */
  private executeEvent = (event: TimerEvent): void => {
    const { execute, repeat } = event;
    execute();

    if (repeat) {
      // Create event for next iteration
      const nextTimestamp = calculateRepeatTime(repeat);
      this.schedule(execute, nextTimestamp, repeat);
    }
  };

  public checkIsRunning = (): boolean => this.isRunning;

  public clear = (): void => {
    this.queue.clear();
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  };

  /**
   * Schedules an event in the event queue.
   */
  public schedule = (
    execute: Function,
    time: number,
    repeat?: RepeatConfig
  ): DeltaTimerScheduleResult => {
    const result = this.queue.insertEvent(time, { time, execute, repeat });

    const { cancel, isNextEvent, timeUntil } = result;

    if (isNextEvent) {
      // stop current timeout
      clearTimeout(this.timeout);
      // set new timeout
      const delta =
        timeUntil > this.pollingFrequency ? this.pollingFrequency : timeUntil;
      setTimeout(this.processNextEvent, delta);
    }

    return {
      cancel
    };
  };

  public start = (): void => {
    if (this.isRunning) return;

    // Delete all events that should have occured while the timer
    // was stopped. TODO: should add config to execute all "waiting"
    // events from when timer was stopped
    this.queue.cleanup();
    this.processNextEvent();
  };

  public stop = (): void => {
    if (!this.isRunning) return;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  };
}

export default DeltaTimer;
