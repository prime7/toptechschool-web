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
  } else if (date.includes('-')) {
    const [yearStr, monthStr] = date.split('-');
    year = parseInt(yearStr, 10);
    month = parseInt(monthStr, 10) - 1; 
  } else {
    const d = new Date(date);
    year = d.getFullYear();
    month = d.getMonth();
  }
  
  // Use abbreviated month names
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
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