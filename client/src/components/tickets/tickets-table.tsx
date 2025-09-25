import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Edit, Trash2, Eye, Clock, ArrowUpDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import TicketDetailsModal from "./ticket-details-modal";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "new" | "in_progress" | "waiting_customer" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  customerId: string;
  assigneeId?: string;
  departmentId?: string;
  categoryId?: string;
  timeSpent: string;
  createdAt: string;
  updatedAt: string;
}

interface TicketsTableProps {
  tickets: Ticket[];
}

type SortField = "title" | "status" | "priority" | "createdAt" | "updatedAt";
type SortDirection = "asc" | "desc";

export default function TicketsTable({ tickets }: TicketsTableProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedTickets = [...tickets].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === "createdAt" || sortField === "updatedAt") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "destructive";
      case "in_progress": return "default";
      case "waiting_customer": return "secondary";
      case "resolved": return "outline";
      case "closed": return "outline";
      default: return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: "Novo",
      in_progress: "Em Progresso",
      waiting_customer: "Aguardando Cliente",
      resolved: "Resolvido",
      closed: "Fechado"
    };
    return labels[status] || status;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: "Baixa",
      medium: "Média",
      high: "Alta",
      critical: "Crítica"
    };
    return labels[priority] || priority;
  };

  const handleViewTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setIsDetailsModalOpen(true);
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-8 font-medium"
      data-testid={`sort-${field}`}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Nenhum ticket encontrado</h3>
            <p className="text-muted-foreground">
              Não há tickets que correspondam aos filtros selecionados
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card data-testid="tickets-table">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="w-full min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">ID</TableHead>
                    <TableHead className="min-w-[200px]">
                      <SortButton field="title">Título</SortButton>
                    </TableHead>
                    <TableHead className="min-w-[120px]">Cliente</TableHead>
                    <TableHead className="min-w-[100px]">
                      <SortButton field="status">Status</SortButton>
                    </TableHead>
                    <TableHead className="min-w-[100px]">
                      <SortButton field="priority">Prioridade</SortButton>
                    </TableHead>
                    <TableHead className="min-w-[120px]">Responsável</TableHead>
                    <TableHead className="min-w-[80px]">Tempo</TableHead>
                    <TableHead className="min-w-[100px]">
                      <SortButton field="createdAt">Criado</SortButton>
                    </TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTickets.map((ticket) => (
                    <TableRow 
                      key={ticket.id} 
                      className="hover:bg-muted/30 cursor-pointer"
                      onClick={() => handleViewTicket(ticket.id)}
                      data-testid={`ticket-row-${ticket.id}`}
                    >
                      <TableCell className="font-mono text-sm">
                        #{ticket.id.slice(-6)}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div>
                          <p className="font-medium line-clamp-1">{ticket.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{ticket.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {ticket.customerId.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">#{ticket.customerId.slice(-6)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(ticket.status) as any}>
                          {getStatusLabel(ticket.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(ticket.priority) as any}>
                          {getPriorityLabel(ticket.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {ticket.assigneeId ? (
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {ticket.assigneeId.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">#{ticket.assigneeId.slice(-6)}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Não atribuído</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{ticket.timeSpent || 0}h</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(ticket.createdAt), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                              data-testid={`ticket-actions-${ticket.id}`}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewTicket(ticket.id);
                              }}
                              data-testid={`button-view-ticket-${ticket.id}`}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => e.stopPropagation()}
                              data-testid={`button-edit-ticket-${ticket.id}`}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => e.stopPropagation()}
                              className="text-destructive"
                              data-testid={`button-delete-ticket-${ticket.id}`}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4" data-testid="tickets-mobile-view">
        {sortedTickets.map((ticket) => (
          <Card 
            key={ticket.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleViewTicket(ticket.id)}
            data-testid={`ticket-mobile-card-${ticket.id}`}
          >
            <CardContent className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    #{ticket.id.slice(-6)}
                  </span>
                  <Badge variant={getPriorityColor(ticket.priority) as any} className="text-xs">
                    {getPriorityLabel(ticket.priority)}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => e.stopPropagation()}
                      data-testid={`ticket-mobile-actions-${ticket.id}`}
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewTicket(ticket.id);
                      }}
                      data-testid={`button-view-ticket-mobile-${ticket.id}`}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => e.stopPropagation()}
                      data-testid={`button-edit-ticket-mobile-${ticket.id}`}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => e.stopPropagation()}
                      className="text-destructive"
                      data-testid={`button-delete-ticket-mobile-${ticket.id}`}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Title */}
              <h4 className="font-medium text-sm mb-2 line-clamp-2">{ticket.title}</h4>
              
              {/* Description */}
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {ticket.description}
              </p>
              
              {/* Status and badges */}
              <div className="flex items-center justify-between mb-3">
                <Badge variant={getStatusColor(ticket.status) as any} className="text-xs">
                  {getStatusLabel(ticket.status)}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{ticket.timeSpent || 0}h</span>
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Avatar className="h-4 w-4">
                    <AvatarFallback className="text-xs">
                      {ticket.customerId.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>#{ticket.customerId.slice(-6)}</span>
                </div>
                <span>
                  {formatDistanceToNow(new Date(ticket.createdAt), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {sortedTickets.length} de {tickets.length} tickets
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled data-testid="button-previous-page">
            <span className="hidden sm:inline">Anterior</span>
            <span className="sm:hidden">Ant</span>
          </Button>
          <Button variant="outline" size="sm" className="bg-accent text-white" data-testid="button-page-1">
            1
          </Button>
          <Button variant="outline" size="sm" disabled data-testid="button-next-page">
            <span className="hidden sm:inline">Próximo</span>
            <span className="sm:hidden">Próx</span>
          </Button>
        </div>
      </div>

      {/* Ticket Details Modal */}
      <TicketDetailsModal
        ticketId={selectedTicketId}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedTicketId(null);
        }}
      />
    </>
  );
}
