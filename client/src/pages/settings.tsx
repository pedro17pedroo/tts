import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings as SettingsIcon, 
  Building, 
  Users, 
  CreditCard, 
  Bell, 
  Shield, 
  Palette,
  Clock,
  Mail,
  Globe,
  Trash2,
  Plus
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const companySchema = z.object({
  name: z.string().min(1, "Nome da empresa é obrigatório"),
  cnpj: z.string().optional(),
  domain: z.string().optional(),
});

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  slackNotifications: z.boolean(),
  smsNotifications: z.boolean(),
});

type CompanyFormData = z.infer<typeof companySchema>;
type NotificationFormData = z.infer<typeof notificationSchema>;

export default function Settings() {
  const [activeTab, setActiveTab] = useState("company");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: departments = [] } = useQuery({
    queryKey: ["/api/departments"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "Minha Empresa",
      cnpj: "",
      domain: "",
    },
  });

  const notificationForm = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      slackNotifications: false,
      smsNotifications: false,
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async (data: CompanyFormData) => {
      // This would call the tenant update API
      const response = await apiRequest("PATCH", "/api/tenant", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Configurações salvas",
        description: "As configurações da empresa foram atualizadas.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: async (data: NotificationFormData) => {
      // This would call the notification settings API
      const response = await apiRequest("PATCH", "/api/settings/notifications", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Notificações atualizadas",
        description: "As configurações de notificação foram salvas.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmitCompany = (data: CompanyFormData) => {
    updateCompanyMutation.mutate(data);
  };

  const onSubmitNotifications = (data: NotificationFormData) => {
    updateNotificationsMutation.mutate(data);
  };

  return (
    <div className="p-6" data-testid="settings-page">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações da sua conta e organização</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="company" data-testid="tab-company">
            <Building className="h-4 w-4 mr-2" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="users" data-testid="tab-users">
            <Users className="h-4 w-4 mr-2" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="billing" data-testid="tab-billing">
            <CreditCard className="h-4 w-4 mr-2" />
            Cobrança
          </TabsTrigger>
          <TabsTrigger value="notifications" data-testid="tab-notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security" data-testid="tab-security">
            <Shield className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="customization" data-testid="tab-customization">
            <Palette className="h-4 w-4 mr-2" />
            Personalização
          </TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...companyForm}>
                  <form onSubmit={companyForm.handleSubmit(onSubmitCompany)} className="space-y-4">
                    <FormField
                      control={companyForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Empresa</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-company-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={companyForm.control}
                      name="cnpj"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CNPJ</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-company-cnpj" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={companyForm.control}
                      name="domain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Domínio Personalizado</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="suporte.minhaempresa.com" data-testid="input-company-domain" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      disabled={updateCompanyMutation.isPending}
                      data-testid="button-save-company"
                    >
                      {updateCompanyMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Departments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Departamentos</CardTitle>
                  <Button size="sm" data-testid="button-add-department">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departments.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Nenhum departamento configurado</p>
                  ) : (
                    departments.map((dept: any) => (
                      <div key={dept.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span>{dept.name}</span>
                        <Button variant="ghost" size="icon" data-testid={`button-delete-department-${dept.id}`}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Categorias de Tickets</CardTitle>
                  <Button size="sm" data-testid="button-add-category">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Nenhuma categoria configurada</p>
                  ) : (
                    categories.map((cat: any) => (
                      <div key={cat.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: cat.color || '#3b82f6' }}
                          />
                          <span>{cat.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" data-testid={`button-delete-category-${cat.id}`}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Settings */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Usuários da Organização</CardTitle>
                <Button data-testid="button-invite-user">
                  <Plus className="h-4 w-4 mr-2" />
                  Convidar Usuário
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                      {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-medium">{user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Badge>Admin</Badge>
                </div>
                
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum outro usuário na organização</p>
                  <p className="text-sm">Convide membros da equipe para colaborar</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Plano Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Plano Gratuito</h3>
                    <p className="text-muted-foreground">Até 3 usuários, 100 tickets/mês</p>
                  </div>
                  <Button data-testid="button-upgrade-plan">Fazer Upgrade</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uso Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Usuários</span>
                      <span className="text-sm">1 / 3</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '33%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Tickets este mês</span>
                      <span className="text-sm">0 / 100</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Armazenamento</span>
                      <span className="text-sm">0 MB / 1 GB</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-secondary h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onSubmitNotifications)} className="space-y-6">
                  <FormField
                    control={notificationForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Notificações por Email</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Receba emails sobre novos tickets e atualizações
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-email-notifications"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notificationForm.control}
                    name="slackNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Integração Slack</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Envie notificações para canais do Slack
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-slack-notifications"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notificationForm.control}
                    name="smsNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">SMS para Emergências</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            SMS apenas para tickets críticos
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-sms-notifications"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    disabled={updateNotificationsMutation.isPending}
                    data-testid="button-save-notifications"
                  >
                    {updateNotificationsMutation.isPending ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Segurança</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Autenticação de Dois Fatores</h4>
                    <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                  </div>
                  <Button variant="outline" data-testid="button-setup-2fa">Configurar</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Sessões Ativas</h4>
                    <p className="text-sm text-muted-foreground">Gerencie dispositivos conectados</p>
                  </div>
                  <Button variant="outline" data-testid="button-manage-sessions">Gerenciar</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Log de Auditoria</h4>
                    <p className="text-sm text-muted-foreground">Visualize atividades recentes</p>
                  </div>
                  <Button variant="outline" data-testid="button-view-audit">Visualizar</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customization Settings */}
        <TabsContent value="customization">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personalização da Interface</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="logo">Logo da Empresa</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <Building className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <Button variant="outline" data-testid="button-upload-logo">Upload Logo</Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label>Cores do Tema</Label>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    <div className="w-8 h-8 bg-primary rounded cursor-pointer border-2 border-primary"></div>
                    <div className="w-8 h-8 bg-accent rounded cursor-pointer border-2 border-transparent hover:border-accent"></div>
                    <div className="w-8 h-8 bg-secondary rounded cursor-pointer border-2 border-transparent hover:border-secondary"></div>
                    <div className="w-8 h-8 bg-destructive rounded cursor-pointer border-2 border-transparent hover:border-destructive"></div>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select defaultValue="america/sao_paulo">
                    <SelectTrigger className="mt-2" data-testid="select-timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/sao_paulo">América/São Paulo (UTC-3)</SelectItem>
                      <SelectItem value="america/new_york">América/Nova York (UTC-5)</SelectItem>
                      <SelectItem value="europe/london">Europa/Londres (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
