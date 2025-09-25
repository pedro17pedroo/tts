import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Clock, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import StatsCard from "@/components/ui/stats-card";

interface DashboardStats {
  openTickets: number;
  inProgressTickets: number;
  resolvedToday: number;
  slaAtRisk: number;
  hourBank: {
    totalSold: number;
    consumed: number;
    available: number;
    totalValue: number;
    activeBanks: number;
  };
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6" data-testid="dashboard-page">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <StatsCard
          title="Tickets Abertos"
          value={stats?.openTickets || 0}
          icon={<Ticket className="h-5 w-5 md:h-6 md:w-6" />}
          color="destructive"
          data-testid="stat-open-tickets"
        />
        <StatsCard
          title="Em Progresso"
          value={stats?.inProgressTickets || 0}
          icon={<Clock className="h-5 w-5 md:h-6 md:w-6" />}
          color="accent"
          data-testid="stat-in-progress-tickets"
        />
        <StatsCard
          title="Resolvidos Hoje"
          value={stats?.resolvedToday || 0}
          icon={<CheckCircle className="h-5 w-5 md:h-6 md:w-6" />}
          color="primary"
          data-testid="stat-resolved-today"
        />
        <StatsCard
          title="SLA em Risco"
          value={stats?.slaAtRisk || 0}
          icon={<AlertTriangle className="h-5 w-5 md:h-6 md:w-6" />}
          color="destructive"
          data-testid="stat-sla-at-risk"
        />
      </div>

      {/* Hour Bank Summary */}
      {stats?.hourBank && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatsCard
            title="Total de Horas Vendidas"
            value={`${stats.hourBank.totalSold}h`}
            icon={<Clock className="h-5 w-5 md:h-6 md:w-6" />}
            color="accent"
            data-testid="stat-hours-sold"
          />
          <StatsCard
            title="Horas Consumidas"
            value={`${stats.hourBank.consumed}h`}
            icon={<TrendingUp className="h-5 w-5 md:h-6 md:w-6" />}
            color="primary"
            data-testid="stat-hours-consumed"
          />
          <StatsCard
            title="Saldo Disponível"
            value={`${stats.hourBank.available}h`}
            icon={<CheckCircle className="h-5 w-5 md:h-6 md:w-6" />}
            color="secondary"
            data-testid="stat-hours-available"
          />
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl">Tickets Recentes</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="space-y-4">
              <div className="text-center text-muted-foreground py-6 md:py-8">
                <Ticket className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm md:text-base">Nenhum ticket recente encontrado</p>
                <p className="text-xs md:text-sm">Os tickets aparecerão aqui quando criados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl">Performance SLA</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="space-y-4 md:space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs md:text-sm font-medium">Tempo de Primeira Resposta</span>
                  <span className="text-xs md:text-sm text-accent font-semibold">--</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs md:text-sm font-medium">Tempo de Resolução</span>
                  <span className="text-xs md:text-sm text-primary font-semibold">--</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs md:text-sm font-medium">Satisfação do Cliente</span>
                  <span className="text-xs md:text-sm text-accent font-semibold">--</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
