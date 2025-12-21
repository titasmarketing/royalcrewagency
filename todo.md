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
