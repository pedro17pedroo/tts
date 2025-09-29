import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Clock, Settings, TrendingUp, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";
import PageContainer from "@/components/ui/page-container";

// Tipos para SLA
interface SlaConfig {
  id: string;
  categoryId?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  firstResponseMinutes: number;
  resolutionMinutes: number;
  businessHoursStart: string;
  businessHoursEnd: string;
  businessDays: number[];
  timezone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SlaAlert {
  id: string;
  ticketId: string;
  type: 'first_response_at_risk' | 'resolution_at_risk' | 'first_response_breached' | 'resolution_breached';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
}

interface SlaReport {
  totalTickets: number;
  compliantTickets: number;
  breachedTickets: number;
  complianceRate: number;
  averageResponseTime: number;
  averageResolutionTime: number;
}

// Função para fazer requisições à API
async function apiRequest(method: string, endpoint: string, data?: any) {
  const response = await fetch(`/api/sla${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro na requisição');
  }

  return response.json();
}

export default function SlaPage() {
  const [activeTab, setActiveTab] = useState("configs");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<SlaConfig | null>(null);
  const { toast } = useToast();
  const { t } = useTranslations();
  const queryClient = useQueryClient();

  // Queries
  const { data: slaConfigs = [], isLoading: configsLoading } = useQuery({
    queryKey: ['sla-configs'],
    queryFn: () => apiRequest('GET', '/configs'),
    select: (data) => Array.isArray(data) ? data : [],
  });

  const { data: slaAlerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ['sla-alerts'],
    queryFn: () => apiRequest('GET', '/alerts'),
    select: (data) => Array.isArray(data) ? data : [],
  });

  const { data: slaReport, isLoading: reportLoading } = useQuery({
    queryKey: ['sla-report'],
    queryFn: () => apiRequest('GET', '/reports?startDate=' + new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() + '&endDate=' + new Date().toISOString()),
  });

  // Mutations
  const createConfigMutation = useMutation({
    mutationFn: (data: Partial<SlaConfig>) => apiRequest('POST', '/configs', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sla-configs'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Sucesso",
        description: "Configuração SLA criada com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SlaConfig> }) => 
      apiRequest('PATCH', `/configs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sla-configs'] });
      setEditingConfig(null);
      toast({
        title: "Sucesso",
        description: "Configuração SLA atualizada com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteConfigMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/configs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sla-configs'] });
      toast({
        title: "Sucesso",
        description: "Configuração SLA removida com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Funções auxiliares
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <PageContainer 
      title="SLA" 
      subtitle="Gestão de acordos"
      className="space-y-6"
    >

      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div></div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Configuração SLA
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conformidade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportLoading ? '...' : `${(slaReport?.complianceRate || 0).toFixed(1)}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio Resposta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportLoading ? '...' : formatMinutes(slaReport?.averageResponseTime || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Média geral
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio Resolução</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportLoading ? '...' : formatMinutes(slaReport?.averageResolutionTime || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Média geral
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alertsLoading ? '...' : slaAlerts.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requerem atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="configs">Configurações</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        {/* Tab de Configurações */}
        <TabsContent value="configs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de SLA</CardTitle>
              <CardDescription>
                Defina os tempos de resposta e resolução por prioridade
              </CardDescription>
            </CardHeader>
            <CardContent>
              {configsLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Primeira Resposta</TableHead>
                      <TableHead>Resolução</TableHead>
                      <TableHead>Horário Comercial</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(slaConfigs) ? slaConfigs.map((config: SlaConfig) => (
                      <TableRow key={config.id}>
                        <TableCell>
                          <Badge className={getPriorityColor(config.priority)}>
                            {config.priority.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatMinutes(config.firstResponseMinutes)}</TableCell>
                        <TableCell>{formatMinutes(config.resolutionMinutes)}</TableCell>
                        <TableCell>
                          {config.businessHoursStart} - {config.businessHoursEnd}
                        </TableCell>
                        <TableCell>
                          <Badge variant={config.isActive ? "default" : "secondary"}>
                            {config.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingConfig(config)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteConfigMutation.mutate(config.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )) : null}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Alertas */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de SLA</CardTitle>
              <CardDescription>
                Tickets que estão em risco ou violaram o SLA
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alertsLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : slaAlerts.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  Nenhum alerta ativo no momento
                </div>
              ) : (
                <div className="space-y-3">
                  {slaAlerts.map((alert: SlaAlert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Ticket #{alert.ticketId}</h4>
                          <p className="text-sm mt-1">{alert.message}</p>
                          <p className="text-xs mt-2 opacity-75">
                            {new Date(alert.createdAt).toLocaleString('pt-AO')}
                          </p>
                        </div>
                        <Badge variant="outline" className={alert.severity}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Relatórios */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Performance SLA</CardTitle>
              <CardDescription>
                Análise detalhada do cumprimento dos SLAs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Resumo Geral</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total de Tickets:</span>
                        <span className="font-medium">{slaReport?.totalTickets || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tickets Conformes:</span>
                        <span className="font-medium text-green-600">{slaReport?.compliantTickets || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tickets Violados:</span>
                        <span className="font-medium text-red-600">{slaReport?.breachedTickets || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Tempos Médios</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Primeira Resposta:</span>
                        <span className="font-medium">{formatMinutes(slaReport?.averageResponseTime || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Resolução:</span>
                        <span className="font-medium">{formatMinutes(slaReport?.averageResolutionTime || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxa de Conformidade:</span>
                        <span className="font-medium">{(slaReport?.complianceRate || 0).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para criar/editar configuração SLA */}
      <SlaConfigDialog
        isOpen={isCreateDialogOpen || !!editingConfig}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setEditingConfig(null);
        }}
        config={editingConfig}
        onSave={(data) => {
          if (editingConfig) {
            updateConfigMutation.mutate({ id: editingConfig.id, data });
          } else {
            createConfigMutation.mutate(data);
          }
        }}
        isLoading={createConfigMutation.isPending || updateConfigMutation.isPending}
      />
    </PageContainer>
  );
}

// Componente do Dialog para configuração SLA
interface SlaConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  config?: SlaConfig | null;
  onSave: (data: Partial<SlaConfig>) => void;
  isLoading: boolean;
}

function SlaConfigDialog({ isOpen, onClose, config, onSave, isLoading }: SlaConfigDialogProps) {
  const [formData, setFormData] = useState({
    priority: config?.priority || 'medium',
    firstResponseMinutes: config?.firstResponseMinutes || 60,
    resolutionMinutes: config?.resolutionMinutes || 480,
    businessHoursStart: config?.businessHoursStart || '09:00',
    businessHoursEnd: config?.businessHoursEnd || '18:00',
    businessDays: config?.businessDays || [1, 2, 3, 4, 5],
    timezone: config?.timezone || 'Africa/Luanda',
    isActive: config?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {config ? 'Editar Configuração SLA' : 'Nova Configuração SLA'}
          </DialogTitle>
          <DialogDescription>
            Configure os tempos de resposta e resolução para esta prioridade
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => setFormData({ ...formData, timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Luanda">África/Luanda</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstResponse">Primeira Resposta (minutos)</Label>
              <Input
                id="firstResponse"
                type="number"
                value={formData.firstResponseMinutes}
                onChange={(e) => setFormData({ ...formData, firstResponseMinutes: parseInt(e.target.value) })}
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolution">Resolução (minutos)</Label>
              <Input
                id="resolution"
                type="number"
                value={formData.resolutionMinutes}
                onChange={(e) => setFormData({ ...formData, resolutionMinutes: parseInt(e.target.value) })}
                min="1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Início Expediente</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.businessHoursStart}
                onChange={(e) => setFormData({ ...formData, businessHoursStart: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Fim Expediente</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.businessHoursEnd}
                onChange={(e) => setFormData({ ...formData, businessHoursEnd: e.target.value })}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}