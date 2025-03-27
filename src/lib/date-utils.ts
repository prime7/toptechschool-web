/**
 * Format a date to a human-readable string (Month Year)
 */
export function formatDate(date: Date | string | null): string {
  if (!date) return "";
  
  // Handle Date objects and string dates properly
  let year, month;
  
  if (date instanceof Date) {
    year = date.getFullYear();
    month = date.getMonth();
  } else {
    // If it's an ISO string (from database), parse it properly
    const d = new Date(date);
    year = d.getFullYear();
    month = d.getMonth();
  }
  
  // Get month name using a reliable approach
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return `${monthNames[month]} ${year}`;
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
  
  let year, month;
  
  if (date instanceof Date) {
    year = date.getFullYear();
    month = date.getMonth() + 1; // JavaScript months are 0-indexed
  } else {
    const d = new Date(date);
    year = d.getFullYear();
    month = d.getMonth() + 1;
  }
  
  // Ensure month is padded with leading zero if needed
  const monthStr = month < 10 ? `0${month}` : `${month}`;
  
  return `${year}-${monthStr}`;
} 