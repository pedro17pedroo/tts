import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Clock, 
  Play, 
  Pause, 
  OctagonMinus, 
  Send, 
  Paperclip, 
  X, 
  User, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  File,
  Download
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TimerWidget from "@/components/timer/timer-widget";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "new" | "in_progress" | "waiting_customer" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  customerId: string;
  assigneeId?: string;
  departmentId?: string;
  categoryId?: string;
  timeSpent: string;
  createdAt: string;
  updatedAt: string;
}

interface TicketComment {
  id: string;
  content: string;
  isInternal: boolean;
  authorId: string;
  createdAt: string;
}

interface TimeEntry {
  id: string;
  startTime: string;
  endTime?: string;
  duration?: string;
  description?: string;
  userId: string;
  createdAt: string;
}

interface TicketDetailsModalProps {
  ticketId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TicketDetailsModal({ ticketId, isOpen, onClose }: TicketDetailsModalProps) {
  const [newComment, setNewComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ticketData, isLoading } = useQuery({
    queryKey: ["/api/tickets", ticketId],
    enabled: !!ticketId && isOpen,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
    enabled: isOpen,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["/api/departments"],
    enabled: isOpen,
  });

  const updateTicketMutation = useMutation({
    mutationFn: async ({ ticketId, updates }: { ticketId: string; updates: Partial<Ticket> }) => {
      const response = await apiRequest("PATCH", `/api/tickets/${ticketId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      toast({
        title: "Ticket atualizado",
        description: "Ticket atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar ticket",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async (comment: { content: string; isInternal: boolean }) => {
      const response = await apiRequest("POST", `/api/tickets/${ticketId}/comments`, comment);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets", ticketId] });
      setNewComment("");
      toast({
        title: "Comentário adicionado",
        description: "Comentário adicionado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar comentário",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (status: string) => {
    if (ticketId) {
      updateTicketMutation.mutate({
        ticketId,
        updates: { status: status as Ticket["status"] }
      });
    }
  };

  const handlePriorityChange = (priority: string) => {
    if (ticketId) {
      updateTicketMutation.mutate({
        ticketId,
        updates: { priority: priority as Ticket["priority"] }
      });
    }
  };

  const handleAssigneeChange = (assigneeId: string) => {
    if (ticketId) {
      updateTicketMutation.mutate({
        ticketId,
        updates: { assigneeId }
      });
    }
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    createCommentMutation.mutate({
      content: newComment,
      isInternal,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "destructive";
      case "in_progress": return "default";
      case "waiting_customer": return "secondary";
      case "resolved": return "outline";
      case "closed": return "outline";
      default: return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: "Novo",
      in_progress: "Em Progresso",
      waiting_customer: "Aguardando Cliente",
      resolved: "Resolvido",
      closed: "Fechado"
    };
    return labels[status] || status;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: "Baixa",
      medium: "Média",
      high: "Alta",
      critical: "Crítica"
    };
    return labels[priority] || priority;
  };

  if (!isOpen || !ticketId) return null;

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="animate-pulse space-y-4 p-6">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const ticket = ticketData?.ticket;
  const comments = ticketData?.comments || [];
  const timeEntries = ticketData?.timeEntries || [];

  if (!ticket) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h3 className="text-lg font-semibold mb-2">Ticket não encontrado</h3>
            <p className="text-muted-foreground mb-4">O ticket solicitado não pôde ser carregado.</p>
            <Button onClick={onClose}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col" data-testid="ticket-details-modal">
        {/* Header */}
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <DialogTitle className="text-xl font-bold line-clamp-2">{ticket.title}</DialogTitle>
                <Badge variant={getPriorityColor(ticket.priority) as any}>
                  {getPriorityLabel(ticket.priority)}
                </Badge>
                <Badge variant={getStatusColor(ticket.status) as any}>
                  {getStatusLabel(ticket.status)}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span data-testid="ticket-id">#{ticket.id.slice(-8)}</span>
                <span>Cliente #{ticket.customerId.slice(-6)}</span>
                <span>
                  Criado {formatDistanceToNow(new Date(ticket.createdAt), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-ticket-details">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold mb-3">Descrição</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
            </div>

            {/* Timer Widget */}
            <TimerWidget 
              ticketId={ticket.id}
              onTimerStart={() => setIsTimerActive(true)}
              onTimerStop={() => setIsTimerActive(false)}
            />

            {/* Time Entries */}
            {timeEntries.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Registro de Tempo</h3>
                <div className="space-y-2">
                  {timeEntries.map((entry: TimeEntry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {entry.duration ? `${entry.duration}h` : "Em andamento"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(entry.createdAt), {
                              addSuffix: true,
                              locale: ptBR
                            })}
                          </p>
                        </div>
                      </div>
                      {entry.description && (
                        <p className="text-sm text-muted-foreground">{entry.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div>
              <h3 className="font-semibold mb-4">Conversação ({comments.length})</h3>
              <div className="space-y-4">
                {comments.map((comment: TicketComment) => (
                  <div 
                    key={comment.id} 
                    className={`p-4 rounded-lg ${comment.isInternal ? 'bg-accent/10 border border-accent/20' : 'bg-muted/30'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {comment.authorId.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">Usuário {comment.authorId.slice(-6)}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                              locale: ptBR
                            })}
                          </p>
                        </div>
                      </div>
                      {comment.isInternal && (
                        <Badge variant="outline" className="text-xs">Interno</Badge>
                      )}
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                  </div>
                ))}

                {comments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhum comentário ainda</p>
                    <p className="text-sm">Seja o primeiro a comentar neste ticket</p>
                  </div>
                )}
              </div>

