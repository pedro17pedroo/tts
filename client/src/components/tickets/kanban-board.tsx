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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6" data-testid="kanban-board">
      {columns.map((column) => (
        <Card key={column.id} className="min-h-80 md:min-h-96">
          <CardHeader className="pb-2 md:pb-3 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <CardTitle 
                className={`text-xs md:text-sm font-semibold truncate mr-2 ${
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
                className={`text-xs shrink-0 ${
                  column.color === 'destructive' ? 'border-destructive text-destructive' :
                  column.color === 'accent' ? 'border-accent text-accent' :
                  column.color === 'primary' ? 'border-primary text-primary' :
                  column.color === 'secondary' ? 'border-secondary text-secondary' :
                  'border-muted-foreground text-muted-foreground'
                }`}
                data-testid={`column-count-${column.id}`}
              >
                {column.tickets.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 md:space-y-3 p-4 md:p-6 pt-0">
            {column.tickets.length === 0 ? (
              <div className="text-center py-6 md:py-8 text-muted-foreground">
                <p className="text-xs md:text-sm">Nenhum ticket</p>
              </div>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {column.tickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
