/**
 * Date Formatting Utilities —— 中文日期格式
 */

export interface DateFormatOptions {
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
  locale?: string;
}

function toDate(date: string | Date | number): Date {
  return typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;
}

/**
 * Format a date to a readable string（统一输出中文长格式）
 */
export function formatDate(
  date: string | Date | number,
  _options: DateFormatOptions = {}
): string {
  return formatDateLong(date);
}

/**
 * 短格式：2018年4月19日
 */
export function formatDateShort(date: string | Date | number): string {
  const d = toDate(date);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

/**
 * 长格式：2018年4月19日
 */
export function formatDateLong(date: string | Date | number): string {
  return formatDateShort(date);
}
