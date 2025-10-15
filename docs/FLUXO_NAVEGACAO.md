# 🗺️ Fluxo de Navegação Completo - AgendaBarber

**Data:** 15 de outubro de 2025  
**Baseado em:** Análise de 23 screenshots do sistema

---

## 🌐 ARQUITETURA DE ROTAS

### **Rotas Públicas** (sem autenticação)
```
/ → BookingPage
/login → LoginPage
```

### **Rotas Protegidas** (requer autenticação)
```
/dashboard → DashboardPage
/agenda → AgendaPage
/clients → ClientsPage
/financial → FinancialPage
/settings → SettingsPage
/settings/barbershop → BarbershopConfigPage
/settings/services → ServicesPage
/settings/profile → ProfilePage
```

---

## 📍 FLUXO 1: ACESSO INICIAL (SEM LOGIN)

```
┌─────────────────┐
│  Usuário acessa │
│   aplicativo    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      Não autenticado
│   Router Guard  │─────────────────────┐
└────────┬────────┘                     │
         │                              │
    Autenticado                         ▼
         │                    ┌──────────────────┐
         ▼                    │   Booking Page   │
┌─────────────────┐           │  (Agendamento)   │
│  Dashboard Page │           └────────┬─────────┘
└─────────────────┘                    │
                                       │ Clica "Fazer Login"
                                       │
                                       ▼
                             ┌──────────────────┐
                             │   Login Page     │
                             └────────┬─────────┘
                                      │
                           ┌──────────┼──────────┐
                           │          │          │
                      Email/Senha  Google   "Continuar
                                    OAuth    sem Login"
                           │          │          │
                           └──────────┼──────────┘
                                      │
                                      ▼
                             ┌──────────────────┐
                             │  Dashboard Page  │
                             └──────────────────┘
```

---

## 📍 FLUXO 2: BOOKING PAGE (PÁGINA PÚBLICA)

```
┌──────────────────────┐
│   Booking Page       │
│   (Cliente Final)    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ STEP 1: Serviços     │
│                      │
│ □ Corte - R$ 40      │
│ ☑ Barba - R$ 30      │
│ □ Sobrancelha - R$ 20│
│                      │
│ Total: R$ 70         │
│ [Próximo]            │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ STEP 2: Profissional │
│                      │
│ ( ) André            │
│ (●) Bruno            │
│ ( ) Carlos           │
│                      │
│ [Voltar] [Próximo]   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ STEP 3: Data/Hora    │
│                      │
│ Data: 15/10/2025     │
│                      │
│ Horários:            │
│ 09:00  10:00  11:00  │
│ 13:00  [14:00] 15:00 │
│                      │
│ [Voltar] [Próximo]   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ STEP 4: Pagamento    │
│                      │
│ ( ) Pagar agora      │
│     (5% desconto)    │
│ (●) Pagar no local   │
│                      │
│ Total: R$ 70,00      │
│                      │
│ [Confirmar WhatsApp] │◄─── Abre WhatsApp com
└──────────┬───────────┘     mensagem pré-formatada
           │
           ▼
     Redirect para
   WhatsApp Business
 (Não salva no sistema)
```

### **Características do Fluxo Booking:**
- ✅ Sem necessidade de login
- ✅ Validação em cada step (não avança sem selecionar)
- ✅ Navegação back/forward entre steps
- ✅ Cálculo automático do total
- ✅ Confirmação via WhatsApp (não salva no Firebase)
- ✅ Mobile-first (steps verticais)

---

## 📍 FLUXO 3: AUTENTICAÇÃO

```
┌──────────────────┐
│   Login Page     │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
  Login    Cadastro
   Tab       Tab
    │         │
    └────┬────┘
         │
    ┌────┴─────────────────────┐
    │                          │
    │                          │
┌───▼──────────┐    ┌──────────▼────┐
│ Email/Senha  │    │  Google OAuth  │
│              │    │                │
│ [Entrar]     │    │ [Login Google] │
└───┬──────────┘    └──────────┬────┘
    │                          │
    │ Sucesso                  │ Sucesso
    └────┬─────────────────────┘
         │
         ▼
  ┌──────────────┐
  │ onAuthState  │◄── Firebase listener
  │   Changed    │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ AuthStore    │
  │ setUser(...)  │
  └──────┬───────┘
         │
         ▼
  ┌──────────────────┐
  │ Dashboard Page   │
  │ (rota protegida) │
  └──────────────────┘


┌────────────────────────────────┐
│  Botão "Continuar sem Login"   │
└────────────┬───────────────────┘
             │
             ▼
    ┌──────────────────┐
    │   Booking Page   │
    │ (fluxo público)  │
    └──────────────────┘
```

