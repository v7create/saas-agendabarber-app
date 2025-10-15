# 📸 Análise Completa da UI - AgendaBarber

**Data:** 15 de outubro de 2025  
**Análise baseada em:** 23 screenshots do fluxo completo  
**Status:** Análise detalhada de todas as telas e componentes

---

## 🎯 Visão Geral do Sistema

**AgendaBarber** é um SaaS dual-purpose:
1. **Painel Profissional** - Dashboard completo para gestão da barbearia
2. **Página Pública de Agendamento** - Interface para clientes agendarem sem login

---

## 📱 1. TELA DE LOGIN / AUTENTICAÇÃO

### **Screenshot:** Login Page

#### Componentes Identificados:
```typescript
- Logo circular com ícone de tesoura (violeta)
- Título: "AgendaBarber"
- Subtítulo: "Acesso ao Painel Profissional ou Tela de Agendamentos para Clientes"
- Tabs: "Login" | "Cadastro"
- Campos:
  * Email (input text)
  * Senha (input password com dots)
- Botão primário: "Entrar" (violeta)
- Divisor: "ou"
- Botão secundário: "Continuar com Google" (branco, com ícone G)
- Botão terciário: "Continuar sem login" (outline)
```

#### Funcionalidades:
- Login com email/senha
- Login com Google (OAuth)
- Acesso público (sem autenticação)
- Toggle entre Login e Cadastro

#### Estados Especiais:
- **Loading:** Botão "Entrar" com spinner durante autenticação
- **Error:** Mensagem de erro abaixo dos campos (texto vermelho)
- **Success:** Redirect automático para Dashboard
- **Empty:** Validação de campos obrigatórios

#### Fluxo de Navegação:
```
LoginPage
├─ Login bem-sucedido → Dashboard
├─ Continuar com Google → Dashboard (após OAuth)
└─ Continuar sem login → Booking Page (página pública)
```

---

## 🏠 2. DASHBOARD (PÁGINA PRINCIPAL)

### **Screenshot:** Dashboard Principal

#### Layout:
```typescript
Header:
  - Menu hamburger (esquerda)
  - Título: "Dashboard"
  - Badge de notificações: (2) - vermelho
  - Avatar do usuário: "AB" (direita)

Content:
  - Data: "Quarta-Feira, 15 De Outubro De 2025"
  - Botão CTA: "+ Novo Agendamento" (violeta, full-width)
  
  - Grid 2x2 de Cards Estatísticos:
    1. Agendamentos Hoje: 8 (+2 desde ontem) - verde
    2. Receita Hoje: R$ 450 (+12.5% esta semana) - verde
    3. Total de Clientes: 127 (Clientes ativos) - vermelho
    4. Próximo Cliente: 14:30 (João Silva) - vermelho

  - Seção "Ações Rápidas":
    * Grid 2x2:
      - Novo Agendamento (ícone calendário)
      - Cadastrar Cliente (ícone pessoa)
      - Registrar Pagamento (ícone cartão)
      - Ver Agenda (ícone relógio)

  - Seção "Próximos Agendamentos":
    * Card 1: João Silva
      - 14/10, 14:30
      - Serviços: Corte, Barba
      - Profissional: André
      - Valor: R$ 65,00
      - Botão WhatsApp (verde)
      - Menu 3 dots (opções)
    
    * Card 2: Pedro Santos
      - 14/10, 16:00
      - Serviços: Corte Simples
      - Profissional: Bruno
      - Valor: R$ 35,00
      - Botão WhatsApp (verde)
      - Menu 3 dots (opções)

Bottom Navigation:
  - Início (ativo - violeta)
  - Agenda
  - Clientes
  - Financeiro
```

#### Funcionalidades:
- Resumo executivo em tempo real
- Acesso rápido às principais funções
- Lista de próximos agendamentos
- Integração com WhatsApp
- Notificações em tempo real

#### Estados Especiais:
- **Loading:** Skeleton screens nos cards durante carregamento
- **Empty:** "Nenhum agendamento hoje" com CTA para criar
- **Error:** Banner de erro no topo se falhar ao carregar dados
- **Success:** Toast "Login realizado! Bem-vindo de volta!" (topo, fade-in-down)

#### Dados Dinâmicos:
```typescript
interface DashboardStats {
  appointmentsToday: {
    count: number;
    change: string; // "+2 desde ontem"
  };
  revenueToday: {
    amount: number;
    change: string; // "+12.5% esta semana"
  };
  totalClients: {
    count: number;
    subtitle: string; // "Clientes ativos"
  };
  nextClient: {
    time: string;
    name: string;
  };
}
```

