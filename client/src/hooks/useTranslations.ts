import { useCallback } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { translations, getTranslation, type AllTranslationPaths } from '@/lib/translations';

/**
 * Hook for accessing translations with locale support
 * Integrates with the existing LocaleContext and provides easy access to translated strings
 */
export function useTranslations() {
  const { locale } = useLocale();

  /**
   * Get translation by path with support for interpolation
   * @param path - Dot-notation path to translation (e.g., 'common.save', 'auth.login.title')
   * @param params - Parameters for string interpolation (e.g., { count: 5 })
   * @returns Translated string
   */
  const t = useCallback((path: string, params?: Record<string, string | number>): string => {
    // For now, we only support pt-AO but the structure is ready for multiple locales
    let translatedText = getTranslation(path, translations);
    
    // If translation not found, return the path as fallback
    if (translatedText === path) {
      console.warn(`Translation not found for path: ${path}`);
      return path;
    }
    
    // Handle string interpolation if params provided
    if (params && typeof translatedText === 'string') {
      Object.entries(params).forEach(([key, value]) => {
        translatedText = translatedText.replace(new RegExp(`{${key}}`, 'g'), String(value));
      });
    }
    
    return translatedText;
  }, [locale]);

  /**
   * Get translation with type safety for known paths
   * @param path - Typed path to translation
   * @param params - Parameters for string interpolation
   * @returns Translated string
   */
  const tt = useCallback(<T extends AllTranslationPaths>(
    path: T, 
    params?: Record<string, string | number>
  ): string => {
    return t(path, params);
  }, [t]);

  /**
   * Get multiple translations at once
   * @param paths - Array of translation paths
   * @returns Object with paths as keys and translations as values
   */
  const tMultiple = useCallback((paths: string[]): Record<string, string> => {
    return paths.reduce((acc, path) => {
      acc[path] = t(path);
      return acc;
    }, {} as Record<string, string>);
  }, [t]);

  /**
   * Check if translation exists for given path
   * @param path - Translation path to check
   * @returns True if translation exists
   */
  const hasTranslation = useCallback((path: string): boolean => {
    const result = getTranslation(path, translations);
    return result !== path;
  }, []);

  /**
   * Get all translations for a specific section
   * @param section - Top-level section key (e.g., 'common', 'auth', 'tickets')
   * @returns Object with all translations for that section
   */
  const getSection = useCallback((section: keyof typeof translations) => {
    return translations[section] || {};
  }, []);

  /**
   * Format error message with context
   * @param error - Error key or message
   * @param context - Additional context for the error
   * @returns Formatted error message
   */
  const formatError = useCallback((error: string, context?: string): string => {
    const baseError = t(`errors.${error}`) || t('errors.general');
    return context ? `${baseError}: ${context}` : baseError;
  }, [t]);

  /**
   * Format success message
   * @param action - Action that succeeded
   * @param entity - Entity that was affected (optional)
   * @returns Formatted success message
   */
  const formatSuccess = useCallback((action: string, entity?: string): string => {
    const baseMessage = t(`messages.${action}`) || `${action} realizado com sucesso`;
    return entity ? `${entity} ${baseMessage}` : baseMessage;
  }, [t]);

  /**
   * Get localized label for status, priority, or other enum values
   * @param type - Type of label ('status', 'priority', 'roles')
   * @param value - Value to get label for
   * @returns Localized label
   */
  const getLabel = useCallback((type: 'status' | 'priority' | 'roles', value: string): string => {
    return t(`labels.${type}.${value}`) || value;
  }, [t]);

  /**
   * Get validation error message
   * @param rule - Validation rule name
   * @param params - Parameters for the validation message
   * @returns Localized validation error
   */
  const getValidationError = useCallback((rule: string, params?: Record<string, string | number>): string => {
    return t(`forms.validation.${rule}`, params);
  }, [t]);

  /**
   * Get placeholder text for form fields
   * @param field - Field type or name
   * @returns Localized placeholder text
   */
  const getPlaceholder = useCallback((field: string): string => {
    return t(`forms.placeholders.${field}`) || '';
  }, [t]);

  /**
   * Format time/date related text
   * @param key - Time key (e.g., 'now', 'today', 'yesterday')
   * @param params - Parameters for interpolation (e.g., count for relative time)
   * @returns Localized time text
   */
  const getTimeText = useCallback((key: string, params?: Record<string, string | number>): string => {
    return t(`time.${key}`, params);
  }, [t]);

  /**
   * Get navigation item text
   * @param item - Navigation item key
   * @returns Localized navigation text
   */
  const getNavText = useCallback((item: string): string => {
    return t(`navigation.${item}`);
  }, [t]);

  /**
   * Get common action text
   * @param action - Action key (e.g., 'save', 'cancel', 'delete')
   * @returns Localized action text
   */
  const getActionText = useCallback((action: string): string => {
    return t(`common.${action}`);
  }, [t]);

  /**
   * Format currency amount with localized text
   * @param amount - Amount to format
   * @param showText - Whether to include currency text
   * @returns Formatted currency string
   */
  const formatCurrencyText = useCallback((amount: number, showText: boolean = false): string => {
    // This uses the existing locale formatting from LocaleContext
    const { formatCurrency } = useLocale();
    const formatted = formatCurrency(amount);
    
    if (showText) {
      return `${formatted} (${t('common.currency')})`;
    }
    
    return formatted;
  }, [t]);

  return {
    // Main translation functions
    t,           // Main translation function
    tt,          // Type-safe translation function
    tMultiple,   // Get multiple translations
    
    // Utility functions
    hasTranslation,
    getSection,
    
    // Specialized formatters
    formatError,
    formatSuccess,
    getLabel,
    getValidationError,
    getPlaceholder,
    getTimeText,
    getNavText,
    getActionText,
    formatCurrencyText,
    
    // Current locale for reference
    locale,
    
    // Direct access to translations object for advanced use cases
    translations
  };
}

