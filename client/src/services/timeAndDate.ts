import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);
const ta = new TimeAgo("en-US");

export default function timeAgo(dateStr: string): string {
  const date = Date.parse(dateStr);
  return date ? ta.format(date) : "";
}

export function getDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (!date) return "";

  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  return formattedDate;
}

export function getTime(dateStr: string) {
  const date = new Date(dateStr);
  let formattedTime = date.toLocaleTimeString().replace(/:\d{2}\s/, " ");
  return formattedTime;
}

export function getDateAndTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (!date) return "";

  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  const formattedTime = date.toLocaleTimeString().replace(/:\d{2}\s/, " ");

  return formattedDate + " " + formattedTime;
}