---

## 🗂️ 3. SIDEBAR / MENU LATERAL

### **Screenshot:** Sidebar Aberto

#### Estrutura:
```typescript
Header:
  - Logo: "AgendaBarber"
  - Botão fechar (X)
  - Badge notificações: (2)
  - Avatar: "AB"

Perfil:
  - Nome: "André Barber"
  - Email: "testebarber@gmail.com"

PRINCIPAL:
  - Início (ícone casa)
  - Agenda (ícone calendário)
  - Clientes (ícone pessoas)
  - Financeiro (ícone cifrão)

GERENCIAMENTO:
  - Perfil da Empresa (ícone pessoa)
  - Configurações da Barbearia (ícone tesoura)
  - Serviços (ícone lista)
  - Configurações (ícone engrenagem)

Footer:
  - Sair (ícone logout, texto vermelho)
```

#### Funcionalidades:
- Navegação completa do app
- Informações do usuário logado
- Logout

#### Estados Especiais:
- **Open:** Overlay escuro sobre conteúdo + sidebar slide-in-left
- **Closed:** Sidebar fora da tela
- **Active Route:** Item do menu destacado (background violeta/20)

---

## 📅 4. AGENDA (CALENDÁRIO E TIMELINE)

### **Screenshot:** Agenda - Vista Timeline

#### Layout:
```typescript
Header:
  - Título: "Agenda"
  - Subtítulo: "Quarta-Feira, 15 De Outubro De 2025"

Navegação de Data:
  - Botão anterior (<)
  - Label: "Hoje"
  - Botão próximo (>)
  - Botão "+": Novo agendamento

Grid de Estatísticas 2x2:
  - Total Agendamentos: 0
  - Confirmados: 0
  - Pendentes: 0
  - Próximo Cliente: --:--

Tabs de Visualização:
  - Calendário (ativo)
  - Kanban
  - Timeline
  - Filtros (botão)

Timeline View:
  - Seção "Linha do Tempo"
  - Descrição: "Visualização cronológica dos agendamentos"
  - Slots de 30 em 30 min:
    * 08:00 - Horário disponível + Agendar
    * 08:30 - Horário disponível + Agendar
    * 09:00 - Horário disponível + Agendar
    * ... (scrollable)
```

#### Funcionalidades:
- Visualização de agenda por dia
- Navegação entre datas
- 3 tipos de visualização (Calendário/Kanban/Timeline)
- Indicadores de horários disponíveis/ocupados
- Criação rápida de agendamentos

#### Estados Especiais:
- **Empty:** Todos horários disponíveis (como no print)
- **Loaded:** Horários ocupados com cards de agendamento
- **Loading:** Skeleton nos slots de horário
- **Conflito:** Highlight vermelho em horários conflitantes

#### Dados Dinâmicos:
```typescript
interface AgendaDay {
  date: string;
  stats: {
    total: number;
    confirmed: number;
    pending: number;
    nextClient: string | null;
  };
  timeSlots: TimeSlot[];
}

interface TimeSlot {
  time: string; // "08:00"
  status: 'available' | 'booked' | 'blocked';
  appointment?: Appointment;
}
```

---

## 👥 5. CLIENTES (LISTA E DETALHES)

### **Screenshot 1:** Clientes - Vista Lista

#### Layout:
```typescript
Header:
  - Título: "Clientes"
  - Subtítulo: "Gerencie sua base de clientes"

Actions:
  - Botão: "+ Novo Cliente" (violeta, full-width)

Busca:
  - Input: "Buscar por nome, telefone ou email..."
  - Ícone lupa

Filtros:
  - Botão "Filtros" (outline, com ícone funil)

Grid de Estatísticas 2x2:
  - Total de Clientes: 5
  - Clientes Ativos: 3 (com check verde)
  - Clientes VIP: 1 (com estrela)
  - Receita Total: R$ 3.890

Lista de Clientes:
  - Header: "Lista de Clientes"
  - Contador: "5 clientes encontrados"
  
  Card Cliente (resumido):
    - Avatar circular: "JS"
    - Nome: "João Silva"
    - Status badge: "Ativo" (violeta)
    - Telefone: (11) 99999-9999
    - Email: joao.silva@email.com
    - Menu 3 dots
```

### **Screenshot 2:** Clientes - Card Expandido

