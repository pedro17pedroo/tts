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
        return 'bg-destructive text-white';
      case 'high':
        return 'bg-destructive text-white';
      case 'medium':
        return 'bg-secondary text-white';
      case 'low':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
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
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            #{ticket.id.slice(-8)}
          </span>
          <Badge className={getPriorityColor(ticket.priority)}>
            {getPriorityLabel(ticket.priority)}
          </Badge>
        </div>
        
        <h4 className="font-medium mb-2 line-clamp-2">{ticket.title}</h4>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {ticket.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Cliente #{ticket.customerId.slice(-6)}</span>
          <span>
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