### **Características do Fluxo Auth:**
- ✅ Tabs Login/Cadastro na mesma página
- ✅ Validação com Zod (loginSchema/registerSchema)
- ✅ Mensagens de erro em português
- ✅ Google OAuth com signInWithRedirect
- ✅ Opção "Continuar sem login" → Booking Page
- ✅ Após login: redirect automático para Dashboard

---

## 📍 FLUXO 4: DASHBOARD (HOME)

```
┌────────────────────────────────┐
│         Dashboard              │
│  (Tela principal autenticada)  │
└───────────┬────────────────────┘
            │
            ├──► Cards de Estatísticas
            │    ├─ Agendamentos Hoje
            │    ├─ Receita Hoje
            │    ├─ Total Clientes
            │    └─ Próximo Cliente
            │
            ├──► Ações Rápidas (4 botões)
            │    ├─ Novo Agendamento ──► Modal Agendamento
            │    ├─ Cadastrar Cliente ──► Modal Cliente
            │    ├─ Registrar Pagamento ──► Modal Transação
            │    └─ Ver Agenda ──► AgendaPage
            │
            ├──► Lista Próximos Agendamentos
            │    └─ Cada card:
            │       ├─ Botão WhatsApp ──► Abre WhatsApp
            │       └─ Menu 3 dots ──► Editar/Cancelar
            │
            └──► Bottom Navigation
                 ├─ Início (atual)
                 ├─ Agenda ──► AgendaPage
                 ├─ Clientes ──► ClientsPage
                 └─ Financeiro ──► FinancialPage


┌─────────────────────────────┐
│  Header (todas as páginas)  │
└──────────┬──────────────────┘
           │
      ┌────┴────┐
      │         │
  Hamburger  Notificações
   Menu       Badge (2)
      │         │
      ▼         ▼
  Sidebar   Notifications
   Slide      Panel
```

### **Características do Dashboard:**
- ✅ Hub central de navegação
- ✅ Estatísticas em tempo real
- ✅ Acesso rápido às principais ações
- ✅ Lista de próximos compromissos
- ✅ Integração WhatsApp em cada card

---

## 📍 FLUXO 5: AGENDA

```
┌────────────────────────────────┐
│        Agenda Page             │
└───────────┬────────────────────┘
            │
            ├──► Navegação de Data
            │    ├─ [<] Dia anterior
            │    ├─ [Hoje] Voltar para hoje
            │    └─ [>] Próximo dia
            │
            ├──► Cards Estatísticas
            │    ├─ Total Agendamentos
            │    ├─ Confirmados
            │    ├─ Pendentes
            │    └─ Próximo Cliente
            │
            ├──► Tabs de Visualização
            │    ├─ [Calendário] ◄── Vista mensal
            │    ├─ [Kanban] ◄──── Vista por status
            │    └─ [Timeline] ◄─── Vista por horário
            │
            └──► Conteúdo (depende da tab)


┌────────────────────────────────┐
│   Vista Timeline (exemplo)     │
└───────────┬────────────────────┘
            │
        ┌───┴────────────────┐
        │                    │
    Horários             Agendamentos
   Disponíveis              Marcados
        │                    │
        ▼                    ▼
  ┌──────────┐        ┌─────────────┐
  │ 08:00    │        │ 09:00       │
  │ [Agendar]│        │ João Silva  │
  └──────────┘        │ Corte+Barba │
                      │ André       │
  ┌──────────┐        │ R$ 65       │
  │ 08:30    │        │ [WhatsApp]  │
  │ [Agendar]│        │ [Menu ⋮]    │
  └──────────┘        └─────────────┘
                           │
                      ┌────┴─────┐
                      │          │
                   Editar    Cancelar
                   Modal      Confirm
```

### **Características da Agenda:**
- ✅ 3 visualizações diferentes (Calendário/Kanban/Timeline)
- ✅ Navegação por data
- ✅ Estatísticas do dia
- ✅ Criação rápida de agendamentos (botão + em cada slot)
- ✅ Filtros (botão no header)

---

## 📍 FLUXO 6: CLIENTES

