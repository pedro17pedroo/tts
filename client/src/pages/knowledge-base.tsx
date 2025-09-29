import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { BookOpen, Plus, Search, Eye, Edit, Trash2, ExternalLink } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import PageContainer from "@/components/ui/page-container";

const articleSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  summary: z.string().optional(),
  isPublic: z.boolean(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface Article {
  id: string;
  title: string;
  content: string;
  summary?: string;
  isPublic: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

export default function KnowledgeBase() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPublic, setFilterPublic] = useState<boolean | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
    select: (data) => Array.isArray(data) ? data : [],
  });

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      content: "",
      summary: "",
      isPublic: false,
    },
  });

  const createArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const response = await apiRequest("POST", "/api/articles", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      setIsCreateModalOpen(false);
      form.reset();
      toast({
        title: "Artigo criado",
        description: "Artigo criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar artigo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ArticleFormData) => {
    createArticleMutation.mutate(data);
  };

  const articlesArray = Array.isArray(articles) ? articles : [];
  const filteredArticles = articlesArray.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPublic === null || article.isPublic === filterPublic;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: articlesArray.length,
    public: articlesArray.filter(a => a.isPublic).length,
    private: articlesArray.filter(a => !a.isPublic).length,
    totalViews: articlesArray.reduce((sum, a) => sum + a.viewCount, 0),
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer 
      title="Base de Conhecimento" 
      subtitle="Gestão de artigos"
      data-testid="knowledge-base-page"
    >

      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div></div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-article">
              <Plus className="h-4 w-4 mr-2" />
              Novo Artigo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Artigo</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título *</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-article-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resumo</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={2}
                          data-testid="input-article-summary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={8}
                          data-testid="input-article-content"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Artigo Público</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Artigos públicos são visíveis para os clientes
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-article-public"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    data-testid="button-cancel-article"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createArticleMutation.isPending}
                    data-testid="button-save-article"
                  >
                    {createArticleMutation.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total de Artigos</p>
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Artigos Públicos</p>
                <p className="text-3xl font-bold text-accent">{stats.public}</p>
              </div>
              <ExternalLink className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Artigos Privados</p>
                <p className="text-3xl font-bold text-secondary">{stats.private}</p>
              </div>
              <BookOpen className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total de Visualizações</p>
                <p className="text-3xl font-bold text-primary">{stats.totalViews}</p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar artigos..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-articles"
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant={filterPublic === null ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterPublic(null)}
              data-testid="filter-all-articles"
            >
              Todos
            </Button>
            <Button
              variant={filterPublic === true ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterPublic(true)}
              data-testid="filter-public-articles"
            >
              Públicos
            </Button>
            <Button
              variant={filterPublic === false ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterPublic(false)}
              data-testid="filter-private-articles"
            >
              Privados
            </Button>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              {articles.length === 0 ? (
                <>
                  <h3 className="text-lg font-semibold mb-2">Nenhum artigo criado</h3>
                  <p className="text-muted-foreground mb-4">
                    Comece criando artigos para sua base de conhecimento
                  </p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Artigo
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-2">Nenhum artigo encontrado</h3>
                  <p className="text-muted-foreground">
                    Tente ajustar sua busca ou filtros
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow" data-testid={`article-card-${article.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={article.isPublic ? "default" : "secondary"}>
                        {article.isPublic ? "Público" : "Privado"}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>{article.viewCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {article.summary && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {article.summary}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>
                    Criado {formatDistanceToNow(new Date(article.createdAt), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </span>
                  {article.updatedAt !== article.createdAt && (
                    <span>
                      Atualizado {formatDistanceToNow(new Date(article.updatedAt), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    data-testid={`button-view-article-${article.id}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-testid={`button-edit-article-${article.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    data-testid={`button-delete-article-${article.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