#### Layout do Card Completo:
```typescript
Card Cliente (expandido):
  Header:
    - Avatar: "JS"
    - Nome: "João Silva"
    - Status: "Ativo"
    - Menu 3 dots
    
  Contato:
    - Telefone: (11) 99999-9999
    - Email: joao.silva@email.com
  
  Última Visita:
    - Ícone calendário
    - Data: "24/09/2024"
  
  Avaliação:
    - 5 estrelas (amarelo)
    - Rating: (5.0)
  
  Estatísticas (2 colunas):
    - Visitas: 15
    - Gasto Total: R$ 975
  
  Notas:
    - Texto: "Cliente fiel, prefere corte baixo nas laterais"
    - Estilo: itálico, cinza
```

#### Funcionalidades:
- Busca por nome, telefone ou email
- Filtros avançados (status, VIP, etc)
- Visualização resumida e expandida
- Estatísticas agregadas
- Gestão de clientes VIP
- Sistema de avaliações (5 estrelas)
- Notas personalizadas por cliente

#### Estados Especiais:
- **Empty:** "Nenhum cliente cadastrado" + CTA "Cadastrar Primeiro Cliente"
- **Loading:** Skeleton cards
- **Search Results:** "X clientes encontrados" ou "Nenhum resultado"
- **Error:** Banner de erro se falhar ao carregar

#### Dados Dinâmicos:
```typescript
interface Client {
  id: string;
  name: string;
  avatar: string; // initials or photo URL
  status: 'Ativo' | 'Inativo';
  phone: string;
  email: string;
  lastVisit: string; // ISO date
  rating: number; // 0-5
  visits: number;
  totalSpent: number;
  notes: string;
  isVIP: boolean;
}
```

---

## 💰 6. FINANCEIRO (DASHBOARD FINANCEIRO)

### **Screenshot 1:** Financeiro - Vista Completa

#### Layout:
```typescript
Header:
  - Título: "Financeiro"
  - Subtítulo: "Controle completo das suas finanças"

Actions:
  - Botão: "+ Nova Transação" (violeta, full-width)

Grid de Cards 2x2:
  1. Receita Mensal:
     - Valor: R$ 12.450
     - Mudança: +15.2% vs mês anterior (verde)
  
  2. Receita Semanal:
     - Valor: R$ 3.200
     - Mudança: -5.1% vs semana anterior (vermelho)
  
  3. Receita Diária:
     - Valor: R$ 650
     - Label: "Hoje, 27/09/2025" (vermelho)
  
  4. Lucro Líquido:
     - Valor: R$ 9.650
     - Label: "Receita - Despesas" (vermelho)

Formas de Pagamento:
  - Título: "Formas de Pagamento"
  - Subtítulo: "Distribuição dos recebimentos do mês"
  
  - PIX: 45% do total - R$ 4.580 (barra violeta)
  - Dinheiro: 32% do total - R$ 3.200 (barra violeta)
  - Cartão: 23% do total - R$ 2.340 (barra violeta)

Transações Recentes:
  - Título: "Transações Recentes"
  - Subtítulo: "Últimas movimentações financeiras"
  
  Lista:
    1. João Silva
       - Data: 26/09/2024 - 14:30
       - Serviço: Corte + Barba
       - Valor: +R$ 65 (verde)
       - Ícone seta para cima (receita)
    
    2. Pedro Santos
       - Data: 26/09/2024 - 13:00
       - Serviço: Corte Simples
       - Valor: +R$ 35 (verde)
    
    3. Produtos de Cabelo
       - Data: 25/09/2024 - 10:00
       - Categoria: Estoque
       - Valor: -R$ 120 (vermelho)
       - Ícone seta para baixo (despesa)
    
    4. Carlos Lima
       - Data: 25/09/2024 - 16:30
       - Serviço: Barba Completa
       - Valor: +R$ 30 (verde)
    
    5. Conta de Luz
       - Data: 24/09/2024 - 09:00
       - Categoria: Despesas Fixas
       - Valor: -R$ 180 (vermelho)
  
  - Link: "Ver Todas as Transações" (violeta)
```

### **Screenshot 2:** Financeiro - Vista Scroll

(Mostra mais cards de estatísticas ao rolar a página)

#### Funcionalidades:
- Dashboard financeiro completo
- Visualização de receitas (mensal/semanal/diária)
- Cálculo de lucro líquido
- Distribuição por forma de pagamento
- Histórico de transações (receitas/despesas)
- Filtros e exportação (implícito)

