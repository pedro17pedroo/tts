import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { HeaderLanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { 
  Ticket, 
  Home, 
  Users, 
  Clock, 
  BookOpen, 
  BarChart3, 
  Settings,
  Bell,
  Plus,
  Menu,
  X,
  LogOut,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Lock scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: Home, 
      current: location === '/dashboard',
      description: 'Visão geral do sistema'
    },
    { 
      name: 'Tickets', 
      href: '/tickets', 
      icon: Ticket, 
      current: location === '/tickets',
      description: 'Gerir tickets de suporte',
      badge: 3
    },
    { 
      name: 'Clientes', 
      href: '/customers', 
      icon: Users, 
      current: location === '/customers',
      description: 'Base de clientes'
    },
    { 
      name: 'Bolsa de Horas', 
      href: '/hour-bank', 
      icon: Clock, 
      current: location === '/hour-bank',
      description: 'Gestão de horas'
    },
    { 
      name: 'Base de Conhecimento', 
      href: '/knowledge-base', 
      icon: BookOpen, 
      current: location === '/knowledge-base',
      description: 'Artigos e documentação'
    },
    { 
      name: 'Relatórios', 
      href: '/reports', 
      icon: BarChart3, 
      current: location === '/reports',
      description: 'Analytics e métricas'
    },
    { 
      name: 'Configurações', 
      href: '/settings', 
      icon: Settings, 
      current: location === '/settings',
      description: 'Configurações da conta'
    },
  ];

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getPageTitle = () => {
    const currentRoute = navigation.find(nav => nav.current);
    return currentRoute?.name || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm sidebar-backdrop z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
          data-testid="sidebar-backdrop"
        />
      )}

      {/* Sidebar */}
      <nav 
        id="sidebar"
        className={`fixed left-0 top-0 h-full w-72 bg-card/95 backdrop-blur-lg border-r border-border/50 shadow-xl z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:z-auto lg:w-72`}
        aria-label="Navigation principale"
        data-testid="sidebar"
      >
        {/* Header Section */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm"></div>
                <Ticket className="relative h-8 w-8 text-primary" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  TatuTicket
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-muted/50"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-3 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.firstName ? `${user.firstName}'s Company` : 'Pedro\'s Company'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Plano Professional • Ativo
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="group">
                  <button
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      item.current 
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 transform scale-[0.98]' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:transform hover:scale-[0.98]'
                    }`}
                    onClick={() => {
                      setLocation(item.href);
                      setIsSidebarOpen(false);
                    }}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    aria-current={item.current ? "page" : undefined}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={`p-1.5 rounded-lg ${
                        item.current 
                          ? 'bg-white/20' 
                          : 'bg-muted/30 group-hover:bg-muted'
                      }`}>
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-medium truncate text-sm">
                          {item.name}
                        </p>
                        <p className={`text-xs truncate ${
                          item.current 
                            ? 'text-primary-foreground/70' 
                            : 'text-muted-foreground group-hover:text-foreground/70'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <Badge 
                          variant={item.current ? "secondary" : "outline"}
                          className={`text-xs ${
                            item.current 
                              ? 'bg-white/20 text-primary-foreground border-white/20' 
                              : ''
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {item.current && (
                        <ChevronRight className="h-4 w-4 opacity-70" />
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="mx-4" />

        {/* User Profile Section */}
        <div className="p-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarImage src={user?.profileImageUrl || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-semibold">
                  {user?.firstName?.[0] || user?.email?.[0] || 'P'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Pedro Nekaka'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || 'pedro@empresa.co.ao'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="lg:ml-72">
        {/* Top bar */}
        <header className="bg-card/80 backdrop-blur-lg border-b border-border/50 px-4 md:px-8 py-4 md:py-5 sticky top-0 z-30">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-muted/50"
                onClick={() => setIsSidebarOpen(true)}
                data-testid="button-menu"
                aria-label="Abrir menu de navegação"
                aria-expanded={isSidebarOpen}
                aria-controls="sidebar"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">
                  {getPageTitle()}
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  {navigation.find(nav => nav.current)?.description || 'Gerencie sua plataforma'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 md:space-x-4 shrink-0">
              <div className="hidden md:flex items-center space-x-2">
                <HeaderLanguageSwitcher />
                <ThemeToggle />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="relative hover:bg-muted/50 border-border/50"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></span>
                </span>
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 text-sm md:text-base font-medium"
                onClick={() => setLocation('/tickets')}
                data-testid="button-new-ticket"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Novo Ticket</span>
                <span className="sm:hidden">Novo</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
