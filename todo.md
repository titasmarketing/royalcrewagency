# GOD MODE - Royal Crew Agency
## Lista de Funcionalidades e Tarefas

### 🎨 DESIGN SYSTEM E IDENTIDADE VISUAL
- [x] Configurar paleta de cores premium (azul marinho #001F3F + dourado #D4AF37)
- [x] Definir tipografia e hierarquia visual
- [x] Criar componentes UI customizados com tema premium
- [x] Configurar TailwindCSS com cores personalizadas
- [x] Adicionar logo Royal Crew Agency

### 🗄️ BANCO DE DADOS E ARQUITETURA
- [x] Criar tabela de serviços (services)
- [x] Criar tabela de eventos (events)
- [x] Criar tabela de staff (staff_members)
- [x] Criar tabela de disponibilidade de staff (staff_availability)
- [x] Criar tabela de convites/vagas (job_invitations)
- [x] Criar tabela de clientes (clients)
- [x] Criar tabela de pagamentos (payments)
- [x] Criar tabela de documentos (documents)
- [x] Criar tabela de insumos/estoque (inventory_items)
- [x] Criar tabela de requisições de estoque (inventory_requests)
- [x] Criar relacionamentos entre tabelas

### 📄 CMS DINÂMICO
- [x] Sistema de criação de serviços no admin
- [x] Renderização automática de páginas de serviços (/servicos/[slug])
- [ ] Upload de imagens para serviços
- [ ] Editor de conteúdo rico (WYSIWYG)
- [ ] Sistema de portfólio/galeria automática
- [x] Sincronização em tempo real do catálogo
- [x] SEO automático para páginas de serviços

### 📅 PAINEL ADMIN - CALENDÁRIO MESTRE
- [x] Calendário multi-visão (mês, semana, dia)
- [x] Visão de eventos com blocos coloridos por status
- [ ] Visão de escala de staff (timeline horizontal)
- [x] Drag-and-drop de eventos
- [ ] Sistema de detecção de conflitos de agenda
- [ ] Alertas visuais para conflitos de staff
- [ ] Filtros por status, tipo de evento, staff
- [ ] Raio-X do evento (detalhes expandidos)

### 👥 SISTEMA DE STAFF
- [ ] Cadastro e perfil de staff
- [ ] Calendário de disponibilidade individual
- [ ] Sistema de bloqueio de datas
- [ ] Sistema de convites para vagas (estilo Uber)
- [ ] Notificações push para novas oportunidades
- [ ] Sistema de aceite/recusa de convites
- [ ] Agenda pessoal do staff com eventos aceitos
- [ ] Integração com Waze/Google Maps para endereços
- [ ] Carteira financeira do staff
- [ ] Histórico de eventos trabalhados
- [ ] Sistema de avaliações

### 👔 PORTAL DO CLIENTE
- [ ] Dashboard do cliente com eventos contratados
- [ ] Calendário de eventos do cliente
- [ ] Tracking em tempo real da equipe
- [ ] Status do evento (equipe em deslocamento, no local, serviço iniciado)
- [ ] Área financeira (boletos, notas fiscais, status de pagamento)
- [ ] Sistema de autoatendimento

### 🤖 MATCHMAKING E INTELIGÊNCIA
- [ ] Algoritmo de sugestão de staff por proximidade (geolocalização)
- [ ] Algoritmo de sugestão por avaliação média
- [ ] Algoritmo de sugestão por disponibilidade
- [ ] Sistema de ranking de staff
- [ ] Sugestão automática de equipe ideal

### 💰 GESTÃO FINANCEIRA
- [ ] Sistema de pagamentos para staff
- [ ] Extrato financeiro detalhado
- [ ] Status "A receber", "Pago", "Bônus"
- [ ] Gestão de pagamentos de clientes
- [ ] Integração com gateway de pagamento
- [ ] Geração de boletos
- [ ] Controle de comissões

### 📋 GERADOR DE DOCUMENTOS
- [ ] Template de contrato em PDF
- [ ] Template de ordem de serviço em PDF
- [ ] Template de nota fiscal em PDF
- [ ] Sistema de preenchimento automático com dados do banco
- [ ] Download de documentos gerados

### 📦 GESTÃO DE LOGÍSTICA E ESTOQUE
- [ ] Cadastro de insumos
- [ ] Sistema de kits de insumos por tipo de serviço
- [ ] Sugestão automática de insumos por evento
- [ ] Baixa automática no estoque virtual
- [ ] Alertas de estoque baixo
- [ ] Relatórios de consumo

### 🔔 AUTOMAÇÕES E NOTIFICAÇÕES
- [ ] Sistema de notificações push
- [ ] Lembretes automáticos 3 dias antes do evento (cliente)
- [ ] Confirmação automática 1 dia antes (staff)
- [ ] Pesquisa de satisfação pós-evento (cliente)
- [ ] Notificações de novas vagas (staff)
- [ ] Notificações de conflitos de agenda

### 🔐 AUTENTICAÇÃO E PERMISSÕES
- [ ] Sistema de roles (admin, staff, cliente)
- [ ] Controle de acesso por role
- [ ] Área administrativa protegida
- [ ] Área do staff protegida
- [ ] Área do cliente protegida

### 🎯 FUNCIONALIDADES EXTRAS
- [ ] Dashboard com métricas e KPIs
- [ ] Relatórios de eventos
- [ ] Relatórios financeiros
- [ ] Sistema de busca avançada
- [ ] Exportação de dados
- [ ] Logs de atividades

### 🚀 NOVAS FUNCIONALIDADES EM DESENVOLVIMENTO
- [x] Calendário de disponibilidade individual do staff
- [x] Sistema de bloqueio de datas para staff
- [ ] Detecção automática de conflitos de agenda
- [ ] Alertas visuais para conflitos de escala
- [x] Portal do cliente com tracking em tempo real
- [x] Mapa interativo com localização da equipe
- [x] Status do evento (equipe em deslocamento, no local, serviço iniciado)
- [x] Carteira financeira do staff (A receber, Pago, Bônus)
- [x] Área financeira do cliente (boletos, notas fiscais, status)
- [x] Sistema de extrato financeiro detalhado

### 🎯 PORTAL DE RECRUTAMENTO
- [x] Página pública de cadastro de staff (/trabalhe-conosco)
- [x] Formulário completo de inscrição
- [ ] Upload de foto de perfil para S3
- [x] Campos: nome, email, telefone, CPF, experiência, especialidades
- [x] Sistema de status (Pendente, Aprovado, Reprovado)
- [x] Página no admin para gerenciar candidatos
- [x] Notificação ao admin quando novo cadastro chegar
- [ ] Email de confirmação para candidato aprovado
- [x] Integração com sistema de autenticação

### 🔧 MELHORIAS URGENTES
- [ ] Remover campo CPF (sistema roda no Reino Unido)
- [ ] Melhorar Home Page com seções completas (estatísticas, depoimentos, galeria, FAQ)
- [ ] Criar CMS para gerenciar conteúdo do site no admin
- [ ] Melhorar Portal do Cliente com mais funcionalidades
- [ ] Redesign da página de recrutamento com mais informações e visual premium
- [ ] Adicionar seção de benefícios e diferenciais na home
- [ ] Criar galeria de eventos realizados
- [ ] Adicionar seção de depoimentos de clientes

### 💷 CORREÇÃO DE MOEDA
- [x] Alterar todos os preços de R$ (Real) para £ (Libra Esterlina)
- [x] Atualizar labels de "Preço Base (R$)" para "Base Price (£)"
- [x] Corrigir formatação de valores monetários em toda a plataforma
- [x] Atualizar documentos PDF para usar £ ao invés de R$

### 🔄 REORGANIZAÇÃO DO HEADER
- [x] Remover botão "Painel Admin" do header
- [x] Adicionar botão "Portal do Cliente" no header
- [x] Adicionar link "Admin" no footer (discreto)

### 🇬🇧 ADAPTAÇÃO PARA REINO UNIDO
- [ ] Adaptar formulário de cadastro para padrão UK
- [ ] Mudar "Estado" para "County" (condados UK)
- [ ] Adicionar campo "Postcode" (código postal UK)
- [ ] Atualizar formato de endereço (Address Line 1, Line 2, Postcode)
- [ ] Atualizar placeholders com exemplos UK
- [ ] Traduzir todos os textos para inglês

### 🇬🇧 ADAPTAÇÃO PARA REINO UNIDO (MANTER PORTUGUÊS)
- [x] Adaptar formato de telefone para UK (+44)
- [x] Mudar "Estado" para "Condado" 
- [x] Adicionar campo "Código Postal" (postcode UK)
- [x] Atualizar placeholders: Londres, Greater London, SW1A 1AA
- [x] Atualizar exemplo de telefone: +44 20 1234 5678

### 📱 IMPLEMENTAR DASHBOARDLAYOUT COM SIDEBAR
- [x] Usar DashboardLayout em todas as páginas admin
- [x] Configurar menu lateral com todas as opções
- [x] Remover página AdminDashboard com cards
- [x] Redirecionar /admin para /admin/calendario

### 🎨 MELHORIAS VISUAIS
- [x] Adicionar cor dourada (#D4AF37) nos cards (bordas, ícones, hover)
- [ ] Limpar serviços fake do banco de dados

### 🔀 MESCLAGEM COM PROJETO EVENTMASTER
- [x] Analisar layout e componentes do EventMaster Pro
- [x] Extrair melhores práticas de UI/UX
- [x] Integrar home page premium com navbar elegante e hero section
- [ ] Melhorar Portal do Cliente com dashboard visual
- [ ] Criar Portal do Staff (agenda, eventos, carteira)
- [ ] Sistema de Booking Expresso na home
- [x] Adaptar cores para Royal Crew (azul marinho + dourado)
- [x] Manter funcionalidades GOD MODE existentes

### 📝 FORMULÁRIO DE RESERVA IMEDIATA
- [ ] Adicionar formulário de reserva no hero (lado direito)
- [ ] Campos: Data, Tipo de Evento, Horas, Email
- [ ] Seleção de staff necessário (checkboxes)
- [ ] Botão "Solicitar Cotação" dourado
- [ ] Integrar com sistema de eventos/clientes

### 🎨 REDESIGN PREMIUM DAS PÁGINAS ADMIN
- [ ] Redesenhar Calendário Mestre (manter FullCalendar + design premium)
- [ ] Redesenhar Gestão de Serviços (manter CRUD + cards elegantes)
- [ ] Redesenhar Gestão de Staff (manter funcionalidades + visual premium)
- [ ] Redesenhar Gestão de Clientes (manter PF/PJ + design sofisticado)
- [ ] Redesenhar Gestão de Estoque (manter alertas + visual novo)
- [ ] Redesenhar Documentos PDF (manter geração + interface melhorada)
- [ ] Redesenhar Matchmaking IA (manter algoritmo + visualização premium)
- [ ] Redesenhar Candidaturas (manter aprovação + cards elegantes)

### 🎯 AJUSTAR LAYOUT DO HERO
- [x] Mudar layout de lado a lado para vertical centralizado
- [x] Texto "A ELITE DA HOSPITALIDADE" no topo (centralizado)
- [x] Formulário de reserva embaixo do texto (centralizado)
- [x] Mais espaçamento entre elementos

### 🚪 IMPLEMENTAR 3 PORTAIS
- [x] Implementar Portal do Cliente (/cliente) usando Client.tsx do EventMaster Pro
- [ ] Implementar Portal do Admin (/admin) usando Admin.tsx do EventMaster Pro  
- [x] Implementar Portal do Staff (/staff) usando StaffRegistration.tsx do EventMaster Pro
- [x] Atualizar footer com links para Admin e Staff
- [ ] Melhorar página de recrutamento usando Recruitment.tsx

### 🚨 CORREÇÕES URGENTES - NAVBAR E PORTAL DO CLIENTE
- [x] Trocar botão "PORTAIS" por "CLIENTES" na navbar da home
- [x] Botão "CLIENTES" deve levar para /cliente (portal de autoatendimento)
- [x] Portal do Cliente (/cliente) é para cliente final se cadastrar e ver seus serviços
- [x] Página Admin/Clientes (/admin/clientes) é separada - para admin gerenciar clientes

### 🎨 AJUSTES VISUAIS DO HERO SECTION
- [x] Diminuir fonte do título "A ELITE DA HOSPITALIDADE" (de text-8xl para text-6xl)
- [x] Aumentar largura do modal de reserva (de max-w-3xl para max-w-5xl)
- [x] Reorganizar grid do formulário (4 colunas em desktop, mais compacto)
- [x] Ajustar grid de staff (5 colunas, altura reduzida)

### 🖼️ AJUSTAR IMAGEM DE FUNDO DO HERO
- [x] Aumentar opacidade da imagem de fundo (de opacity-20 para opacity-40)
- [x] Ajustar gradiente para não cobrir totalmente a imagem (from-[#0c1b33]/80 via-[#0c1b33]/60)

### 🗑️ REMOVER ELEMENTOS TEMPORÁRIOS
- [x] Remover seção "+1,200 Profissionais Verificados" com avatares do hero

### 🔧 AJUSTES FINAIS DO HERO
- [x] Reduzir espaçamento entre título e formulário (de space-y-12 para space-y-8)
- [x] Aumentar opacidade da imagem de fundo para 70% e reduzir gradiente escuro

### 🚨 URGENTE - IMAGEM DE FUNDO
- [x] Colocar imagem de fundo VISÍVEL no hero (opacity-30, sem gradiente)
- [x] Remover overlay escuro que estava escondendo a imagem

### 🎨 AJUSTAR OPACIDADE DA IMAGEM
- [x] Aumentar overlay de 60% para 75% (mais escuro conforme solicitado)

### 🇬🇧 TRADUÇÃO COMPLETA PARA INGLÊS (UK)
- [x] Traduzir home page (hero, navbar, footer)
- [x] Traduzir formulário de reserva
- [x] Traduzir Portal do Cliente
- [x] Traduzir Portal do Staff
- [x] Traduzir todas as páginas Admin (9 páginas)
- [x] Traduzir página de recrutamento
- [x] Traduzir todas as interfaces e mensagens

### 🧹 LIMPAR DADOS FAKE/MOCK
- [x] Remover todos os "Test Service" da página AdminServices (DELETE FROM services)
- [x] Deixar página zerada com apenas botão "+ Novo Servi### 🌐 TRADUZIR URLs PARA INGLÊS
- [x] Traduzir página RecruitmentPortal (Trabalhe Conosco)
- [x] Mudar URL /trabalhe-conosco → /work-with-us
- [x] Atualizar rotas no App.tsx (todas as 16 rotas traduzidas)
- [x] Atualizar todos os links no site (Home, Footer, DashboardLayout)
- [x] URLs traduzidas: /client, /services, /work-with-us, /admin/calendar, /admin/services, /admin/clients, /admin/inventory, /admin/documents, /admin/applicationsDashboardLayout, etc.)
- [x] URLs traduzidas: /client, /services, /admin/calendar, /admin/services, /admin/clients, /admin/inventory, /admin/documents, /admin/applications

### 🚨 URGENTE - TRADUZIR TEXTOS RESTANTES
- [x] Traduzir "Faça Parte da Team Premium" → "Join the Premium Team"
- [x] Traduzir benefícios (Great Pay, Flexibility, Premium Events, Top Team)
- [x] Traduzir "Formulário de Cadastro" → "Application Form"
- [x] Traduzir "Informações Pessoais" → "Personal Information"
- [x] Traduzir "Informações Profissionais" → "Professional Information"
- [x] Traduzir "Specialties / Funções" → "Specialties / Roles"
- [x] Traduzir todos os placeholders e botões

### 🏢 TRADUZIR PÁGINAS ADMIN
- [x] Traduzir DashboardLayout (menu lateral: Calendar, Services, Team, Clients, Inventory, Documents, Matchmaking, Applications)
- [x] Traduzir AdminCalendar
- [x] Traduzir AdminServices
- [x] Traduzir AdminStaff
- [x] Traduzir AdminClients
- [x] Traduzir AdminInventory
- [x] Traduzir AdminDocuments
- [x] Traduzir AdminMatchmaking
- [x] Traduzir AdminRecruitment
- [x] Traduzir AdminDashboard

### 📝 TRADUZIR MODAIS/DIALOGS DAS PÁGINAS ADMIN
- [x] Traduzir formulários dentro dos modais (labels, placeholders)
- [x] Traduzir mensagens de validação
- [x] Traduzir botões de ação nos modais (Save, Cancel, Create, Update, Delete)
- [x] Traduzir títulos e descrições dos dialogs
- [x] 150+ traduções aplicadas em 9 páginas admin

### 🌍 TRADUZIR TEXTOS RESTANTES EM PORTUGUÊS
- [x] Traduzir títulos de páginas (Calendar Mestre → Master Calendar, Gestão de Services → Services Management)
- [x] Traduzir descrições (Visualização e gestão... → View and manage...)
- [x] Traduzir botões de visualização (Mês → Month, Semana → Week, Dia → Day)
- [x] Traduzir dias da semana (dom/seg/ter/qua/qui/sex/sáb → Sun/Mon/Tue/Wed/Thu/Fri/Sat)
- [x] Traduzir meses (dezembro → December, janeiro → January, etc)
- [x] Traduzir status (Orçamento → Budget, Confirmado → Confirmed, Completeds → Completed, Cancelleds → Cancelled)
- [x] Traduzir mensagens de estado vazio (None serviço cadastrado → No services registered, Create First Serviço → Create First Service)
- [x] 100+ traduções aplicadas em 11 arquivos (9 Admin + ClientPortal + StaffPortal)

### 📅 MELHORAR NAVEGAÇÃO DO CALENDÁRIO
- [x] Adicionar botões de seta (< >) para navegar entre meses (já existem no FullCalendar: prev,next)
- [x] Traduzir locale de "pt-br" → "en-gb"
- [x] Traduzir buttonText: "Hoje" → "Today"
- [x] Agora mostra "December 2025" ao invés de "dezembro de 2025"

### 🔧 CORRIGIR BOTÕES DE NAVEGAÇÃO DO CALENDÁRIO
- [ ] Botões prev/next não estão aparecendo visualmente
- [ ] Verificar CSS do FullCalendar
- [ ] Adicionar estilos customizados se necessário

### 🎨 MELHORAR VISIBILIDADE DOS BOTÕES DO CALENDÁRIO
- [x] Botões prev/next/today estavam muito claros (apagados)
- [x] Adicionado CSS customizado no index.css
- [x] Botões agora usam navy blue com texto gold
- [x] Hover effect com sombra e transform
- [x] Botão ativo fica gold com texto navy

### 🌐 TRADUZIR PORTAL DO CLIENTE COMPLETAMENTE
- [x] Traduzir saudação "Olá, Marcel" → "Hello, Marcel"
- [x] Traduzir "SEJA BEM-VINDO AO SEU PORTAL DE ELITE" → "WELCOME TO YOUR ELITE PORTAL"
- [x] Traduzir "CANCEL SOLICITAÇÃO" → "CANCEL REQUEST"
- [x] Traduzir "DETALHES DO EVENTO" → "EVENT DETAILS"
- [x] Traduzir todos os labels dos campos (DATE, DURATION, LOCATION, POSTCODE)
- [x] Traduzir nomes dos serviços (Garçom → Waiter, Recepcionista → Receptionist, Segurança → Security, Limpeza → Cleaning, Coordenador → Coordinator)
- [x] Traduzir "ENVIAR SOLICITAÇÃO ROYAL" → "SUBMIT ROYAL REQUEST"
- [x] Traduzir "Você ainda não possui solicitações ativas" → "You don't have any active requests yet"
- [x] Traduzir status (Pendente → Pending, Confirmado → Confirmed, etc)

### 🔧 TRADUÇÃO MANUAL DO CLIENTPORTAL (SCRIPT FALHOU)
- [x] Script Python não funcionou - feito edições manuais com file edit
- [x] Traduzir TODOS os textos em português restantes (12 traduções aplicadas)
- [x] Verificado cada linha do arquivo

### 🔧 TRADUÇÃO DO STAFFPORTAL (USUÁRIO REPORTOU)
- [x] Traduzir "BEM-VINDO AO SEU PORTAL PROFISSIONAL" → "WELCOME TO YOUR PROFESSIONAL PORTAL"
- [x] Traduzir "MINHA WALLET" → "MY WALLET"
- [x] Traduzir "A RECEBER" → "TO RECEIVE"
- [x] Traduzir "PAGO" → "PAID"
- [x] Traduzir "BÔNUS" → "BONUS"
- [x] Traduzir "MEUS JOBS" → "MY JOBS"
- [x] Traduzir "Você ainda não possui trabalhos agendados." → "You don't have any scheduled jobs yet."
- [x] Traduzir "MINHA AVAILABILITY" → "MY AVAILABILITY"
- [x] Traduzir "CALENDAR DE DISPONIBILIDADE EM BREVE" → "AVAILABILITY CALENDAR COMING SOON"
- [x] 18 traduções aplicadas com sucesso
