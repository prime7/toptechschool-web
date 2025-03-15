/**
 * Format a date to a human-readable string (Month Year)
 */
export function formatDate(date: Date | string | null): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Format a date range for display
 */
export function formatDateRange(startDate: Date | string | null, endDate: Date | string | null): string {
  if (!startDate) return "";
  return `${formatDate(startDate)} - ${endDate ? formatDate(endDate) : "Present"}`;
}

/**
 * Convert Date to YYYY-MM format for input[type="month"]
 */
export function dateToMonthString(date: Date | string | null): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().slice(0, 7);
} 