#### Estados Especiais:
- **Loading:** Skeleton nos cards de valores
- **Empty:** "Nenhuma transação registrada este mês"
- **Error:** Banner de erro
- **Updated:** Toast "Transação registrada com sucesso!"

#### Dados Dinâmicos:
```typescript
interface FinancialStats {
  monthlyRevenue: { amount: number; change: string };
  weeklyRevenue: { amount: number; change: string };
  dailyRevenue: { amount: number; date: string };
  netProfit: { amount: number };
  paymentMethods: {
    pix: { percentage: number; amount: number };
    cash: { percentage: number; amount: number };
    card: { percentage: number; amount: number };
  };
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  category: string;
  amount: number;
  date: string; // ISO
  time: string;
  paymentMethod?: string;
}
```

---

## ⚙️ 7. CONFIGURAÇÕES (APP SETTINGS)

### **Screenshot:** Configurações Principais

#### Layout:
```typescript
Header:
  - Menu hamburger
  - Título: "Configurações"
  - Notificações: (2)
  - Avatar: "AB"

Seção "Aparência":
  - Label: "Tema do Aplicativo"
  - Toggle: Claro | Escuro (Escuro ativo)
  - Ícone paleta de cores

Seção "Conta":
  - Item: Email
    * Ícone pessoa
    * Label: "Email"
    * Valor: "testebarbearia@gmail.com"
  
  - Item: Redefinir Senha
    * Ícone chave
    * Label: "Redefinir Senha"
    * Chevron direita

Seção "Notificações":
  - Item: Novos Agendamentos
    * Ícone calendário
    * Label: "Novos Agendamentos"
    * Toggle ON (violeta)
  
  - Item: Lembretes de Agendamento
    * Ícone sino
    * Label: "Lembretes de Agendamento"
    * Toggle ON (violeta)

Seção "Mais":
  - Item: Dados e Privacidade
    * Ícone escudo
    * Chevron direita
  
  - Item: Suporte
    * Ícone interrogação
    * Chevron direita
  
  - Item: Novidades do App
    * Ícone presente
    * Chevron direita

Bottom Navigation: (padrão)
```

#### Funcionalidades:
- Toggle tema claro/escuro
- Gerenciamento de conta (email, senha)
- Preferências de notificações
- Links para suporte e privacidade

#### Estados Especiais:
- **Loading:** Spinner ao salvar preferências
- **Success:** Toast "Configurações salvas"
- **Error:** "Erro ao salvar configurações"

---

## 🏪 8. CONFIGURAÇÕES DA BARBEARIA

### **Screenshot:** Settings - Shop Configuration

#### Layout:
```typescript
Header:
  - Título: "Configurações da Barbe..." (truncado)

Seção "Profissionais":
  - Botão: "+ Adicionar Novo" (violeta)
  
  Lista de Profissionais:
    1. André (avatar foto)
       - Menu 3 dots
    
    2. Bruno (avatar foto)
       - Menu 3 dots
    
    3. Carlos (avatar foto)
       - Menu 3 dots

Seção "Horários de Funcionamento":
  - Botão: "Editar" (outline)
  
  Horários:
    - Segunda a Sexta: 09:00 - 19:00
    - Sábado: 09:00 - 16:00
    - Domingo: Fechado (texto vermelho)

Seção "Formas de Pagamento":
  - PIX: Toggle ON (violeta)
  - Dinheiro: Toggle ON (violeta)
  - Cartão de Crédito/Débito: Toggle OFF (cinza)
```

#### Funcionalidades:
- Gerenciamento de profissionais
- Configuração de horários por dia da semana
- Habilitação de formas de pagamento

#### Estados Especiais:
- **Loading:** Skeleton ao carregar profissionais
- **Success:** Toast "Profissional adicionado"
- **Error:** "Erro ao salvar configurações"

---

## 💈 9. SERVIÇOS (SERVICE MANAGEMENT)

### **Screenshot 1:** Serviços - Lista Completa

