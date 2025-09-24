import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, AlertTriangle, Calendar, DollarSign, Plus, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HourBank {
  id: string;
  customerId: string;
  totalHours: string;
  consumedHours: string;
  hourlyRate?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
}

interface HourBankCardProps {
  hourBank: HourBank;
  onAddHours?: (hourBankId: string) => void;
  onViewDetails?: (hourBankId: string) => void;
}

export default function HourBankCard({ hourBank, onAddHours, onViewDetails }: HourBankCardProps) {
  const totalHours = parseFloat(hourBank.totalHours);
  const consumedHours = parseFloat(hourBank.consumedHours);
  const remainingHours = totalHours - consumedHours;
  const usagePercentage = totalHours > 0 ? (consumedHours / totalHours) * 100 : 0;
  const hourlyRate = hourBank.hourlyRate ? parseFloat(hourBank.hourlyRate) : null;
  const totalValue = hourlyRate ? totalHours * hourlyRate : null;

  // Check if expiring soon (within 30 days)
  const isExpiringSoon = hourBank.expiresAt ? 
    new Date(hourBank.expiresAt).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000 : false;

  // Check if expired
  const isExpired = hourBank.expiresAt ? 
    new Date(hourBank.expiresAt).getTime() < Date.now() : false;

  // Check if running low (< 20% remaining)
  const isRunningLow = usagePercentage > 80;

  const getStatusColor = () => {
    if (isExpired) return "destructive";
    if (isExpiringSoon || isRunningLow) return "secondary";
    return "default";
  };

  const getStatusText = () => {
    if (isExpired) return "Expirado";
    if (!hourBank.isActive) return "Inativo";
    if (isExpiringSoon) return "Expirando em breve";
    if (isRunningLow) return "Saldo baixo";
    return "Ativo";
  };

  const getProgressColor = () => {
    if (usagePercentage > 80) return "bg-destructive";
    if (usagePercentage > 60) return "bg-secondary";
    return "bg-accent";
  };

  return (
    <Card className={`transition-shadow hover:shadow-md ${isExpired ? 'opacity-75' : ''}`} data-testid={`hour-bank-card-${hourBank.id}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-lg">
                {hourBank.customer?.name || `Cliente #${hourBank.customerId.slice(-6)}`}
              </h3>
              <p className="text-sm text-muted-foreground">
                {hourBank.customer?.email || `ID: ${hourBank.customerId.slice(-8)}`}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusColor() as any}>
                {getStatusText()}
              </Badge>
              {(isExpiringSoon || isRunningLow) && (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              )}
            </div>
          </div>

          {/* Hours Summary */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Saldo: <span className="font-semibold">{remainingHours.toFixed(1)}h</span></span>
              <span>Total: <span className="font-semibold">{totalHours.toFixed(1)}h</span></span>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-1">
              <Progress 
                value={usagePercentage} 
                className="h-2"
                data-testid={`progress-${hourBank.id}`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{consumedHours.toFixed(1)}h consumidas</span>
                <span>{usagePercentage.toFixed(0)}% usado</span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Expira</p>
                <p className="font-medium">
                  {hourBank.expiresAt ? (
                    isExpired ? (
                      <span className="text-destructive">Expirado</span>
                    ) : (
                      formatDistanceToNow(new Date(hourBank.expiresAt), {
                        addSuffix: true,
                        locale: ptBR
                      })
                    )
                  ) : (
                    "Sem expiração"
                  )}
                </p>
              </div>
            </div>

            {totalValue && (
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Valor Total</p>
                  <p className="font-medium">
                    R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Creation Date */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <span>
              Criado {formatDistanceToNow(new Date(hourBank.createdAt), {
                addSuffix: true,
                locale: ptBR
              })}
            </span>
            {hourlyRate && (
              <span>R$ {hourlyRate.toFixed(2)}/hora</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 pt-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => onViewDetails?.(hourBank.id)}
              data-testid={`button-view-details-${hourBank.id}`}
            >
              <Eye className="h-4 w-4 mr-1" />
              Detalhes
            </Button>
            
            {hourBank.isActive && !isExpired && (
              <Button 
                size="sm" 
                className="flex-1 bg-accent hover:bg-accent/90"
                onClick={() => onAddHours?.(hourBank.id)}
                data-testid={`button-add-hours-${hourBank.id}`}
              >
                <Plus className="h-4 w-4 mr-1" />
                Renovar
              </Button>
            )}
          </div>

          {/* Warning Messages */}
          {(isExpiringSoon || isRunningLow || isExpired) && (
            <div className={`p-2 rounded-lg text-xs ${
              isExpired ? 'bg-destructive/10 text-destructive' :
              (isExpiringSoon || isRunningLow) ? 'bg-secondary/10 text-secondary-foreground' :
              'bg-muted/30'
            }`}>
              {isExpired && (
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Esta bolsa de horas expirou e não pode mais ser utilizada</span>
                </div>
              )}
              {!isExpired && isExpiringSoon && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Esta bolsa de horas expira em breve</span>
                </div>
              )}
              {!isExpired && isRunningLow && (
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Saldo baixo - considere renovar a bolsa de horas</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
