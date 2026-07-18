export const formatMonthYear = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);

  if (isNaN(date)) return dateString;

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${year}`;
}