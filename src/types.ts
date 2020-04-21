export enum TimeUnits {
  Milliseconds = "milliseconds",
  Seconds = "seconds",
  Minutes = "minutes",
  Hours = "hours",
  Days = "days"
}

export interface RepeatConfig {
  unit: TimeUnits;
  amount: number;
}

export interface TimerEvent {
  // unique identifier for referencing event. Set when event is scheduled
  id?: string;
  // unix timestamp of when to invoke the event
  time: number;
  // function executed when the event is invoked
  execute: Function;
  // config for when to repeat event
  repeat?: RepeatConfig;
}