```
┌────────────────────────────────┐
│       Clients Page             │
└───────────┬────────────────────┘
            │
            ├──► Botão Novo Cliente ──► Modal Cadastro
            │
            ├──► Busca
            │    └─ Input: "Buscar por nome, telefone..."
            │       │
            │       └──► Filtra lista em tempo real
            │
            ├──► Filtros (botão)
            │    └─ Modal Filtros:
            │       ├─ Status: Ativo/Inativo
            │       ├─ VIP: Sim/Não
            │       └─ Ordenação: A-Z, Mais Gastos, etc
            │
            ├──► Cards Estatísticas
            │    ├─ Total Clientes
            │    ├─ Clientes Ativos
            │    ├─ Clientes VIP
            │    └─ Receita Total
            │
            └──► Lista de Clientes
                 └─ Cada card:
                    ├─ Estado Colapsado:
                    │  ├─ Avatar
                    │  ├─ Nome + Status badge
                    │  ├─ Telefone
                    │  └─ Email
                    │
                    └─ Estado Expandido (clique):
                       ├─ Última Visita
                       ├─ Avaliação (estrelas)
                       ├─ Total Visitas
                       ├─ Gasto Total
                       └─ Notas


┌─────────────────────────────┐
│  Menu 3 dots (cada cliente) │
└──────────┬──────────────────┘
           │
      ┌────┴────────────┐
      │                 │
   Editar          Excluir
   Modal            Confirm
      │                 │
      ▼                 ▼
  Atualiza         Remove
  Cliente          Cliente
```

### **Características de Clientes:**
- ✅ Busca em tempo real
- ✅ Filtros avançados
- ✅ Cards expansíveis (collapse/expand)
- ✅ Sistema de avaliação (5 estrelas)
- ✅ Gestão de clientes VIP
- ✅ Notas personalizadas

---

## 📍 FLUXO 7: FINANCEIRO

```
┌────────────────────────────────┐
│      Financial Page            │
└───────────┬────────────────────┘
            │
            ├──► Botão Nova Transação ──► Modal Registro
            │
            ├──► Cards Estatísticas (4)
            │    ├─ Receita Mensal (+ % mudança)
            │    ├─ Receita Semanal (+ % mudança)
            │    ├─ Receita Diária
            │    └─ Lucro Líquido
            │
            ├──► Formas de Pagamento
            │    └─ Barra de progresso por método:
            │       ├─ PIX: 45% - R$ 4.580
            │       ├─ Dinheiro: 32% - R$ 3.200
            │       └─ Cartão: 23% - R$ 2.340
            │
            └──► Transações Recentes
                 └─ Lista scrollable:
                    ├─ Cada card:
                    │  ├─ Ícone (↑ receita / ↓ despesa)
                    │  ├─ Descrição
                    │  ├─ Data e Hora
                    │  ├─ Categoria/Serviço
                    │  └─ Valor (verde/vermelho)
                    │
                    └─ Link: "Ver Todas as Transações"


┌──────────────────────────────┐
│  Modal Nova Transação        │
└──────────┬───────────────────┘
           │
      ┌────┴─────────────────┐
      │                      │
   Receita               Despesa
  (toggle)              (toggle)
      │                      │
      └──────────┬───────────┘
                 │
            Campos:
            ├─ Descrição
            ├─ Valor
            ├─ Forma de Pagamento
            └─ [Registrar]
```

### **Características do Financeiro:**
- ✅ Dashboard financeiro completo
- ✅ Visualização de receitas por período
- ✅ Distribuição por forma de pagamento
- ✅ Histórico de transações (receitas + despesas)
- ✅ Cálculo automático de lucro líquido
- ✅ Diferenciação visual receita/despesa

---

## 📍 FLUXO 8: CONFIGURAÇÕES

```
┌────────────────────────────────┐
│      Settings Hub              │
└───────────┬────────────────────┘
            │
            ├──► Aparência
            │    └─ Toggle: Tema Claro/Escuro
            │
            ├──► Conta
            │    ├─ Email (visualização)
            │    └─ Redefinir Senha ──► Modal/Nova Página
            │
            ├──► Notificações
            │    ├─ Toggle: Novos Agendamentos
            │    └─ Toggle: Lembretes
            │
            └──► Mais
                 ├─ Dados e Privacidade ──► Nova Página
                 ├─ Suporte ──► Link externo
                 └─ Novidades ──► Modal Changelog


┌────────────────────────────────┐
│  Sidebar Menu > GERENCIAMENTO  │
└───────────┬────────────────────┘
            │
            ├──► Perfil da Empresa ──► ProfilePage
            │    ├─ Banner/Foto de capa
            │    ├─ Avatar
            │    ├─ Nome + @username
            │    ├─ Sobre Nós (descrição)
            │    ├─ Contato e Localização
            │    │  ├─ Endereço
            │    │  └─ Telefone/WhatsApp
            │    └─ Redes Sociais
            │       ├─ Instagram
            │       ├─ Facebook
            │       ├─ TikTok
            │       └─ Website
            │
            ├──► Configurações da Barbearia ──► BarbershopConfigPage
            │    ├─ Profissionais
            │    │  └─ Lista + Botão Adicionar
            │    ├─ Horários de Funcionamento
            │    │  └─ Grid por dia da semana
            │    └─ Formas de Pagamento
            │       ├─ Toggle PIX
            │       ├─ Toggle Dinheiro
            │       └─ Toggle Cartão
            │
            └──► Serviços ──► ServicesPage
                 └─ Lista de serviços:
                    ├─ Nome
                    ├─ Duração
                    ├─ Preço
                    ├─ Menu 3 dots ──► Editar/Excluir
                    └─ Botão + Novo Serviço
```

