import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Theme types
export type Theme = 'light' | 'dark' | 'auto';

// Theme configuration
const THEME_STORAGE_KEY = 'tatuticket-theme';
const THEME_OPTIONS = {
  light: {
    label: 'Light',
    icon: Sun,
  },
  dark: {
    label: 'Dark', 
    icon: Moon,
  },
  auto: {
    label: 'Auto',
    icon: Monitor,
  },
} as const;

// Utility function to get system theme preference
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Theme context hook
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    const actualTheme = newTheme === 'auto' ? getSystemTheme() : newTheme;
    
    // Toggle dark class
    if (actualTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    setResolvedTheme(actualTheme);
  };

  // Set theme with persistence
  const setTheme = (newTheme: Theme) => {
    try {
      // Save to localStorage
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      
      // Update state
      setThemeState(newTheme);
      
      // Apply theme
      applyTheme(newTheme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  // Initialize theme on mount
  useEffect(() => {
    try {
      // Get saved theme or default to auto
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
      const initialTheme = savedTheme && ['light', 'dark', 'auto'].includes(savedTheme) 
        ? savedTheme 
        : 'auto';
      
      setThemeState(initialTheme);
      applyTheme(initialTheme);
      
      // Listen for system theme changes when in auto mode
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = () => {
        if (theme === 'auto') {
          applyTheme('auto');
        }
      };
      
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    } catch (error) {
      console.warn('Failed to initialize theme:', error);
      // Fallback to light theme
      applyTheme('light');
    }
  }, [theme]);

  return {
    theme,
    setTheme,
    resolvedTheme,
  };
}

// Theme toggle component props
interface ThemeToggleProps {
  variant?: 'default' | 'compact' | 'icon-only';
  align?: 'start' | 'center' | 'end';
  side?: 'bottom' | 'top' | 'left' | 'right';
  className?: string;
  testId?: string;
  showLabels?: boolean;
}

export function ThemeToggle({
  variant = 'default',
  align = 'end',
  side = 'bottom',
  className,
  testId,
  showLabels = true,
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Get current theme icon
  const getCurrentIcon = () => {
    if (theme === 'auto') {
      return resolvedTheme === 'dark' ? Moon : Sun;
    }
    return THEME_OPTIONS[theme].icon;
  };

  const CurrentIcon = getCurrentIcon();

  // Get trigger content based on variant
  const renderTriggerContent = () => {
    switch (variant) {
      case 'icon-only':
        return <CurrentIcon className="h-4 w-4" />;
      case 'compact':
        return (
          <>
            <CurrentIcon className="h-4 w-4" />
            {showLabels && (
              <span className="ml-1 text-sm">
                {theme === 'auto' ? `Auto (${resolvedTheme})` : THEME_OPTIONS[theme].label}
              </span>
            )}
          </>
        );
      case 'default':
      default:
        return (
          <>
            <CurrentIcon className="h-4 w-4" />
            {showLabels && (
              <span className="ml-2">
                {theme === 'auto' ? `Auto (${resolvedTheme})` : THEME_OPTIONS[theme].label}
              </span>
            )}
          </>
        );
    }
  };

  // Get button size based on variant
  const getButtonSize = () => {
    switch (variant) {
      case 'icon-only':
        return 'sm';
      case 'compact':
        return 'sm';
      case 'default':
      default:
        return 'default';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={getButtonSize() as any}
          className={cn(
            'justify-between',
            variant === 'icon-only' && 'w-auto px-2',
            variant === 'compact' && 'w-auto',
            variant === 'default' && 'min-w-[140px]',
            className
          )}
          data-testid={testId || 'theme-toggle-trigger'}
          aria-label={`Current theme: ${theme === 'auto' ? `Auto (${resolvedTheme})` : THEME_OPTIONS[theme].label}`}
        >
          {renderTriggerContent()}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align={align} 
        side={side}
        className="w-48"
        data-testid="theme-toggle-content"
      >
        {(Object.entries(THEME_OPTIONS) as [Theme, typeof THEME_OPTIONS[Theme]][]).map(([themeOption, config]) => {
          const Icon = config.icon;
          const isSelected = theme === themeOption;
          const isSystemDark = getSystemTheme() === 'dark';

          return (
            <DropdownMenuItem
              key={themeOption}
              onClick={() => {
                setTheme(themeOption);
                setIsOpen(false);
              }}
              className={cn(
                'cursor-pointer',
                isSelected && 'bg-accent'
              )}
              data-testid={`theme-option-${themeOption}`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Icon className="h-4 w-4 mr-3" />
                  <div className="flex flex-col">
                    <span className="font-medium">{config.label}</span>
                    {themeOption === 'auto' && (
                      <span className="text-xs text-muted-foreground">
                        System ({isSystemDark ? 'Dark' : 'Light'})
                      </span>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <div 
                    className="h-2 w-2 rounded-full bg-primary" 
                    data-testid={`selected-${themeOption}`}
                  />
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Convenience components for different use cases
export function CompactThemeToggle(props: Omit<ThemeToggleProps, 'variant'>) {
  return <ThemeToggle variant="compact" {...props} />;
}

export function IconOnlyThemeToggle(props: Omit<ThemeToggleProps, 'variant'>) {
  return <ThemeToggle variant="icon-only" {...props} />;
}

// Header/Navigation variant
export function HeaderThemeToggle(props: Omit<ThemeToggleProps, 'variant' | 'side'>) {
  return <ThemeToggle variant="icon-only" side="bottom" {...props} />;
}

// Settings page variant
export function SettingsThemeToggle(props: Omit<ThemeToggleProps, 'variant'>) {
  return <ThemeToggle variant="default" {...props} />;
}

// Theme provider component for app-wide theme management
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'auto' }: ThemeProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      // Initialize theme on app start
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
      const initialTheme = savedTheme && ['light', 'dark', 'auto'].includes(savedTheme) 
        ? savedTheme 
        : defaultTheme;
      
      const root = document.documentElement;
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const actualTheme = initialTheme === 'auto' ? systemTheme : initialTheme;
      
      if (actualTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.warn('Failed to initialize theme provider:', error);
      setIsInitialized(true);
    }
  }, [defaultTheme]);

  if (!isInitialized) {
    return null; // Prevent flash of unstyled content
  }

  return <>{children}</>;
}

// Utility function to get current theme
export function getCurrentTheme(): Theme {
  if (typeof window === 'undefined') return 'auto';
  
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    return savedTheme && ['light', 'dark', 'auto'].includes(savedTheme) ? savedTheme : 'auto';
  } catch {
    return 'auto';
  }
}

// Utility function to get resolved theme (actual applied theme)
export function getResolvedTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export default ThemeToggle;