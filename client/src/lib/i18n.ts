// Internationalization utilities for Angola-specific formatting
import { format, formatDistanceToNow as formatDistanceToNowFn } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

// Supported locales
export type Locale = 'pt-AO' | 'pt-BR' | 'en-US';

// Currency codes and their symbols
export const CURRENCIES = {
  'pt-AO': { code: 'AOA', symbol: 'Kz' },
  'pt-BR': { code: 'BRL', symbol: 'R$' },
  'en-US': { code: 'USD', symbol: '$' }
} as const;

// Date-fns locales mapping
const DATE_FNS_LOCALES = {
  'pt-AO': ptBR, // Use Portuguese Brazil as closest to Portuguese Angola
  'pt-BR': ptBR,
  'en-US': enUS
} as const;

// Timezone mapping
export const TIMEZONES = {
  'pt-AO': 'Africa/Luanda',
  'pt-BR': 'America/Sao_Paulo',
  'en-US': 'America/New_York'
} as const;

// Date format patterns
export const DATE_FORMATS = {
  'pt-AO': 'dd/MM/yyyy',
  'pt-BR': 'dd/MM/yyyy',
  'en-US': 'MM/dd/yyyy'
} as const;

export const DATETIME_FORMATS = {
  'pt-AO': 'dd/MM/yyyy HH:mm',
  'pt-BR': 'dd/MM/yyyy HH:mm',
  'en-US': 'MM/dd/yyyy h:mm a'
} as const;

// Language names and flags
export const LANGUAGE_INFO = {
  'pt-AO': {
    name: 'Português (Angola)',
    shortName: 'PT-AO',
    flag: '🇦🇴'
  },
  'pt-BR': {
    name: 'Português (Brasil)',
    shortName: 'PT-BR',
    flag: '🇧🇷'
  },
  'en-US': {
    name: 'English (US)',
    shortName: 'EN-US',
    flag: '🇺🇸'
  }
} as const;

/**
 * Format currency amount according to locale
 */
export function formatCurrency(
  amount: number,
  locale: Locale = 'pt-AO',
  options?: {
    showSymbol?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  const {
    showSymbol = true,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  } = options || {};

  const currency = CURRENCIES[locale];
  
  // Format the number according to locale
  const formattedNumber = amount.toLocaleString(locale === 'pt-AO' ? 'pt-PT' : locale, {
    minimumFractionDigits,
    maximumFractionDigits
  });

  if (!showSymbol) {
    return formattedNumber;
  }

  // For Angola, put symbol after the amount with space
  if (locale === 'pt-AO') {
    return `${formattedNumber} ${currency.symbol}`;
  }

  // For other locales, put symbol before
  return `${currency.symbol} ${formattedNumber}`;
}

/**
 * Format number according to locale
 */
export function formatNumber(
  num: number,
  locale: Locale = 'pt-AO',
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2
  } = options || {};

  return num.toLocaleString(locale === 'pt-AO' ? 'pt-PT' : locale, {
    minimumFractionDigits,
    maximumFractionDigits
  });
}

/**
 * Format date according to locale
 */
export function formatDate(
  date: Date | string,
  locale: Locale = 'pt-AO',
  formatPattern?: string
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const pattern = formatPattern || DATE_FORMATS[locale];
  
  return format(dateObj, pattern, {
    locale: DATE_FNS_LOCALES[locale]
  });
}

/**
 * Format datetime according to locale
 */
export function formatDateTime(
  date: Date | string,
  locale: Locale = 'pt-AO',
  formatPattern?: string
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const pattern = formatPattern || DATETIME_FORMATS[locale];
  
  return format(dateObj, pattern, {
    locale: DATE_FNS_LOCALES[locale]
  });
}

/**
 * Format relative time (e.g., "2 hours ago") according to locale
 */
export function formatDistanceToNow(
  date: Date | string,
  locale: Locale = 'pt-AO',
  options?: {
    addSuffix?: boolean;
  }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const { addSuffix = true } = options || {};
  
  return formatDistanceToNowFn(dateObj, {
    addSuffix,
    locale: DATE_FNS_LOCALES[locale]
  });
}

/**
 * Format time according to locale
 */
export function formatTime(
  date: Date | string,
  locale: Locale = 'pt-AO'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (locale === 'en-US') {
    return format(dateObj, 'h:mm a', { locale: DATE_FNS_LOCALES[locale] });
  }
  
  return format(dateObj, 'HH:mm', { locale: DATE_FNS_LOCALES[locale] });
}

/**
 * Get currency symbol for locale
 */
export function getCurrencySymbol(locale: Locale = 'pt-AO'): string {
  return CURRENCIES[locale].symbol;
}

/**
 * Get currency code for locale
 */
export function getCurrencyCode(locale: Locale = 'pt-AO'): string {
  return CURRENCIES[locale].code;
}

/**
 * Validate if locale is supported
 */
export function isValidLocale(locale: string): locale is Locale {
  return ['pt-AO', 'pt-BR', 'en-US'].includes(locale);
}

/**
 * Get default locale (Angola)
 */
export function getDefaultLocale(): Locale {
  return 'pt-AO';
}

/**
 * Parse currency string back to number
 */
export function parseCurrency(currencyString: string, locale: Locale = 'pt-AO'): number {
  // Remove currency symbols and spaces
  const cleanString = currencyString
    .replace(/[KzR$\s]/g, '')
    .replace(/\./g, '') // Remove thousands separators for pt locales
    .replace(/,/g, '.'); // Replace decimal comma with dot
  
  return parseFloat(cleanString) || 0;
}

/**
 * Format hours (e.g., for time tracking)
 */
export function formatHours(
  hours: number,
  locale: Locale = 'pt-AO',
  showLabel: boolean = true
): string {
  const formattedHours = formatNumber(hours, locale, { 
    minimumFractionDigits: 1,
    maximumFractionDigits: 1 
  });
  
  if (!showLabel) {
    return formattedHours;
  }
  
  const hourLabel = locale === 'en-US' ? 'h' : 'h';
  return `${formattedHours}${hourLabel}`;
}

/**
 * Format percentage according to locale
 */
export function formatPercentage(
  value: number,
  locale: Locale = 'pt-AO',
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 1
  } = options || {};

  const formattedNumber = formatNumber(value, locale, {
    minimumFractionDigits,
    maximumFractionDigits
  });

  return `${formattedNumber}%`;
}