### **Características de Configurações:**
- ✅ Hub centralizado de configurações
- ✅ Múltiplas sub-páginas especializadas
- ✅ Perfil público da barbearia
- ✅ Gestão de profissionais e serviços
- ✅ Configuração de horários e pagamentos

---

## 📍 FLUXO 9: NOTIFICAÇÕES

```
┌────────────────────────────────┐
│  Badge de Notificações (2)     │
│  (No header de qualquer página)│
└───────────┬────────────────────┘
            │
            │ Click
            ▼
┌────────────────────────────────┐
│  Notifications Panel           │
│  (Slide-in from right)         │
└───────────┬────────────────────┘
            │
            ├──► Header:
            │    ├─ Título + Badge (4)
            │    └─ Link: "Marcar todas como lidas"
            │
            └──► Lista de Notificações:
                 └─ Cada notificação:
                    ├─ Tipo (ícone):
                    │  ├─ Calendário (agendamento)
                    │  ├─ Gráfico (meta)
                    │  └─ Sino (lembrete)
                    ├─ Título
                    ├─ Descrição
                    ├─ Tempo relativo ("2 min atrás")
                    └─ Badge roxo (se não lida)
                       │
                       │ Click na notificação
                       ▼
                  ┌────────────────┐
                  │ Marca como lida│
                  │ + Navega para  │
                  │ página relevante│
                  └────────────────┘
```

### **Características de Notificações:**
- ✅ Badge contador no header
- ✅ Panel slide-in lateral
- ✅ Tipos variados (agendamentos, metas, lembretes)
- ✅ Timestamp relativo
- ✅ Ação "marcar todas como lidas"
- ✅ Click na notificação → navega para contexto

---

## 📍 FLUXO 10: MODAIS (COMPONENTES GLOBAIS)

### **Modal: Novo Agendamento**
```
Dashboard/Agenda/Anywhere
       │
       │ Click "+ Novo Agendamento"
       ▼
┌──────────────────────────┐
│  Modal Novo Agendamento  │
└──────────┬───────────────┘
           │
      Campos:
      ├─ Cliente (autocomplete ou novo)
      ├─ Profissional (select)
      ├─ Serviços (multi-select)
      ├─ Data (date picker)
      └─ Hora (time picker)
           │
      ┌────┴─────┐
      │          │
  Cancelar   Confirmar
      │          │
   Fecha     Salva no
   Modal    Firebase
              │
         ┌────┴────┐
         │         │
      Sucesso   Erro
         │         │
      Toast    Toast
    "Criado"  "Erro"
         │
    Atualiza
     Estado
    (Zustand)
```

### **Modal: Cadastrar Cliente**
```
ClientsPage
       │
       │ Click "+ Novo Cliente"
       ▼
┌──────────────────────────┐
│  Modal Cadastrar Cliente │
└──────────┬───────────────┘
           │
      Campos:
      ├─ Nome Completo
      ├─ Telefone (máscara)
      └─ Email (opcional)
           │
           │ Validação Zod
           │ (clientSchema)
           ▼
      ┌────┴─────┐
      │          │
  Cancelar    Salvar
      │          │
   Fecha     Cria no
   Modal    Firebase
              │
         ┌────┴────┐
         │         │
      Sucesso   Erro
         │         │
      Toast    Toast
   "Salvo"   "Erro"
         │
    Atualiza
  ClientsStore
```

