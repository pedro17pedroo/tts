import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Ticket, Plus, X, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
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

    onboardingMutation.mutate(formData);
  };

  const nextStep = () => {
    if (step === 1 && !formData.tenantName.trim()) {
      toast({
        title: "Nome da empresa obrigatório",
        description: "Por favor, informe o nome da sua empresa.",
        variant: "destructive",
      });
      return;
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
                Informações Básicas
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
                Configuração
              </span>
            </div>
            <div className="w-12 h-0.5 bg-border"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 3 ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'
              }`}>
                3
              </div>
              <span className={`ml-2 text-sm ${step >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>
                Finalizar
              </span>
            </div>
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
                      <Label htmlFor="planType">Plano</Label>
                      <Select 
                        value={formData.planType} 
                        onValueChange={(value: "free" | "pro" | "enterprise") => 
                          setFormData(prev => ({ ...prev, planType: value }))
                        }
                      >
                        <SelectTrigger data-testid="select-plan">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Gratuito</SelectItem>
                          <SelectItem value="pro">Pro - R$ 99/mês</SelectItem>
                          <SelectItem value="enterprise">Enterprise - R$ 299/mês</SelectItem>
                        </SelectContent>
                      </Select>
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

            {step === 3 && (
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

              {step < 3 ? (
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
