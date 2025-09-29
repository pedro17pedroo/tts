import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Download, TrendingUp, TrendingDown, BarChart3, PieChart, Clock, Users, Filter, AlertTriangle } from "lucide-react";
import PageContainer from "@/components/ui/page-container";

// Tipos para os relatórios
interface ReportFilters {
  startDate?: string;
  endDate?: string;
  assigneeId?: string;
  customerId?: string;
  priority?: string;
  status?: string;
  isActive?: boolean;
}

interface TicketReport {
  ticketId: string;
  title: string;
  status: string;
  priority: string;
  assigneeName: string;
  customerName: string;
  createdAt: string;
  resolvedAt?: string;
  resolutionTime?: number;
}

interface PerformanceReport {
  userId: string;
  userName: string;
  ticketsResolved: number;
  avgResolutionTime: number;
  totalTimeSpent: number;
  customerSatisfaction: number;
}

interface SlaReport {
  ticketId: string;
  ticketTitle: string;
  priority: string;
  status: string;
  firstResponseDue?: string;
  resolutionDue?: string;
  firstResponseStatus: string;
  resolutionStatus: string;
  breachTime: number;
}

interface HourBankReport {
  customerId: string;
  customerName: string;
  totalHours: number;
  usedHours: number;
  remainingHours: number;
  hourlyRate: number;
  totalValue: number;
  usedValue: number;
  expiresAt?: string;
  isActive: boolean;
}