              {/* Add Comment */}
              <div className="mt-6 border-t border-border pt-4">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Digite sua resposta..."
                  rows={3}
                  className="mb-3"
                  data-testid="textarea-new-comment"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Anexar
                    </Button>
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                        className="rounded"
                        data-testid="checkbox-internal-comment"
                      />
                      <span>Comentário interno</span>
                    </label>
                  </div>
                  <Button 
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || createCommentMutation.isPending}
                    data-testid="button-submit-comment"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {createCommentMutation.isPending ? "Enviando..." : "Responder"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-border p-6 bg-muted/10 overflow-y-auto">
            <div className="space-y-6">
              {/* Status & Priority */}
              <div>
                <h4 className="font-semibold mb-3">Status e Prioridade</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <Select value={ticket.status} onValueChange={handleStatusChange}>
                      <SelectTrigger data-testid="select-ticket-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Novo</SelectItem>
                        <SelectItem value="in_progress">Em Progresso</SelectItem>
                        <SelectItem value="waiting_customer">Aguardando Cliente</SelectItem>
                        <SelectItem value="resolved">Resolvido</SelectItem>
                        <SelectItem value="closed">Fechado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Prioridade</label>
                    <Select value={ticket.priority} onValueChange={handlePriorityChange}>
                      <SelectTrigger data-testid="select-ticket-priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="critical">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Assignment */}
              <div>
                <h4 className="font-semibold mb-3">Atribuição</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Responsável</label>
                    <Select value={ticket.assigneeId || ""} onValueChange={handleAssigneeChange}>
                      <SelectTrigger data-testid="select-ticket-assignee">
                        <SelectValue placeholder="Não atribuído" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Não atribuído</SelectItem>
                        {users.map((user: any) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Departamento</label>
                    <Select value={ticket.departmentId || ""}>
                      <SelectTrigger data-testid="select-ticket-department">
                        <SelectValue placeholder="Não definido" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Não definido</SelectItem>
                        {departments.map((dept: any) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Time Summary */}
              <div>
                <h4 className="font-semibold mb-3">Resumo de Tempo</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Tempo Total</span>
                      <span className="font-semibold">{ticket.timeSpent || 0}h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Status Timer</span>
                      <Badge variant={isTimerActive ? "default" : "outline"}>
                        {isTimerActive ? "Ativo" : "Parado"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* SLA Information */}
              <div>
                <h4 className="font-semibold mb-3">SLA</h4>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Primeira Resposta</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      <span className="text-xs text-accent">Cumprido</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Resolução</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Dentro do prazo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div>
                <h4 className="font-semibold mb-3">Informações</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Criado</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Atualizado</span>
                    <span>{new Date(ticket.updatedAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">ID</span>
                    <span className="font-mono">#{ticket.id.slice(-8)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
