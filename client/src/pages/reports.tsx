import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, TrendingUp, TrendingDown, BarChart3, PieChart, Clock, Users } from "lucide-react";

export default function Reports() {
  const [dateRange, setDateRange] = useState("last30days");
  const [reportType, setReportType] = useState("overview");

  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const mockMetrics = {
    ticketMetrics: {
      totalTickets: 156,
      newTickets: 23,
      resolvedTickets: 89,
      avgResolutionTime: "4.2 horas",
      slaCompliance: 94,
    },
    performanceMetrics: {
      firstResponseTime: "45 min",
      avgResolutionTime: "4.2h",
      customerSatisfaction: 4.8,
      agentProductivity: 85,
    },
    timeMetrics: {
      totalHoursLogged: 245.5,
      billableHours: 220.0,
      hoursConsumed: 180.5,
      utilizationRate: 82,
    },
  };

  const exportReport = (format: 'csv' | 'pdf') => {
    // This would typically call an API endpoint to generate and download the report
    console.log(`Exporting report as ${format.toUpperCase()}`);
  };

  return (
    <div className="p-6" data-testid="reports-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Análise detalhada de performance e métricas</p>
        </div>
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
      <div className="flex space-x-2 mb-6">
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
      </div>

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
                    <p className="text-3xl font-bold text-primary">{mockMetrics.ticketMetrics.totalTickets}</p>
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
    </div>
  );
}
