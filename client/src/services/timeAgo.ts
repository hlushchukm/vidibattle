import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);
const ta = new TimeAgo("en-US");

export default function timeAgo(dateStr: string) {
  const date = Date.parse(dateStr);
  return date ? ta.format(date) : "";
}
