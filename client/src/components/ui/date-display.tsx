import { forwardRef } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { cn } from '@/lib/utils';

interface DateDisplayProps {
  date: Date | string;
  className?: string;
  format?: 'date' | 'datetime' | 'time' | 'relative';
  formatPattern?: string;
  variant?: 'default' | 'large' | 'small' | 'muted';
  addSuffix?: boolean;
  testId?: string;
}

const DateDisplay = forwardRef<HTMLSpanElement, DateDisplayProps>(
  ({ 
    date, 
    className, 
    format = 'date',
    formatPattern,
    variant = 'default',
    addSuffix = true,
    testId,
    ...props 
  }, ref) => {
    const { formatDate, formatDateTime, formatTime, formatDistanceToNow } = useLocale();

    const getFormattedDate = () => {
      switch (format) {
        case 'datetime':
          return formatDateTime(date, formatPattern);
        case 'time':
          return formatTime(date);
        case 'relative':
          return formatDistanceToNow(date, { addSuffix });
        case 'date':
        default:
          return formatDate(date, formatPattern);
      }
    };

    const formattedDate = getFormattedDate();

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
          'tabular-nums',
          variantClasses[variant],
          className
        )}
        data-testid={testId}
        title={format === 'relative' ? formatDateTime(date) : undefined}
        {...props}
      >
        {formattedDate}
      </span>
    );
  }
);

DateDisplay.displayName = 'DateDisplay';

export { DateDisplay };

// Convenience components for common use cases
export const RelativeDateDisplay = forwardRef<HTMLSpanElement, Omit<DateDisplayProps, 'format'>>(
  (props, ref) => <DateDisplay ref={ref} format="relative" {...props} />
);

export const DateTimeDisplay = forwardRef<HTMLSpanElement, Omit<DateDisplayProps, 'format'>>(
  (props, ref) => <DateDisplay ref={ref} format="datetime" {...props} />
);

export const TimeDisplay = forwardRef<HTMLSpanElement, Omit<DateDisplayProps, 'format'>>(
  (props, ref) => <DateDisplay ref={ref} format="time" {...props} />
);

export const LargeDateDisplay = forwardRef<HTMLSpanElement, Omit<DateDisplayProps, 'variant'>>(
  (props, ref) => <DateDisplay ref={ref} variant="large" {...props} />
);

export const SmallDateDisplay = forwardRef<HTMLSpanElement, Omit<DateDisplayProps, 'variant'>>(
  (props, ref) => <DateDisplay ref={ref} variant="small" {...props} />
);

export const MutedDateDisplay = forwardRef<HTMLSpanElement, Omit<DateDisplayProps, 'variant'>>(
  (props, ref) => <DateDisplay ref={ref} variant="muted" {...props} />
);

RelativeDateDisplay.displayName = 'RelativeDateDisplay';
DateTimeDisplay.displayName = 'DateTimeDisplay';
TimeDisplay.displayName = 'TimeDisplay';
LargeDateDisplay.displayName = 'LargeDateDisplay';
SmallDateDisplay.displayName = 'SmallDateDisplay';
MutedDateDisplay.displayName = 'MutedDateDisplay';