import EventQueue from "../EventQueue";
import * as utils from "../utils";
import { TimerEvent } from "../types";

Date.now = jest.fn(() => 1579143666468);

const createEvent = (time: number): TimerEvent => ({
  id: "",
  time,
  execute: jest.fn()
});

describe("EventQueue", () => {
  let queue: EventQueue;
  const now = utils.now();
  const time1 = now - 1;
  const time2 = now + 2;

  beforeEach(() => {
    queue = new EventQueue({
      [time1]: [{ time: time1 }, { time: time1 }],
      [time2]: [{ time: time2 }]
    });
  });

  describe("clear", () => {
    it("no events after clearing", () => {
      queue.clear();
      const timestamps = Object.keys(queue.getEvents());
      expect(timestamps.length).toEqual(0);
    });
  });

  describe("cleanup", () => {
    it("removes past events", () => {
      queue.cleanup();
      expect(queue.getEvents()[time1]).toBeUndefined();
    });
  });

  describe("insertEvent", () => {
    it("does not insert if specified time has already passed", () => {
      console.warn = jest.fn();
      const time = now - 1;
      const result = queue.insertEvent(time, createEvent(time));
      expect(result).toBeUndefined();
      expect(console.warn).toBeCalled();
    });

    it("works correctly when no other items are scheduled for specified time", () => {
      const time = now + 3;
      queue.insertEvent(time, createEvent(time));
      const events = queue.getEvents();
      expect(events[time].length).toEqual(1);
    });

    it("works correctly when there are other items scheduled for specified time", () => {
      const time = time2;
      const eventsCount = queue.getEvents()[time]?.length || 0;
      queue.insertEvent(time, createEvent(time));
      const events = queue.getEvents();
      expect(events[time].length).toEqual(eventsCount + 1);
    });

    // TODO: test that return object calculates correctly
  });

  describe("getEvents", () => {
    it("gets the scheduled events", () => {
      expect(queue.getEvents()).toEqual({
        [time1]: [{ time: time1 }, { time: time1 }],
        [time2]: [{ time: time2 }]
      });
    });
  });

  describe("getNextEvent", () => {
    it("gets the next scheduled event", () => {
      const event = queue.getNextEvent();
      expect(event).toEqual({ time: time2 });
    });

    it("returns null if no next event", () => {
      queue.clear();
      expect(queue.getNextEvent()).toBeNull();
    });
  });

  describe("getNextEventTime", () => {
    it("gets the time of the next scheduled event", () => {
      expect(queue.getNextEventTime()).toEqual(time2);
    });

    it("returns null if no next event", () => {
      queue.clear();
      expect(queue.getNextEventTime()).toBeNull();
    });
  });
});
