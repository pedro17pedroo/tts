import { useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocale, type Locale } from '@/contexts/LocaleContext';
import { LANGUAGE_INFO } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'icon-only';
  align?: 'start' | 'center' | 'end';
  side?: 'bottom' | 'top' | 'left' | 'right';
  className?: string;
  testId?: string;
}

export function LanguageSwitcher({
  variant = 'default',
  align = 'end',
  side = 'bottom',
  className,
  testId
}: LanguageSwitcherProps) {
  const { locale, setLocale, getSupportedLocales, getLanguageInfo, isLoading } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const supportedLocales = getSupportedLocales();
  const currentLanguageInfo = getLanguageInfo();

  const handleLocaleChange = async (newLocale: Locale) => {
    try {
      await setLocale(newLocale);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to change locale:', error);
    }
  };

  const renderTriggerContent = () => {
    switch (variant) {
      case 'icon-only':
        return (
          <>
            <span className="text-lg">{currentLanguageInfo.flag}</span>
            <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
          </>
        );
      case 'compact':
        return (
          <>
            <span className="text-lg mr-1">{currentLanguageInfo.flag}</span>
            <span className="font-medium">{currentLanguageInfo.shortName}</span>
            <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
          </>
        );
      case 'default':
      default:
        return (
          <>
            <span className="text-lg mr-2">{currentLanguageInfo.flag}</span>
            <span className="font-medium">{currentLanguageInfo.name}</span>
            <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
          </>
        );
    }
  };

  const getTriggerSize = () => {
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
          size={getTriggerSize() as any}
          className={cn(
            'justify-between',
            variant === 'icon-only' && 'w-auto px-2',
            variant === 'compact' && 'w-auto',
            variant === 'default' && 'min-w-[160px]',
            className
          )}
          disabled={isLoading}
          data-testid={testId || 'language-switcher-trigger'}
        >
          {renderTriggerContent()}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align={align} 
        side={side}
        className="w-56"
        data-testid="language-switcher-content"
      >
        {supportedLocales.map((supportedLocale) => {
          const languageInfo = LANGUAGE_INFO[supportedLocale];

          if (!languageInfo) return null;

          const isSelected = locale === supportedLocale;

          return (
            <DropdownMenuItem
              key={supportedLocale}
              onClick={() => handleLocaleChange(supportedLocale)}
              className={cn(
                'cursor-pointer',
                isSelected && 'bg-accent'
              )}
              data-testid={`language-option-${supportedLocale}`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span className="text-lg mr-3">{languageInfo.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{languageInfo.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {languageInfo.shortName}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <Check className="h-4 w-4 text-primary" data-testid={`check-${supportedLocale}`} />
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
export function CompactLanguageSwitcher(props: Omit<LanguageSwitcherProps, 'variant'>) {
  return <LanguageSwitcher variant="compact" {...props} />;
}

export function IconOnlyLanguageSwitcher(props: Omit<LanguageSwitcherProps, 'variant'>) {
  return <LanguageSwitcher variant="icon-only" {...props} />;
}

// Header/Navigation variant
export function HeaderLanguageSwitcher(props: Omit<LanguageSwitcherProps, 'variant' | 'side'>) {
  return <LanguageSwitcher variant="icon-only" side="bottom" {...props} />;
}

// Settings page variant
export function SettingsLanguageSwitcher(props: Omit<LanguageSwitcherProps, 'variant'>) {
  return <LanguageSwitcher variant="default" {...props} />;
}