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
// PaymentForm removido - não mais necessário no fluxo simplificado

// Schema para validação das etapas do fluxo simplificado
const companyInfoSchema = z.object({
  tenantName: z.string().min(2, "Nome da empresa deve ter pelo menos 2 caracteres"),
  nif: z.string().min(1, "NIF é obrigatório"),
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

type CompanyInfoForm = z.infer<typeof companyInfoSchema>;
type UserRegistrationForm = z.infer<typeof userRegistrationSchema>;

type RegistrationStep = "company" | "user" | "processing" | "success";


export default function SaasRegister() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Estados do fluxo
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("company");
  const [companyData, setCompanyData] = useState<CompanyInfoForm | null>(null);
  const [userData, setUserData] = useState<UserRegistrationForm | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Forms para o fluxo simplificado
  const companyForm = useForm<CompanyInfoForm>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      tenantName: "",
      nif: "",
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


  // Mutation para completar onboarding
  const onboardingMutation = useMutation({
    mutationFn: async (data: CompanyInfoForm & { planType: string; stripeCustomerId?: string; stripeSubscriptionId?: string }) => {
      const response = await apiRequest("POST", "/api/onboarding", data);
      return response.json();
    },
    onSuccess: async () => {
      setCurrentStep("success");
      toast({
        title: "Empresa criada com sucesso!",
        description: "Redirecionando para o seu dashboard...",
      });
      
      // Invalidate user query to refetch with new tenant
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      // Wait for user query to be updated with tenantId before redirecting
      const waitForUserUpdate = async () => {
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts) {
          try {
            const userData = queryClient.getQueryData(["/api/auth/user"]) as any;
            if (userData?.data?.tenantId) {
              // User has tenantId, safe to redirect to dashboard
              setLocation("/");
              return;
            }
            
            // Wait a bit and try again
            await new Promise(resolve => setTimeout(resolve, 300));
            attempts++;
          } catch (error) {
            console.error("Error checking user data:", error);
            break;
          }
        }
        
        // Fallback: redirect anyway after max attempts
        setLocation("/");
      };
      
      // Start waiting after a short delay to show success message
      setTimeout(waitForUserUpdate, 1500);
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
      // Agora cria a empresa com plano trial de 14 dias automaticamente
      onboardingMutation.mutate({
        ...companyData!,
        planType: "free", // Trial implementado como plano free
      });
    } catch (error) {
      setCurrentStep("user");
    }
  };

  // Removidas handlePaymentSuccess e handlePaymentError - não mais necessárias no novo fluxo

  const handleBack = () => {
    setError(null);
    switch (currentStep) {
      case "user":
        setCurrentStep("company");
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
      case "company": return 33;
      case "user": return 66;
      case "processing": return 90;
      case "success": return 100;
      default: return 0;
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Ticket className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            <span className="text-2xl md:text-3xl font-bold text-primary">TatuTicket</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Criar Sua Conta</h1>
          <p className="text-sm md:text-base text-muted-foreground px-4">
            {currentStep === "company" && "Informações da sua empresa"}
            {currentStep === "user" && "Suas informações de login"}
            {currentStep === "processing" && "Processando seu registro..."}
            {currentStep === "success" && "Conta criada com sucesso! 14 dias grátis incluídos."}
          </p>
        </div>

        {/* Progress Bar */}
        {currentStep !== "success" && (
          <div className="w-full">
            <Progress value={getStepProgress()} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Empresa</span>
              <span>Usuário</span>
              <span>Conclusão</span>
            </div>
          </div>
        )}

        {/* Back Button */}
        {currentStep !== "company" && currentStep !== "success" && currentStep !== "processing" && (
          <div className="flex justify-start">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center space-x-2"
              disabled={registerMutation.isPending || onboardingMutation.isPending}
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

        {/* Step 1: Company Information */}
        {currentStep === "company" && (
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">Informações da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <form onSubmit={companyForm.handleSubmit(handleCompanyInfo)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantName" className="text-sm md:text-base">Nome da Empresa *</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="tenantName"
                      placeholder="Nome da sua empresa"
                      className="pl-10 text-sm md:text-base"
                      data-testid="input-tenant-name"
                      {...companyForm.register("tenantName")}
                    />
                  </div>
                  {companyForm.formState.errors.tenantName && (
                    <p className="text-xs md:text-sm text-destructive">
                      {companyForm.formState.errors.tenantName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nif" className="text-sm md:text-base">NIF *</Label>
                  <Input
                    id="nif"
                    placeholder="000000000"
                    data-testid="input-nif"
                    className="text-sm md:text-base"
                    {...companyForm.register("nif")}
                  />
                  {companyForm.formState.errors.nif && (
                    <p className="text-xs md:text-sm text-destructive">
                      {companyForm.formState.errors.nif.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    className="flex items-center space-x-2 text-sm md:text-base"
                    data-testid="button-next-company"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: User Registration */}
        {currentStep === "user" && (
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">Suas Informações</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <form onSubmit={userForm.handleSubmit(handleUserRegistration)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm md:text-base">Nome *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        placeholder="Seu nome"
                        className="pl-10 text-sm md:text-base"
                        data-testid="input-first-name"
                        {...userForm.register("firstName")}
                      />
                    </div>
                    {userForm.formState.errors.firstName && (
                      <p className="text-xs md:text-sm text-destructive">
                        {userForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm md:text-base">Sobrenome *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        placeholder="Seu sobrenome"
                        className="pl-10 text-sm md:text-base"
                        data-testid="input-last-name"
                        {...userForm.register("lastName")}
                      />
                    </div>
                    {userForm.formState.errors.lastName && (
                      <p className="text-xs md:text-sm text-destructive">
                        {userForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm md:text-base">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      placeholder="seu@email.com"
                      type="email"
                      className="pl-10 text-sm md:text-base"
                      data-testid="input-email"
                      {...userForm.register("email")}
                    />
                  </div>
                  {userForm.formState.errors.email && (
                    <p className="text-xs md:text-sm text-destructive">
                      {userForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm md:text-base">Senha *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      placeholder="Sua senha (min. 6 caracteres)"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10 text-sm md:text-base"
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
                    <p className="text-xs md:text-sm text-destructive">
                      {userForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm md:text-base">Confirmar Senha *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      placeholder="Confirme sua senha"
                      type={showConfirmPassword ? "text" : "password"}
                      className="pl-10 pr-10 text-sm md:text-base"
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
                    <p className="text-xs md:text-sm text-destructive">
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

        {/* Step 3: Processing */}
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

        {/* Step 4: Success */}
        {currentStep === "success" && (
          <Card>
            <CardContent className="py-16 text-center">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-accent" />
              <h3 className="text-2xl font-bold mb-2">Conta Criada com Sucesso!</h3>
              <p className="text-muted-foreground mb-4">
                Bem-vindo ao TatuTicket! Sua conta e empresa foram criadas.
              </p>
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-accent mb-2">🎉 Trial de 14 Dias Ativado!</h4>
                <p className="text-sm text-muted-foreground">
                  Você tem acesso completo a todas as funcionalidades por 14 dias.
                  Após este período, será necessário escolher um plano de assinatura.
                </p>
              </div>
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