/*
 * Copyright (c) 2020 Convergence Labs, Inc.
 *
 * This file is part of the Convergence Chat Demo, which is released under
 * the terms of the MIT License. A copy of the MIT should have been provided
 * along with this file, typically located in the "LICENSE" file, which is part
 * of this source code package. Alternatively, see
 * <https://opensource.org/licenses/MIT> for the full text of theMIT license,
 *  if it was not provided.
 */

export interface CancelableRateLimitedFunction<T> {
  callback: T;
  cancel(): void;
}

export function eventsPerSecondToMillisecondInterval(eventsPerSecond: number): number {
  return 1000 / eventsPerSecond;
}

export function rateLimit<T extends (...args: any[]) => any>(this: any,
                                                             callback: T,
                                                             minIntervalMs: number): T {
  return rateLimitWithCancel(callback, minIntervalMs).callback;
}

export function rateLimitWithCancel<T extends (...args: any[]) => any>(
  this: any, callback: T, minIntervalMs: number): CancelableRateLimitedFunction<T> {

  let lastEventTime: number = 0;
  let finalEventTimerId: any = null;
  const context: any = this;

  const func = function () {
    const args = arguments as any as any[];
    const time = Date.now();
    const delta = time - lastEventTime;

    if (delta > minIntervalMs) {
      lastEventTime = time;
      callback.apply(context, args);
    } else {
      if (finalEventTimerId) {
        clearTimeout(finalEventTimerId);
        finalEventTimerId = null;
      }
      finalEventTimerId = setTimeout(function () {
        callback.apply(context, args);
      }, minIntervalMs - delta);
    }
  } as T;

  return {
    callback: func,
    cancel: () => {
      clearTimeout(finalEventTimerId);
    }
  }
}
