import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Ticket, Plus, X, CheckCircle, CreditCard, Users, HardDrive } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

// Payment form component
function PaymentForm({ onPaymentComplete }: { onPaymentComplete: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: "if_required",
    });

    if (error) {
      toast({
        title: "Erro no pagamento",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Pagamento confirmado!",
        description: "Assinatura ativada com sucesso.",
      });
      onPaymentComplete();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || isProcessing}
        data-testid="button-confirm-payment"
      >
        {isProcessing ? "Processando..." : "Confirmar Pagamento"}
      </Button>
    </form>
  );
}

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<{
    subscriptionId?: string;
    customerId?: string;
  }>({});
  const [formData, setFormData] = useState({
    tenantName: "",
    cnpj: "",
    planType: "free" as "free" | "pro" | "enterprise",
    departments: ["Suporte Técnico", "Comercial"],
    categories: ["Bug/Erro", "Solicitação", "Dúvida"],
  });

  const [newDepartment, setNewDepartment] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const onboardingMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/onboarding", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Onboarding concluído!",
        description: "Sua conta foi configurada com sucesso.",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Erro no onboarding",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addDepartment = () => {
    if (newDepartment.trim() && !formData.departments.includes(newDepartment.trim())) {
      setFormData(prev => ({
        ...prev,
        departments: [...prev.departments, newDepartment.trim()]
      }));
      setNewDepartment("");
    }
  };

  const removeDepartment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.filter((_, i) => i !== index)
    }));
  };

  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
      setNewCategory("");
    }
  };

  const removeCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (!formData.tenantName.trim()) {
      toast({
        title: "Nome da empresa obrigatório",
        description: "Por favor, informe o nome da sua empresa.",
        variant: "destructive",
      });
      return;
    }

    // For paid plans, ensure payment is completed
    if (formData.planType !== "free" && !paymentCompleted) {
      toast({
        title: "Pagamento necessário",
        description: "Complete o pagamento para prosseguir.",
        variant: "destructive",
      });
      return;
    }

    onboardingMutation.mutate({
      ...formData,
      ...(subscriptionData.customerId && { stripeCustomerId: subscriptionData.customerId }),
      ...(subscriptionData.subscriptionId && { stripeSubscriptionId: subscriptionData.subscriptionId }),
    } as any);
  };

  const nextStep = async () => {
    if (step === 1 && !formData.tenantName.trim()) {
      toast({
        title: "Nome da empresa obrigatório",
        description: "Por favor, informe o nome da sua empresa.",
        variant: "destructive",
      });
      return;
    }
    
    // If moving to payment step for paid plans
    if (step === 1 && formData.planType !== "free") {
      try {
        const response = await apiRequest("POST", "/api/onboarding-subscription", {
          planType: formData.planType,
          tenantName: formData.tenantName
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
        setSubscriptionData({
          subscriptionId: data.subscriptionId,
          customerId: data.customerId,
        });
      } catch (error) {
        toast({
          title: "Erro ao processar pagamento",
          description: "Não foi possível iniciar o processo de pagamento.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Ticket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">TatuTicket</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Bem-vindo ao TatuTicket!</h1>
          <p className="text-muted-foreground">Vamos configurar sua conta em alguns passos simples</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 1 ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <span className={`ml-2 text-sm ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                Informações & Plano
              </span>
            </div>
            <div className="w-12 h-0.5 bg-border"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 2 ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {step > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className={`ml-2 text-sm ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
                {(formData.planType === "pro" || formData.planType === "enterprise") ? "Pagamento" : "Configuração"}
              </span>
            </div>
            <div className="w-12 h-0.5 bg-border"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 3 ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {step > 3 ? <CheckCircle className="w-5 h-5" /> : '3'}
              </div>
              <span className={`ml-2 text-sm ${step >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>
                {(formData.planType === "pro" || formData.planType === "enterprise") ? "Configuração" : "Finalizar"}
              </span>
            </div>
            {(formData.planType === "pro" || formData.planType === "enterprise") && (
              <>
                <div className="w-12 h-0.5 bg-border"></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= 4 ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    4
                  </div>
                  <span className={`ml-2 text-sm ${step >= 4 ? 'text-foreground' : 'text-muted-foreground'}`}>
                    Finalizar
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="mb-6">Informações da Empresa</CardTitle>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="tenantName">Nome da Empresa *</Label>
                      <Input
                        id="tenantName"
                        value={formData.tenantName}
                        onChange={(e) => setFormData(prev => ({ ...prev, tenantName: e.target.value }))}
                        placeholder="Minha Empresa Ltda"
                        data-testid="input-tenant-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        value={formData.cnpj}
                        onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                        placeholder="00.000.000/0000-00"
                        data-testid="input-cnpj"
                      />
                    </div>
                    <div>
                      <Label className="text-lg font-semibold mb-4 block">Escolha seu Plano</Label>
                      <div className="grid gap-4">
                        {[
                          {
                            id: "free",
                            name: "Gratuito",
                            price: "R$ 0",
                            period: "Para sempre",
                            features: ["Até 3 usuários", "100 tickets/mês", "1GB armazenamento", "Suporte básico"],
                            recommended: false,
                          },
                          {
                            id: "pro",
                            name: "Pro",
                            price: "R$ 99",
                            period: "por mês",
                            features: ["Até 15 usuários", "1.000 tickets/mês", "50GB armazenamento", "SLA e relatórios", "API integração"],
                            recommended: true,
                          },
                          {
                            id: "enterprise",
                            name: "Enterprise",
                            price: "R$ 299",
                            period: "por mês",
                            features: ["Usuários ilimitados", "Tickets ilimitados", "500GB armazenamento", "Customização avançada", "Suporte prioritário"],
                            recommended: false,
                          },
                        ].map((plan) => (
                          <div
                            key={plan.id}
                            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              formData.planType === plan.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, planType: plan.id as "free" | "pro" | "enterprise" }))}
                            data-testid={`plan-${plan.id}`}
                          >
                            {plan.recommended && (
                              <Badge className="absolute -top-2 left-4 bg-accent text-white">Recomendado</Badge>
                            )}
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-lg">{plan.name}</h3>
                                <div className="flex items-baseline">
                                  <span className="text-2xl font-bold text-primary">{plan.price}</span>
                                  <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                                </div>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                formData.planType === plan.id 
                                  ? 'border-primary bg-primary' 
                                  : 'border-border'
                              }`}>
                                {formData.planType === plan.id && (
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                              </div>
                            </div>
                            <ul className="space-y-1">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center text-sm">
                                  <CheckCircle className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <CardTitle className="mb-6">Configuração Inicial</CardTitle>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Departamentos</h3>
                    <div className="space-y-3">
                      {formData.departments.map((dept, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span>{dept}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDepartment(index)}
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-remove-department-${index}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                        <Input
                          value={newDepartment}
                          onChange={(e) => setNewDepartment(e.target.value)}
                          placeholder="Nome do departamento"
                          onKeyDown={(e) => e.key === 'Enter' && addDepartment()}
                          data-testid="input-new-department"
                        />
                        <Button
                          variant="outline"
                          onClick={addDepartment}
                          data-testid="button-add-department"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Categorias de Tickets</h3>
                    <div className="space-y-3">
                      {formData.categories.map((cat, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span>{cat}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCategory(index)}
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-remove-category-${index}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                        <Input
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="Nome da categoria"
                          onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                          data-testid="input-new-category"
                        />
                        <Button
                          variant="outline"
                          onClick={addCategory}
                          data-testid="button-add-category"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && formData.planType !== "free" && (
              <div className="space-y-6">
                <div className="text-center">
                  <CardTitle className="mb-2 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 mr-2" />
                    Confirmar Assinatura
                  </CardTitle>
                  <p className="text-muted-foreground mb-6">
                    Complete o pagamento para ativar seu plano {formData.planType === "pro" ? "Pro" : "Enterprise"}
                  </p>
                  <div className="bg-accent/10 p-4 rounded-lg mb-6">
                    <div className="text-lg font-semibold text-accent">
                      {formData.planType === "pro" ? "R$ 99" : "R$ 299"}/mês
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Plano {formData.planType === "pro" ? "Pro" : "Enterprise"} - {formData.tenantName}
                    </div>
                  </div>
                </div>
                {!stripePromise ? (
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground mb-4">
                      Sistema de pagamento não configurado no momento.
                    </p>
                    <Button 
                      onClick={() => setPaymentCompleted(true)}
                      className="w-full"
                      data-testid="button-skip-payment"
                    >
                      Pular Pagamento (Configurar Depois)
                    </Button>
                  </div>
                ) : !clientSecret ? (
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                    <p className="text-muted-foreground mt-2">Preparando pagamento...</p>
                  </div>
                ) : (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm onPaymentComplete={() => setPaymentCompleted(true)} />
                  </Elements>
                )}
              </div>
            )}

            {step === (formData.planType === "free" ? 3 : 4) && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Tudo Pronto!</h2>
                  <p className="text-muted-foreground mb-6">
                    Sua conta foi configurada com sucesso. Você pode começar a usar o TatuTicket agora.
                  </p>
                  <div className="bg-muted/30 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-2">Resumo da Configuração:</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>Empresa:</strong> {formData.tenantName}</p>
                      <p><strong>Plano:</strong> {formData.planType}</p>
                      <p><strong>Departamentos:</strong> {formData.departments.length}</p>
                      <p><strong>Categorias:</strong> {formData.categories.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-8 border-t border-border">
              {step > 1 ? (
                <Button variant="outline" onClick={prevStep} data-testid="button-previous">
                  Voltar
                </Button>
              ) : (
                <div />
              )}

              {step < (formData.planType === "free" ? 3 : (paymentCompleted ? 4 : 3)) ? (
                <Button onClick={nextStep} data-testid="button-next">
                  Próximo
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={onboardingMutation.isPending}
                  data-testid="button-finish"
                >
                  {onboardingMutation.isPending ? "Configurando..." : "Finalizar Configuração"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
