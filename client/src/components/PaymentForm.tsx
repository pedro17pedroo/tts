import { useState } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  Elements
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentFormProps {
  clientSecret: string;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
  planName: string;
  amount: string;
}

function PaymentFormContent({ clientSecret, onSuccess, onError, planName, amount }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe não foi carregado corretamente. Tente recarregar a página.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Elemento de cartão não encontrado.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (confirmError) {
        let errorMessage = "Falha no pagamento. Tente novamente.";
        
        switch (confirmError.code) {
          case "card_declined":
            errorMessage = "Cartão recusado. Verifique os dados ou use outro cartão.";
            break;
          case "insufficient_funds":
            errorMessage = "Fundos insuficientes. Verifique seu saldo ou use outro cartão.";
            break;
          case "incorrect_cvc":
            errorMessage = "Código de segurança (CVV) incorreto.";
            break;
          case "expired_card":
            errorMessage = "Cartão expirado. Use outro cartão.";
            break;
          case "processing_error":
            errorMessage = "Erro de processamento. Tente novamente em alguns instantes.";
            break;
          default:
            errorMessage = confirmError.message || errorMessage;
        }
        
        setError(errorMessage);
        onError(errorMessage);
        toast({
          title: "Erro no pagamento",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (paymentIntent) {
        if (paymentIntent.status === 'succeeded') {
          toast({
            title: "Pagamento realizado com sucesso!",
            description: `Plano ${planName} ativado. Redirecionando...`,
          });
          onSuccess(paymentIntent);
        } else {
          setError("Pagamento não foi concluído. Tente novamente.");
          onError("Pagamento não foi concluído.");
        }
      }
    } catch (err: any) {
      const errorMessage = err.message || "Erro inesperado durante o pagamento.";
      setError(errorMessage);
      onError(errorMessage);
      toast({
        title: "Erro no pagamento",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: '"Inter", system-ui, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Informações de Pagamento</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-primary">Plano Selecionado</h4>
              <p className="text-sm text-muted-foreground">{planName}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{amount}</div>
              <div className="text-sm text-muted-foreground">/mês</div>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Dados do Cartão</label>
            <div className="p-3 border rounded-md bg-background">
              <CardElement
                options={cardElementOptions}
                data-testid="card-element"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Seus dados de pagamento são processados de forma segura pelo Stripe.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!stripe || isProcessing}
            data-testid="button-submit-payment"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando pagamento...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirmar Pagamento {amount}/mês
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Ao confirmar o pagamento, você concorda com nossos termos de serviço.
              <br />
              Você pode cancelar sua assinatura a qualquer momento.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function PaymentForm(props: PaymentFormProps) {
  if (!stripePromise) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Stripe não está configurado. Verifique a variável de ambiente VITE_STRIPE_PUBLIC_KEY.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent {...props} />
    </Elements>
  );
}