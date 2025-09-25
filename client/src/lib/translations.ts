// Comprehensive translations for Portuguese (Angola)
// Using Angola-specific terminology and business terms

export const translations = {
  // Common/General
  common: {
    loading: "A carregar...",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    view: "Ver",
    close: "Fechar",
    yes: "Sim",
    no: "Não",
    confirm: "Confirmar",
    search: "Pesquisar",
    filter: "Filtrar",
    all: "Todos",
    none: "Nenhum",
    back: "Voltar",
    next: "Seguinte",
    previous: "Anterior",
    submit: "Submeter",
    create: "Criar",
    update: "Actualizar",
    refresh: "Actualizar",
    export: "Exportar",
    import: "Importar",
    download: "Transferir",
    upload: "Carregar",
    select: "Seleccionar",
    required: "Obrigatório",
    optional: "Opcional",
    actions: "Acções",
    status: "Estado",
    active: "Activo",
    inactive: "Inactivo",
    enabled: "Activado",
    disabled: "Desactivado",
    total: "Total",
    success: "Sucesso",
    error: "Erro",
    warning: "Aviso",
    info: "Informação",
    today: "Hoje",
    yesterday: "Ontem",
    tomorrow: "Amanhã",
    date: "Data",
    time: "Hora",
    datetime: "Data e Hora",
    name: "Nome",
    email: "E-mail",
    phone: "Telefone",
    company: "Empresa",
    description: "Descrição",
    notes: "Notas",
    comments: "Comentários",
    settings: "Definições",
    profile: "Perfil",
    logout: "Terminar Sessão",
    login: "Iniciar Sessão",
    register: "Registar",
    password: "Palavra-passe",
    newPassword: "Nova Palavra-passe",
    confirmPassword: "Confirmar Palavra-passe",
    forgotPassword: "Esqueceu a palavra-passe?",
    rememberMe: "Lembrar-me",
    or: "ou",
    and: "e",
    welcome: "Bem-vindo",
    dashboard: "Painel de Controlo",
    home: "Início",
    menu: "Menu",
    navigation: "Navegação",
    language: "Idioma",
    currency: "Moeda",
    timezone: "Fuso Horário",
    theme: "Tema",
    light: "Claro",
    dark: "Escuro",
    auto: "Automático"
  },

  // Navigation/Menu
  navigation: {
    dashboard: "Painel de Controlo",
    tickets: "Bilhetes de Suporte",
    customers: "Clientes",
    hourBank: "Bolsa de Horas",
    knowledgeBase: "Base de Conhecimento",
    reports: "Relatórios",
    settings: "Definições",
    billing: "Facturação",
    subscription: "Subscrição",
    profile: "Perfil",
    users: "Utilizadores",
    departments: "Departamentos",
    categories: "Categorias",
    analytics: "Análises",
    integrations: "Integrações",
    api: "API",
    audit: "Auditoria",
    security: "Segurança"
  },

  // Landing Page
  landing: {
    brandName: "TatuTicket",
    tagline: "Sistema de Gestão de Suporte Técnico para Angola",
    heroTitle: "Optimize o Atendimento ao Cliente da Sua Empresa",
    heroSubtitle: "Sistema completo de gestão de tickets, SLA e bolsa de horas adaptado ao mercado angolano",
    getStarted: "Começar Grátis",
    learnMore: "Saber Mais",
    watchDemo: "Ver Demonstração",
    featuresNav: "Características",
    featuresTitle: "Tudo o que Precisa para Gerir o Suporte",
    pricing: "Preços",
    pricingTitle: "Planos para Cada Necessidade",
    testimonials: "Testemunhos",
    testimonialsTitle: "O que Dizem os Nossos Clientes",
    faqNav: "Perguntas Frequentes",
    faqTitle: "Esclarecimentos",
    contact: "Contacto",
    footer: {
      company: "Empresa",
      product: "Produto",
      support: "Suporte",
      legal: "Legal",
      followUs: "Siga-nos",
      allRightsReserved: "Todos os direitos reservados",
      privacyPolicy: "Política de Privacidade",
      termsOfService: "Termos de Serviço",
      cookies: "Política de Cookies"
    },
    featureList: {
      ticketManagement: {
        title: "Gestão de Bilhetes",
        description: "Sistema completo com estados, prioridades, categorias e encaminhamento automático"
      },
      hourBank: {
        title: "Bolsa de Horas",
        description: "Controlo de horas por cliente com temporizador automático e relatórios detalhados"
      },
      slaMetrics: {
        title: "SLA e Métricas",
        description: "Monitorização de SLAs com alertas e painéis personalizáveis"
      },
      multiTenant: {
        title: "Multi-inquilino",
        description: "Isolamento completo entre empresas com gestão de permissões"
      },
      knowledgeBase: {
        title: "Base de Conhecimento",
        description: "Artigos organizados com pesquisa avançada e portal do cliente"
      },
      security: {
        title: "Segurança",
        description: "Encriptação AES-256, MFA e conformidade com LGPD/GDPR"
      }
    },
    plans: {
      free: {
        name: "Gratuito",
        price: "0 Kz",
        period: "Para começar",
        description: "Ideal para pequenas equipas",
        cta: "Começar Grátis",
        features: [
          "Até 3 utilizadores",
          "100 bilhetes/mês",
          "1GB armazenamento",
          "Suporte básico"
        ]
      },
      pro: {
        name: "Profissional",
        price: "49.500 Kz",
        period: "por mês",
        description: "Para empresas em crescimento",
        cta: "Subscrever Pro",
        popular: "Mais Popular",
        features: [
          "Até 15 utilizadores",
          "1.000 bilhetes/mês",
          "50GB armazenamento",
          "SLA e relatórios",
          "Integração API"
        ]
      },
      enterprise: {
        name: "Empresarial",
        price: "149.500 Kz",
        period: "por mês",
        description: "Para grandes organizações",
        cta: "Subscrever Empresarial",
        features: [
          "Utilizadores ilimitados",
          "Bilhetes ilimitados",
          "500GB armazenamento",
          "Personalização avançada",
          "Suporte prioritário"
        ]
      }
    },
    faqList: {
      trial: {
        question: "Como funciona o período de teste?",
        answer: "Tem 14 dias para testar todas as funcionalidades do plano Profissional sem compromisso. Não é necessário cartão de crédito."
      },
      migration: {
        question: "Posso migrar entre planos?",
        answer: "Sim, pode fazer upgrade ou downgrade a qualquer momento. As mudanças são aplicadas no próximo ciclo de facturação."
      },
      security: {
        question: "Os dados são seguros?",
        answer: "Utilizamos encriptação AES-256, cópias de segurança automáticas e somos compatíveis com LGPD e GDPR."
      },
      support: {
        question: "Que tipo de suporte está disponível?",
        answer: "Oferecemos suporte por e-mail, chat e telefone. Clientes empresariais têm acesso a suporte prioritário 24/7."
      },
      customization: {
        question: "Posso personalizar o sistema?",
        answer: "Sim, oferecemos opções de personalização incluindo cores, logótipo e fluxos de trabalho personalizados."
      },
      integration: {
        question: "O sistema integra com outras ferramentas?",
        answer: "Sim, temos integração com as principais ferramentas de e-mail, CRM e sistemas de facturação usados em Angola."
      }
    }
  },

  // Authentication
  auth: {
    login: {
      title: "Iniciar Sessão",
      subtitle: "Introduza o seu e-mail e palavra-passe para aceder à sua conta",
      email: "E-mail",
      password: "Palavra-passe",
      rememberMe: "Lembrar-me",
      forgotPassword: "Esqueceu a palavra-passe?",
      signIn: "Entrar",
      signUp: "Criar Conta",
      noAccount: "Não tem conta?",
      success: "Sessão iniciada com sucesso!",
      successDescription: "Foi autenticado com sucesso.",
      error: "Erro no início de sessão",
      invalidCredentials: "E-mail ou palavra-passe incorrectos",
      accountLocked: "Conta bloqueada temporariamente",
      tooManyAttempts: "Demasiadas tentativas. Tente novamente mais tarde."
    },
    register: {
      title: "Criar Conta",
      subtitle: "Registe-se para começar a usar o TatuTicket",
      firstName: "Nome",
      lastName: "Apelido",
      email: "E-mail",
      password: "Palavra-passe",
      confirmPassword: "Confirmar Palavra-passe",
      company: "Empresa",
      phone: "Telefone",
      agreeTerms: "Concordo com os termos e condições",
      createAccount: "Criar Conta",
      signIn: "Entrar",
      hasAccount: "Já tem conta?",
      success: "Conta criada com sucesso!",
      successDescription: "Foi registado e autenticado com sucesso.",
      error: "Erro no registo",
      emailExists: "E-mail já está em uso",
      passwordMismatch: "Palavras-passe não coincidem",
      termsRequired: "Deve aceitar os termos e condições"
    },
    forgotPassword: {
      title: "Recuperar Palavra-passe",
      subtitle: "Introduza o seu e-mail para receber instruções de recuperação",
      email: "E-mail",
      sendInstructions: "Enviar Instruções",
      backToLogin: "Voltar ao início de sessão",
      success: "Instruções enviadas!",
      successDescription: "Verifique o seu e-mail para instruções de recuperação.",
      error: "Erro na recuperação",
      emailNotFound: "E-mail não encontrado"
    },
    logout: {
      title: "Terminar Sessão",
      confirm: "Tem a certeza que quer terminar a sessão?",
      success: "Sessão terminada com sucesso",
      error: "Erro ao terminar sessão"
    }
  },

  // Dashboard
  dashboard: {
    title: "Painel de Controlo",
    welcome: "Bem-vindo de volta",
    overview: "Visão Geral",
    stats: {
      openTickets: "Bilhetes Abertos",
      inProgress: "Em Progresso",
      resolvedToday: "Resolvidos Hoje",
      slaAtRisk: "SLA em Risco",
      totalCustomers: "Total de Clientes",
      activeUsers: "Utilizadores Activos",
      hoursSold: "Horas Vendidas",
      hoursConsumed: "Horas Consumidas",
      hoursAvailable: "Saldo Disponível",
      totalRevenue: "Receita Total",
      monthlyRevenue: "Receita Mensal",
      avgResolutionTime: "Tempo Médio Resolução",
      customerSatisfaction: "Satisfação Cliente"
    },
    widgets: {
      recentTickets: "Bilhetes Recentes",
      upcomingSLA: "SLAs Próximos",
      hourBankSummary: "Resumo Bolsa Horas",
      performance: "Desempenho",
      activity: "Actividade Recente",
      notifications: "Notificações"
    },
    quickActions: {
      createTicket: "Criar Bilhete",
      addCustomer: "Adicionar Cliente",
      generateReport: "Gerar Relatório",
      viewAnalytics: "Ver Análises"
    }
  },

  // Tickets
  tickets: {
    title: "Bilhetes de Suporte",
    create: "Criar Bilhete",
    view: "Ver Bilhete",
    edit: "Editar Bilhete",
    delete: "Eliminar Bilhete",
    assign: "Atribuir",
    unassign: "Desatribuir",
    close: "Fechar",
    reopen: "Reabrir",
    resolve: "Resolver",
    escalate: "Escalar",
    merge: "Juntar",
    split: "Dividir",
    duplicate: "Duplicar",
    print: "Imprimir",
    export: "Exportar",
    
    // Views
    kanbanView: "Vista Kanban",
    tableView: "Vista Tabela",
    listView: "Vista Lista",
    
    // Filters
    filters: {
      status: "Estado",
      priority: "Prioridade",
      assignee: "Responsável",
      customer: "Cliente",
      department: "Departamento",
      category: "Categoria",
      dateRange: "Período",
      search: "Pesquisar bilhetes..."
    },
    
    // Status
    status: {
      new: "Novo",
      open: "Aberto",
      inProgress: "Em Progresso",
      waitingCustomer: "Aguardando Cliente",
      waitingInternal: "Aguardando Interno",
      resolved: "Resolvido",
      closed: "Fechado",
      cancelled: "Cancelado",
      onHold: "Em Espera"
    },
    
    // Priority
    priority: {
      low: "Baixa",
      medium: "Média",
      high: "Alta",
      critical: "Crítica",
      urgent: "Urgente"
    },
    
    // Fields
    fields: {
      id: "ID",
      title: "Título",
      description: "Descrição",
      status: "Estado",
      priority: "Prioridade",
      customer: "Cliente",
      assignee: "Responsável",
      department: "Departamento",
      category: "Categoria",
      tags: "Etiquetas",
      attachments: "Anexos",
      timeSpent: "Tempo Gasto",
      timeEstimated: "Tempo Estimado",
      dueDate: "Data Limite",
      createdAt: "Criado em",
      updatedAt: "Actualizado em",
      resolvedAt: "Resolvido em",
      closedAt: "Fechado em",
      slaStatus: "Estado SLA",
      slaDeadline: "Prazo SLA",
      lastResponse: "Última Resposta",
      responseTime: "Tempo Resposta",
      resolutionTime: "Tempo Resolução",
      satisfaction: "Satisfação",
      rating: "Avaliação",
      feedback: "Comentário"
    },
    
    // Actions
    actions: {
      viewDetails: "Ver Detalhes",
      editTicket: "Editar Bilhete",
      addComment: "Adicionar Comentário",
      changeStatus: "Alterar Estado",
      changePriority: "Alterar Prioridade",
      assignTo: "Atribuir a",
      addTime: "Adicionar Tempo",
      addAttachment: "Adicionar Anexo",
      createSubtask: "Criar Subtarefa",
      linkTicket: "Ligar Bilhete",
      copyLink: "Copiar Ligação",
      sendEmail: "Enviar E-mail",
      scheduleReminder: "Agendar Lembrete"
    },
    
    // Messages
    messages: {
      created: "Bilhete criado com sucesso",
      updated: "Bilhete actualizado com sucesso",
      deleted: "Bilhete eliminado com sucesso",
      assigned: "Bilhete atribuído com sucesso",
      statusChanged: "Estado alterado com sucesso",
      priorityChanged: "Prioridade alterada com sucesso",
      commentAdded: "Comentário adicionado com sucesso",
      timeAdded: "Tempo registado com sucesso",
      attachmentAdded: "Anexo adicionado com sucesso",
      resolved: "Bilhete resolvido com sucesso",
      closed: "Bilhete fechado com sucesso",
      reopened: "Bilhete reaberto com sucesso",
      escalated: "Bilhete escalado com sucesso",
      merged: "Bilhetes unidos com sucesso",
      duplicated: "Bilhete duplicado com sucesso",
      
      // Errors
      createError: "Erro ao criar bilhete",
      updateError: "Erro ao actualizar bilhete",
      deleteError: "Erro ao eliminar bilhete",
      assignError: "Erro ao atribuir bilhete",
      statusError: "Erro ao alterar estado",
      priorityError: "Erro ao alterar prioridade",
      commentError: "Erro ao adicionar comentário",
      timeError: "Erro ao registar tempo",
      attachmentError: "Erro ao adicionar anexo",
      loadError: "Erro ao carregar bilhetes",
      notFound: "Bilhete não encontrado",
      accessDenied: "Acesso negado ao bilhete",
      invalidData: "Dados inválidos",
      duplicateTitle: "Título já existe"
    }
  },

  // Customers
  customers: {
    title: "Clientes",
    add: "Adicionar Cliente",
    edit: "Editar Cliente",
    delete: "Eliminar Cliente",
    view: "Ver Cliente",
    import: "Importar Clientes",
    export: "Exportar Clientes",
    
    // Fields
    fields: {
      name: "Nome",
      email: "E-mail",
      phone: "Telefone",
      company: "Empresa",
      address: "Morada",
      city: "Cidade",
      country: "País",
      postalCode: "Código Postal",
      taxNumber: "Número Fiscal",
      website: "Website",
      industry: "Sector",
      size: "Dimensão",
      status: "Estado",
      type: "Tipo",
      priority: "Prioridade",
      assignedTo: "Atribuído a",
      createdAt: "Criado em",
      updatedAt: "Actualizado em",
      lastContact: "Último Contacto",
      totalTickets: "Total Bilhetes",
      openTickets: "Bilhetes Abertos",
      satisfaction: "Satisfação",
      value: "Valor",
      tags: "Etiquetas",
      notes: "Notas"
    },
    
    // Status
    status: {
      active: "Activo",
      inactive: "Inactivo",
      suspended: "Suspenso",
      prospect: "Prospecto",
      lead: "Lead",
      trial: "Teste"
    },
    
    // Type
    type: {
      individual: "Individual",
      business: "Empresa",
      government: "Governo",
      ngo: "ONG",
      education: "Educação",
      healthcare: "Saúde"
    },
    
    // Actions
    actions: {
      viewProfile: "Ver Perfil",
      editProfile: "Editar Perfil",
      viewTickets: "Ver Bilhetes",
      createTicket: "Criar Bilhete",
      viewHourBank: "Ver Bolsa Horas",
      addHours: "Adicionar Horas",
      sendEmail: "Enviar E-mail",
      makeCall: "Fazer Chamada",
      addNote: "Adicionar Nota",
      addTag: "Adicionar Etiqueta",
      exportData: "Exportar Dados",
      mergeCustomer: "Juntar Cliente",
      deleteCustomer: "Eliminar Cliente"
    },
    
    // Messages
    messages: {
      created: "Cliente criado com sucesso",
      updated: "Cliente actualizado com sucesso",
      deleted: "Cliente eliminado com sucesso",
      imported: "Clientes importados com sucesso",
      exported: "Clientes exportados com sucesso",
      emailSent: "E-mail enviado com sucesso",
      noteAdded: "Nota adicionada com sucesso",
      tagAdded: "Etiqueta adicionada com sucesso",
      merged: "Clientes unidos com sucesso",
      
      // Errors
      createError: "Erro ao criar cliente",
      updateError: "Erro ao actualizar cliente",
      deleteError: "Erro ao eliminar cliente",
      importError: "Erro ao importar clientes",
      exportError: "Erro ao exportar clientes",
      emailError: "Erro ao enviar e-mail",
      loadError: "Erro ao carregar clientes",
      notFound: "Cliente não encontrado",
      emailExists: "E-mail já existe",
      invalidData: "Dados inválidos",
      accessDenied: "Acesso negado"
    }
  },

  // Hour Bank
  hourBank: {
    title: "Bolsa de Horas",
    create: "Criar Bolsa",
    edit: "Editar Bolsa",
    delete: "Eliminar Bolsa",
    view: "Ver Detalhes",
    add: "Adicionar Horas",
    consume: "Consumir Horas",
    transfer: "Transferir Horas",
    extend: "Prorrogar",
    suspend: "Suspender",
    activate: "Activar",
    
    // Fields
    fields: {
      customer: "Cliente",
      totalHours: "Total Horas",
      consumedHours: "Horas Consumidas",
      remainingHours: "Horas Restantes",
      hourlyRate: "Tarifa por Hora",
      totalValue: "Valor Total",
      purchaseDate: "Data Compra",
      expiryDate: "Data Validade",
      status: "Estado",
      description: "Descrição",
      notes: "Notas",
      tags: "Etiquetas",
      department: "Departamento",
      project: "Projecto",
      contract: "Contrato",
      invoiceNumber: "Número Factura",
      paymentStatus: "Estado Pagamento",
      usageHistory: "Histórico Uso",
      createdAt: "Criado em",
      updatedAt: "Actualizado em",
      createdBy: "Criado por",
      updatedBy: "Actualizado por"
    },
    
    // Status
    status: {
      active: "Activa",
      inactive: "Inactiva",
      expired: "Expirada",
      suspended: "Suspensa",
      exhausted: "Esgotada",
      pending: "Pendente",
      cancelled: "Cancelada"
    },
    
    // Usage Types
    usageTypes: {
      support: "Suporte Técnico",
      development: "Desenvolvimento",
      consulting: "Consultoria",
      training: "Formação",
      maintenance: "Manutenção",
      implementation: "Implementação",
      testing: "Testes",
      documentation: "Documentação",
      meeting: "Reunião",
      other: "Outro"
    },
    
    // Statistics
    stats: {
      totalBanks: "Total Bolsas",
      activeBanks: "Bolsas Activas",
      totalHoursSold: "Total Horas Vendidas",
      totalHoursConsumed: "Total Horas Consumidas",
      totalHoursRemaining: "Total Horas Restantes",
      totalValue: "Valor Total",
      averageUsage: "Uso Médio",
      expiringThisMonth: "Expiram Este Mês",
      lowBalance: "Saldo Baixo",
      utilizationRate: "Taxa Utilização"
    },
    
    // Actions
    actions: {
      viewDetails: "Ver Detalhes",
      addHours: "Adicionar Horas",
      consumeHours: "Registar Uso",
      transferHours: "Transferir Horas",
      extendExpiry: "Prorrogar Validade",
      generateReport: "Gerar Relatório",
      exportHistory: "Exportar Histórico",
      sendStatement: "Enviar Extracto",
      createInvoice: "Criar Factura",
      viewInvoices: "Ver Facturas",
      addNote: "Adicionar Nota",
      editDetails: "Editar Detalhes",
      suspendBank: "Suspender Bolsa",
      activateBank: "Activar Bolsa",
      deleteBank: "Eliminar Bolsa"
    },
    
    // Messages
    messages: {
      created: "Bolsa de horas criada com sucesso",
      updated: "Bolsa de horas actualizada com sucesso",
      deleted: "Bolsa de horas eliminada com sucesso",
      hoursAdded: "Horas adicionadas com sucesso",
      hoursConsumed: "Horas registadas com sucesso",
      hoursTransferred: "Horas transferidas com sucesso",
      expiryExtended: "Validade prorrogada com sucesso",
      suspended: "Bolsa suspensa com sucesso",
      activated: "Bolsa activada com sucesso",
      reportGenerated: "Relatório gerado com sucesso",
      statementSent: "Extracto enviado com sucesso",
      invoiceCreated: "Factura criada com sucesso",
      
      // Warnings
      lowBalance: "Saldo baixo na bolsa de horas",
      expiringSoon: "Bolsa de horas expira em breve",
      expired: "Bolsa de horas expirada",
      exhausted: "Bolsa de horas esgotada",
      insufficientHours: "Horas insuficientes na bolsa",
      
      // Errors
      createError: "Erro ao criar bolsa de horas",
      updateError: "Erro ao actualizar bolsa de horas",
      deleteError: "Erro ao eliminar bolsa de horas",
      addHoursError: "Erro ao adicionar horas",
      consumeHoursError: "Erro ao registar uso de horas",
      transferError: "Erro ao transferir horas",
      extendError: "Erro ao prorrogar validade",
      loadError: "Erro ao carregar bolsas de horas",
      notFound: "Bolsa de horas não encontrada",
      invalidData: "Dados inválidos",
      accessDenied: "Acesso negado",
      alreadyExpired: "Bolsa já expirada",
      alreadySuspended: "Bolsa já suspensa"
    }
  },

  // Settings
  settings: {
    title: "Definições",
    generalTab: "Geral",
    profileTab: "Perfil",
    account: "Conta",
    securityTab: "Segurança",
    notificationsTab: "Notificações",
    integrations: "Integrações",
    billing: "Facturação",
    team: "Equipa",
    departments: "Departamentos",
    categories: "Categorias",
    automation: "Automatização",
    customization: "Personalização",
    backup: "Cópia Segurança",
    audit: "Auditoria",
    
    // General Settings
    general: {
      companyName: "Nome da Empresa",
      companyLogo: "Logótipo",
      timezone: "Fuso Horário",
      dateFormat: "Formato Data",
      timeFormat: "Formato Hora",
      currency: "Moeda",
      language: "Idioma",
      theme: "Tema",
      businessHours: "Horário Funcionamento",
      workingDays: "Dias Úteis",
      holidays: "Feriados",
      defaultPriority: "Prioridade Padrão",
      defaultStatus: "Estado Padrão",
      autoAssignment: "Atribuição Automática",
      escalationRules: "Regras Escalação",
      slaSettings: "Definições SLA"
    },
    
    // Profile Settings
    profile: {
      avatar: "Avatar",
      firstName: "Nome",
      lastName: "Apelido",
      email: "E-mail",
      phone: "Telefone",
      position: "Cargo",
      department: "Departamento",
      bio: "Biografia",
      skills: "Competências",
      languages: "Idiomas",
      certifications: "Certificações",
      socialLinks: "Redes Sociais"
    },
    
    // Security Settings
    security: {
      changePassword: "Alterar Palavra-passe",
      currentPassword: "Palavra-passe Actual",
      newPassword: "Nova Palavra-passe",
      confirmPassword: "Confirmar Palavra-passe",
      twoFactorAuth: "Autenticação Dois Factores",
      loginSessions: "Sessões Activas",
      apiKeys: "Chaves API",
      accessLog: "Registo Acessos",
      securityQuestions: "Perguntas Segurança",
      trustedDevices: "Dispositivos Confiança",
      passwordPolicy: "Política Palavras-passe",
      sessionTimeout: "Timeout Sessão"
    },
    
    // Notification Settings
    notifications: {
      emailNotifications: "Notificações E-mail",
      pushNotifications: "Notificações Push",
      smsNotifications: "Notificações SMS",
      slackNotifications: "Notificações Slack",
      newTicket: "Novo Bilhete",
      ticketAssigned: "Bilhete Atribuído",
      ticketUpdated: "Bilhete Actualizado",
      slaAlert: "Alerta SLA",
      customerReply: "Resposta Cliente",
      teamMention: "Menção Equipa",
      systemUpdates: "Actualizações Sistema",
      securityAlerts: "Alertas Segurança",
      weeklyReport: "Relatório Semanal",
      monthlyReport: "Relatório Mensal"
    },
    
    // Messages
    messages: {
      saved: "Definições guardadas com sucesso",
      passwordChanged: "Palavra-passe alterada com sucesso",
      profileUpdated: "Perfil actualizado com sucesso",
      notificationsUpdated: "Notificações actualizadas com sucesso",
      integrationEnabled: "Integração activada com sucesso",
      integrationDisabled: "Integração desactivada com sucesso",
      backupCreated: "Cópia de segurança criada com sucesso",
      dataImported: "Dados importados com sucesso",
      dataExported: "Dados exportados com sucesso",
      
      // Errors
      saveError: "Erro ao guardar definições",
      passwordError: "Erro ao alterar palavra-passe",
      profileError: "Erro ao actualizar perfil",
      integrationError: "Erro na integração",
      backupError: "Erro na cópia de segurança",
      importError: "Erro ao importar dados",
      exportError: "Erro ao exportar dados",
      invalidPassword: "Palavra-passe actual incorrecta",
      weakPassword: "Palavra-passe muito fraca",
      emailExists: "E-mail já está em uso"
    }
  },

  // Forms and Validation
  forms: {
    validation: {
      required: "Este campo é obrigatório",
      email: "Introduza um e-mail válido",
      phone: "Introduza um número de telefone válido",
      url: "Introduza um URL válido",
      minLength: "Mínimo {min} caracteres",
      maxLength: "Máximo {max} caracteres",
      min: "Valor mínimo {min}",
      max: "Valor máximo {max}",
      pattern: "Formato inválido",
      passwordMismatch: "Palavras-passe não coincidem",
      passwordWeak: "Palavra-passe muito fraca",
      invalidDate: "Data inválida",
      futureDate: "Data deve ser futura",
      pastDate: "Data deve ser passada",
      fileSize: "Ficheiro muito grande",
      fileType: "Tipo de ficheiro inválido",
      numberRequired: "Deve ser um número",
      positiveNumber: "Deve ser um número positivo",
      integer: "Deve ser um número inteiro",
      decimal: "Deve ser um número decimal"
    },
    
    placeholders: {
      search: "Pesquisar...",
      email: "exemplo@empresa.co.ao",
      phone: "+244 900 000 000",
      website: "https://www.empresa.co.ao",
      selectOption: "Seleccionar opção",
      selectDate: "Seleccionar data",
      selectTime: "Seleccionar hora",
      enterText: "Introduzir texto",
      enterNumber: "Introduzir número",
      selectFile: "Seleccionar ficheiro",
      dropFile: "Arraste ficheiro aqui",
      noOptions: "Sem opções disponíveis",
      loading: "A carregar...",
      searching: "A pesquisar...",
      noResults: "Sem resultados"
    }
  },

  // Status and Priority Labels
  labels: {
    // Priority levels
    priority: {
      critical: "Crítica",
      high: "Alta", 
      medium: "Média",
      low: "Baixa"
    },
    
    // Status states
    status: {
      active: "Activo",
      inactive: "Inactivo",
      pending: "Pendente",
      approved: "Aprovado",
      rejected: "Rejeitado",
      completed: "Concluído",
      cancelled: "Cancelado",
      draft: "Rascunho",
      published: "Publicado",
      archived: "Arquivado"
    },
    
    // User roles
    roles: {
      admin: "Administrador",
      manager: "Gestor",
      agent: "Agente",
      customer: "Cliente",
      viewer: "Visualizador"
    }
  },

  // Error Messages
  errors: {
    general: "Ocorreu um erro inesperado",
    network: "Erro de ligação à rede",
    server: "Erro interno do servidor",
    unauthorized: "Não autorizado",
    forbidden: "Acesso negado",
    notFound: "Recurso não encontrado",
    timeout: "Tempo limite excedido",
    validation: "Dados inválidos",
    fileUpload: "Erro no carregamento do ficheiro",
    fileSize: "Ficheiro demasiado grande",
    fileType: "Tipo de ficheiro não suportado",
    duplicate: "Registo duplicado",
    constraint: "Violação de restrição",
    permission: "Permissão insuficiente",
    quota: "Quota excedida",
    maintenance: "Sistema em manutenção",
    
    // Specific errors
    loginFailed: "Falha no início de sessão",
    sessionExpired: "Sessão expirada",
    passwordIncorrect: "Palavra-passe incorrecta",
    emailNotVerified: "E-mail não verificado",
    accountLocked: "Conta bloqueada",
    accountSuspended: "Conta suspensa",
    featureNotAvailable: "Funcionalidade não disponível",
    dataCorrupted: "Dados corrompidos",
    backupFailed: "Falha na cópia de segurança",
    restoreFailed: "Falha na restauração",
    syncFailed: "Falha na sincronização",
    integrationFailed: "Falha na integração",
    paymentFailed: "Falha no pagamento",
    subscriptionExpired: "Subscrição expirada"
  },

  // Time and Dates
  time: {
    now: "Agora",
    today: "Hoje",
    yesterday: "Ontem",
    tomorrow: "Amanhã",
    thisWeek: "Esta Semana",
    lastWeek: "Semana Passada",
    nextWeek: "Próxima Semana",
    thisMonth: "Este Mês",
    lastMonth: "Mês Passado",
    nextMonth: "Próximo Mês",
    thisYear: "Este Ano",
    lastYear: "Ano Passado",
    nextYear: "Próximo Ano",
    
    // Relative time
    justNow: "Agora mesmo",
    minuteAgo: "Há um minuto",
    minutesAgo: "Há {count} minutos",
    hourAgo: "Há uma hora",
    hoursAgo: "Há {count} horas",
    dayAgo: "Há um dia",
    daysAgo: "Há {count} dias",
    weekAgo: "Há uma semana",
    weeksAgo: "Há {count} semanas",
    monthAgo: "Há um mês",
    monthsAgo: "Há {count} meses",
    yearAgo: "Há um ano",
    yearsAgo: "Há {count} anos",
    
    // Time units
    seconds: "segundos",
    minutes: "minutos", 
    hours: "horas",
    days: "dias",
    weeks: "semanas",
    months: "meses",
    years: "anos",
    
    // Days of week
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
    
    // Months
    january: "Janeiro",
    february: "Fevereiro",
    march: "Março",
    april: "Abril",
    may: "Maio",
    june: "Junho",
    july: "Julho",
    august: "Agosto",
    september: "Setembro",
    october: "Outubro",
    november: "Novembro",
    december: "Dezembro"
  }
} as const;

// Helper type for nested translation keys
export type TranslationKey = keyof typeof translations;
export type TranslationPath<T> = T extends object 
  ? { [K in keyof T]: K extends string 
      ? T[K] extends object 
        ? `${K}.${TranslationPath<T[K]>}` 
        : K 
      : never }[keyof T]
  : never;

export type AllTranslationPaths = TranslationPath<typeof translations>;

// Helper function to get nested translation
export function getTranslation(path: string, translationsObj: any = translations): any {
  return path.split('.').reduce((obj, key) => obj?.[key], translationsObj) || path;
}

export default translations;