// Export specific hook functions for common use cases
export function useCommonTranslations() {
  const { getActionText, getLabel, getTimeText } = useTranslations();
  
  return {
    // Common actions
    save: getActionText('save'),
    cancel: getActionText('cancel'),
    delete: getActionText('delete'),
    edit: getActionText('edit'),
    create: getActionText('create'),
    view: getActionText('view'),
    loading: getActionText('loading'),
    
    // Common status
    active: getLabel('status', 'active'),
    inactive: getLabel('status', 'inactive'),
    pending: getLabel('status', 'pending'),
    
    // Common time
    today: getTimeText('today'),
    yesterday: getTimeText('yesterday'),
    now: getTimeText('now')
  };
}

export function useTicketTranslations() {
  const { t, getLabel } = useTranslations();
  
  return {
    // Ticket status
    new: getLabel('status', 'new') || t('tickets.status.new'),
    open: getLabel('status', 'open') || t('tickets.status.open'), 
    inProgress: t('tickets.status.inProgress'),
    waitingCustomer: t('tickets.status.waitingCustomer'),
    resolved: t('tickets.status.resolved'),
    closed: t('tickets.status.closed'),
    
    // Ticket priority
    low: getLabel('priority', 'low') || t('tickets.priority.low'),
    medium: getLabel('priority', 'medium') || t('tickets.priority.medium'),
    high: getLabel('priority', 'high') || t('tickets.priority.high'),
    critical: getLabel('priority', 'critical') || t('tickets.priority.critical'),
    
    // Actions
    createTicket: t('tickets.create'),
    viewTicket: t('tickets.view'),
    editTicket: t('tickets.edit'),
    deleteTicket: t('tickets.delete'),
    assignTicket: t('tickets.assign'),
    closeTicket: t('tickets.close'),
    resolveTicket: t('tickets.resolve')
  };
}

export function useFormTranslations() {
  const { getValidationError, getPlaceholder } = useTranslations();
  
  return {
    // Validation messages
    required: getValidationError('required'),
    email: getValidationError('email'),
    minLength: (min: number) => getValidationError('minLength', { min }),
    maxLength: (max: number) => getValidationError('maxLength', { max }),
    passwordMismatch: getValidationError('passwordMismatch'),
    
    // Placeholders
    emailPlaceholder: getPlaceholder('email'),
    phonePlaceholder: getPlaceholder('phone'),
    searchPlaceholder: getPlaceholder('search'),
    selectPlaceholder: getPlaceholder('selectOption')
  };
}

export default useTranslations;