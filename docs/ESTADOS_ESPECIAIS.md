# 🎭 Estados Especiais - AgendaBarber

**Data:** 15 de outubro de 2025  
**Propósito:** Definir todos os estados de UI (loading, empty, error, success) para cada feature

---

## 📋 ÍNDICE

1. [Estados Globais (Aplicação Completa)](#estados-globais)
2. [Autenticação (LoginPage)](#autenticação)
3. [Dashboard](#dashboard)
4. [Agenda](#agenda)
5. [Clientes](#clientes)
6. [Financeiro](#financeiro)
7. [Configurações da Barbearia](#configurações-da-barbearia)
8. [Serviços](#serviços)
9. [Perfil da Empresa](#perfil-da-empresa)
10. [Notificações](#notificações)
11. [Booking Page (Pública)](#booking-page)
12. [Modais e Formulários](#modais-e-formulários)

---

## 🌐 ESTADOS GLOBAIS

### **Loading Global (App Initialization)**
```typescript
Quando: App.tsx carregando Firebase Auth state
Duração: Até onAuthStateChanged resolver
UI:
  - Tela branca ou splash screen
  - Logo centralizado
  - Spinner violeta abaixo do logo
  - Texto: "Carregando..."
```

### **Network Error**
```typescript
Quando: Perda de conexão com internet
UI:
  - Banner fixo no topo (vermelho)
  - Ícone: WiFi off
  - Texto: "Sem conexão com a internet"
  - Ação: Retry automático a cada 5s
```

### **Firebase Error (Critical)**
```typescript
Quando: Erro ao inicializar Firebase
UI:
  - Tela de erro full-page
  - Ícone: Alerta
  - Título: "Erro ao conectar"
  - Descrição: "Não foi possível conectar ao servidor. Tente novamente."
  - Botão: "Tentar Novamente" (recarrega página)
```

### **Route Not Found**
```typescript
Quando: Rota inexistente (404)
UI:
  - Tela centralizada
  - Ícone: Mapa riscado
  - Título: "Página não encontrada"
  - Texto: "A página que você procura não existe."
  - Botão: "Voltar ao Início" → /dashboard
```

### **Unauthorized Access**
```typescript
Quando: Usuário não autenticado tenta acessar rota protegida
Ação: Redirect para /login
Persistência: Salva URL tentada para redirect após login
```

---

## 🔐 AUTENTICAÇÃO

### **LoginPage - Idle**
```typescript
Estado: Formulário vazio, sem interação
UI:
  - Campos vazios
  - Placeholders visíveis
  - Botões habilitados
  - Nenhuma mensagem de erro
```

### **LoginPage - Submitting**
```typescript
Quando: Usuário clicou em "Entrar"
Duração: Até Firebase resolver (auth)
UI:
  - Campos desabilitados (opacity 50%)
  - Botão "Entrar":
    * Texto: "Entrando..."
    * Spinner pequeno à esquerda do texto
    * Background: violet-600 (mantém cor)
  - Outros botões desabilitados
  - Cursor: not-allowed
```

### **LoginPage - Success**
```typescript
Quando: Login bem-sucedido
Duração: Instantâneo (redirect imediato)
UI:
  - Toast verde no topo:
    * Ícone: Check
    * Texto: "Login realizado! Bem-vindo de volta!"
    * Animação: fade-in-down
    * Auto-dismiss: 3s
  - Redirect para /dashboard (200ms delay)
```

### **LoginPage - Error**
```typescript
Quando: Credenciais inválidas ou erro de rede
Duração: Persistente até próxima tentativa
UI:
  - Mensagem de erro abaixo dos campos:
    * Background: red-500/10
    * Border: red-500
    * Ícone: Alerta
    * Texto: Erro específico (português)
      - "Email ou senha incorretos"
      - "Usuário não encontrado"
      - "Erro de conexão. Tente novamente."
    * Padding: p-3
    * Border-radius: rounded-md
  - Campos voltam habilitados
  - Foco automático no campo com erro
```

### **LoginPage - Google OAuth Loading**
```typescript
Quando: Usuário clicou em "Continuar com Google"
Duração: Até redirect do Google
UI:
  - Overlay escuro (black/50%)
  - Spinner centralizado (grande, violeta)
  - Texto: "Redirecionando para o Google..."
  - Animação: fade-in
```

### **RegisterPage - Email Already Exists**
```typescript
Quando: Tentativa de cadastro com email já usado
UI:
  - Mensagem de erro no campo Email:
    * Border: red-500
    * Texto abaixo: "Este email já está cadastrado"
    * Link: "Fazer login" → Switch para tab Login
```

### **RegisterPage - Password Mismatch**
```typescript
Quando: Senha e Confirmar Senha não coincidem
UI:
  - Campo "Confirmar Senha":
    * Border: red-500
    * Texto abaixo: "As senhas não coincidem"
  - Botão "Cadastrar" desabilitado
```

---

## 🏠 DASHBOARD

### **Dashboard - Loading**
```typescript
Quando: Carregando dados iniciais (appointments, stats)
Duração: 500ms - 2s
UI:
  - Skeleton screens:
    * Cards de estatísticas:
      - Shimmer animation (gradient slate-800 → slate-700)
      - Dimensões: mesmas dos cards reais
      - Border-radius: rounded-lg
    * Ações Rápidas:
      - 4 blocos quadrados com shimmer
    * Lista de Appointments:
      - 3 cards skeleton
      - Altura: h-24 cada
  - Header: Visível (sem skeleton)
  - Bottom Nav: Visível (sem skeleton)
```

### **Dashboard - Empty (Sem Agendamentos Hoje)**
```typescript
Quando: Nenhum appointment com date === today
UI:
  - Cards de estatísticas:
    * Agendamentos Hoje: 0
    * Receita Hoje: R$ 0
    * Próximo Cliente: --:--
  - Seção "Próximos Agendamentos":
    * Ícone: Calendário (grande, slate-600)
    * Título: "Nenhum agendamento para hoje"
    * Subtítulo: "Crie um novo agendamento para começar"
    * Botão: "+ Novo Agendamento" (violeta)
    * Background: slate-800/50
    * Padding: p-8
    * Border: dashed slate-700
```

### **Dashboard - Error (Falha ao Carregar)**
```typescript
Quando: Erro ao buscar dados do Firebase
UI:
  - Banner no topo (vermelho):
    * Ícone: Alerta
    * Texto: "Erro ao carregar dados"
    * Botão: "Tentar Novamente"
    * Animação: slide-in-down
  - Cards de estatísticas: Mantém valores anteriores (cache)
  - Lista de appointments: Vazia
```

### **Dashboard - Partial Data (Alguns Cards Carregados)**
```typescript
Quando: Alguns requests Firebase succedem, outros falham
UI:
  - Cards bem-sucedidos: Exibem dados
  - Cards com erro:
    * Ícone: Alerta pequeno
    * Texto: "--"
    * Tooltip: "Erro ao carregar"
    * Border: red-500/50
```

### **Dashboard - Real-Time Update**
```typescript
Quando: Novo appointment criado (listener Firestore)
UI:
  - Novo card aparece no topo da lista:
    * Animação: fade-in-down + scale
    * Duração: 300ms
  - Badge de contagem atualiza
  - Toast (opcional):
    * Ícone: Calendário
    * Texto: "Novo agendamento recebido!"
    * Auto-dismiss: 3s
```

---

## 📅 AGENDA

### **Agenda - Loading Initial**
```typescript
Quando: Primeira carga da página
Duração: 500ms - 2s
UI:
  - Header: Visível
  - Cards de estatísticas: Skeleton (4 blocos)
  - Tabs: Visíveis (mas não clicáveis)
  - Timeline View:
    * 10 slots skeleton
    * Shimmer animation
    * Altura: h-20 cada
```

### **Agenda - Empty (Nenhum Agendamento no Dia)**
```typescript
Quando: Appointments[] vazio para data selecionada
UI:
  - Cards de estatísticas:
    * Total: 0
    * Confirmados: 0
    * Pendentes: 0
    * Próximo: --:--
  - Timeline View:
    * Todos os slots: "Horário disponível"
    * Botão: "[Agendar]" em cada slot
  - Calendar View:
    * Dia selecionado sem indicador
    * Texto abaixo: "Nenhum agendamento"
  - Kanban View:
    * Todas as colunas vazias
    * Ícone + texto: "Arraste cards ou clique + para criar"
```

### **Agenda - Loading Date Change**
```typescript
Quando: Usuário navega para outro dia (< ou >)
Duração: 200ms - 1s
UI:
  - Data no header: Atualiza imediatamente
  - Cards de estatísticas: Skeleton (preserva altura)
  - Timeline:
    * Fade-out atual (150ms)
    * Skeleton (200ms)
    * Fade-in novos dados (150ms)
  - Animação: slide (left/right dependendo da direção)
```

### **Agenda - Error (Falha ao Carregar Horários)**
```typescript
Quando: Erro ao buscar appointments do Firebase
UI:
  - Banner no topo:
    * Background: red-500/10
    * Ícone: Alerta
    * Texto: "Erro ao carregar agendamentos"
    * Botão: "Tentar Novamente"
  - Timeline: Exibe última versão em cache (se houver)
  - Cards de estatísticas: "--" ou valores em cache
```

### **Agenda - Time Conflict (ao Criar Appointment)**
```typescript
Quando: Usuário tenta agendar em horário já ocupado
UI:
  - Modal de criação:
    * Campo "Horário":
      - Border: red-500
      - Texto abaixo: "Horário já ocupado"
    * Sugestões:
      - Lista de 3 próximos horários disponíveis
      - Click: Preenche campo automaticamente
  - Timeline View:
    * Slot conflitante: Background red-500/20
    * Tooltip: "Ocupado - {clientName}"
```

### **Agenda - Filter Active**
```typescript
Quando: Usuário aplicou filtros (status, profissional, etc)
UI:
  - Botão "Filtros":
    * Badge: Contador de filtros ativos (ex: "2")
    * Background: violet-500 (em vez de transparent)
  - Appointments não matchando: Hidden
  - Contador:
    * Texto: "X agendamentos encontrados (Y filtrados)"
    * Cor: slate-400
  - Botão: "Limpar Filtros" (vermelho, outline)
```

### **Agenda - Timeline Scroll Loading (Infinite Scroll)**
```typescript
Quando: Usuário rola até o final da lista de horários
Duração: Carrega mais 10 slots
UI:
  - Spinner pequeno no final da lista
  - Texto: "Carregando mais horários..."
  - Animação: fade-in dos novos slots
```

---

## 👥 CLIENTES

### **Clients - Loading**
```typescript
Quando: Carregando lista inicial
Duração: 500ms - 2s
UI:
  - Busca e filtros: Visíveis (desabilitados)
  - Cards de estatísticas: Skeleton (4 blocos)
  - Lista de clientes:
    * 5 cards skeleton
    * Avatar: círculo com shimmer
    * Linhas de texto: retângulos com shimmer
    * Altura: h-32 cada
```

### **Clients - Empty (Nenhum Cliente Cadastrado)**
```typescript
Quando: Clients[] vazio
UI:
  - Cards de estatísticas: Todos em 0
  - Lista:
    * Ícone: Pessoas (grande, slate-600, 4rem)
    * Título: "Nenhum cliente cadastrado"
    * Subtítulo: "Cadastre seu primeiro cliente para começar"
    * Botão: "+ Cadastrar Primeiro Cliente" (violeta, large)
    * Ilustração: SVG de pessoas (opcional)
    * Background: slate-800/50
    * Padding: p-12
    * Border: dashed slate-700
```

### **Clients - Search No Results**
```typescript
Quando: Busca não retorna resultados
UI:
  - Busca: Mantém query visível
  - Lista:
    * Ícone: Lupa com X
    * Título: "Nenhum cliente encontrado"
    * Subtítulo: "Nenhum resultado para '{query}'"
    * Sugestões:
      - "Verifique a digitação"
      - "Tente termos mais gerais"
    * Botão: "Limpar Busca" (outline)
```

### **Clients - Searching (Debounce)**
```typescript
Quando: Usuário digitando na busca
Duração: 300ms após parar de digitar
UI:
  - Input de busca:
    * Ícone: Spinner pequeno (substitui lupa)
    * Placeholder: "Buscando..."
  - Lista: Mantém resultados anteriores (não pisca)
  - Opacity: 70% (feedback visual)
```

### **Clients - Filter Active**
```typescript
Quando: Filtros aplicados (status, VIP, etc)
UI:
  - Botão "Filtros":
    * Badge: Contador (ex: "3")
    * Background: violet-500
  - Cards de estatísticas: Recalculados para subset
  - Contador:
    * Texto: "X clientes encontrados"
    * Badge: "Filtros ativos" (violeta)
  - Link: "Limpar Filtros" (vermelho, small)
```

### **Clients - Card Expanded**
```typescript
Quando: Click em um card de cliente
Transição: 200ms ease-out
UI:
  - Card:
    * Altura: Expande (auto)
    * Animação: expand-down
    * Mais informações aparecem: fade-in
  - Overlay sutil: Background slate-950/50 sobre outros cards
  - Ícone: Chevron up (em vez de down)
```

### **Clients - Error (Falha ao Carregar)**
```typescript
Quando: Erro ao buscar clientes do Firebase
UI:
  - Banner no topo:
    * Background: red-500/10
    * Ícone: Alerta
    * Texto: "Erro ao carregar clientes"
    * Botão: "Tentar Novamente"
  - Lista: Vazia ou mantém cache
  - Cards de estatísticas: "--"
```

### **Clients - Delete Confirmation**
```typescript
Quando: Usuário clica "Excluir" no menu
UI:
  - Modal de confirmação:
    * Background: slate-900
    * Border: red-500
    * Ícone: Alerta (grande, vermelho)
    * Título: "Excluir Cliente?"
    * Texto: "Esta ação não pode ser desfeita. O cliente será removido permanentemente."
    * Aviso: "⚠️ Appointments futuros serão afetados" (se houver)
    * Botões:
      - "Cancelar" (cinza)
      - "Excluir" (vermelho, requer confirmação dupla)
```

### **Clients - Deleting**
```typescript
Quando: Processando exclusão
Duração: 200ms - 1s
UI:
  - Modal:
    * Botões desabilitados
    * Spinner no botão "Excluir"
    * Texto: "Excluindo..."
  - Card na lista:
    * Opacity: 50%
    * Animação: shake (se erro)
```

### **Clients - Deleted Success**
```typescript
Quando: Cliente excluído com sucesso
UI:
  - Modal: Fecha (fade-out)
  - Card na lista:
    * Animação: slide-out-right + fade-out
    * Duração: 300ms
  - Toast verde:
    * Ícone: Check
    * Texto: "Cliente removido com sucesso"
  - Estatísticas: Atualizam automaticamente
```

---

## 💰 FINANCEIRO

### **Financial - Loading**
```typescript
Quando: Carregando dados financeiros
Duração: 500ms - 2s
UI:
  - Cards de valores: Skeleton (4 blocos)
  - Formas de Pagamento:
    * 3 barras skeleton (animação horizontal)
  - Transações Recentes:
    * 5 cards skeleton
    * Altura: h-20 cada
```

### **Financial - Empty (Nenhuma Transação)**
```typescript
Quando: Transactions[] vazio
UI:
  - Cards de valores:
    * Todos: R$ 0,00
    * Mudança: "--"
  - Formas de Pagamento:
    * Barras: 0% (vazias)
    * Texto: "Nenhum recebimento este mês"
  - Transações Recentes:
    * Ícone: Cifrão (grande, slate-600)
    * Título: "Nenhuma transação registrada"
    * Subtítulo: "Registre sua primeira transação"
    * Botão: "+ Nova Transação" (violeta)
```

### **Financial - Error (Falha ao Calcular Stats)**
```typescript
Quando: Erro ao processar dados financeiros
UI:
  - Banner no topo:
    * Background: red-500/10
    * Ícone: Alerta
    * Texto: "Erro ao calcular estatísticas"
    * Botão: "Tentar Novamente"
  - Cards de valores: Exibem "--" ou valores em cache
  - Transações: Mantém lista (se houver cache)
```

### **Financial - Transaction Creating**
```typescript
Quando: Salvando nova transação
Duração: 200ms - 1s
UI:
  - Modal:
    * Campos desabilitados
    * Botão "Registrar":
      - Spinner
      - Texto: "Salvando..."
    * Cursor: not-allowed
```

### **Financial - Transaction Created**
```typescript
Quando: Transação salva com sucesso
UI:
  - Modal: Fecha (fade-out)
  - Nova transação:
    * Aparece no topo da lista
    * Animação: slide-in-down + highlight (glow verde, 1s)
  - Cards de valores:
    * Atualizam com animação (count-up)
    * Duração: 500ms
  - Toast verde:
    * Ícone: Check
    * Texto: "Transação registrada!"
```

### **Financial - Negative Balance**
```typescript
Quando: Lucro Líquido < 0 (despesas > receitas)
UI:
  - Card "Lucro Líquido":
    * Valor: Vermelho (em vez de branco)
    * Border: red-500/50
    * Ícone: Alerta (pequeno)
    * Tooltip: "Despesas maiores que receitas"
```

### **Financial - Filter by Date Range**
```typescript
Quando: Usuário aplica filtro de período
UI:
  - Date Range Picker:
    * Datas selecionadas: Highlight violeta
    * Botão "Aplicar": Ativo
  - Durante reload:
    * Skeleton nos cards de valores
    * Lista: Fade-out → Skeleton → Fade-in
  - Indicador:
    * Badge: "{start} - {end}"
    * Link: "Limpar" (volta para "Este Mês")
```

---

## ⚙️ CONFIGURAÇÕES DA BARBEARIA

### **Barbershop Config - Loading**
```typescript
Quando: Carregando configurações
Duração: 500ms - 1s
UI:
  - Profissionais: Skeleton (3 cards circulares)
  - Horários: Skeleton (7 linhas)
  - Formas de Pagamento: Skeleton (3 toggles)
```

### **Barbershop Config - Empty (Nenhum Profissional)**
```typescript
Quando: Professionals[] vazio
UI:
  - Seção Profissionais:
    * Ícone: Pessoa (grande, slate-600)
    * Título: "Nenhum profissional cadastrado"
    * Subtítulo: "Adicione profissionais para gerenciar a agenda"
    * Botão: "+ Adicionar Primeiro Profissional" (violeta)
```

### **Barbershop Config - Professional Deleting**
```typescript
Quando: Removendo profissional
Duração: 200ms - 1s
UI:
  - Card do profissional:
    * Opacity: 50%
    * Spinner overlay
  - Modal de confirmação (se houver appointments futuros):
    * Título: "Este profissional tem agendamentos"
    * Texto: "X agendamentos futuros serão afetados. Deseja continuar?"
    * Checkbox: "Reatribuir para outro profissional"
    * Botões: "Cancelar" | "Confirmar"
```

### **Barbershop Config - Business Hours Editing**
```typescript
Quando: Editando horários
UI:
  - Modal:
    * Grid de dias da semana
    * Cada dia:
      - Toggle: Aberto/Fechado
      - Time pickers: Início/Fim (se aberto)
      - Desabilitado: Cinza claro
  - Validação em tempo real:
    * Horário fim < início: Border vermelho + mensagem
  - Preview:
    * Atualiza em tempo real (lado direito do modal)
```

### **Barbershop Config - Saving**
```typescript
Quando: Salvando configurações
Duração: 200ms - 1s
UI:
  - Botão "Salvar":
    * Spinner
    * Texto: "Salvando..."
    * Desabilitado
  - Campos: Desabilitados (opacity 70%)
  - Overlay: Sutil (black/10%)
```

### **Barbershop Config - Saved**
```typescript
Quando: Configurações salvas com sucesso
UI:
  - Toast verde:
    * Ícone: Check
    * Texto: "Configurações atualizadas!"
  - Campos: Voltam ao normal
  - Animação: Flash verde no container (200ms)
```

---

## 💈 SERVIÇOS

### **Services - Loading**
```typescript
Quando: Carregando lista de serviços
Duração: 500ms - 1s
UI:
  - Lista: 5 cards skeleton
  - Cada skeleton:
    * Avatar: Círculo (ícone tesoura)
    * Linhas: Nome, duração, preço
    * Altura: h-24
```

### **Services - Empty**
```typescript
Quando: Services[] vazio
UI:
  - Ícone: Tesoura (grande, slate-600)
  - Título: "Nenhum serviço cadastrado"
  - Subtítulo: "Adicione serviços para começar a agendar"
  - Botão: "+ Adicionar Primeiro Serviço" (violeta, large)
  - Ilustração: SVG de tesoura/pente (opcional)
```

### **Services - Creating**
```typescript
Quando: Salvando novo serviço
UI:
  - Modal:
    * Campos desabilitados
    * Botão "Salvar":
      - Spinner
      - Texto: "Criando..."
```

### **Services - Created**
```typescript
Quando: Serviço criado com sucesso
UI:
  - Modal: Fecha
  - Novo card:
    * Aparece no topo da lista
    * Animação: scale-up + fade-in
    * Highlight: Glow violeta (1s)
  - Toast verde:
    * Ícone: Check
    * Texto: "Serviço criado com sucesso!"
```

### **Services - Deleting (with Validation)**
```typescript
Quando: Tentando excluir serviço com appointments futuros
UI:
  - Modal de confirmação:
    * Border: red-500
    * Ícone: Alerta (vermelho)
    * Título: "Serviço em uso"
    * Texto: "Este serviço tem X agendamentos futuros"
    * Opções:
      - "Cancelar"
      - "Desativar" (soft delete, recomendado)
      - "Excluir Mesmo Assim" (perigoso, vermelho)
```

### **Services - Inactive (Soft Delete)**
```typescript
Quando: Serviço com isActive === false
UI:
  - Card:
    * Opacity: 50%
    * Badge: "Inativo" (cinza)
    * Nome: Strikethrough
  - Menu 3 dots:
    * Opção: "Reativar" (em vez de "Desativar")
  - Filtro:
    * Toggle: "Mostrar inativos" (default: OFF)
```

---

## 👤 PERFIL DA EMPRESA

### **Profile - Loading**
```typescript
Quando: Carregando dados do perfil
Duração: 500ms - 1s
UI:
  - Banner: Skeleton retangular (h-32)
  - Avatar: Skeleton circular (w-24 h-24)
  - Campos: Skeleton (linhas de texto)
```

### **Profile - Editing Mode**
```typescript
Quando: Usuário clica "Editar Perfil"
Transição: 200ms
UI:
  - Campos:
    * Background: slate-800 (em vez de transparent)
    * Border: slate-700 (visível)
    * Cursor: text
  - Banner/Avatar:
    * Overlay ao hover: "Clique para alterar"
    * Ícone: Camera
  - Botões:
    * "Cancelar" (cinza)
    * "Salvar Alterações" (violeta)
    * Posição: Sticky bottom
```

### **Profile - Uploading Image**
```typescript
Quando: Upload de banner ou avatar
Duração: 1s - 5s (depende do tamanho)
UI:
  - Imagem:
    * Overlay escuro (black/70%)
    * Progress bar:
      - Circular (ao redor do avatar)
      - Linear (embaixo do banner)
      - Cor: violet-500
      - Percentual: "45%"
    * Ícone: Upload (animação)
  - Campos: Desabilitados temporariamente
```

### **Profile - Image Upload Error**
```typescript
Quando: Erro ao fazer upload (tamanho, formato, rede)
UI:
  - Toast vermelho:
    * Ícone: Alerta
    * Texto: "Erro ao fazer upload"
    * Detalhes: "Tamanho máximo: 5MB" ou "Formato inválido"
  - Imagem: Reverte para anterior
  - Campo mantém foco (pode tentar novamente)
```

### **Profile - Saving**
```typescript
Quando: Salvando alterações
Duração: 200ms - 1s
UI:
  - Botão "Salvar":
    * Spinner
    * Texto: "Salvando..."
    * Desabilitado
  - Campos: Desabilitados
  - Overlay: Sutil
```

### **Profile - Saved**
```typescript
Quando: Perfil atualizado com sucesso
UI:
  - Toast verde:
    * Ícone: Check
    * Texto: "Perfil atualizado!"
  - Modo edição: OFF
  - Campos: Voltam para display mode
  - Animação: Flash verde (200ms)
```

---

## 🔔 NOTIFICAÇÕES

### **Notifications - Loading**
```typescript
Quando: Carregando notificações
Duração: 300ms - 1s
UI:
  - Panel:
    * Header: Visível
    * Lista: 3 cards skeleton
    * Animação: Shimmer
```

### **Notifications - Empty**
```typescript
Quando: Notifications[] vazio
UI:
  - Ícone: Sino (grande, slate-600)
  - Título: "Nenhuma notificação"
  - Subtítulo: "Você está em dia!"
  - Ilustração: SVG de sino vazio (opcional)
  - Padding: p-12
```

### **Notifications - New (Real-Time)**
```typescript
Quando: Nova notificação chega (Firestore listener)
UI:
  - Badge contador:
    * Incrementa com animação (scale-up)
    * Cor: red-500
  - Panel (se aberto):
    * Nova notificação aparece no topo
    * Animação: slide-in-down + glow violeta
  - Toast (opcional):
    * Ícone: Sino
    * Texto: "{titulo}"
    * Auto-dismiss: 5s
  - Som: Notificação (se habilitado)
```

### **Notifications - Marking as Read**
```typescript
Quando: Usuário clica em uma notificação
Transição: 200ms
UI:
  - Badge contador: Decrementa
  - Notificação:
    * Badge roxo: Fade-out
    * Opacity: 100% → 70%
    * Background: slate-800 → slate-900
  - Ação: Navigate para página relacionada
```

### **Notifications - Marking All as Read**
```typescript
Quando: Usuário clica "Marcar todas como lidas"
Duração: 500ms
UI:
  - Botão:
    * Spinner pequeno
    * Texto: "Marcando..."
  - Notificações:
    * Animação em cascata (top to bottom)
    * Cada uma: Fade badge → Opacity 70%
    * Delay: 50ms entre cada
  - Badge contador: Anima para 0
  - Toast:
    * Ícone: Check
    * Texto: "Todas as notificações marcadas como lidas"
```

---

## 🌐 BOOKING PAGE

### **Booking - Loading Services**
```typescript
Quando: Carregando serviços da barbearia
Duração: 500ms - 1s
UI:
  - Header: Visível
  - Lista de serviços: 5 cards skeleton
  - Botão "Confirmar": Desabilitado
```

### **Booking - No Services Available**
```typescript
Quando: Barbearia sem serviços cadastrados
UI:
  - Ícone: Tesoura (grande, slate-600)
  - Título: "Nenhum serviço disponível"
  - Subtítulo: "Esta barbearia ainda não cadastrou serviços"
  - Botão: "Voltar" (outline)
```

### **Booking - Loading Available Times**
```typescript
Quando: Carregando horários disponíveis (Step 3)
Duração: 500ms - 2s (query Firebase)
UI:
  - Date picker: Desabilitado
  - Grid de horários:
    * Skeleton: 12 blocos (3x4)
    * Shimmer animation
  - Spinner centralizado
  - Texto: "Buscando horários disponíveis..."
```

### **Booking - No Available Times**
```typescript
Quando: Nenhum horário disponível no dia selecionado
UI:
  - Ícone: Calendário com X
  - Título: "Nenhum horário disponível"
  - Subtítulo: "Tente outro dia ou profissional"
  - Sugestões:
    * "Próximos dias com horários:"
    * Lista de 3 datas (clicáveis)
  - Botão "Voltar"
```

### **Booking - Generating WhatsApp Link**
```typescript
Quando: Usuário clica "Confirmar no WhatsApp" (Step 4)
Duração: Instantâneo (200ms)
UI:
  - Botão:
    * Spinner pequeno
    * Texto: "Gerando link..."
    * Desabilitado
  - Overlay: Sutil
  - Toast:
    * Ícone: WhatsApp
    * Texto: "Redirecionando para WhatsApp..."
    * Duração: 1s
  - Ação: `window.open(whatsappURL)`
```

### **Booking - Step Validation Error**
```typescript
Quando: Usuário tenta avançar sem selecionar
UI:
  - Botão "Próximo":
    * Shake animation (300ms)
    * Cor: red-500 (temporário, 1s)
  - Mensagem abaixo:
    * Background: red-500/10
    * Ícone: Alerta
    * Texto: "Selecione ao menos um serviço" (Step 1)
           "Selecione um profissional" (Step 2)
           "Selecione data e horário" (Step 3)
```

---

## 📝 MODAIS E FORMULÁRIOS

### **Modal - Opening**
```typescript
Transição: 300ms
UI:
  - Overlay:
    * Fade-in (0 → 50% opacity)
    * Background: black/50%
  - Modal:
    * Scale: 0.9 → 1
    * Opacity: 0 → 100%
    * Y: 20px → 0
    * Easing: ease-out
```

### **Modal - Closing**
```typescript
Transição: 200ms
UI:
  - Modal:
    * Scale: 1 → 0.95
    * Opacity: 100% → 0%
    * Y: 0 → -10px
  - Overlay:
    * Fade-out (50% → 0)
```

### **Form - Validating (Real-Time)**
```typescript
Quando: Usuário digita em campo com validação
Debounce: 500ms
UI:
  - Campo válido:
    * Border: green-500 (sutil)
    * Ícone: Check (pequeno, direita)
  - Campo inválido:
    * Border: red-500
    * Mensagem abaixo: Texto vermelho
    * Ícone: Alerta (direita)
  - Botão "Salvar": Desabilitado se houver erros
```

### **Form - Submitting**
```typescript
Quando: Usuário clica "Salvar/Criar/Registrar"
Duração: 200ms - 2s
UI:
  - Campos: Desabilitados (opacity 70%)
  - Botão:
    * Spinner à esquerda
    * Texto: "{Ação}ndo..." (ex: "Salvando...")
    * Cursor: not-allowed
  - Outros botões: Desabilitados
```

### **Form - Success**
```typescript
Quando: Salvo com sucesso no Firebase
UI:
  - Modal:
    * Fecha (animação 200ms)
  - Toast verde:
    * Ícone: Check
    * Texto: "{Entidade} {ação} com sucesso!"
      - "Cliente cadastrado com sucesso!"
      - "Agendamento criado com sucesso!"
  - Lista/Página: Atualiza com novo item (animação)
```

### **Form - Error**
```typescript
Quando: Erro ao salvar (Firebase, validação backend)
UI:
  - Modal: Mantém aberto
  - Banner no topo do modal:
    * Background: red-500/10
    * Border-left: red-500 (4px)
    * Ícone: Alerta
    * Texto: Mensagem de erro específica
    * Botão: "Tentar Novamente"
  - Campos: Re-habilitados
  - Foco: Volta para campo com erro (se aplicável)
```

### **Autocomplete Input - Searching**
```typescript
Quando: Usuário digita em campo autocomplete (ex: Cliente)
Debounce: 300ms
UI:
  - Input:
    * Ícone: Spinner (substitui lupa)
  - Dropdown:
    * Aparece abaixo
    * Skeleton: 3 linhas
    * Animação: fade-in-down
```

### **Autocomplete Input - No Results**
```typescript
Quando: Busca não retorna resultados
UI:
  - Dropdown:
    * Ícone: Lupa com X
    * Texto: "Nenhum resultado para '{query}'"
    * Botão: "+ Adicionar novo" (violeta)
      - Click: Abre modal de criação inline
```

### **Date Picker - Opening**
```typescript
Transição: 200ms
UI:
  - Calendário:
    * Aparece abaixo do input
    * Animação: fade-in + slide-down
    * Shadow: large
    * Border: slate-700
  - Input: Highlight (border violeta)
```

### **Time Picker - Opening**
```typescript
UI:
  - Grid de horários:
    * Aparece abaixo do input
    * Intervalos: 30 min
    * Horários ocupados: Desabilitados (cinza)
    * Horários disponíveis: Hover (violeta/20)
```

---

## 🎨 TOAST NOTIFICATIONS (GLOBAL)

### **Toast - Success**
```typescript
Aparência:
  - Background: green-500/10
  - Border-left: green-500 (4px)
  - Ícone: Check (verde)
  - Texto: Branco
  - Posição: top-center
  - Animação: slide-in-down (200ms)
  - Auto-dismiss: 3s
  - Progress bar: Countdown (verde, embaixo)
```

### **Toast - Error**
```typescript
Aparência:
  - Background: red-500/10
  - Border-left: red-500 (4px)
  - Ícone: Alerta (vermelho)
  - Texto: Branco
  - Posição: top-center
  - Animação: shake (300ms) + slide-in-down
  - Auto-dismiss: 5s (mais tempo para erro)
  - Botão: X (fechar manual)
```

### **Toast - Info**
```typescript
Aparência:
  - Background: violet-500/10
  - Border-left: violet-500 (4px)
  - Ícone: Info (violeta)
  - Texto: Branco
  - Posição: top-center
  - Animação: fade-in-down
  - Auto-dismiss: 4s
```

### **Toast - Warning**
```typescript
Aparência:
  - Background: yellow-500/10
  - Border-left: yellow-500 (4px)
  - Ícone: Alerta (amarelo)
  - Texto: Branco
  - Posição: top-center
  - Auto-dismiss: 4s
```

---

## 📊 SKELETON SCREENS (PADRÕES)

### **Card Skeleton**
```typescript
Estrutura:
  - Container: slate-800, rounded-lg, p-4
  - Elementos:
    * Avatar: Círculo (w-12 h-12)
    * Título: Retângulo (h-4, w-3/4)
    * Subtítulo: Retângulo (h-3, w-1/2)
    * Texto: 2-3 linhas (h-3, w-full)
  - Animação: Shimmer (gradient)
    * De: slate-800
    * Para: slate-700
    * Duração: 1.5s infinite
```

### **List Skeleton**
```typescript
Estrutura:
  - 5 items
  - Cada item: Card skeleton
  - Espaçamento: gap-4
  - Altura: h-24 (consistente)
```

### **Stats Card Skeleton**
```typescript
Estrutura:
  - Container: slate-800, rounded-lg, p-4
  - Elementos:
    * Ícone: Círculo (w-10 h-10)
    * Valor: Retângulo (h-8, w-20) - grande
    * Label: Retângulo (h-3, w-32)
```

---

## ✅ RESUMO DE ESTADOS POR CRITICIDADE

### **Críticos (Implementar Primeiro)**
1. ✅ Loading states (todas as features)
2. ✅ Error states com retry (Firebase failures)
3. ✅ Empty states com CTAs
4. ✅ Form validation errors
5. ✅ Success toasts

### **Importantes (Segunda Fase)**
1. Real-time updates (listeners Firestore)
2. Debounce em buscas
3. Skeleton screens
4. Confirmação antes de delete
5. Network offline detection

### **Nice to Have (Polimento)**
1. Animações suaves (fade, slide, scale)
2. Progress bars em uploads
3. Hover states ricos
4. Tooltips informativos
5. Confetti em metas atingidas

---

**Fim dos Estados Especiais**
