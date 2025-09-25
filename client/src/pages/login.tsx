import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Ticket, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";

const loginSchema = z.object({
  email: z.string().email("Introduza um e-mail válido"),
  password: z.string().min(1, "Palavra-passe é obrigatória"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, isLoginLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslations();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginForm) => {
    try {
      setError(null);
      await login(data);
      toast({
        title: t('auth.login.success'),
        description: t('auth.login.successDescription'),
      });
      setLocation("/");
    } catch (error: any) {
      const errorMessage = error.message || t('auth.login.error');
      setError(errorMessage);
      toast({
        title: t('auth.login.error'),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password
    toast({
      title: "Em desenvolvimento",
      description: "Funcionalidade de recuperação de palavra-passe em breve.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Ticket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">{t('landing.brandName')}</span>
          </div>
          <CardTitle className="text-2xl">{t('auth.login.title')}</CardTitle>
          <CardDescription>
            {t('auth.login.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.login.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder={t('forms.placeholders.email')}
                  type="email"
                  className="pl-10"
                  data-testid="input-email"
                  {...form.register("email")}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.login.password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  placeholder={t('auth.login.password')}
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  data-testid="input-password"
                  {...form.register("password")}
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
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoginLoading}
              data-testid="button-login"
            >
              {isLoginLoading ? t('common.loading') : t('auth.login.signIn')}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={handleForgotPassword}
              data-testid="button-forgot-password"
            >
              {t('auth.login.forgotPassword')}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            {t('auth.login.noAccount')}{" "}
            <Link href="/saas-register">
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                data-testid="link-register"
              >
                {t('auth.login.signUp')}
              </Button>
            </Link>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <Link href="/">
              <Button
                variant="link"
                className="p-0 h-auto"
                data-testid="link-home"
              >
                {t('common.back')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}