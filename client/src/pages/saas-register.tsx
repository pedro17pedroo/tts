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
  Loader2,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import PaymentForm from "@/components/PaymentForm";

// Schema para validação de cada etapa
const planSelectionSchema = z.object({
  planType: z.enum(["free", "pro", "enterprise"], {
    required_error: "Você deve selecionar um plano para continuar",
  }),
});

const companyInfoSchema = z.object({
  tenantName: z.string().min(2, "Nome da empresa deve ter pelo menos 2 caracteres"),
  cnpj: z.string().optional(),
});

const userRegistrationSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirmação de senha é obrigatória"),
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

type PlanSelectionForm = z.infer<typeof planSelectionSchema>;
type CompanyInfoForm = z.infer<typeof companyInfoSchema>;
type UserRegistrationForm = z.infer<typeof userRegistrationSchema>;

type RegistrationStep = "plan" | "company" | "user" | "payment" | "processing" | "success";

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

export default function SaasRegister() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Estados do fluxo
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("plan");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [companyData, setCompanyData] = useState<CompanyInfoForm | null>(null);
  const [userData, setUserData] = useState<UserRegistrationForm | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Estados para pagamento
  const [paymentData, setPaymentData] = useState<{
    clientSecret: string;
    subscriptionId: string;
    customerId: string;
  } | null>(null);

  // Forms para cada etapa
  const planForm = useForm<PlanSelectionForm>({
    resolver: zodResolver(planSelectionSchema),
    defaultValues: { planType: undefined },
  });

  const companyForm = useForm<CompanyInfoForm>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      tenantName: "",
      cnpj: "",
    },
  });

  const userForm = useForm<UserRegistrationForm>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  // Mutation para registrar usuário
  const registerMutation = useMutation({
    mutationFn: async (data: { email: string; password: string; firstName: string; lastName: string }) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate user query to refetch with new user
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Falha no registro do usuário";
      setError(errorMessage);
      toast({
        title: "Erro no registro",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Mutation para criar subscription para planos pagos
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

  // Mutation para completar onboarding
  const onboardingMutation = useMutation({
    mutationFn: async (data: CompanyInfoForm & { planType: string; stripeCustomerId?: string; stripeSubscriptionId?: string }) => {
      const response = await apiRequest("POST", "/api/onboarding", data);
      return response.json();
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

  // Navegação entre etapas
  const handlePlanSelection = (data: PlanSelectionForm) => {
    setSelectedPlan(data.planType);
    setCurrentStep("company");
    setError(null);
  };

  const handleCompanyInfo = (data: CompanyInfoForm) => {
    setCompanyData(data);
    setCurrentStep("user");
    setError(null);
  };

  const handleUserRegistration = async (data: UserRegistrationForm) => {
    setUserData(data);
    setError(null);
    setCurrentStep("processing");

    try {
      // Primeiro registra o usuário
      await registerMutation.mutateAsync({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      // Se chegou até aqui, o usuário foi registrado com sucesso
      // Agora processa a criação da empresa
      if (selectedPlan === "free") {
        // Para plano gratuito, cria empresa diretamente
        onboardingMutation.mutate({
          ...companyData!,
          planType: selectedPlan,
        });
      } else {
        // Para planos pagos, cria subscription primeiro
        subscriptionMutation.mutate({
          planType: selectedPlan,
          tenantName: companyData!.tenantName,
        });
      }
    } catch (error) {
      setCurrentStep("user");
    }
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    if (!companyData || !paymentData) return;

    // Complete onboarding with payment info
    onboardingMutation.mutate({
      ...companyData,
      planType: selectedPlan,
      stripeCustomerId: paymentData.customerId,
      stripeSubscriptionId: paymentData.subscriptionId,
    });
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setCurrentStep("payment");
  };

  const handleBack = () => {
    setError(null);
    switch (currentStep) {
      case "company":
        setCurrentStep("plan");
        break;
      case "user":
        setCurrentStep("company");
        break;
      case "payment":
        setCurrentStep("user");
        setPaymentData(null);
        break;
      case "processing":
        setCurrentStep("user");
        break;
      default:
        setLocation("/");
    }
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case "plan": return 25;
      case "company": return 50;
      case "user": return 75;
      case "payment": return 90;
      case "processing": return 95;
      case "success": return 100;
      default: return 0;
    }
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Ticket className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold text-primary">TatuTicket</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Criar Sua Conta</h1>
          <p className="text-muted-foreground">
            {currentStep === "plan" && "Escolha o plano ideal para sua empresa"}
            {currentStep === "company" && "Informações da sua empresa"}
            {currentStep === "user" && "Suas informações de login"}
            {currentStep === "payment" && "Finalizar pagamento"}
            {currentStep === "processing" && "Processando seu registro..."}
            {currentStep === "success" && "Conta criada com sucesso!"}
          </p>
        </div>

        {/* Progress Bar */}
        {currentStep !== "success" && (
          <div className="w-full">
            <Progress value={getStepProgress()} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Plano</span>
              <span>Empresa</span>
              <span>Usuário</span>
              <span>Conclusão</span>
            </div>
          </div>
        )}

        {/* Back Button */}
        {currentStep !== "plan" && currentStep !== "success" && currentStep !== "processing" && (
          <div className="flex justify-start">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center space-x-2"
              disabled={registerMutation.isPending || subscriptionMutation.isPending || onboardingMutation.isPending}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Plan Selection */}
        {currentStep === "plan" && (
          <Card>
            <CardHeader>
              <CardTitle>Escolha seu Plano</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={planForm.handleSubmit(handlePlanSelection)} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <Card 
                      key={plan.id} 
                      className={`relative cursor-pointer transition-all hover:shadow-lg ${
                        selectedPlan === plan.id 
                          ? 'border-2 border-primary ring-2 ring-primary/20' 
                          : 'border hover:border-primary/50'
                      } ${plan.popular ? 'border-accent' : ''}`}
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        planForm.setValue("planType", plan.id as any);
                      }}
                      data-testid={`plan-${plan.id}`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-accent text-white">Mais Popular</Badge>
                        </div>
                      )}
                      
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          <div className="flex justify-center mb-2">
                            {plan.icon}
                          </div>
                          <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                          <div className="text-2xl font-bold text-primary mb-1">{plan.price}</div>
                          <p className="text-muted-foreground text-sm">{plan.period}</p>
                          <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                        </div>
                        
                        <ul className="space-y-2 mb-4">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {selectedPlan === plan.id && (
                          <div className="flex justify-center">
                            <CheckCircle className="h-6 w-6 text-primary" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {planForm.formState.errors.planType && (
                  <p className="text-sm text-destructive text-center">
                    {planForm.formState.errors.planType.message}
                  </p>
                )}

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={!selectedPlan}
                    className="flex items-center space-x-2"
                    data-testid="button-next-plan"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Company Information */}
        {currentStep === "company" && (
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={companyForm.handleSubmit(handleCompanyInfo)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantName">Nome da Empresa *</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="tenantName"
                      placeholder="Nome da sua empresa"
                      className="pl-10"
                      data-testid="input-tenant-name"
                      {...companyForm.register("tenantName")}
                    />
                  </div>
                  {companyForm.formState.errors.tenantName && (
                    <p className="text-sm text-destructive">
                      {companyForm.formState.errors.tenantName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ (opcional)</Label>
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    data-testid="input-cnpj"
                    {...companyForm.register("cnpj")}
                  />
                  {companyForm.formState.errors.cnpj && (
                    <p className="text-sm text-destructive">
                      {companyForm.formState.errors.cnpj.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    className="flex items-center space-x-2"
                    data-testid="button-next-company"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: User Registration */}
        {currentStep === "user" && (
          <Card>
            <CardHeader>
              <CardTitle>Suas Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={userForm.handleSubmit(handleUserRegistration)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        placeholder="Seu nome"
                        className="pl-10"
                        data-testid="input-first-name"
                        {...userForm.register("firstName")}
                      />
                    </div>
                    {userForm.formState.errors.firstName && (
                      <p className="text-sm text-destructive">
                        {userForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        placeholder="Seu sobrenome"
                        className="pl-10"
                        data-testid="input-last-name"
                        {...userForm.register("lastName")}
                      />
                    </div>
                    {userForm.formState.errors.lastName && (
                      <p className="text-sm text-destructive">
                        {userForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      placeholder="seu@email.com"
                      type="email"
                      className="pl-10"
                      data-testid="input-email"
                      {...userForm.register("email")}
                    />
                  </div>
                  {userForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {userForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      placeholder="Sua senha (min. 6 caracteres)"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      data-testid="input-password"
                      {...userForm.register("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      data-testid="button-toggle-password"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {userForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {userForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      placeholder="Confirme sua senha"
                      type={showConfirmPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      data-testid="input-confirm-password"
                      {...userForm.register("confirmPassword")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      data-testid="button-toggle-confirm-password"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {userForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {userForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="flex items-center space-x-2"
                    data-testid="button-create-account"
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Criando conta...</span>
                      </>
                    ) : (
                      <>
                        <span>Criar Conta</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Payment (for paid plans) */}
        {currentStep === "payment" && paymentData && selectedPlanData && (
          <Card>
            <CardHeader>
              <CardTitle>Finalizar Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentForm
                clientSecret={paymentData.clientSecret}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                planName={selectedPlanData.name}
                amount={selectedPlanData.price}
              />
            </CardContent>
          </Card>
        )}

        {/* Step 5: Processing */}
        {currentStep === "processing" && (
          <Card>
            <CardContent className="py-16 text-center">
              <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Processando sua conta...</h3>
              <p className="text-muted-foreground">
                Estamos criando sua empresa e configurando tudo para você.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Success */}
        {currentStep === "success" && (
          <Card>
            <CardContent className="py-16 text-center">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-accent" />
              <h3 className="text-2xl font-bold mb-2">Conta Criada com Sucesso!</h3>
              <p className="text-muted-foreground mb-6">
                Bem-vindo ao TatuTicket! Sua conta e empresa foram criadas.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecionando para o dashboard...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <div>
            Já tem uma conta?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-primary"
              onClick={() => setLocation("/login")}
              data-testid="link-login"
            >
              Fazer login
            </Button>
          </div>
          <div>
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => setLocation("/")}
              data-testid="link-home"
            >
              Voltar ao início
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}