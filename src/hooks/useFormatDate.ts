import { format, fromUnixTime } from "date-fns";

export const formatDate = (date: number) => {
  const jsDate = fromUnixTime(date);
  return format(jsDate, "MMMM, dd yyyy");
};
