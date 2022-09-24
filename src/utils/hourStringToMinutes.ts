export function hourStringToMinutes(hours: string) {
  const [hour, minute] = hours.split(":").map(Number);

  const minutesAmount = hour * 60 + minute;

  return minutesAmount;
}
