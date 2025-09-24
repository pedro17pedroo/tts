import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Ticket, 
  Clock, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Shield,
  Menu,
  X,
  Star
} from "lucide-react";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleRegister = () => {
    window.location.href = "/register";
  };

  const features = [
    {
      icon: <Ticket className="h-8 w-8 text-primary" />,
      title: "Gestão de Tickets",
      description: "Sistema completo com status, prioridades, categorias e roteamento automático"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Bolsa de Horas",
      description: "Controle de horas por cliente com timer automático e relatórios detalhados"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "SLA e Métricas",
      description: "Monitoramento de SLAs com alertas e dashboards personalizáveis"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Multi-tenant",
      description: "Isolamento completo entre empresas com gestão de permissões"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Base de Conhecimento",
      description: "Artigos organizados com busca avançada e portal do cliente"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Segurança",
      description: "Criptografia AES-256, MFA e conformidade com LGPD/GDPR"
    }
  ];

  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "Para começar",
      features: [
        "Até 3 usuários",
        "100 tickets/mês",
        "1GB armazenamento",
        "Suporte básico"
      ],
      buttonText: "Começar Grátis",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Pro",
      price: "R$ 99",
      period: "por mês",
      features: [
        "Até 15 usuários",
        "1.000 tickets/mês",
        "50GB armazenamento",
        "SLA e relatórios",
        "API integração"
      ],
      buttonText: "Assinar Pro",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise",
      price: "R$ 299",
      period: "por mês",
      features: [
        "Usuários ilimitados",
        "Tickets ilimitados",
        "500GB armazenamento",
        "Customização avançada",
        "Suporte prioritário"
      ],
      buttonText: "Assinar Enterprise",
      buttonVariant: "default" as const,
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Como funciona o período de teste?",
      answer: "Você tem 14 dias para testar todas as funcionalidades do plano Pro sem compromisso. Não é necessário cartão de crédito."
    },
    {
      question: "Posso migrar entre planos?",
      answer: "Sim, você pode fazer upgrade ou downgrade a qualquer momento. As mudanças são aplicadas no próximo ciclo de cobrança."
    },
    {
      question: "Os dados são seguros?",
      answer: "Utilizamos criptografia AES-256, backups automáticos e somos compatíveis com LGPD e GDPR."
    },
    {
      question: "Há integração com outras ferramentas?",
      answer: "Sim, oferecemos integrações com Slack, Teams, WhatsApp e API REST para integrações customizadas."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Ticket className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">TatuTicket</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Recursos</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Planos</a>
              <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contato</a>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" onClick={handleLogin}>Login</Button>
              <Button onClick={handleRegister}>Começar Grátis</Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="#features" className="block px-3 py-2 text-muted-foreground hover:text-foreground">Recursos</a>
                <a href="#pricing" className="block px-3 py-2 text-muted-foreground hover:text-foreground">Planos</a>
                <a href="#faq" className="block px-3 py-2 text-muted-foreground hover:text-foreground">FAQ</a>
                <a href="#contact" className="block px-3 py-2 text-muted-foreground hover:text-foreground">Contato</a>
                <div className="pt-4 border-t border-border">
                  <Button variant="ghost" className="w-full justify-start" onClick={handleLogin}>Login</Button>
                  <Button className="w-full mt-2" onClick={handleRegister}>Começar Grátis</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Gestão de Tickets<br />
              <span className="text-accent">Simplificada</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Plataforma SaaS completa para empresas gerenciarem suporte ao cliente, 
              bolsas de horas, SLAs e muito mais. Multi-tenant, escalável e segura.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white" onClick={handleLogin}>
                Teste Grátis por 14 Dias
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Recursos Principais</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tudo que sua empresa precisa para oferecer suporte excepcional aos clientes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos e Preços</h2>
            <p className="text-muted-foreground text-lg">Escolha o plano ideal para sua empresa</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`p-8 relative ${plan.popular ? 'border-2 border-accent' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent text-white">Mais Popular</Badge>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-primary mb-2">{plan.price}</div>
                  <p className="text-muted-foreground">{plan.period}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-accent mr-3" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.buttonVariant} 
                  className="w-full"
                  onClick={handleLogin}
                >
                  {plan.buttonText}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Perguntas Frequentes</h2>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para Começar?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Junte-se a centenas de empresas que já usam o TatuTicket
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-white" onClick={handleLogin}>
            Criar Conta Grátis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Ticket className="h-6 w-6" />
                <span className="text-xl font-bold">TatuTicket</span>
              </div>
              <p className="text-primary-foreground/80">
                Plataforma SaaS para gestão de tickets e suporte ao cliente.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#features" className="hover:text-primary-foreground">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-primary-foreground">Preços</a></li>
                <li><a href="#" className="hover:text-primary-foreground">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground">Sobre</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Blog</a></li>
                <li><a href="#contact" className="hover:text-primary-foreground">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground">Documentação</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Status</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Privacidade</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/80">
            <p>&copy; 2024 TatuTicket. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