#### Layout:
```typescript
Header:
  - Menu hamburger
  - Título: "Serviços"
  - Notificações: (2)
  - Avatar: "AB"

Lista de Serviços (Cards):
  1. Corte
     - Duração: 30 min
     - Preço: R$ 40.00
     - Menu 3 dots
  
  2. Barba
     - Duração: 30 min
     - Preço: R$ 30.00
     - Menu 3 dots
  
  3. Sobrancelha
     - Duração: 15 min
     - Preço: R$ 20.00
     - Menu 3 dots
  
  4. Corte Degradê
     - Duração: 40 min
     - Preço: R$ 45.00
     - Menu 3 dots
  
  5. Corte + Barba
     - Duração: 60 min
     - Preço: R$ 65.00
     - Menu 3 dots
  
  6. Degradê + Barba
     - Duração: 70 min
     - Preço: R$ 70.00
     - Menu 3 dots
  
  7. Platinado
     - Duração: 120 min
     - Preço: R$ 150.00
     - Menu 3 dots
  
  8. Degradê + Platinado
     - Duração: 150 min
     - Preço: R$ 180.00
     - Menu 3 dots
  
  9. Luzes
     - Duração: 90 min
     - Preço: R$ 120.00
     - Menu 3 dots

Bottom Navigation: (padrão)
```

### **Screenshot 2:** Serviços - Com Botão "Novo Serviço"

(Mesma lista, mas com botão CTA no topo)

#### Layout Adicional:
```typescript
Header da Lista:
  - Label: "Serviços Cadastrados"
  - Botão: "+ Novo Serviço" (violeta, canto superior direito)
```

#### Funcionalidades:
- Lista todos os serviços disponíveis
- Criação de novos serviços
- Edição/exclusão via menu 3 dots
- Suporte a serviços combinados

#### Estados Especiais:
- **Empty:** "Nenhum serviço cadastrado" + CTA
- **Loading:** Skeleton cards
- **Success:** Toast "Serviço criado/atualizado"
- **Error:** "Erro ao salvar serviço"

#### Dados Dinâmicos:
```typescript
interface Service {
  id: string;
  name: string;
  duration: number; // em minutos
  price: number;
  description?: string;
  isActive: boolean;
}
```

---

## 👤 10. PERFIL DA EMPRESA

### **Screenshot 1:** Profile - Vista Completa

#### Layout:
```typescript
Header:
  - Menu hamburger
  - Título: "Perfil da Empresa"
  - Notificações: (2)
  - Avatar: "AB"

Perfil:
  - Nome: "André Barber"
  - Username: "@andrebarber"
  - Botão: "Editar Perfil" (outline)

Seção "Sobre Nós":
  - Texto: "A melhor barbearia da cidade, especializada em
            cortes clássicos e modernos. Venha nos visitar
            e saia com o visual renovado!"

Seção "Contato e Localização":
  - Endereço:
    * Ícone pin
    * "Rua Fictícia, 123 - Centro"
    * "São Paulo, SP"
    * Chevron direita
  
  - Telefone/WhatsApp:
    * Ícone telefone
    * "(11) 99999-8888"
    * Label: "WhatsApp"
    * Chevron direita

Seção "Nossas Redes":
  - Instagram
    * Ícone Instagram
    * Chevron direita
  
  - Facebook
    * Ícone Facebook
    * Chevron direita
  
  - TikTok
    * Ícone TikTok
    * Chevron direita
  
  - Nosso Site
    * Ícone globo
    * Chevron direita

Bottom Navigation: (padrão)
```

### **Screenshot 2:** Profile - Com Foto de Capa

(Mesma estrutura, mas com banner/capa no topo)

#### Layout Adicional:
```typescript
Banner:
  - Imagem de capa (placeholder: "Capa da Barbearia")
  
Avatar:
  - Foto circular sobreposta ao banner
  - Nome: "André Barber"
  - Username: "@andrebarber"
```

#### Funcionalidades:
- Edição de perfil público
- Informações de contato e localização
- Links para redes sociais
- Foto de perfil e banner

#### Estados Especiais:
- **Editing:** Campos editáveis + botões "Cancelar/Salvar"
- **Loading:** Skeleton ao carregar
- **Success:** Toast "Perfil atualizado"
- **Error:** "Erro ao atualizar perfil"

---

## 📝 11. MODAIS E FORMULÁRIOS

### **Modal 1:** Novo Agendamento

#### Layout:
```typescript
Header:
  - Título: "Novo Agendamento / Registro"
  - Botão fechar (X)

Tabs:
  - "Novo Agendamento" (ativo)
  - "Novo Registro"

Campos:
  - Cliente:
    * Label: "Cliente"
    * Input: "Buscar ou adicionar cliente..."
  
  - Profissional:
    * Label: "Profissional"
    * Select: "André" (selecionado)
  
  - Serviços:
    * Label: "Serviços"
    * Multi-select scrollable:
      - Corte (R$ 40.00) - selecionado
      - Barba (R$ 30.00) - selecionado
      - Sobrancelha (R$ 20.00)
      - (outros...)
  
  - Data e Hora:
    * Data: "15/10/2025" (date picker)
    * Hora: "14:30" (time picker)

Actions:
  - Botão "Cancelar" (cinza)
  - Botão "Confirmar Agendamento" (violeta)
```

