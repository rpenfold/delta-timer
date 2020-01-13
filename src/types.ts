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
  // unix timestamp of when to invoke the event
  time: number;
  // function executed when the event is invoked
  execute(): void;
  // config for when to repeat event
  repeat?: RepeatConfig;
  // Whether the event can be serialized
  serialize?: boolean;
}
