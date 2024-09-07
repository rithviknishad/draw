import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T extends unknown[], U>(
  callback: (...args: T) => PromiseLike<U> | U,
  wait: number
) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: T): Promise<U> => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(callback(...args)), wait);
    });
  };
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * `true` if device is an Apple device, else `false`
 */
export const isAppleDevice = (() => {
  if (navigator.platform.includes("Mac")) return true;
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
})();

export function timeAgo(time: Date) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = new Date().getTime() - time.getTime();

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + " seconds ago";
  }
  if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " mins ago";
  }
  if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  }
  if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + " days ago";
  }
  if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + " months ago";
  }
  return Math.round(elapsed / msPerYear) + " years ago";
}
