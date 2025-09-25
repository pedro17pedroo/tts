import { forwardRef } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { cn } from '@/lib/utils';

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
  showSymbol?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  variant?: 'default' | 'large' | 'small' | 'muted';
  testId?: string;
}

const CurrencyDisplay = forwardRef<HTMLSpanElement, CurrencyDisplayProps>(
  ({ 
    amount, 
    className, 
    showSymbol = true,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    variant = 'default',
    testId,
    ...props 
  }, ref) => {
    const { formatCurrency } = useLocale();

    const formattedAmount = formatCurrency(amount, {
      showSymbol,
      minimumFractionDigits,
      maximumFractionDigits
    });

    const variantClasses = {
      default: '',
      large: 'text-lg font-semibold',
      small: 'text-sm',
      muted: 'text-muted-foreground'
    };

    return (
      <span
        ref={ref}
        className={cn(
          'font-medium tabular-nums',
          variantClasses[variant],
          className
        )}
        data-testid={testId}
        {...props}
      >
        {formattedAmount}
      </span>
    );
  }
);

CurrencyDisplay.displayName = 'CurrencyDisplay';

export { CurrencyDisplay };

// Convenience components for common use cases
export const LargeCurrencyDisplay = forwardRef<HTMLSpanElement, Omit<CurrencyDisplayProps, 'variant'>>(
  (props, ref) => <CurrencyDisplay ref={ref} variant="large" {...props} />
);

export const SmallCurrencyDisplay = forwardRef<HTMLSpanElement, Omit<CurrencyDisplayProps, 'variant'>>(
  (props, ref) => <CurrencyDisplay ref={ref} variant="small" {...props} />
);

export const MutedCurrencyDisplay = forwardRef<HTMLSpanElement, Omit<CurrencyDisplayProps, 'variant'>>(
  (props, ref) => <CurrencyDisplay ref={ref} variant="muted" {...props} />
);

LargeCurrencyDisplay.displayName = 'LargeCurrencyDisplay';
SmallCurrencyDisplay.displayName = 'SmallCurrencyDisplay';
MutedCurrencyDisplay.displayName = 'MutedCurrencyDisplay';