#### Variações:
- **Novo Registro:** Tab alternativa para registro manual de transação
- **Seleção múltipla de serviços:** Highlight violeta nos selecionados
- **Autocomplete de cliente:** Busca ou "adicionar novo"

---

### **Modal 2:** Novo Registro / Transação Financeira

#### Layout:
```typescript
Header:
  - Título: "Novo Agendamento / Registro"
  - Tab: "Novo Registro" (ativo)

Campos:
  - Cliente:
    * Input: "Buscar ou adicionar cliente..."
  
  - Profissional:
    * Select: "André"
  
  - Serviços:
    * Multi-select: (lista completa)
  
  - Valor Total:
    * Input: "R$ 0.00" (calculado automaticamente)
  
  - Forma de Pagamento:
    * Select: "PIX"
  
  - Descrição (Opcional):
    * Textarea: "Alguma observação sobre o atendimento..."

Actions:
  - Botão "Cancelar" (cinza)
  - Botão "Salvar Registro" (violeta)
```

---

### **Modal 3:** Registrar Transação (Financeiro)

#### Layout:
```typescript
Header:
  - Título: "Registrar Transação"
  - Botão fechar (X)

Campos:
  - Descrição:
    * Placeholder: "Ex: Corte João Silva"
  
  - Valor (R$):
    * Placeholder: "Ex: 40.00"
  
  - Tipo:
    * Toggle: "Receita" (ativo)
  
  - Forma de Pagamento:
    * Select: "PIX"

Actions:
  - Botão "Cancelar" (cinza)
  - Botão "Registrar" (violeta)
```

---

### **Modal 4:** Cadastrar Novo Cliente

#### Layout:
```typescript
Header:
  - Título: "Cadastrar Novo Cliente"
  - Botão fechar (X)

Campos:
  - Nome Completo:
    * Placeholder: "Nome do cliente"
  
  - Telefone:
    * Placeholder: "(11) 99999-9999"
    * Máscara de telefone
  
  - Email (Opcional):
    * Placeholder: "cliente@email.com"

Actions:
  - Botão "Cancelar" (cinza)
  - Botão "Salvar Cliente" (violeta)
```

---

### **Panel:** Notificações

#### Layout:
```typescript
Header:
  - Título: "Notificações"
  - Badge contador: (4)
  - Link: "Marcar todas como lidas" (violeta)

Lista de Notificações:
  1. Novo Agendamento!
     - Texto: "Carlos Lima agendou um Corte para 16:00."
     - Tempo: "2 min atrás"
     - Badge roxo (não lida)
     - Ícone calendário
  
  2. Meta Diária Batida!
     - Texto: "Você atingiu R$ 450 de receita hoje. Parabéns!"
     - Tempo: "1h atrás"
     - Badge roxo
     - Ícone gráfico
  
  3. Novo Agendamento!
     - Texto: "Roberto Costa agendou Corte + Barba para amanhã."
     - Tempo: "3h atrás"
     - Badge roxo
     - Ícone calendário
  
  4. Meta Semanal Quase Lá!
     - Texto: "Faltam apenas R$ 200 para sua meta semanal."
     - Tempo: "ontem"
     - Sem badge (lida)
     - Ícone gráfico
```

#### Funcionalidades:
- Notificações em tempo real
- Badge contador no header
- Tipos: Agendamentos, Metas, Lembretes
- Marcar como lida (individual ou em lote)

---

## 🌐 12. BOOKING PAGE (PÁGINA PÚBLICA)

### **Screenshot 1:** Booking - Escolha de Serviços

#### Layout:
```typescript
Header:
  - Título: "Faça seu Agendamento"
  - Subtítulo: "Rápido, fácil e sem login."

Step 1: "1. Escolha os Serviços"
  - Lista de Serviços (selecionáveis):
    * Corte (30 min) - R$ 40.00 - SELECIONADO
    * Barba (30 min) - R$ 30.00
    * Sobrancelha (15 min) - R$ 20.00
    * Corte Degradê (40 min) - R$ 45.00 - SELECIONADO
    * Corte + Barba (60 min) - R$ 65.00
    * Degradê + Barba (70 min) - R$ 70.00
    * Platinado (120 min) - R$ 150.00
    * (scrollable)

Footer:
  - Total: R$ 85.00 (calculado)
  - Botão: "Confirmar no WhatsApp" (verde, full-width)
```

