/**
 * Formats a date string into a human-readable relative time format
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

/**
 * Formats a date string into a short localized date format
 */
export function formatShortDate(dateString: string, locale?: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale);
}

/**
 * Formats a date string into a full date and time format
 */
export function formatDateTime(dateString: string, locale?: string): string {
  const date = new Date(dateString);
  return date.toLocaleString(locale);
}

/**
 * Converts Java Duration string to number of days
 */