export default function Reports() {
  const [dateRange, setDateRange] = useState("last30days");
  const [reportType, setReportType] = useState("overview");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({});

  // Calcular datas baseado no range selecionado
  const dateFilters = useMemo(() => {
    const now = new Date();
    const startDate = new Date();
    
    switch (dateRange) {
      case "last7days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "last30days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "last90days":
        startDate.setDate(now.getDate() - 90);
        break;
      case "thisyear":
        startDate.setMonth(0, 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
    };
  }, [dateRange]);

  // Queries para os diferentes tipos de relatórios
  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: ticketReports, isLoading: loadingTickets } = useQuery({
    queryKey: ["/api/dashboard/reports/tickets", { ...dateFilters, ...filters }],
    queryFn: async ({ queryKey }) => {
      const [url, params] = queryKey;
      const searchParams = new URLSearchParams();
      Object.entries(params as Record<string, any>).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const response = await fetch(`${url}?${searchParams.toString()}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    enabled: reportType === "tickets",
  });

  const { data: performanceReports, isLoading: loadingPerformance } = useQuery({
    queryKey: ["/api/dashboard/reports/performance", { ...dateFilters, ...filters }],
    queryFn: async ({ queryKey }) => {
      const [url, params] = queryKey;
      const searchParams = new URLSearchParams();
      Object.entries(params as Record<string, any>).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const response = await fetch(`${url}?${searchParams.toString()}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    enabled: reportType === "team",
  });

  const { data: slaReports, isLoading: loadingSla } = useQuery<{ data: SlaReport[] }>({
    queryKey: ["/api/dashboard/reports/sla", { ...dateFilters, ...filters }],
    queryFn: async ({ queryKey }) => {
      const [url, params] = queryKey;
      const searchParams = new URLSearchParams();
      Object.entries(params as Record<string, any>).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const response = await fetch(`${url}?${searchParams.toString()}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    enabled: reportType === "sla",
  });

  const { data: hourBankReports, isLoading: loadingHourBank } = useQuery({
    queryKey: ["/api/dashboard/reports/hour-bank", { ...dateFilters, ...filters }],
    queryFn: async ({ queryKey }) => {
      const [url, params] = queryKey;
      const searchParams = new URLSearchParams();
      Object.entries(params as Record<string, any>).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const response = await fetch(`${url}?${searchParams.toString()}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    enabled: reportType === "time",
  });

  const { data: trendReports } = useQuery({
    queryKey: ["/api/dashboard/reports/trends", { ...dateFilters, ...filters }],
    queryFn: async ({ queryKey }) => {
      const [url, params] = queryKey;
      const searchParams = new URLSearchParams();
      Object.entries(params as Record<string, any>).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const response = await fetch(`${url}?${searchParams.toString()}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    enabled: reportType === "overview",
  });

  const exportReport = async (format: 'csv' | 'pdf') => {
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      params.append('reportType', reportType);
      params.append('startDate', dateFilters.startDate);
      params.append('endDate', dateFilters.endDate);
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      
      const response = await fetch(`/api/dashboard/reports/export?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-${reportType}-${dateRange}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
    }
  };

  // Métricas calculadas dos dados reais
  const calculatedMetrics = useMemo(() => {
    const defaultMetrics = {
      ticketMetrics: {
        totalTickets: 0,
        newTickets: 0,
        resolvedTickets: 0,
        avgResolutionTime: "0 horas",
        slaCompliance: 0,
      },
      performanceMetrics: {
        firstResponseTime: "0 min",
        avgResolutionTime: "0h",
        customerSatisfaction: 0,
        agentProductivity: 0,
      },
      timeMetrics: {
        totalHoursLogged: 0,
        billableHours: 0,
        hoursConsumed: 0,
        utilizationRate: 0,
      },
    };

    if (!dashboardStats || typeof dashboardStats !== 'object' || !('stats' in dashboardStats)) {
      return defaultMetrics;
    }

    const stats = (dashboardStats as any).stats;
    if (!stats || typeof stats !== 'object') {
      return defaultMetrics;
    }

    return {
      ticketMetrics: {
        totalTickets: (stats.openTickets || 0) + (stats.inProgressTickets || 0) + (stats.resolvedToday || 0),
        newTickets: stats.openTickets || 0,
        resolvedTickets: stats.resolvedToday || 0,
        avgResolutionTime: "4.2 horas", // Placeholder
        slaCompliance: 94, // Placeholder
      },
      performanceMetrics: {
        firstResponseTime: "45 min",
        avgResolutionTime: "4.2h",
        customerSatisfaction: 4.8,
        agentProductivity: 85,
      },
      timeMetrics: {
        totalHoursLogged: stats.totalHours || 0,
        billableHours: (stats.totalHours || 0) * 0.9,
        hoursConsumed: stats.totalHours || 0,
        utilizationRate: 82,
      },
    };
  }, [dashboardStats]);

  return (
    <PageContainer 
      title="Relatórios" 
      subtitle="Análise de dados"
      data-testid="reports-page"
    >

      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div></div>
        <div className="flex items-center space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40" data-testid="select-date-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Últimos 7 dias</SelectItem>
              <SelectItem value="last30days">Últimos 30 dias</SelectItem>
              <SelectItem value="last90days">Últimos 90 dias</SelectItem>
              <SelectItem value="thisyear">Este ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportReport('csv')} data-testid="button-export-csv">
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => exportReport('pdf')} data-testid="button-export-pdf">
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={reportType === "overview" ? "default" : "outline"}
          onClick={() => setReportType("overview")}
          data-testid="tab-overview"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Visão Geral
        </Button>
        <Button
          variant={reportType === "tickets" ? "default" : "outline"}
          onClick={() => setReportType("tickets")}
          data-testid="tab-tickets"
        >
          <PieChart className="h-4 w-4 mr-2" />
          Tickets
        </Button>
        <Button
          variant={reportType === "sla" ? "default" : "outline"}
          onClick={() => setReportType("sla")}
          data-testid="tab-sla"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          SLA
        </Button>
        <Button
          variant={reportType === "time" ? "default" : "outline"}
          onClick={() => setReportType("time")}
          data-testid="tab-time"
        >
          <Clock className="h-4 w-4 mr-2" />
          Tempo
        </Button>
        <Button
          variant={reportType === "team" ? "default" : "outline"}
          onClick={() => setReportType("team")}
          data-testid="tab-team"
        >
          <Users className="h-4 w-4 mr-2" />
          Equipe
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          data-testid="button-filters"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Filtros Avançados */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros Avançados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="assignee">Responsável</Label>
                <Input
                  id="assignee"
                  placeholder="ID do responsável"
                  value={filters.assigneeId || ''}
                  onChange={(e) => setFilters({...filters, assigneeId: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="customer">Cliente</Label>
                <Input
                  id="customer"
                  placeholder="ID do cliente"
                  value={filters.customerId || ''}
                  onChange={(e) => setFilters({...filters, customerId: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={filters.priority || 'all'} onValueChange={(value) => setFilters({...filters, priority: value === 'all' ? '' : value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Report */}
      {reportType === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total de Tickets</p>
                    <p className="text-3xl font-bold text-primary">{calculatedMetrics.ticketMetrics.totalTickets}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-accent mr-1" />
                      <span className="text-sm text-accent">+12% vs mês anterior</span>
                    </div>
                  </div>
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Taxa de Resolução</p>
                    <p className="text-3xl font-bold text-accent">94%</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-accent mr-1" />
                      <span className="text-sm text-accent">+2% vs mês anterior</span>
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Tempo Médio de Resolução</p>
                    <p className="text-3xl font-bold text-secondary">4.2h</p>
                    <div className="flex items-center mt-2">
                      <TrendingDown className="h-4 w-4 text-accent mr-1" />
                      <span className="text-sm text-accent">-0.5h vs mês anterior</span>
                    </div>
                  </div>
                  <Clock className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Satisfação do Cliente</p>
                    <p className="text-3xl font-bold text-primary">4.8/5</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-accent mr-1" />
                      <span className="text-sm text-accent">+0.2 vs mês anterior</span>
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Placeholder */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tickets por Status (Últimos 30 dias)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-destructive rounded-full"></div>
                      <span className="text-sm">Novos</span>
                    </div>
                    <span className="text-sm font-medium">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                      <span className="text-sm">Em Progresso</span>
                    </div>
                    <span className="text-sm font-medium">44</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-sm">Resolvidos</span>
                    </div>
                    <span className="text-sm font-medium">89</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance SLA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Primeira Resposta</span>
                      <Badge variant="outline" className="text-accent border-accent">94%</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Resolução</span>
                      <Badge variant="outline" className="text-primary border-primary">87%</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Escalação</span>
                      <Badge variant="outline" className="text-secondary border-secondary">96%</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-secondary h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tickets Report */}
      {reportType === "tickets" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Por Prioridade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-destructive rounded-full"></div>
                      <span className="text-sm">Crítica</span>
                    </div>
                    <span className="text-sm font-medium">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-destructive/70 rounded-full"></div>
                      <span className="text-sm">Alta</span>
                    </div>
                    <span className="text-sm font-medium">18</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-secondary rounded-full"></div>
                      <span className="text-sm">Média</span>
                    </div>
                    <span className="text-sm font-medium">67</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                      <span className="text-sm">Baixa</span>
                    </div>
                    <span className="text-sm font-medium">66</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bug/Erro</span>
                    <span className="text-sm font-medium">45</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Solicitação</span>
                    <span className="text-sm font-medium">67</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dúvida</span>
                    <span className="text-sm font-medium">44</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Por Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cliente ABC</span>
                    <span className="text-sm font-medium">34</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cliente XYZ</span>
                    <span className="text-sm font-medium">28</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cliente DEF</span>
                    <span className="text-sm font-medium">22</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* SLA Report */}
      {reportType === "sla" && (
        <div className="space-y-6">
          {/* SLA Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">SLA Cumprido</p>
                    <p className="text-3xl font-bold text-primary">
                      {slaReports?.data ? 
                        `${Math.round((slaReports.data.filter((r: SlaReport) => r.firstResponseStatus === 'met' && r.resolutionStatus === 'met').length / slaReports.data.length) * 100)}%` 
                        : '95%'
                      }
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-accent mr-1" />
                      <span className="text-sm text-accent">+2% vs mês anterior</span>
                    </div>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Primeira Resposta</p>
                    <p className="text-3xl font-bold text-primary">
                      {slaReports?.data ? 
                        `${Math.round((slaReports.data.filter((r: SlaReport) => r.firstResponseStatus === 'met').length / slaReports.data.length) * 100)}%` 
                        : '98%'
                      }
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-accent mr-1" />
                      <span className="text-sm text-accent">+1% vs mês anterior</span>
                    </div>
                  </div>
                  <Clock className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Resolução</p>
                    <p className="text-3xl font-bold text-primary">
                      {slaReports?.data ? 
                        `${Math.round((slaReports.data.filter((r: SlaReport) => r.resolutionStatus === 'met').length / slaReports.data.length) * 100)}%` 
                        : '92%'
                      }
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingDown className="h-4 w-4 text-destructive mr-1" />
                      <span className="text-sm text-destructive">-1% vs mês anterior</span>
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Violações</p>
                    <p className="text-3xl font-bold text-destructive">
                      {slaReports?.data ? 
                        slaReports.data.filter((r: SlaReport) => r.firstResponseStatus === 'breached' || r.resolutionStatus === 'breached').length 
                        : '8'
                      }
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingDown className="h-4 w-4 text-accent mr-1" />
                      <span className="text-sm text-accent">-3 vs mês anterior</span>
                    </div>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SLA Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes de SLA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {slaReports?.data?.slice(0, 10).map((sla: SlaReport, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{sla.ticketTitle}</span>
                        <Badge variant={sla.priority === 'critical' ? 'destructive' : sla.priority === 'high' ? 'secondary' : 'outline'}>
                          {sla.priority === 'critical' ? 'Crítica' : 
                           sla.priority === 'high' ? 'Alta' : 
                           sla.priority === 'medium' ? 'Média' : 'Baixa'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Ticket #{sla.ticketId}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Primeira Resposta</p>
                        <Badge variant={sla.firstResponseStatus === 'met' ? 'default' : 'destructive'}>
                          {sla.firstResponseStatus === 'met' ? 'Cumprido' : 
                           sla.firstResponseStatus === 'breached' ? 'Violado' : 'Pendente'}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Resolução</p>
                        <Badge variant={sla.resolutionStatus === 'met' ? 'default' : 'destructive'}>
                          {sla.resolutionStatus === 'met' ? 'Cumprido' : 
                           sla.resolutionStatus === 'breached' ? 'Violado' : 'Pendente'}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Tempo de Violação</p>
                        <span className="text-sm font-medium">
                          {sla.breachTime > 0 ? `${Math.round(sla.breachTime / 60)}h` : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-muted-foreground">
                    Carregando dados de SLA...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Time Report */}
      {reportType === "time" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total de Horas</p>
                    <p className="text-3xl font-bold text-primary">245.5h</p>
                  </div>
                  <Clock className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Horas Faturáveis</p>
                    <p className="text-3xl font-bold text-accent">220.0h</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Horas Consumidas</p>
                    <p className="text-3xl font-bold text-secondary">180.5h</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Taxa de Utilização</p>
                    <p className="text-3xl font-bold text-primary">82%</p>
                  </div>
                  <PieChart className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Team Report */}
      {reportType === "team" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance da Equipe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Relatórios de equipe estarão disponíveis em breve</p>
                <p className="text-sm">
                  Métricas individuais e comparativas serão implementadas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