### **Screenshot 2:** Booking - Escolha de Profissional

#### Layout:
```typescript
Step 2: "2. Escolha o Profissional"
  - Grid de Profissionais:
    * André (foto circular)
    * Bruno (foto circular) - SELECIONADO (borda violeta)
    * Carlos (foto circular)
```

### **Screenshot 3:** Booking - Escolha de Data e Hora

#### Layout:
```typescript
Step 3: "3. Escolha a Data e Horário"
  
  Data:
    - Input: "15/10/2025"
    - Ícone calendário
  
  Horários Disponíveis (grid):
    - 09:00
    - 10:00
    - 11:00
    - 13:00
    - 14:00
    - 15:00
    - 16:00 - SELECIONADO (violeta)
    - 17:00
```

### **Screenshot 4:** Booking - Pagamento

#### Layout:
```typescript
Step 4: "4. Pagamento"
  
  Opções:
    - "Pagar agora" (e ganhe 5% de desconto!)
    - "Pagar no local" - SELECIONADO (violeta)

Total:
  - Valor: R$ 85.00 (grande, destaque)
  
Ação:
  - Botão: "Confirmar no WhatsApp" (verde, full-width)
```

#### Funcionalidades:
- Fluxo de agendamento sem autenticação
- Seleção de serviços múltiplos
- Escolha de profissional
- Escolha de data e horário
- Opções de pagamento
- Confirmação via WhatsApp (não salva no sistema)

#### Estados Especiais:
- **Step Navigation:** Indicadores visuais de progresso
- **Validation:** Não permite avançar sem selecionar
- **Loading:** Spinner ao buscar horários disponíveis
- **Success:** Redirect para WhatsApp com mensagem pré-formatada

#### Dados Gerados para WhatsApp:
```typescript
interface BookingWhatsAppData {
  services: string[]; // ["Corte", "Corte Degradê"]
  professional: string; // "Bruno"
  date: string; // "15/10/2025"
  time: string; // "16:00"
  total: number; // 85.00
  paymentMethod: 'now' | 'later';
}

// Mensagem gerada:
// "Olá! Gostaria de agendar:
//  Serviços: Corte, Corte Degradê
//  Profissional: Bruno
//  Data: 15/10/2025 às 16:00
//  Total: R$ 85,00
//  Pagamento: No local"
```

---

## 🎨 13. COMPONENTES REUTILIZÁVEIS IDENTIFICADOS

### **Cards:**
```typescript
1. StatCard (Dashboard)
   - Icon (calendar, dollar, users, clock)
   - Title
   - Value (large number)
   - Subtitle/Change (with arrow and color)
   - Background: slate-800

2. AppointmentCard
   - Client name (bold)
   - Date and time
   - Services list
   - Professional name
   - Price (green, large)
   - WhatsApp button (floating)
   - Menu 3 dots
   - Background: slate-800

3. ClientCard (collapsed)
   - Avatar (initials)
   - Name
   - Status badge
   - Phone
   - Email
   - Menu 3 dots

4. ClientCard (expanded)
   - All from collapsed +
   - Last visit date
   - Star rating
   - Visit count
   - Total spent
   - Notes (italic)

5. TransactionCard
   - Icon (up arrow = income, down = expense)
   - Description
   - Date and time
   - Category/Service
   - Amount (green/red)
   - Background color subtle (green/red glow)

6. ServiceCard
   - Service name
   - Duration
   - Price
   - Menu 3 dots
   - Background: slate-800

7. ProfessionalCard
   - Avatar photo (circular)
   - Name
   - Menu 3 dots
   - Background: slate-800
```

### **Buttons:**
```typescript
1. Primary Button
   - Background: violet-600
   - Text: white
   - Full-width or auto
   - Hover: violet-500
   - Examples: "Entrar", "Confirmar Agendamento"

2. Secondary Button
   - Background: slate-700
   - Text: white
   - Examples: "Cancelar"

3. Outline Button
   - Border: slate-600
   - Text: slate-300
   - Background: transparent
   - Examples: "Editar", "Filtros"

4. Icon Button
   - Just icon, no text
   - Background: slate-800
   - Examples: Quick action cards

5. WhatsApp Button
   - Background: green-600
   - Icon: WhatsApp logo
   - Circular or rectangular

6. Danger Button
   - Text: red-500
   - Examples: "Sair"
```

