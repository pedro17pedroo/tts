import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Ticket, Building, FileText, Users, CheckCircle, Star, HardDrive, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const onboardingSchema = z.object({
  tenantName: z.string().min(2, "Nome da empresa deve ter pelo menos 2 caracteres"),
  cnpj: z.string().optional(),
  planType: z.enum(["free", "pro", "enterprise"], {
    required_error: "Você deve selecionar um plano para continuar",
  }),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

const plans = [
  {
    id: "free",
    name: "Gratuito",
    price: "R$ 0",
    period: "/mês",
    description: "Perfeito para começar",
    features: [
      "Até 3 usuários",
      "100 tickets/mês",
      "1GB armazenamento",
      "Suporte básico"
    ],
    icon: <Users className="h-5 w-5" />,
    maxUsers: 3,
    maxTickets: 100,
    maxStorage: 1
  },
  {
    id: "pro",
    name: "Profissional",
    price: "R$ 49",
    period: "/mês",
    description: "Para equipes em crescimento",
    features: [
      "Até 15 usuários",
      "1000 tickets/mês",
      "10GB armazenamento",
      "Suporte prioritário",
      "Relatórios avançados",
      "Integrações"
    ],
    icon: <Star className="h-5 w-5" />,
    maxUsers: 15,
    maxTickets: 1000,
    maxStorage: 10,
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "R$ 149",
    period: "/mês",
    description: "Para grandes organizações",
    features: [
      "Usuários ilimitados",
      "Tickets ilimitados",
      "100GB armazenamento",
      "Suporte 24/7",
      "White-label",
      "API personalizada",
      "SLA garantido"
    ],
    icon: <Building className="h-5 w-5" />,
    maxUsers: 999999,
    maxTickets: 999999,
    maxStorage: 100
  }
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      tenantName: "",
      cnpj: "",
    },
  });

  const onboardingMutation = useMutation({
    mutationFn: async (data: OnboardingForm) => {
      const response = await apiRequest("POST", "/api/onboarding", data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Empresa criada com sucesso!",
        description: "Bem-vindo ao TatuTicket. Sua conta está pronta para uso.",
      });
      // Invalidate user query to refetch with new tenant
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/");
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Falha ao criar empresa";
      setError(errorMessage);
      toast({
        title: "Erro ao criar empresa",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: OnboardingForm) => {
    setError(null);
    
    if (!selectedPlan) {
      setError("Você deve selecionar um plano para continuar");
      toast({
        title: "Plano obrigatório",
        description: "Você deve selecionar um plano para criar sua empresa",
        variant: "destructive",
      });
      return;
    }
    
    onboardingMutation.mutate({
      ...data,
      planType: selectedPlan as any,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Ticket className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold text-primary">TatuTicket</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Configure sua Empresa</h1>
          <p className="text-muted-foreground">
            Crie sua empresa e escolha o plano ideal para começar a usar o TatuTicket
          </p>
        </div>

        {/* Main Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Informações da Empresa</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenantName">Nome da Empresa</Label>
                    <Input
                      id="tenantName"
                      placeholder="Digite o nome da sua empresa"
                      data-testid="input-tenant-name"
                      {...form.register("tenantName")}
                    />
                    {form.formState.errors.tenantName && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.tenantName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ (Opcional)</Label>
                    <Input
                      id="cnpj"
                      placeholder="00.000.000/0000-00"
                      data-testid="input-cnpj"
                      {...form.register("cnpj")}
                    />
                    {form.formState.errors.cnpj && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.cnpj.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={onboardingMutation.isPending || !selectedPlan}
                    data-testid="button-create-company"
                  >
                    {onboardingMutation.isPending ? "Criando empresa..." : 
                     !selectedPlan ? "Selecione um plano" : "Criar Empresa"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Plan Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Escolha seu Plano</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                      data-testid={`plan-${plan.id}`}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-2 left-4 bg-primary">
                          Mais Popular
                        </Badge>
                      )}
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                            {plan.icon}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">{plan.name}</h3>
                            <div className="flex items-baseline space-x-1">
                              <span className="text-2xl font-bold text-primary">
                                {plan.price}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {plan.period}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {plan.description}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {plan.features.map((feature, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0">
                          <div className={`w-5 h-5 rounded-full border-2 ${
                            selectedPlan === plan.id
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/30"
                          }`}>
                            {selectedPlan === plan.id && (
                              <CheckCircle className="w-full h-full text-primary-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedPlan && (
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-primary">
                        Plano Selecionado: {plans.find(p => p.id === selectedPlan)?.name}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Nota:</strong> Você pode alterar seu plano a qualquer momento nas configurações.
                      {selectedPlan === "free" && " O plano gratuito não requer pagamento."}
                      {(selectedPlan === "pro" || selectedPlan === "enterprise") && 
                        " Você será direcionado para configurar o pagamento após criar a empresa."}
                    </p>
                  </div>
                )}
                
                {!selectedPlan && (
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
                        <span className="text-white text-sm">!</span>
                      </div>
                      <p className="text-sm text-amber-800 font-medium">
                        Selecione um plano para continuar com a criação da empresa
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}