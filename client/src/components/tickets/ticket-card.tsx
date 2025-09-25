import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  customerId: string;
  createdAt: string;
}

interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
}

export default function TicketCard({ ticket, onClick }: TicketCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
      critical: 'Crítica'
    };
    return labels[priority] || priority;
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
      data-testid={`ticket-card-${ticket.id}`}
    >
      <CardContent className="p-3 md:p-4">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs md:text-sm font-medium text-muted-foreground truncate">
            #{ticket.id.slice(-8)}
          </span>
          <Badge variant={getPriorityColor(ticket.priority) as any} className="text-xs shrink-0 ml-2">
            {getPriorityLabel(ticket.priority)}
          </Badge>
        </div>
        
        <h4 className="font-medium mb-2 line-clamp-2 text-sm md:text-base">{ticket.title}</h4>
        
        <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2">
          {ticket.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate mr-2">Cliente #{ticket.customerId.slice(-6)}</span>
          <span className="shrink-0">
            {formatDistanceToNow(new Date(ticket.createdAt), { 
              addSuffix: true,
              locale: ptBR 
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