### **Form Elements:**
```typescript
1. Input Text
   - Background: slate-800
   - Border: slate-700
   - Text: white
   - Placeholder: slate-500
   - Focus: border-violet-500

2. Select/Dropdown
   - Same style as Input
   - Chevron down icon

3. Date Picker
   - Input + calendar icon
   - Modal calendar on click

4. Time Picker
   - Input + clock icon
   - Modal time selector

5. Toggle Switch
   - OFF: slate-600
   - ON: violet-600
   - Smooth animation

6. Textarea
   - Multi-line input
   - Same style as Input

7. Search Input
   - Input + magnifying glass icon
   - Placeholder: "Buscar..."
```

### **Modals:**
```typescript
Structure:
  - Overlay: black/50% opacity
  - Container: slate-900
  - Header: Title + Close button (X)
  - Content: Form fields or content
  - Footer: Action buttons (Cancel + Confirm)
  - Animation: slide-in-up
  - Max-width: md (mobile-first)
```

### **Toasts/Notifications:**
```typescript
Position: top-center
Animation: fade-in-down
Duration: 3s auto-dismiss
Style:
  - Background: slate-800
  - Border: slate-700
  - Success: green accent
  - Error: red accent
  - Info: violet accent
```

### **Bottom Navigation:**
```typescript
Fixed bottom
4 items:
  - Início (home icon)
  - Agenda (calendar icon)
  - Clientes (users icon)
  - Financeiro (dollar icon)

Active state:
  - Icon: violet-500
  - Label: violet-500

Inactive state:
  - Icon: slate-400
  - Label: slate-400
```

### **Header:**
```typescript
Fixed top
Elements:
  - Menu hamburger (left)
  - Title (center)
  - Notification badge (right)
  - Avatar (right)

Style:
  - Background: slate-900
  - Border-bottom: slate-800
```

### **Sidebar:**
```typescript
Slide-in from left
Overlay: black/50%
Content:
  - Header (logo + close)
  - User profile section
  - Navigation sections
  - Logout button

Animation: slide-in-left 300ms
```

---

## 📊 14. ESTADOS GLOBAIS NECESSÁRIOS (ZUSTAND)

### **Stores a Criar:**

```typescript
// 1. Auth Store (já existe)
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// 2. Appointments Store
interface AppointmentsState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  filters: {
    date: string;
    status: AppointmentStatus[];
    professional: string;
  };
  selectedDate: string;
  fetchAppointments: () => Promise<void>;
  createAppointment: (data: CreateAppointmentData) => Promise<void>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
}

// 3. Clients Store
interface ClientsState {
  clients: Client[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    status: ClientStatus[];
    isVIP: boolean;
  };
  fetchClients: () => Promise<void>;
  createClient: (data: CreateClientData) => Promise<void>;
  updateClient: (id: string, data: UpdateClientData) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

// 4. Financial Store
interface FinancialState {
  transactions: Transaction[];
  stats: FinancialStats;
  loading: boolean;
  error: string | null;
  dateRange: { start: string; end: string };
  fetchTransactions: () => Promise<void>;
  createTransaction: (data: CreateTransactionData) => Promise<void>;
  fetchStats: () => Promise<void>;
}

// 5. Services Store
interface ServicesState {
  services: Service[];
  loading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  createService: (data: CreateServiceData) => Promise<void>;
  updateService: (id: string, data: UpdateServiceData) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

// 6. Barbershop Store (Settings)
interface BarbershopState {
  barbershop: Barbershop | null;
  professionals: Professional[];
  loading: boolean;
  error: string | null;
  fetchBarbershop: () => Promise<void>;
  updateBarbershop: (data: UpdateBarbershopData) => Promise<void>;
  fetchProfessionals: () => Promise<void>;
  addProfessional: (data: CreateProfessionalData) => Promise<void>;
  removeProfessional: (id: string) => Promise<void>;
}

// 7. Notifications Store
interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

// 8. UI Store (transient state)
interface UIState {
  sidebarOpen: boolean;
  modalOpen: string | null; // modal name
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info';
  openSidebar: () => void;
  closeSidebar: () => void;
  openModal: (name: string) => void;
  closeModal: () => void;
  showToast: (message: string, type: ToastType) => void;
  hideToast: () => void;
}
```

---

**Continua na próxima parte...**
