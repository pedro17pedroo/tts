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

// Spanish translations
export const translationsES = {
  // Common/General
  common: {
    loading: "Cargando...",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    view: "Ver",
    close: "Cerrar",
    yes: "Sí",
    no: "No",
    confirm: "Confirmar",
    search: "Buscar",
    filter: "Filtrar",
    all: "Todos",
    none: "Ninguno",
    back: "Atrás",
    next: "Siguiente",
    previous: "Anterior",
    submit: "Enviar",
    create: "Crear",
    update: "Actualizar",
    refresh: "Actualizar",
    export: "Exportar",
    import: "Importar",
    download: "Descargar",
    upload: "Subir",
    select: "Seleccionar",
    required: "Requerido",
    optional: "Opcional",
    actions: "Acciones",
    status: "Estado",
    active: "Activo",
    inactive: "Inactivo",
    enabled: "Habilitado",
    disabled: "Deshabilitado",
    total: "Total",
    success: "Éxito",
    error: "Error",
    warning: "Advertencia",
    info: "Información",
    today: "Hoy",
    yesterday: "Ayer",
    tomorrow: "Mañana",
    date: "Fecha",
    time: "Hora",
    datetime: "Fecha y Hora",
    name: "Nombre",
    email: "Email",
    phone: "Teléfono",
    company: "Empresa",
    description: "Descripción",
    notes: "Notas",
    comments: "Comentarios",
    settings: "Configuración",
    profile: "Perfil",
    logout: "Cerrar Sesión",
    login: "Iniciar Sesión",
    register: "Registrarse",
    password: "Contraseña",
    newPassword: "Nueva Contraseña",
    confirmPassword: "Confirmar Contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    rememberMe: "Recordarme",
    or: "o",
    and: "y",
    welcome: "Bienvenido",
    dashboard: "Panel de Control",
    home: "Inicio",
    menu: "Menú",
    navigation: "Navegación",
    language: "Idioma",
    currency: "Moneda",
    timezone: "Zona Horaria",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
    auto: "Automático"
  },

  // Navigation/Menu
  navigation: {
    dashboard: "Panel de Control",
    tickets: "Tickets de Soporte",
    customers: "Clientes",
    hourBank: "Banco de Horas",
    knowledgeBase: "Base de Conocimiento",
    reports: "Informes",
    settings: "Configuración",
    billing: "Facturación",
    subscription: "Suscripción",
    profile: "Perfil",
    users: "Usuarios",
    departments: "Departamentos",
    categories: "Categorías",
    analytics: "Análisis",
    integrations: "Integraciones",
    api: "API",
    audit: "Auditoría",
    security: "Seguridad"
  },

  // Landing Page
  landing: {
    brandName: "TatuTicket",
    tagline: "Sistema de Gestión de Soporte Técnico",
    heroTitle: "Optimiza la Atención al Cliente de tu Empresa",
    heroSubtitle: "Sistema completo de gestión de tickets, SLA y banco de horas",
    getStarted: "Comenzar Gratis",
    learnMore: "Saber Más",
    watchDemo: "Ver Demostración",
    featuresNav: "Características",
    featuresTitle: "Todo lo que Necesitas para Gestionar el Soporte",
    pricing: "Precios",
    pricingTitle: "Planes para Cada Necesidad",
    testimonials: "Testimonios",
    testimonialsTitle: "Lo que Dicen Nuestros Clientes",
    faqNav: "Preguntas Frecuentes",
    faqTitle: "Aclaraciones",
    contact: "Contacto",
    footer: {
      company: "Empresa",
      product: "Producto",
      support: "Soporte",
      legal: "Legal",
      followUs: "Síguenos",
      allRightsReserved: "Todos los derechos reservados",
      privacyPolicy: "Política de Privacidad",
      termsOfService: "Términos de Servicio",
      cookies: "Política de Cookies"
    },
    featureList: {
      ticketManagement: {
        title: "Gestión de Tickets",
        description: "Sistema completo con estados, prioridades, categorías y enrutamiento automático"
      },
      hourBank: {
        title: "Banco de Horas",
        description: "Control de horas por cliente con temporizador automático e informes detallados"
      },
      slaMetrics: {
        title: "SLA y Métricas",
        description: "Monitoreo de SLAs con alertas y paneles personalizables"
      },
      multiTenant: {
        title: "Multi-inquilino",
        description: "Aislamiento completo entre empresas con gestión de permisos"
      },
      knowledgeBase: {
        title: "Base de Conocimiento",
        description: "Artículos organizados con búsqueda avanzada y portal del cliente"
      },
      security: {
        title: "Seguridad",
        description: "Encriptación AES-256, MFA y cumplimiento con LGPD/GDPR"
      }
    },
    plans: {
      free: {
        name: "Gratuito",
        price: "0 €",
        period: "Para empezar",
        description: "Ideal para equipos pequeños",
        cta: "Comenzar Gratis",
        features: [
          "Hasta 3 usuarios",
          "100 tickets/mes",
          "1GB almacenamiento",
          "Soporte básico"
        ]
      },
      pro: {
        name: "Profesional",
        price: "49 €",
        period: "por mes",
        description: "Para empresas en crecimiento",
        cta: "Suscribirse Pro",
        popular: "Más Popular",
        features: [
          "Hasta 15 usuarios",
          "1.000 tickets/mes",
          "50GB almacenamiento",
          "SLA e informes",
          "Integración API"
        ]
      },
      enterprise: {
        name: "Empresarial",
        price: "149 €",
        period: "por mes",
        description: "Para grandes organizaciones",
        cta: "Suscribirse Empresarial",
        features: [
          "Usuarios ilimitados",
          "Tickets ilimitados",
          "500GB almacenamiento",
          "Personalización avanzada",
          "Soporte prioritario"
        ]
      }
    },
    faqList: {
      trial: {
        question: "¿Cómo funciona el período de prueba?",
        answer: "Tienes 14 días para probar todas las funcionalidades del plan Profesional sin compromiso. No se requiere tarjeta de crédito."
      },
      migration: {
        question: "¿Puedo migrar entre planes?",
        answer: "Sí, puedes hacer upgrade o downgrade en cualquier momento. Los cambios se aplican en el próximo ciclo de facturación."
      },
      security: {
        question: "¿Son seguros los datos?",
        answer: "Utilizamos encriptación AES-256, copias de seguridad automáticas y somos compatibles con LGPD y GDPR."
      },
      support: {
        question: "¿Qué tipo de soporte está disponible?",
        answer: "Ofrecemos soporte por email, chat y teléfono. Clientes empresariales tienen acceso a soporte prioritario 24/7."
      },
      customization: {
        question: "¿Puedo personalizar el sistema?",
        answer: "Sí, ofrecemos opciones de personalización incluyendo colores, logotipo y flujos de trabajo personalizados."
      },
      integration: {
        question: "¿El sistema integra con otras herramientas?",
        answer: "Sí, tenemos integración con las principales herramientas de email, CRM y sistemas de facturación."
      }
    }
  },

  // Authentication
  auth: {
    login: {
      title: "Iniciar Sesión",
      subtitle: "Introduce tu email y contraseña para acceder a tu cuenta",
      email: "Email",
      password: "Contraseña",
      rememberMe: "Recordarme",
      forgotPassword: "¿Olvidaste tu contraseña?",
      signIn: "Entrar",
      signUp: "Crear Cuenta",
      noAccount: "¿No tienes cuenta?",
      success: "¡Sesión iniciada con éxito!",
      successDescription: "Has sido autenticado correctamente.",
      error: "Error en el inicio de sesión",
      invalidCredentials: "Email o contraseña incorrectos",
      accountLocked: "Cuenta bloqueada temporalmente",
      tooManyAttempts: "Demasiados intentos. Inténtalo de nuevo más tarde."
    },
    register: {
      title: "Crear Cuenta",
      subtitle: "Regístrate para comenzar a usar TatuTicket",
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Email",
      password: "Contraseña",
      confirmPassword: "Confirmar Contraseña",
      company: "Empresa",
      phone: "Teléfono",
      agreeTerms: "Acepto los términos y condiciones",
      createAccount: "Crear Cuenta",
      signIn: "Entrar",
      hasAccount: "¿Ya tienes cuenta?",
      success: "¡Cuenta creada con éxito!",
      successDescription: "Has sido registrado y autenticado correctamente.",
      error: "Error en el registro",
      emailExists: "Email ya está en uso",
      passwordMismatch: "Las contraseñas no coinciden",
      termsRequired: "Debes aceptar los términos y condiciones"
    },
    forgotPassword: {
      title: "Recuperar Contraseña",
      subtitle: "Introduce tu email para recibir instrucciones de recuperación",
      email: "Email",
      sendInstructions: "Enviar Instrucciones",
      backToLogin: "Volver al inicio de sesión",
      success: "¡Instrucciones enviadas!",
      successDescription: "Revisa tu email para instrucciones de recuperación.",
      error: "Error en la recuperación",
      emailNotFound: "Email no encontrado"
    },
    logout: {
      title: "Cerrar Sesión",
      confirm: "¿Estás seguro de que quieres cerrar sesión?",
      success: "Sesión cerrada con éxito",
      error: "Error al cerrar sesión"
    }
  },

  // Dashboard
  dashboard: {
    title: "Panel de Control",
    welcome: "Bienvenido de vuelta",
    overview: "Resumen",
    stats: {
      openTickets: "Tickets Abiertos",
      inProgress: "En Progreso",
      resolvedToday: "Resueltos Hoy",
      slaAtRisk: "SLA en Riesgo",
      totalCustomers: "Total de Clientes",
      activeUsers: "Usuarios Activos",
      hoursSold: "Horas Vendidas",
      hoursConsumed: "Horas Consumidas",
      hoursAvailable: "Saldo Disponible",
      totalRevenue: "Ingresos Totales",
      monthlyRevenue: "Ingresos Mensuales",
      avgResolutionTime: "Tiempo Promedio Resolución",
      customerSatisfaction: "Satisfacción Cliente"
    },
    widgets: {
      recentTickets: "Tickets Recientes",
      upcomingSLA: "SLAs Próximos",
      hourBankSummary: "Resumen Banco Horas",
      performance: "Rendimiento",
      activity: "Actividad Reciente",
      notifications: "Notificaciones"
    },
    quickActions: {
      createTicket: "Crear Ticket",
      addCustomer: "Agregar Cliente",
      generateReport: "Generar Informe",
      viewAnalytics: "Ver Análisis"
    }
  },

  // Tickets
  tickets: {
    title: "Tickets de Soporte",
    create: "Crear Ticket",
    view: "Ver Ticket",
    edit: "Editar Ticket",
    delete: "Eliminar Ticket",
    assign: "Asignar",
    unassign: "Desasignar",
    close: "Cerrar",
    reopen: "Reabrir",
    resolve: "Resolver",
    escalate: "Escalar",
    merge: "Fusionar",
    split: "Dividir",
    duplicate: "Duplicar",
    print: "Imprimir",
    export: "Exportar",
    
    // Views
    kanbanView: "Vista Kanban",
    tableView: "Vista Tabla",
    listView: "Vista Lista",
    
    // Filters
    filters: {
      status: "Estado",
      priority: "Prioridad",
      assignee: "Responsable",
      customer: "Cliente",
      department: "Departamento",
      category: "Categoría",
      dateRange: "Período",
      search: "Buscar tickets..."
    },
    
    // Status
    status: {
      new: "Nuevo",
      open: "Abierto",
      inProgress: "En Progreso",
      waitingCustomer: "Esperando Cliente",
      waitingInternal: "Esperando Interno",
      resolved: "Resuelto",
      closed: "Cerrado",
      cancelled: "Cancelado",
      onHold: "En Espera"
    },
    
    // Priority
    priority: {
      low: "Baja",
      medium: "Media",
      high: "Alta",
      critical: "Crítica",
      urgent: "Urgente"
    },
    
    // Fields
    fields: {
      id: "ID",
      title: "Título",
      description: "Descripción",
      status: "Estado",
      priority: "Prioridad",
      customer: "Cliente",
      assignee: "Responsable",
      department: "Departamento",
      category: "Categoría",
      tags: "Etiquetas",
      attachments: "Adjuntos",
      timeSpent: "Tiempo Gastado",
      timeEstimated: "Tiempo Estimado",
      dueDate: "Fecha Límite",
      createdAt: "Creado en",
      updatedAt: "Actualizado en",
      resolvedAt: "Resuelto en",
      closedAt: "Cerrado en",
      slaStatus: "Estado SLA",
      slaDeadline: "Plazo SLA",
      lastResponse: "Última Respuesta",
      responseTime: "Tiempo Respuesta",
      resolutionTime: "Tiempo Resolución",
      satisfaction: "Satisfacción",
      rating: "Calificación",
      feedback: "Comentario"
    },
    
    // Actions
    actions: {
      viewDetails: "Ver Detalles",
      editTicket: "Editar Ticket",
      addComment: "Agregar Comentario",
      changeStatus: "Cambiar Estado",
      changePriority: "Cambiar Prioridad",
      assignTo: "Asignar a",
      addTime: "Agregar Tiempo",
      addAttachment: "Agregar Adjunto",
      createSubtask: "Crear Subtarea",
      linkTicket: "Enlazar Ticket",
      copyLink: "Copiar Enlace",
      sendEmail: "Enviar Email",
      scheduleReminder: "Programar Recordatorio"
    },
    
    // Messages
    messages: {
      created: "Ticket creado con éxito",
      updated: "Ticket actualizado con éxito",
      deleted: "Ticket eliminado con éxito",
      assigned: "Ticket asignado con éxito",
      statusChanged: "Estado cambiado con éxito",
      priorityChanged: "Prioridad cambiada con éxito",
      commentAdded: "Comentario agregado con éxito",
      timeAdded: "Tiempo registrado con éxito",
      attachmentAdded: "Adjunto agregado con éxito",
      resolved: "Ticket resuelto con éxito",
      closed: "Ticket cerrado con éxito",
      reopened: "Ticket reabierto con éxito",
      escalated: "Ticket escalado con éxito",
      merged: "Tickets fusionados con éxito",
      duplicated: "Ticket duplicado con éxito",
      
      // Errors
      createError: "Error al crear ticket",
      updateError: "Error al actualizar ticket",
      deleteError: "Error al eliminar ticket",
      assignError: "Error al asignar ticket",
      statusError: "Error al cambiar estado",
      priorityError: "Error al cambiar prioridad",
      commentError: "Error al agregar comentario",
      timeError: "Error al registrar tiempo",
      attachmentError: "Error al agregar adjunto",
      loadError: "Error al cargar tickets",
      notFound: "Ticket no encontrado",
      accessDenied: "Acceso denegado al ticket",
      invalidData: "Datos inválidos",
      duplicateTitle: "Título ya existe"
    }
  },

  // Customers
  customers: {
    title: "Clientes",
    add: "Agregar Cliente",
    edit: "Editar Cliente",
    delete: "Eliminar Cliente",
    view: "Ver Cliente",
    import: "Importar Clientes",
    export: "Exportar Clientes",
    
    // Fields
    fields: {
      name: "Nombre",
      email: "Email",
      phone: "Teléfono",
      company: "Empresa",
      address: "Dirección",
      city: "Ciudad",
      country: "País",
      postalCode: "Código Postal",
      taxNumber: "Número Fiscal",
      website: "Sitio Web",
      industry: "Sector",
      size: "Tamaño",
      status: "Estado",
      type: "Tipo",
      priority: "Prioridad",
      assignedTo: "Asignado a",
      createdAt: "Creado en",
      updatedAt: "Actualizado en",
      lastContact: "Último Contacto",
      totalTickets: "Total Tickets",
      openTickets: "Tickets Abiertos",
      satisfaction: "Satisfacción",
      value: "Valor",
      tags: "Etiquetas",
      notes: "Notas"
    },
    
    // Status
    status: {
      active: "Activo",
      inactive: "Inactivo",
      suspended: "Suspendido",
      prospect: "Prospecto",
      lead: "Lead",
      trial: "Prueba"
    },
    
    // Type
    type: {
      individual: "Individual",
      business: "Empresa",
      government: "Gobierno",
      ngo: "ONG",
      education: "Educación",
      healthcare: "Salud"
    },
    
    // Actions
    actions: {
      viewProfile: "Ver Perfil",
      editProfile: "Editar Perfil",
      viewTickets: "Ver Tickets",
      createTicket: "Crear Ticket",
      viewHourBank: "Ver Banco Horas",
      addHours: "Agregar Horas",
      sendEmail: "Enviar Email",
      makeCall: "Hacer Llamada",
      addNote: "Agregar Nota",
      addTag: "Agregar Etiqueta",
      exportData: "Exportar Datos",
      mergeCustomer: "Fusionar Cliente",
      deleteCustomer: "Eliminar Cliente"
    },
    
    // Messages
    messages: {
      created: "Cliente creado con éxito",
      updated: "Cliente actualizado con éxito",
      deleted: "Cliente eliminado con éxito",
      imported: "Clientes importados con éxito",
      exported: "Clientes exportados con éxito",
      emailSent: "Email enviado con éxito",
      noteAdded: "Nota agregada con éxito",
      tagAdded: "Etiqueta agregada con éxito",
      merged: "Clientes fusionados con éxito",
      
      // Errors
      createError: "Error al crear cliente",
      updateError: "Error al actualizar cliente",
      deleteError: "Error al eliminar cliente",
      importError: "Error al importar clientes",
      exportError: "Error al exportar clientes",
      emailError: "Error al enviar email",
      loadError: "Error al cargar clientes",
      notFound: "Cliente no encontrado",
      emailExists: "Email ya existe",
      invalidData: "Datos inválidos",
      accessDenied: "Acceso denegado"
    }
  },

  // Hour Bank
  hourBank: {
    title: "Banco de Horas",
    create: "Crear Banco",
    edit: "Editar Banco",
    delete: "Eliminar Banco",
    view: "Ver Detalles",
    add: "Agregar Horas",
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
      purchaseDate: "Fecha Compra",
      expiryDate: "Fecha Vencimiento",
      status: "Estado",
      description: "Descripción",
      notes: "Notas",
      tags: "Etiquetas",
      department: "Departamento",
      project: "Proyecto",
      contract: "Contrato",
      invoiceNumber: "Número Factura",
      paymentStatus: "Estado Pago",
      usageHistory: "Historial Uso",
      createdAt: "Creado en",
      updatedAt: "Actualizado en",
      createdBy: "Creado por",
      updatedBy: "Actualizado por"
    },
    
    // Status
    status: {
      active: "Activo",
      inactive: "Inactivo",
      expired: "Expirado",
      suspended: "Suspendido",
      exhausted: "Agotado",
      pending: "Pendiente",
      cancelled: "Cancelado"
    },
    
    // Usage Types
    usageTypes: {
      support: "Soporte Técnico",
      development: "Desarrollo",
      consulting: "Consultoría",
      training: "Formación",
      maintenance: "Mantenimiento",
      implementation: "Implementación",
      testing: "Pruebas",
      documentation: "Documentación",
      meeting: "Reunión",
      other: "Otro"
    },
    
    // Statistics
    stats: {
      totalBanks: "Total Bancos",
      activeBanks: "Bancos Activos",
      totalHoursSold: "Total Horas Vendidas",
      totalHoursConsumed: "Total Horas Consumidas",
      totalHoursRemaining: "Total Horas Restantes",
      totalValue: "Valor Total",
      averageUsage: "Uso Promedio",
      expiringThisMonth: "Expiran Este Mes",
      lowBalance: "Saldo Bajo",
      utilizationRate: "Tasa Utilización"
    },
    
    // Actions
    actions: {
      viewDetails: "Ver Detalles",
      addHours: "Agregar Horas",
      consumeHours: "Registrar Uso",
      transferHours: "Transferir Horas",
      extendExpiry: "Prorrogar Vencimiento",
      generateReport: "Generar Informe",
      exportHistory: "Exportar Historial",
      sendStatement: "Enviar Estado de Cuenta",
      createInvoice: "Crear Factura",
      viewInvoices: "Ver Facturas",
      addNote: "Agregar Nota",
      editDetails: "Editar Detalles",
      suspendBank: "Suspender Banco",
      activateBank: "Activar Banco",
      deleteBank: "Eliminar Banco"
    },
    
    // Messages
    messages: {
      created: "Banco de horas creado con éxito",
      updated: "Banco de horas actualizado con éxito",
      deleted: "Banco de horas eliminado con éxito",
      hoursAdded: "Horas agregadas con éxito",
      hoursConsumed: "Horas registradas con éxito",
      hoursTransferred: "Horas transferidas con éxito",
      expiryExtended: "Vencimiento prorrogado con éxito",
      suspended: "Banco suspendido con éxito",
      activated: "Banco activado con éxito",
      reportGenerated: "Informe generado con éxito",
      statementSent: "Estado de cuenta enviado con éxito",
      invoiceCreated: "Factura creada con éxito",
      
      // Warnings
      lowBalance: "Saldo bajo en el banco de horas",
      expiringSoon: "Banco de horas expira pronto",
      expired: "Banco de horas expirado",
      exhausted: "Banco de horas agotado",
      insufficientHours: "Horas insuficientes en el banco",
      
      // Errors
      createError: "Error al crear banco de horas",
      updateError: "Error al actualizar banco de horas",
      deleteError: "Error al eliminar banco de horas",
      addHoursError: "Error al agregar horas",
      consumeHoursError: "Error al registrar uso de horas",
      transferError: "Error al transferir horas",
      extendError: "Error al prorrogar vencimiento",
      loadError: "Error al cargar bancos de horas",
      notFound: "Banco de horas no encontrado",
      invalidData: "Datos inválidos",
      accessDenied: "Acceso denegado",
      alreadyExpired: "Banco ya expirado",
      alreadySuspended: "Banco ya suspendido"
    }
  },

  // Settings
  settings: {
    title: "Configuración",
    general: "General",
    account: "Cuenta",
    security: "Seguridad",
    notifications: "Notificaciones",
    integrations: "Integraciones",
    billing: "Facturación",
    team: "Equipo",
    preferences: "Preferencias",
    
    // General Settings
    generalSettings: {
      companyInfo: "Información de la Empresa",
      companyName: "Nombre de la Empresa",
      companyEmail: "Email de la Empresa",
      companyPhone: "Teléfono de la Empresa",
      companyAddress: "Dirección de la Empresa",
      companyWebsite: "Sitio Web de la Empresa",
      timezone: "Zona Horaria",
      language: "Idioma",
      currency: "Moneda",
      dateFormat: "Formato de Fecha",
      timeFormat: "Formato de Hora"
    },
    
    // Account Settings
    accountSettings: {
      personalInfo: "Información Personal",
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Email",
      phone: "Teléfono",
      avatar: "Avatar",
      changePassword: "Cambiar Contraseña",
      currentPassword: "Contraseña Actual",
      newPassword: "Nueva Contraseña",
      confirmNewPassword: "Confirmar Nueva Contraseña"
    },
    
    // Security Settings
    securitySettings: {
      twoFactorAuth: "Autenticación de Dos Factores",
      enable2FA: "Habilitar 2FA",
      disable2FA: "Deshabilitar 2FA",
      activeSessions: "Sesiones Activas",
      loginHistory: "Historial de Inicios de Sesión",
      apiKeys: "Claves API",
      generateApiKey: "Generar Clave API",
      revokeApiKey: "Revocar Clave API"
    },
    
    // Notification Settings
    notificationSettings: {
      emailNotifications: "Notificaciones por Email",
      pushNotifications: "Notificaciones Push",
      smsNotifications: "Notificaciones SMS",
      ticketUpdates: "Actualizaciones de Tickets",
      slaAlerts: "Alertas SLA",
      systemUpdates: "Actualizaciones del Sistema",
      marketingEmails: "Emails de Marketing",
      weeklyReports: "Informes Semanales",
      monthlyReports: "Informes Mensuales"
    },
    
    // Messages
    messages: {
      settingsSaved: "Configuración guardada con éxito",
      passwordChanged: "Contraseña cambiada con éxito",
      profileUpdated: "Perfil actualizado con éxito",
      notificationsUpdated: "Notificaciones actualizadas con éxito",
      
      // Errors
      saveError: "Error al guardar configuración",
      passwordError: "Error al cambiar contraseña",
      profileError: "Error al actualizar perfil",
      notificationError: "Error al actualizar notificaciones",
      invalidCurrentPassword: "Contraseña actual incorrecta",
      passwordTooShort: "Contraseña demasiado corta",
      passwordMismatch: "Las contraseñas no coinciden"
    }
  },

  // Date and time
  dates: {
    // Time periods
    second: "segundo",
    seconds: "segundos",
    minute: "minuto",
    minutes: "minutos",
    hour: "hora",
    hours: "horas",
    day: "día",
    days: "días",
    week: "semana",
    weeks: "semanas",
    month: "mes",
    months: "meses",
    year: "año",
    years: "años",
    
    // Days of week
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
    
    // Months
    january: "Enero",
    february: "Febrero",
    march: "Marzo",
    april: "Abril",
    may: "Mayo",
    june: "Junio",
    july: "Julio",
    august: "Agosto",
    september: "Septiembre",
    october: "Octubre",
    november: "Noviembre",
    december: "Diciembre"
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