import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { HeaderLanguageSwitcher } from "@/components/ui/language-switcher";
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
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    { name: 'Dashboard', href: '/', icon: Home, current: location === '/' },
    { name: 'Tickets', href: '/tickets', icon: Ticket, current: location === '/tickets' },
    { name: 'Clientes', href: '/customers', icon: Users, current: location === '/customers' },
    { name: 'Bolsa de Horas', href: '/hour-bank', icon: Clock, current: location === '/hour-bank' },
    { name: 'Base de Conhecimento', href: '/knowledge-base', icon: BookOpen, current: location === '/knowledge-base' },
    { name: 'Relatórios', href: '/reports', icon: BarChart3, current: location === '/reports' },
    { name: 'Configurações', href: '/settings', icon: Settings, current: location === '/settings' },
  ];

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getPageTitle = () => {
    const currentRoute = navigation.find(nav => nav.current);
    return currentRoute?.name || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
          data-testid="sidebar-backdrop"
        />
      )}

      {/* Sidebar */}
      <nav 
        className={`fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:z-auto lg:w-64 md:w-56`}
        aria-label="Navigation principale"
        data-testid="sidebar"
      >
        <div className="p-4 md:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Ticket className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <span className="text-lg md:text-xl font-bold text-primary">TatuTicket</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-2 truncate">
            {user?.firstName ? `${user.firstName}'s Company` : 'Minha Empresa'}
          </p>
        </div>

        <div className="p-3 md:p-4 flex-1">
          <ul className="space-y-1 md:space-y-2" role="list">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Button
                    variant={item.current ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      item.current 
                        ? 'bg-accent text-accent-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    }`}
                    onClick={() => {
                      setLocation(item.href);
                      setIsSidebarOpen(false);
                    }}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    aria-current={item.current ? "page" : undefined}
                  >
                    <Icon className="h-4 w-4 mr-3" aria-hidden="true" />
                    {item.name}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* User profile */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 border-t border-border">
          <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3">
            <Avatar className="h-6 w-6 md:h-8 md:w-8 shrink-0">
              <AvatarImage src={user?.profileImageUrl || undefined} />
              <AvatarFallback className="text-xs md:text-sm">
                {user?.firstName?.[0] || user?.email?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-medium truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground shrink-0 h-6 w-6 md:h-8 md:w-8"
              data-testid="button-logout"
            >
              <LogOut className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-card border-b border-border px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
                data-testid="button-menu"
                aria-label="Abrir menu de navegação"
                aria-expanded={isSidebarOpen}
                aria-controls="sidebar"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
              <h1 className="text-lg md:text-2xl font-bold truncate">{getPageTitle()}</h1>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
              <div className="hidden sm:block">
                <HeaderLanguageSwitcher />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4 md:h-5 md:w-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-destructive rounded-full"></span>
              </Button>
              <Button 
                className="bg-accent hover:bg-accent/90 text-sm md:text-base"
                onClick={() => setLocation('/tickets')}
                data-testid="button-new-ticket"
                size="sm"
              >
                <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Novo Ticket</span>
                <span className="sm:hidden">Novo</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