### **Modal: Registrar Transação**
```
FinancialPage
       │
       │ Click "+ Nova Transação"
       ▼
┌──────────────────────────────┐
│  Modal Registrar Transação   │
└──────────┬───────────────────┘
           │
      Toggle:
      ├─ (●) Receita
      └─ ( ) Despesa
           │
      Campos:
      ├─ Descrição
      ├─ Valor (R$)
      └─ Forma de Pagamento
           │
      ┌────┴─────┐
      │          │
  Cancelar  Registrar
      │          │
   Fecha      Salva
   Modal       │
          ┌────┴────┐
          │         │
       Sucesso   Erro
          │         │
       Toast    Toast
          │
     Atualiza
  FinancialStore
```

---

## 🔄 FLUXOS DE DADOS (ZUSTAND)

### **Padrão Geral:**
```
Componente UI
      │
      │ Ação do usuário
      ▼
 Zustand Action
 (async function)
      │
      ├──► set({ loading: true })
      │
      ├──► Firebase Service
      │    (BaseService ou específico)
      │         │
      │         ├─ Firestore query
      │         └─ Retorna dados
      │
      ├──► set({ data: result, loading: false })
      │
      └──► Componente re-renderiza
           (automaticamente via Zustand)


┌─────────────────────────────────┐
│  Exemplo: Dashboard ao carregar │
└──────────────┬──────────────────┘
               │
          useEffect()
               │
               ▼
  appointmentsStore.fetchAppointments()
  clientsStore.fetchClients()
  financialStore.fetchStats()
               │
          Parallel
          Promises
               │
               ▼
         Dados carregados
               │
         ┌─────┴──────┐
         │            │
    Dashboard      Bottom Nav
     Stats          Badge
     Cards          Atualiza
```

---

## 🚨 TRATAMENTO DE ERROS (GLOBAL)

```
Qualquer ação
      │
      │ try/catch
      ▼
  Firebase Error
      │
      ├──► UIStore.showToast(error, 'error')
      │
      ├──► Log no console (dev)
      │
      └──► Traduz erro para português
           (ver useAuth.ts padrão)


Erros Firebase comuns:
├─ auth/user-not-found → "Usuário não encontrado"
├─ auth/wrong-password → "Senha incorreta"
├─ auth/network-request-failed → "Erro de conexão"
├─ permission-denied → "Sem permissão"
└─ unavailable → "Serviço temporariamente indisponível"
```

---

## ✅ VALIDAÇÕES (ZOD)

```
Formulário
      │
      │ onSubmit
      ▼
 Zod Schema Validation
 (ex: appointmentSchema)
      │
  ┌───┴────┐
  │        │
Valid   Invalid
  │        │
  │    Exibe erros
  │    por campo
  │    (Zod error messages)
  │        │
  │    Bloqueia submit
  │
  ▼
Continua
para Firebase
```

---

## 🎯 RESUMO DAS NAVEGAÇÕES PRINCIPAIS

| **Origem**      | **Ação**                  | **Destino**         | **Tipo**      |
|-----------------|---------------------------|---------------------|---------------|
| `/`             | Usuário não autenticado   | `BookingPage`       | Redirect      |
| `/`             | Usuário autenticado       | `Dashboard`         | Redirect      |
| `BookingPage`   | "Fazer Login"             | `LoginPage`         | Link          |
| `LoginPage`     | Login sucesso             | `Dashboard`         | Redirect      |
| `LoginPage`     | "Continuar sem login"     | `BookingPage`       | Navigate      |
| `Dashboard`     | Bottom Nav "Agenda"       | `AgendaPage`        | Navigate      |
| `Dashboard`     | Bottom Nav "Clientes"     | `ClientsPage`       | Navigate      |
| `Dashboard`     | Bottom Nav "Financeiro"   | `FinancialPage`     | Navigate      |
| `Dashboard`     | "Novo Agendamento"        | Modal               | Modal Open    |
| `AgendaPage`    | Slot vazio "Agendar"      | Modal               | Modal Open    |
| `ClientsPage`   | "+ Novo Cliente"          | Modal               | Modal Open    |
| `FinancialPage` | "+ Nova Transação"        | Modal               | Modal Open    |
| `Sidebar`       | "Perfil da Empresa"       | `ProfilePage`       | Navigate      |
| `Sidebar`       | "Config. Barbearia"       | `BarbershopConfigPage` | Navigate   |
| `Sidebar`       | "Serviços"                | `ServicesPage`      | Navigate      |
| `Sidebar`       | "Configurações"           | `SettingsPage`      | Navigate      |
| `Sidebar`       | "Sair"                    | `LoginPage`         | Logout + Redirect |
| Qualquer página | Badge Notificações        | Panel Slide-in      | Panel Open    |
| Qualquer página | Hamburger Menu            | Sidebar Slide-in    | Sidebar Open  |

---

**Fim do Fluxo de Navegação**
