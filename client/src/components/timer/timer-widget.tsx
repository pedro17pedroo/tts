import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Play, Pause, OctagonMinus, Clock, Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TimerWidgetProps {
  ticketId: string;
  onTimerStart?: () => void;
  onTimerStop?: () => void;
}

interface ActiveTimer {
  id: string;
  startTime: string;
  description?: string;
}

export default function TimerWidget({ ticketId, onTimerStart, onTimerStop }: TimerWidgetProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [manualHours, setManualHours] = useState("");
  const [manualDescription, setManualDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Calculate elapsed time when timer starts
  useEffect(() => {
    if (activeTimer && isRunning) {
      const startTime = new Date(activeTimer.startTime);
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setSeconds(elapsedSeconds);
    }
  }, [activeTimer, isRunning]);

  const startTimerMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/time-entries", {
        ticketId,
        startTime: new Date().toISOString(),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setActiveTimer(data);
      setIsRunning(true);
      setSeconds(0);
      onTimerStart?.();
      toast({
        title: "Timer iniciado",
        description: "O timer foi iniciado para este ticket.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao iniciar timer",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const stopTimerMutation = useMutation({
    mutationFn: async () => {
      if (!activeTimer) throw new Error("Nenhum timer ativo");
      
      const duration = seconds / 3600; // Convert to hours
      const response = await apiRequest("PATCH", `/api/time-entries/${activeTimer.id}`, {
        endTime: new Date().toISOString(),
        duration: duration.toFixed(2),
      });
      return response.json();
    },
    onSuccess: () => {
      setIsRunning(false);
      setActiveTimer(null);
      setSeconds(0);
      onTimerStop?.();
      queryClient.invalidateQueries({ queryKey: ["/api/tickets", ticketId] });
      toast({
        title: "Timer finalizado",
        description: `Tempo registrado: ${formatTime(seconds)}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao finalizar timer",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const pauseTimerMutation = useMutation({
    mutationFn: async () => {
      if (!activeTimer) throw new Error("Nenhum timer ativo");
      
      const duration = seconds / 3600; // Convert to hours
      const response = await apiRequest("PATCH", `/api/time-entries/${activeTimer.id}`, {
        endTime: new Date().toISOString(),
        duration: duration.toFixed(2),
      });
      return response.json();
    },
    onSuccess: () => {
      setIsRunning(false);
      setActiveTimer(null);
      onTimerStop?.();
      queryClient.invalidateQueries({ queryKey: ["/api/tickets", ticketId] });
      toast({
        title: "Timer pausado",
        description: `Tempo registrado: ${formatTime(seconds)}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao pausar timer",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const manualEntryMutation = useMutation({
    mutationFn: async (data: { hours: number; description?: string }) => {
      const response = await apiRequest("POST", "/api/time-entries", {
        ticketId,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        duration: data.hours.toFixed(2),
        description: data.description,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets", ticketId] });
      setIsManualEntryOpen(false);
      setManualHours("");
      setManualDescription("");
      toast({
        title: "Tempo registrado",
        description: `${manualHours}h adicionadas ao ticket.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao registrar tempo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    startTimerMutation.mutate();
  };

  const handlePauseTimer = () => {
    pauseTimerMutation.mutate();
  };

  const handleStopTimer = () => {
    stopTimerMutation.mutate();
  };

  const handleManualEntry = () => {
    const hours = parseFloat(manualHours);
    if (isNaN(hours) || hours <= 0) {
      toast({
        title: "Horas inválidas",
        description: "Por favor, insira um número válido de horas.",
        variant: "destructive",
      });
      return;
    }

    manualEntryMutation.mutate({
      hours,
      description: manualDescription.trim() || undefined,
    });
  };

  return (
    <>
      <Card className={`${isRunning ? 'bg-accent/10 border-accent' : ''}`} data-testid="timer-widget">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className={`h-5 w-5 ${isRunning ? 'text-accent' : 'text-muted-foreground'}`} />
              <div>
                <p className="font-semibold">
                  {isRunning ? "Timer Ativo" : "Controle de Tempo"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isRunning ? "Cronometrando tempo neste ticket" : "Registre o tempo trabalhado"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${isRunning ? 'text-accent' : 'text-foreground'}`} data-testid="timer-display">
                {formatTime(seconds)}
              </p>
              <div className="flex space-x-2 mt-2">
                {!isRunning ? (
                  <>
                    <Button
                      size="sm"
                      onClick={handleStartTimer}
                      disabled={startTimerMutation.isPending}
                      className="bg-accent hover:bg-accent/90"
                      data-testid="button-start-timer"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Iniciar
                    </Button>
                    <Dialog open={isManualEntryOpen} onOpenChange={setIsManualEntryOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" data-testid="button-manual-entry">
                          <Plus className="h-4 w-4 mr-1" />
                          Manual
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Registrar Tempo Manual</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Horas</label>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              value={manualHours}
                              onChange={(e) => setManualHours(e.target.value)}
                              placeholder="2.5"
                              data-testid="input-manual-hours"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Descrição (opcional)</label>
                            <Textarea
                              value={manualDescription}
                              onChange={(e) => setManualDescription(e.target.value)}
                              placeholder="Descreva o trabalho realizado..."
                              rows={3}
                              data-testid="textarea-manual-description"
                            />
                          </div>
                          <div className="flex justify-end space-x-3">
                            <Button
                              variant="outline"
                              onClick={() => setIsManualEntryOpen(false)}
                              data-testid="button-cancel-manual"
                            >
                              Cancelar
                            </Button>
                            <Button
                              onClick={handleManualEntry}
                              disabled={manualEntryMutation.isPending}
                              data-testid="button-save-manual"
                            >
                              {manualEntryMutation.isPending ? "Salvando..." : "Registrar"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handlePauseTimer}
                      disabled={pauseTimerMutation.isPending}
                      data-testid="button-pause-timer"
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Pausar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleStopTimer}
                      disabled={stopTimerMutation.isPending}
                      data-testid="button-stop-timer"
                    >
                      <OctagonMinus className="h-4 w-4 mr-1" />
                      Finalizar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
