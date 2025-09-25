import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { 
  type Locale, 
  getDefaultLocale, 
  isValidLocale,
  formatCurrency as formatCurrencyUtil,
  formatDate as formatDateUtil,
  formatDateTime as formatDateTimeUtil,
  formatDistanceToNow as formatDistanceToNowUtil,
  formatTime as formatTimeUtil,
  formatNumber as formatNumberUtil,
  formatHours as formatHoursUtil,
  formatPercentage as formatPercentageUtil,
  getCurrencySymbol,
  getCurrencyCode,
  LANGUAGE_INFO
} from '@/lib/i18n';
import { apiRequest } from '@/lib/queryClient';

// LocaleContext types
interface LocaleContextType {
  // Current locale state
  locale: Locale;
  setLocale: (locale: Locale) => void;
  
  // Helper functions
  isLoading: boolean;
  error: string | null;
  
  // Formatting functions (with locale applied)
  formatCurrency: (amount: number, options?: Parameters<typeof formatCurrencyUtil>[2]) => string;
  formatDate: (date: Date | string, formatPattern?: string) => string;
  formatDateTime: (date: Date | string, formatPattern?: string) => string;
  formatDistanceToNow: (date: Date | string, options?: { addSuffix?: boolean }) => string;
  formatTime: (date: Date | string) => string;
  formatNumber: (num: number, options?: Parameters<typeof formatNumberUtil>[2]) => string;
  formatHours: (hours: number, showLabel?: boolean) => string;
  formatPercentage: (value: number, options?: Parameters<typeof formatPercentageUtil>[2]) => string;
  
  // Currency helpers
  getCurrencySymbol: () => string;
  getCurrencyCode: () => string;
  
  // Language info
  getLanguageInfo: () => typeof LANGUAGE_INFO[Locale];
  getSupportedLocales: () => Locale[];
}

// Default context value
const defaultContextValue: LocaleContextType = {
  locale: getDefaultLocale(),
  setLocale: () => {},
  isLoading: false,
  error: null,
  
  formatCurrency: (amount: number) => formatCurrencyUtil(amount),
  formatDate: (date: Date | string) => formatDateUtil(date),
  formatDateTime: (date: Date | string) => formatDateTimeUtil(date),
  formatDistanceToNow: (date: Date | string) => formatDistanceToNowUtil(date),
  formatTime: (date: Date | string) => formatTimeUtil(date),
  formatNumber: (num: number) => formatNumberUtil(num),
  formatHours: (hours: number) => formatHoursUtil(hours),
  formatPercentage: (value: number) => formatPercentageUtil(value),
  
  getCurrencySymbol: () => getCurrencySymbol(),
  getCurrencyCode: () => getCurrencyCode(),
  
  getLanguageInfo: () => LANGUAGE_INFO[getDefaultLocale()],
  getSupportedLocales: () => ['pt-AO', 'pt-BR', 'en-US']
};

// Create context
const LocaleContext = createContext<LocaleContextType>(defaultContextValue);

// Storage keys
const STORAGE_KEY = 'tatuticket-locale';

// Provider props
interface LocaleProviderProps {
  children: ReactNode;
}

