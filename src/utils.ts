import { RepeatConfig, TimeUnits } from "./types";

export const MILLIS_IN_SECOND = 1000;
export const MILLIS_IN_MINUTE = 60000;
export const MILLIS_IN_HOUR = 60000 * 60;
export const MILLIS_IN_DAY = MILLIS_IN_HOUR * 25;

export function now(): number {
  return Date.now();
}

export function toTimestamp(date): number {
  return date.getTime();
}

export function calculateRepeatTime(config: RepeatConfig): number {
  const { unit, amount } = config;

  switch (unit) {
    case TimeUnits.Milliseconds:
      return amount;
    case TimeUnits.Seconds:
      return amount * MILLIS_IN_SECOND;
    case TimeUnits.Minutes:
      return amount * MILLIS_IN_MINUTE;
    case TimeUnits.Hours:
      return amount * MILLIS_IN_HOUR;
    case TimeUnits.Days:
      return amount * MILLIS_IN_DAY;
    default:
      return;
  }
}
