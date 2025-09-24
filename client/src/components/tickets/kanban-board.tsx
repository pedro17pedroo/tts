import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TicketCard from "./ticket-card";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  customerId: string;
  createdAt: string;
}

interface KanbanBoardProps {
  tickets: Ticket[];
}

export default function KanbanBoard({ tickets }: KanbanBoardProps) {
  const columns = [
    {
      id: "new",
      title: "Novos",
      color: "destructive",
      tickets: tickets.filter(t => t.status === "new"),
    },
    {
      id: "in_progress",
      title: "Em Progresso",
      color: "accent",
      tickets: tickets.filter(t => t.status === "in_progress"),
    },
    {
      id: "waiting_customer",
      title: "Aguardando Cliente",
      color: "secondary",
      tickets: tickets.filter(t => t.status === "waiting_customer"),
    },
    {
      id: "resolved",
      title: "Resolvidos",
      color: "primary",
      tickets: tickets.filter(t => t.status === "resolved"),
    },
    {
      id: "closed",
      title: "Fechados",
      color: "muted",
      tickets: tickets.filter(t => t.status === "closed"),
    },
  ];

  return (
    <div className="grid lg:grid-cols-5 gap-6" data-testid="kanban-board">
      {columns.map((column) => (
        <Card key={column.id} className="min-h-96">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle 
                className={`text-sm font-semibold ${
                  column.color === 'destructive' ? 'text-destructive' :
                  column.color === 'accent' ? 'text-accent' :
                  column.color === 'primary' ? 'text-primary' :
                  column.color === 'secondary' ? 'text-secondary' :
                  'text-muted-foreground'
                }`}
              >
                {column.title}
              </CardTitle>
              <Badge 
                variant="outline" 
                className={
                  column.color === 'destructive' ? 'border-destructive text-destructive' :
                  column.color === 'accent' ? 'border-accent text-accent' :
                  column.color === 'primary' ? 'border-primary text-primary' :
                  column.color === 'secondary' ? 'border-secondary text-secondary' :
                  'border-muted-foreground text-muted-foreground'
                }
                data-testid={`column-count-${column.id}`}
              >
                {column.tickets.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {column.tickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Nenhum ticket</p>
              </div>
            ) : (
              column.tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
