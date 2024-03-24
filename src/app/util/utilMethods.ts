export function getCurrentMonthAndYear(): [string, string] {
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString();
  const currentYear = currentDate.getFullYear().toString();
  return [currentMonth, currentYear];
}
