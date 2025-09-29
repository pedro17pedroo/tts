import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Columns, Table, Search } from "lucide-react";
import KanbanBoard from "@/components/tickets/kanban-board";
import TicketsTable from "@/components/tickets/tickets-table";
import CreateTicketModal from "@/components/tickets/create-ticket-modal";
import PageContainer from "@/components/ui/page-container";
import type { Ticket } from "@/types/schema";

export default function Tickets() {
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
  });

  const { data: tickets = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/tickets", filters],
    queryFn: async ({ queryKey }) => {
      const [url, params] = queryKey;
      const searchParams = new URLSearchParams();
      Object.entries(params as Record<string, any>).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
      const response = await fetch(`${url}?${searchParams.toString()}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    select: (data) => Array.isArray(data) ? data : [],
  });

  if (isLoading) {
    return (
      <PageContainer>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer 
      title="Tickets" 
      subtitle="Gerir tickets de suporte"
      data-testid="tickets-page"
    >

      {/* Filters and Controls */}
      <div className="space-y-4 mb-6">
        {/* Top Row - View Toggle and Create Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={view === "kanban" ? "default" : "outline"}
              onClick={() => setView("kanban")}
              data-testid="button-kanban-view"
              size="sm"
              className="text-xs md:text-sm"
            >
              <Columns className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Kanban</span>
              <span className="sm:hidden">K</span>
            </Button>
            <Button
              variant={view === "table" ? "default" : "outline"}
              onClick={() => setView("table")}
              data-testid="button-table-view"
              size="sm"
              className="text-xs md:text-sm"
            >
              <Table className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Tabela</span>
              <span className="sm:hidden">T</span>
            </Button>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            data-testid="button-create-ticket"
            size="sm"
            className="text-xs md:text-sm"
          >
            <span className="hidden sm:inline">Novo Ticket</span>
            <span className="sm:hidden">+</span>
          </Button>
        </div>

        {/* Bottom Row - Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === "all" ? "" : value }))}
          >
            <SelectTrigger className="w-full sm:w-36 md:w-40" data-testid="select-status-filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="new">Novo</SelectItem>
              <SelectItem value="in_progress">Em Progresso</SelectItem>
              <SelectItem value="waiting_customer">Aguardando Cliente</SelectItem>
              <SelectItem value="resolved">Resolvido</SelectItem>
              <SelectItem value="closed">Fechado</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.priority || "all"}
            onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value === "all" ? "" : value }))}
          >
            <SelectTrigger className="w-full sm:w-36 md:w-40" data-testid="select-priority-filter">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Prioridades</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="critical">Crítica</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1 sm:flex-none">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar tickets..."
              className="pl-9 w-full sm:w-48 md:w-64"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              data-testid="input-search-tickets"
            />
          </div>
        </div>
      </div>

      {/* Ticket Views */}
      {view === "kanban" ? (
        <KanbanBoard tickets={tickets} />
      ) : (
        <TicketsTable tickets={tickets} />
      )}

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </PageContainer>
  );
}
