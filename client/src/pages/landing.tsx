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
import { useTranslations } from "@/hooks/useTranslations";
import { translations } from "@/lib/translations";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslations();

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleRegister = () => {
    window.location.href = "/saas-register";
  };

  const features = [
    {
      icon: <Ticket className="h-8 w-8 text-primary" />,
      title: t('landing.featureList.ticketManagement.title'),
      description: t('landing.featureList.ticketManagement.description')
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: t('landing.featureList.hourBank.title'),
      description: t('landing.featureList.hourBank.description')
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: t('landing.featureList.slaMetrics.title'),
      description: t('landing.featureList.slaMetrics.description')
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: t('landing.featureList.multiTenant.title'),
      description: t('landing.featureList.multiTenant.description')
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: t('landing.featureList.knowledgeBase.title'),
      description: t('landing.featureList.knowledgeBase.description')
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: t('landing.featureList.security.title'),
      description: t('landing.featureList.security.description')
    }
  ];

  const plans = [
    {
      name: t('landing.plans.free.name'),
      price: t('landing.plans.free.price'),
      period: t('landing.plans.free.period'),
      features: translations.landing.plans.free.features,
      buttonText: t('landing.plans.free.cta'),
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: t('landing.plans.pro.name'),
      price: t('landing.plans.pro.price'),
      period: t('landing.plans.pro.period'),
      features: translations.landing.plans.pro.features,
      buttonText: t('landing.plans.pro.cta'),
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: t('landing.plans.enterprise.name'),
      price: t('landing.plans.enterprise.price'),
      period: t('landing.plans.enterprise.period'),
      features: translations.landing.plans.enterprise.features,
      buttonText: t('landing.plans.enterprise.cta'),
      buttonVariant: "default" as const,
      popular: false
    }
  ];

  const faqs = [
    {
      question: t('landing.faqList.trial.question'),
      answer: t('landing.faqList.trial.answer')
    },
    {
      question: t('landing.faqList.migration.question'),
      answer: t('landing.faqList.migration.answer')
    },
    {
      question: t('landing.faqList.security.question'),
      answer: t('landing.faqList.security.answer')
    },
    {
      question: t('landing.faqList.integration.question'),
      answer: t('landing.faqList.integration.answer')
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
              <span className="text-xl font-bold text-primary">{t('landing.brandName')}</span>
            </div>
            
            {/* Desktop Navigation - Full Layout (lg+) */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">{t('landing.featuresNav')}</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">{t('landing.pricing')}</a>
              <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">{t('landing.faqNav')}</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">{t('landing.contact')}</a>
            </div>
            
            {/* Tablet Navigation - Compact Layout (md-lg) */}
            <div className="hidden md:flex lg:hidden items-center space-x-4">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t('landing.featuresNav')}</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t('landing.pricing')}</a>
              <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t('landing.faqNav')}</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t('landing.contact')}</a>
            </div>
            
            {/* Desktop Buttons - Full Size (lg+) */}
            <div className="hidden lg:flex items-center space-x-4">
              <LanguageSwitcher 
                variant="icon-only" 
                testId="nav-language-switcher-desktop"
              />
              <ThemeToggle 
                variant="icon-only" 
                testId="nav-theme-toggle-desktop"
              />
              <Button variant="ghost" onClick={handleLogin} data-testid="button-login-desktop">{t('common.login')}</Button>
              <Button onClick={handleRegister} data-testid="button-register-desktop">{t('landing.getStarted')}</Button>
            </div>

            {/* Tablet Buttons - Compact (md-lg) */}
            <div className="hidden md:flex lg:hidden items-center space-x-2">
              <LanguageSwitcher 
                variant="icon-only" 
                testId="nav-language-switcher-tablet"
              />
              <ThemeToggle 
                variant="icon-only" 
                testId="nav-theme-toggle-tablet"
              />
              <Button variant="ghost" size="sm" onClick={handleLogin} data-testid="button-login-tablet">{t('common.login')}</Button>
              <Button size="sm" onClick={handleRegister} data-testid="button-register-tablet">{t('landing.getStarted')}</Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="#features" className="block px-3 py-2 text-muted-foreground hover:text-foreground">{t('landing.featuresNav')}</a>
                <a href="#pricing" className="block px-3 py-2 text-muted-foreground hover:text-foreground">{t('landing.pricing')}</a>
                <a href="#faq" className="block px-3 py-2 text-muted-foreground hover:text-foreground">{t('landing.faqNav')}</a>
                <a href="#contact" className="block px-3 py-2 text-muted-foreground hover:text-foreground">{t('landing.contact')}</a>
                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between px-3">
                    <span className="text-sm font-medium text-muted-foreground">Settings</span>
                    <div className="flex items-center space-x-2">
                      <LanguageSwitcher 
                        variant="compact" 
                        testId="nav-language-switcher-mobile"
                      />
                      <ThemeToggle 
                        variant="compact" 
                        testId="nav-theme-toggle-mobile"
                      />
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full justify-start" onClick={handleLogin} data-testid="button-login-mobile">{t('common.login')}</Button>
                  <Button className="w-full" onClick={handleRegister} data-testid="button-register-mobile">{t('landing.getStarted')}</Button>
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
              {t('landing.heroTitle')}
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              {t('landing.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white" onClick={handleRegister}>
                {t('landing.getStarted')}
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                {t('landing.watchDemo')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('landing.featuresTitle')}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('landing.featuresTitle')}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('landing.pricingTitle')}</h2>
            <p className="text-muted-foreground text-lg">{t('landing.pricingTitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`p-8 relative ${plan.popular ? 'border-2 border-accent' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent text-white">{t('landing.plans.pro.popular')}</Badge>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-primary mb-2">{plan.price}</div>
                  <p className="text-muted-foreground">{plan.period}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature: string, featureIndex: number) => (
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('landing.faqTitle')}</h2>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('landing.contact')}</h2>
          <p className="text-muted-foreground text-lg mb-8">
            {t('landing.tagline')}
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-white" onClick={handleLogin}>
            {t('landing.getStarted')}
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
                <span className="text-xl font-bold">{t('landing.brandName')}</span>
              </div>
              <p className="text-primary-foreground/80">
                {t('landing.tagline')}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.product')}</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#features" className="hover:text-primary-foreground">{t('landing.featuresNav')}</a></li>
                <li><a href="#pricing" className="hover:text-primary-foreground">{t('landing.pricing')}</a></li>
                <li><a href="#" className="hover:text-primary-foreground">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.company')}</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground">Sobre</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Blog</a></li>
                <li><a href="#contact" className="hover:text-primary-foreground">{t('landing.contact')}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.support')}</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground">Documentação</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Status</a></li>
                <li><a href="#" className="hover:text-primary-foreground">{t('landing.footer.privacyPolicy')}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/80">
            <p>&copy; 2024 {t('landing.brandName')}. {t('landing.footer.allRightsReserved')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
