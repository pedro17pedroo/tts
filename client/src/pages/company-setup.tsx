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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Ticket, 
  Building, 
  Users, 
  CheckCircle, 
  Star, 
  HardDrive, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Loader2 
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";
import { useLocale } from "@/contexts/LocaleContext";
import PaymentForm from "@/components/PaymentForm";

// Schema para cada etapa
const companyInfoSchema = z.object({
  tenantName: z.string().min(2, "Nome da empresa deve ter pelo menos 2 caracteres"),
  nif: z.string().optional(), // Angola tax ID
});

const planSelectionSchema = z.object({
  planType: z.enum(["free", "pro", "enterprise"], {
    required_error: "Você deve selecionar um plano para continuar",
  }),
});

type CompanyInfoForm = z.infer<typeof companyInfoSchema>;
type PlanSelectionForm = z.infer<typeof planSelectionSchema>;

type SetupStep = "company" | "plan" | "payment" | "processing" | "success";

export default function CompanySetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslations();
  const { formatCurrency } = useLocale();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState<SetupStep>("company");
  const [error, setError] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<CompanyInfoForm | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [paymentData, setPaymentData] = useState<{
    clientSecret: string;
    subscriptionId: string;
    customerId: string;
  } | null>(null);

  // Plans with Angola pricing (Kwanza)
  const plans = [
    {
      id: "free",
      name: "Gratuito",
      price: 0,
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
      price: 12000, // 12000 Kz ≈ $49 USD
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
      price: 36000, // 36000 Kz ≈ $149 USD  
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

  const companyForm = useForm<CompanyInfoForm>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      tenantName: "",
      nif: "",
    },
  });

  const planForm = useForm<PlanSelectionForm>({
    resolver: zodResolver(planSelectionSchema),
  });

  // Mutation to create subscription for paid plans
  const subscriptionMutation = useMutation({
    mutationFn: async (data: { planType: string; tenantName: string }) => {
      const response = await apiRequest("POST", "/api/onboarding-subscription", data);
      return response.json();
    },
    onSuccess: (data) => {
      setPaymentData(data);
      setCurrentStep("payment");
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Falha ao criar subscription";
      setError(errorMessage);
      toast({
        title: "Erro ao criar subscription",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Mutation to complete onboarding
  const onboardingMutation = useMutation({
    mutationFn: async (data: CompanyInfoForm & { 
      planType: string; 
      stripeCustomerId?: string; 
      stripeSubscriptionId?: string;
    }) => {
      const response = await apiRequest("POST", "/api/onboarding", data);
      return response;
    },
    onSuccess: () => {
      setCurrentStep("success");
      toast({
        title: "Empresa criada com sucesso!",
        description: "Bem-vindo ao TatuTicket. Sua conta está pronta para uso.",
      });
      // Invalidate user query to refetch with new tenant
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      // Redirect after a short delay to show success message
      setTimeout(() => {
        setLocation("/");
      }, 2000);
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

  const handleCompanySubmit = (data: CompanyInfoForm) => {
    setCompanyData(data);
    setCurrentStep("plan");
  };

  const handlePlanSubmit = (data: PlanSelectionForm) => {
    setSelectedPlan(data.planType);
    
    if (data.planType === "free") {
      // For free plan, go directly to onboarding completion
      if (companyData) {
        onboardingMutation.mutate({
          ...companyData,
          planType: data.planType,
        });
      }
    } else {
      // For paid plans, create subscription and go to payment
      if (companyData) {
        subscriptionMutation.mutate({
          planType: data.planType,
          tenantName: companyData.tenantName,
        });
      }
    }
  };

  const handlePaymentSuccess = (paymentMethodId: string) => {
    if (companyData && paymentData) {
      onboardingMutation.mutate({
        ...companyData,
        planType: selectedPlan,
        stripeCustomerId: paymentData.customerId,
        stripeSubscriptionId: paymentData.subscriptionId,
      });
    }
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case "company": return 25;
      case "plan": return 50;
      case "payment": return 75;
      case "processing": return 90;
      case "success": return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header with Progress */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Ticket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">TatuTicket</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Configuração da Empresa</h1>
          <p className="text-muted-foreground">Configure sua empresa em alguns passos simples</p>
          
          <div className="max-w-md mx-auto mt-6">
            <Progress value={getStepProgress()} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Empresa</span>
              <span>Plano</span>
              <span>Pagamento</span>
              <span>Pronto</span>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Company Information */}
        {currentStep === "company" && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Informações da Empresa</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={companyForm.handleSubmit(handleCompanySubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="tenantName">Nome da Empresa</Label>
                  <Input
                    id="tenantName"
                    {...companyForm.register("tenantName")}
                    placeholder="Digite o nome da sua empresa"
                    data-testid="input-company-name"
                  />
                  {companyForm.formState.errors.tenantName && (
                    <p className="text-sm text-destructive mt-1">
                      {companyForm.formState.errors.tenantName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="nif">NIF (Opcional)</Label>
                  <Input
                    id="nif"
                    {...companyForm.register("nif")}
                    placeholder="Número de Identificação Fiscal"
                    data-testid="input-nif"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  data-testid="button-continue-company"
                >
                  Continuar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Plan Selection */}
        {currentStep === "plan" && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Escolha seu Plano</h2>
              <p className="text-muted-foreground">Selecione o plano que melhor atende às suas necessidades</p>
            </div>

            <form onSubmit={planForm.handleSubmit(handlePlanSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      planForm.watch("planType") === plan.id 
                        ? "ring-2 ring-primary shadow-lg" 
                        : ""
                    } ${plan.popular ? "border-primary" : ""}`}
                    onClick={() => planForm.setValue("planType", plan.id as any)}
                    data-testid={`card-plan-${plan.id}`}
                  >
                    <CardHeader className="text-center">
                      {plan.popular && (
                        <Badge className="mx-auto mb-2 w-fit">Mais Popular</Badge>
                      )}
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        {plan.icon}
                        <span className="font-semibold">{plan.name}</span>
                      </div>
                      <div className="text-3xl font-bold">
                        {plan.price === 0 ? "Grátis" : formatCurrency(plan.price)}
                        <span className="text-sm font-normal text-muted-foreground">
                          {plan.period}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentStep("company")}
                  data-testid="button-back-to-company"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                
                <Button 
                  type="submit" 
                  disabled={!planForm.watch("planType")}
                  data-testid="button-continue-plan"
                >
                  {planForm.watch("planType") === "free" ? "Finalizar" : "Continuar para Pagamento"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Payment (for paid plans) */}
        {currentStep === "payment" && paymentData && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Informações de Pagamento</h2>
              <p className="text-muted-foreground">
                Plano selecionado: <strong>{plans.find(p => p.id === selectedPlan)?.name}</strong>
              </p>
            </div>

            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <PaymentForm
                  clientSecret={paymentData.clientSecret}
                  planName={plans.find(p => p.id === selectedPlan)?.name || ""}
                  amount={formatCurrency(plans.find(p => p.id === selectedPlan)?.price || 0)}
                  onSuccess={handlePaymentSuccess}
                  onError={(error) => {
                    setError(error);
                    toast({
                      title: "Erro no pagamento",
                      description: error,
                      variant: "destructive",
                    });
                  }}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Processing */}
        {currentStep === "processing" && (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Configurando sua empresa...</h3>
              <p className="text-muted-foreground">
                Estamos preparando tudo para você. Isso levará apenas alguns segundos.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Success */}
        {currentStep === "success" && (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Bem-vindo ao TatuTicket!</h3>
              <p className="text-muted-foreground mb-4">
                Sua empresa foi criada com sucesso. Você será redirecionado para o painel em instantes.
              </p>
              <div className="animate-pulse">
                <p className="text-sm text-muted-foreground">Redirecionando...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}