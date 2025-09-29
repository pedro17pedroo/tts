import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";

// Tipos para campos customizados
interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'number' | 'date';
  required: boolean;
  options?: string[];
  defaultValue?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

interface CustomFieldValue {
  fieldId: string;
  value: string | boolean | number;
}

// Função para fazer requisições à API
async function apiRequest(method: string, endpoint: string, data?: any) {
  const response = await fetch(`/api/custom-fields${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro na requisição');
  }

  return response.json();
}

// Componente principal para gestão de campos customizados
export function CustomFieldsManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const { toast } = useToast();
  const { t } = useTranslations();
  const queryClient = useQueryClient();

  // Query para buscar campos customizados
  const { data: customFields = [], isLoading } = useQuery({
    queryKey: ['custom-fields'],
    queryFn: () => apiRequest('GET', ''),
  });

  // Mutations
  const createFieldMutation = useMutation({
    mutationFn: (data: Partial<CustomField>) => apiRequest('POST', '', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Sucesso",
        description: "Campo customizado criado com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateFieldMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomField> }) => 
      apiRequest('PATCH', `/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
      setEditingField(null);
      toast({
        title: "Sucesso",
        description: "Campo customizado atualizado com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteFieldMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
      toast({
        title: "Sucesso",
        description: "Campo customizado removido com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getFieldTypeLabel = (type: string) => {
    const types = {
      text: 'Texto',
      textarea: 'Área de Texto',
      select: 'Lista de Seleção',
      checkbox: 'Caixa de Seleção',
      number: 'Número',
      date: 'Data'
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Campos Customizados
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Configure campos adicionais para os tickets
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Campo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : customFields.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum campo customizado configurado</p>
            <p className="text-sm">Clique em "Novo Campo" para começar</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Obrigatório</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customFields.map((field: CustomField) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">{field.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getFieldTypeLabel(field.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {field.required ? (
                      <Badge variant="destructive">Obrigatório</Badge>
                    ) : (
                      <Badge variant="secondary">Opcional</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={field.isActive ? "default" : "secondary"}>
                      {field.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>{field.order}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingField(field)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteFieldMutation.mutate(field.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Dialog para criar/editar campo */}
      <CustomFieldDialog
        isOpen={isCreateDialogOpen || !!editingField}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setEditingField(null);
        }}
        field={editingField}
        onSave={(data) => {
          if (editingField) {
            updateFieldMutation.mutate({ id: editingField.id, data });
          } else {
            createFieldMutation.mutate(data);
          }
        }}
        isLoading={createFieldMutation.isPending || updateFieldMutation.isPending}
      />
    </Card>
  );
}

// Componente para renderizar campos customizados em formulários
interface CustomFieldsRendererProps {
  fields: CustomField[];
  values: Record<string, any>;
  onChange: (fieldId: string, value: any) => void;
  errors?: Record<string, string>;
}

export function CustomFieldsRenderer({ fields, values, onChange, errors }: CustomFieldsRendererProps) {
  const activeFields = fields.filter(field => field.isActive).sort((a, b) => a.order - b.order);

  if (activeFields.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Campos Adicionais</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            
            {field.type === 'text' && (
              <Input
                id={field.id}
                value={values[field.id] || ''}
                onChange={(e) => onChange(field.id, e.target.value)}
                placeholder={field.defaultValue}
                required={field.required}
              />
            )}
            
            {field.type === 'textarea' && (
              <textarea
                id={field.id}
                value={values[field.id] || ''}
                onChange={(e) => onChange(field.id, e.target.value)}
                placeholder={field.defaultValue}
                required={field.required}
                className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md"
              />
            )}
            
            {field.type === 'select' && (
              <Select
                value={values[field.id] || ''}
                onValueChange={(value) => onChange(field.id, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {field.type === 'checkbox' && (
              <div className="flex items-center space-x-2">
                <Switch
                  id={field.id}
                  checked={values[field.id] || false}
                  onCheckedChange={(checked) => onChange(field.id, checked)}
                />
                <Label htmlFor={field.id} className="text-sm">
                  {field.defaultValue || 'Ativar'}
                </Label>
              </div>
            )}
            
            {field.type === 'number' && (
              <Input
                id={field.id}
                type="number"
                value={values[field.id] || ''}
                onChange={(e) => onChange(field.id, parseFloat(e.target.value) || 0)}
                placeholder={field.defaultValue}
                required={field.required}
              />
            )}
            
            {field.type === 'date' && (
              <Input
                id={field.id}
                type="date"
                value={values[field.id] || ''}
                onChange={(e) => onChange(field.id, e.target.value)}
                required={field.required}
              />
            )}
            
            {errors?.[field.id] && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Dialog para criar/editar campo customizado
interface CustomFieldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  field?: CustomField | null;
  onSave: (data: Partial<CustomField>) => void;
  isLoading: boolean;
}

function CustomFieldDialog({ isOpen, onClose, field, onSave, isLoading }: CustomFieldDialogProps) {
  const [formData, setFormData] = useState({
    name: field?.name || '',
    type: field?.type || 'text',
    required: field?.required || false,
    options: field?.options?.join('\n') || '',
    defaultValue: field?.defaultValue || '',
    order: field?.order || 1,
    isActive: field?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: Partial<CustomField> = {
      name: formData.name,
      type: formData.type as CustomField['type'],
      required: formData.required,
      defaultValue: formData.defaultValue,
      order: formData.order,
      isActive: formData.isActive,
    };

    // Processar opções para campos select
    if (formData.type === 'select' && formData.options) {
      data.options = formData.options.split('\n').filter(option => option.trim());
    }

    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {field ? 'Editar Campo Customizado' : 'Novo Campo Customizado'}
          </DialogTitle>
          <DialogDescription>
            Configure um campo adicional para os tickets
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Campo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Prioridade do Cliente"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Campo</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Texto</SelectItem>
                <SelectItem value="textarea">Área de Texto</SelectItem>
                <SelectItem value="select">Lista de Seleção</SelectItem>
                <SelectItem value="checkbox">Caixa de Seleção</SelectItem>
                <SelectItem value="number">Número</SelectItem>
                <SelectItem value="date">Data</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === 'select' && (
            <div className="space-y-2">
              <Label htmlFor="options">Opções (uma por linha)</Label>
              <textarea
                id="options"
                value={formData.options}
                onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                placeholder="Baixa&#10;Média&#10;Alta&#10;Crítica"
                className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="defaultValue">Valor Padrão (opcional)</Label>
            <Input
              id="defaultValue"
              value={formData.defaultValue}
              onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
              placeholder="Valor inicial do campo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order">Ordem</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Configurações</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="required"
                    checked={formData.required}
                    onCheckedChange={(checked) => setFormData({ ...formData, required: checked })}
                  />
                  <Label htmlFor="required" className="text-sm">Obrigatório</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive" className="text-sm">Ativo</Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}