// Locale Provider Component
export function LocaleProvider({ children }: LocaleProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  // Local state
  const [locale, setLocaleState] = useState<Locale>(getDefaultLocale());
  const [error, setError] = useState<string | null>(null);

  // Fetch tenant locale settings
  const { data: tenantSettings, isLoading: isTenantLoading } = useQuery({
    queryKey: ['/api/tenant/locale-settings'],
    queryFn: async () => {
      const response = await fetch('/api/tenant/locale-settings', {
        credentials: 'include',
      });
      if (!response.ok) {
        // If endpoint doesn't exist, just return null
        if (response.status === 404) return null;
        throw new Error('Failed to fetch tenant locale settings');
      }
      return response.json();
    },
    enabled: isAuthenticated && !!user?.tenantId,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation to update tenant locale settings
  const updateTenantLocaleMutation = useMutation({
    mutationFn: async (newLocale: Locale) => {
      const response = await apiRequest('PUT', '/api/tenant/locale-settings', { 
        locale: newLocale 
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tenant/locale-settings'] });
    },
    onError: (err: any) => {
      console.warn('Failed to update tenant locale settings:', err);
      // Don't show error to user, this is optional functionality
    },
  });

  // Initialize locale from multiple sources
  useEffect(() => {
    let initialLocale: Locale = getDefaultLocale();

    try {
      // Priority 1: Tenant settings (if authenticated and available)
      if (tenantSettings?.locale && isValidLocale(tenantSettings.locale)) {
        initialLocale = tenantSettings.locale;
      }
      // Priority 2: localStorage
      else {
        const savedLocale = localStorage.getItem(STORAGE_KEY);
        if (savedLocale && isValidLocale(savedLocale)) {
          initialLocale = savedLocale;
        }
      }
    } catch (err) {
      console.warn('Failed to load locale preference:', err);
      setError('Failed to load language preference');
    }

    setLocaleState(initialLocale);
  }, [tenantSettings, isAuthenticated]);

  // Update locale function
  const setLocale = async (newLocale: Locale) => {
    try {
      setError(null);
      
      // Update local state immediately
      setLocaleState(newLocale);
      
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, newLocale);
      } catch (err) {
        console.warn('Failed to save locale to localStorage:', err);
      }
      
      // Update tenant settings if authenticated (non-blocking)
      if (isAuthenticated && user?.tenantId) {
        try {
          await updateTenantLocaleMutation.mutateAsync(newLocale);
        } catch (err) {
          console.warn('Failed to update tenant locale settings:', err);
          // Don't revert the local change, tenant settings are optional
        }
      }
    } catch (err) {
      console.error('Failed to set locale:', err);
      setError('Failed to change language');
    }
  };

  // Create formatting functions with current locale
  const formatCurrency = (amount: number, options?: Parameters<typeof formatCurrencyUtil>[2]) => 
    formatCurrencyUtil(amount, locale, options);

  const formatDate = (date: Date | string, formatPattern?: string) => 
    formatDateUtil(date, locale, formatPattern);

  const formatDateTime = (date: Date | string, formatPattern?: string) => 
    formatDateTimeUtil(date, locale, formatPattern);

  const formatDistanceToNow = (date: Date | string, options?: { addSuffix?: boolean }) => 
    formatDistanceToNowUtil(date, locale, options);

  const formatTime = (date: Date | string) => 
    formatTimeUtil(date, locale);

  const formatNumber = (num: number, options?: Parameters<typeof formatNumberUtil>[2]) => 
    formatNumberUtil(num, locale, options);

  const formatHours = (hours: number, showLabel?: boolean) => 
    formatHoursUtil(hours, locale, showLabel);

  const formatPercentage = (value: number, options?: Parameters<typeof formatPercentageUtil>[2]) => 
    formatPercentageUtil(value, locale, options);

  const getCurrencySymbolForLocale = () => getCurrencySymbol(locale);
  const getCurrencyCodeForLocale = () => getCurrencyCode(locale);
  const getLanguageInfo = () => LANGUAGE_INFO[locale];
  const getSupportedLocales = (): Locale[] => ['pt-AO', 'pt-BR', 'en-US', 'es-ES'];

  // Context value
  const contextValue: LocaleContextType = {
    locale,
    setLocale,
    isLoading: isTenantLoading,
    error,
    
    formatCurrency,
    formatDate,
    formatDateTime,
    formatDistanceToNow,
    formatTime,
    formatNumber,
    formatHours,
    formatPercentage,
    
    getCurrencySymbol: getCurrencySymbolForLocale,
    getCurrencyCode: getCurrencyCodeForLocale,
    
    getLanguageInfo,
    getSupportedLocales
  };

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
}

// Hook to use locale context
export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

// Export context for advanced use cases
export { LocaleContext };

// Type exports
export type { LocaleContextType, Locale };