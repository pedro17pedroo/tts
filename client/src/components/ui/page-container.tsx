import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  "data-testid"?: string;
}

/**
 * Componente PageContainer para garantir consistência visual em todas as páginas
 * Baseado nos estilos utilizados na página de Dashboard (seção "Visão geral do sistema")
 */
export default function PageContainer({ 
  children, 
  className, 
  title, 
  subtitle, 
  showHeader = true,
  "data-testid": testId 
}: PageContainerProps) {
  return (
    <div 
      className={cn("px-4 md:px-6 pb-4 md:pb-6", className)} 
      data-testid={testId}
    >
      {/* Page Header - Consistente com o Dashboard */}
      {showHeader && (title || subtitle) && (
        <div className="mb-4 md:mb-6 pb-4 md:pb-5">
          <div className="flex items-baseline gap-2">
            {title && (
              <h1 className="text-lg md:text-xl font-semibold text-foreground">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground">
                | {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Page Content */}
      {children}
    </div>
  );
}