import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Plus, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import HourBankCard from "@/components/hour-bank/hour-bank-card";

const hourBankSchema = z.object({
  customerId: z.string().min(1, "Cliente é obrigatório"),
  totalHours: z.string().min(1, "Total de horas é obrigatório"),
  hourlyRate: z.string().optional(),
  expiresAt: z.string().optional(),
});

type HourBankFormData = z.infer<typeof hourBankSchema>;

interface HourBank {
  id: string;
  customerId: string;
  totalHours: string;
  consumedHours: string;
  hourlyRate?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

export default function HourBank() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: hourBanks = [], isLoading } = useQuery<HourBank[]>({
    queryKey: ["/api/hour-banks"],
  });

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const form = useForm<HourBankFormData>({
    resolver: zodResolver(hourBankSchema),
    defaultValues: {
      customerId: "",
      totalHours: "",
      hourlyRate: "",
      expiresAt: "",
    },
  });

  const createHourBankMutation = useMutation({
    mutationFn: async (data: HourBankFormData) => {
      const payload = {
        customerId: data.customerId,
        totalHours: parseFloat(data.totalHours),
        hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate) : undefined,
        expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : undefined,
      };
      const response = await apiRequest("POST", "/api/hour-banks", payload);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hour-banks"] });
      setIsCreateModalOpen(false);
      form.reset();
      toast({
        title: "Bolsa de horas criada",
        description: "Bolsa de horas criada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar bolsa de horas",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: HourBankFormData) => {
    createHourBankMutation.mutate(data);
  };

  // Calculate statistics
  const stats = {
    totalSold: hourBanks.reduce((sum, bank) => sum + parseFloat(bank.totalHours), 0),
    consumed: hourBanks.reduce((sum, bank) => sum + parseFloat(bank.consumedHours), 0),
    totalValue: hourBanks.reduce((sum, bank) => {
      if (bank.hourlyRate) {
        return sum + (parseFloat(bank.totalHours) * parseFloat(bank.hourlyRate));
      }
      return sum;
    }, 0),
    activeBanks: hourBanks.filter(bank => bank.isActive).length,
  };

  stats.available = stats.totalSold - stats.consumed;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" data-testid="hour-bank-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bolsa de Horas</h1>
          <p className="text-muted-foreground">Gerencie as bolsas de horas dos seus clientes</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90" data-testid="button-create-hour-bank">
              <Plus className="h-4 w-4 mr-2" />
              Nova Bolsa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Bolsa de Horas</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-customer">
                            <SelectValue placeholder="Selecione um cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total de Horas *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.5"
                          min="0"
                          {...field}
                          data-testid="input-total-hours"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor por Hora (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...field}
                          data-testid="input-hourly-rate"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Expiração</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          data-testid="input-expires-at"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    data-testid="button-cancel-hour-bank"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createHourBankMutation.isPending}
                    data-testid="button-save-hour-bank"
                  >
                    {createHourBankMutation.isPending ? "Criando..." : "Criar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total de Horas Vendidas</p>
                <p className="text-3xl font-bold text-accent">{stats.totalSold.toFixed(1)}h</p>
              </div>
              <Clock className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Horas Consumidas</p>
                <p className="text-3xl font-bold text-primary">{stats.consumed.toFixed(1)}h</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Saldo Disponível</p>
                <p className="text-3xl font-bold text-secondary">{stats.available.toFixed(1)}h</p>
              </div>
              <TrendingDown className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Valor Total</p>
                <p className="text-3xl font-bold text-primary">
                  R$ {stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hour Banks */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Client Hour Banks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Bolsas por Cliente ({stats.activeBanks})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {hourBanks.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma bolsa de horas criada</h3>
                <p className="text-muted-foreground mb-4">
                  Comece criando bolsas de horas para seus clientes
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Bolsa
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {hourBanks.map((hourBank) => (
                  <HourBankCard key={hourBank.id} hourBank={hourBank} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Consumption */}
        <Card>
          <CardHeader>
            <CardTitle>Consumo Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum consumo recente</p>
                <p className="text-sm">
                  Os registros de tempo aparecerão aqui quando tickets forem trabalhados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
