# 💈 AgendaBarber

<div align="center">
  
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Sistema SaaS Mobile-First para Gerenciamento de Barbearias**

[🚀 Demo](https://saas-barbearia-8d49a.web.app) • [📚 Documentação](#-documentação) • [🐛 Reportar Bug](https://github.com/seu-usuario/agendabarber/issues) • [✨ Solicitar Feature](https://github.com/seu-usuario/agendabarber/issues)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Começando](#-começando)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Documentação](#-documentação)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

**AgendaBarber** é uma plataforma SaaS completa para gerenciamento de barbearias, oferecendo:

- 📱 **Interface Mobile-First** - Experiência otimizada para dispositivos móveis
- 👨‍💼 **Dashboard Profissional** - Controle completo da barbearia
- 📅 **Sistema de Agendamentos** - Gestão inteligente de horários
- 💰 **Controle Financeiro** - Relatórios e métricas em tempo real
- 🔗 **Integração WhatsApp** - Agendamento direto pelo WhatsApp
- 🌙 **Dark Theme Exclusivo** - Design moderno em tons escuros

### 🎨 Design Philosophy

- **Mobile-First**: Container `max-w-md` simulando experiência mobile
- **Dark Theme**: Paleta Slate + acentos Violet
- **Touch-Optimized**: Interações pensadas para touch
- **Portuguese Localization**: 100% em Português BR

---

## ✨ Funcionalidades

### 👨‍💼 Para Profissionais (Dashboard)

- ✅ Autenticação Firebase (Email/Password + Google)
- 📊 Dashboard com métricas em tempo real
- 📅 Gestão completa de agendamentos
- 👥 Cadastro e histórico de clientes
- 💰 Controle financeiro (receitas e despesas)
- 🏪 Configurações da barbearia
- ⚙️ Gerenciamento de serviços e preços
- 🔔 Notificações em tempo real

### 👤 Para Clientes (Tela Pública)

- 📱 Agendamento sem necessidade de login
- 🔍 Visualização de serviços e preços
- 👨‍🔧 Escolha de profissional
- 📅 Seleção de data e horário
- 💳 Opção de pagamento online (5% desconto)
- 📲 Confirmação via WhatsApp

---

## 🛠️ Tecnologias

### Core

- **[React 18](https://react.dev/)** - Biblioteca UI
- **[TypeScript](https://www.typescriptlang.org/)** - Type Safety
- **[Vite](https://vitejs.dev/)** - Build Tool
- **[React Router](https://reactrouter.com/)** - Roteamento

### Styling

- **[TailwindCSS](https://tailwindcss.com/)** - Utility-First CSS
- **[React Icons](https://react-icons.github.io/react-icons/)** - Ícones

### Backend & Auth

- **[Firebase Auth](https://firebase.google.com/docs/auth)** - Autenticação
- **[Cloud Firestore](https://firebase.google.com/docs/firestore)** - Banco de Dados
- **[Firebase Hosting](https://firebase.google.com/docs/hosting)** - Deploy

### Quality & Tooling

- **[Zod](https://zod.dev/)** - Validação de dados
- **[Vitest](https://vitest.dev/)** - Testing Framework
- **[ESLint](https://eslint.org/)** - Linting
- **[Prettier](https://prettier.io/)** - Formatação

---

## 🚀 Começando

### Pré-requisitos

- **Node.js** 18.x ou superior
- **npm** ou **pnpm**
- Conta no **Firebase** (gratuita)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/agendabarber.git
   cd agendabarber
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```
   
   Edite `.env.local` e adicione suas credenciais Firebase:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   # ... outras variáveis
   ```

4. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Ative **Authentication** (Email/Password e Google)
   - Crie um banco **Cloud Firestore**
   - Copie as credenciais para `.env.local`

5. **Aplique as Security Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

6. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

7. **Abra no navegador**
   ```
   http://localhost:3000
   ```

---

## 📁 Estrutura do Projeto

```
agendabarber/
├── .github/              # GitHub Actions & workflows
├── public/               # Arquivos públicos estáticos
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── common/      # Componentes básicos (Button, Input, etc)
│   │   ├── forms/       # Componentes de formulário
│   │   └── layout/      # Componentes de layout
│   ├── features/         # Features por domínio
│   │   ├── auth/        # Autenticação
│   │   ├── appointments/# Agendamentos
│   │   ├── clients/     # Clientes
│   │   └── financial/   # Financeiro
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Configurações e utilitários
│   │   ├── firebase.ts  # Configuração Firebase
│   │   ├── validations.ts # Schemas Zod
│   │   └── utils.ts     # Funções utilitárias
│   ├── pages/            # Páginas da aplicação
│   ├── services/         # Camada de serviços (API)
│   ├── store/            # Gerenciamento de estado
│   ├── types/            # Tipos TypeScript
│   ├── App.tsx           # Componente raiz
│   └── main.tsx          # Entry point
├── firestore.rules       # Regras de segurança Firestore
├── firestore.indexes.json # Índices Firestore
├── firebase.json         # Configuração Firebase
├── vite.config.ts        # Configuração Vite
├── tsconfig.json         # Configuração TypeScript
├── tailwind.config.js    # Configuração TailwindCSS
└── package.json          # Dependências e scripts
```

---

## 📚 Documentação

A documentação completa do projeto está disponível nos seguintes arquivos:

- **[EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)** - Resumo executivo e visão geral
- **[REFACTORING_REPORT.md](./REFACTORING_REPORT.md)** - Análise detalhada do código
- **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - Plano de implementação por fases
- **[CODE_EXAMPLES.md](./CODE_EXAMPLES.md)** - Exemplos práticos de código
- **[CONFIGURATIONS.md](./CONFIGURATIONS.md)** - Configurações do projeto

### 📖 Guias Rápidos

- [Como adicionar uma nova feature](#)
- [Como escrever testes](#)
- [Como fazer deploy](#)
- [Boas práticas do projeto](#)

---

## 🎮 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build            # Build para produção
npm run preview          # Preview do build

# Qualidade
npm run lint             # Roda ESLint
npm run lint:fix         # Corrige problemas ESLint
npm run format           # Formata código com Prettier
npm run type-check       # Verifica tipos TypeScript

# Testes
npm run test             # Roda testes
npm run test:ui          # Interface UI para testes
npm run test:coverage    # Gera relatório de cobertura
npm run test:watch       # Modo watch para testes

# Firebase
firebase deploy          # Deploy completo
firebase deploy --only hosting  # Deploy apenas hosting
firebase deploy --only firestore:rules  # Deploy apenas rules
```

---

## 🗺️ Roadmap

### ✅ Fase 1: MVP (Completo)
- [x] Autenticação básica
- [x] Dashboard principal
- [x] CRUD de agendamentos
- [x] Tela pública de agendamento
- [x] Integração WhatsApp

### 🚧 Fase 2: Segurança & Qualidade (Em Progresso)
- [x] Variáveis de ambiente
- [x] Firestore Security Rules
- [ ] Validação com Zod (50%)
- [ ] Firebase App Check
- [ ] Testes unitários (20%)

### 📋 Fase 3: Arquitetura (Planejado)
- [ ] Refatoração do monolito pages.tsx
- [ ] Camada de serviços
- [ ] Custom hooks principais
- [ ] Gerenciamento de estado global

### ⚡ Fase 4: Performance (Planejado)
- [ ] Code splitting
- [ ] Lazy loading de rotas
- [ ] Memoização de componentes
- [ ] PWA

### 🎨 Fase 5: UX/A11Y (Planejado)
- [ ] Melhorias de acessibilidade
- [ ] Animações (Framer Motion)
- [ ] Modo offline
- [ ] Notificações push

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### 📝 Padrões de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona nova feature
fix: corrige bug
docs: atualiza documentação
style: formatação, lint
refactor: refatoração de código
test: adiciona testes
chore: tarefas de manutenção
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 👥 Autores

- **Seu Nome** - *Trabalho Inicial* - [seu-usuario](https://github.com/seu-usuario)

---

## 🙏 Agradecimentos

- Firebase Team pela excelente plataforma
- React Team pelas inovações constantes
- Comunidade open-source

---

## 📞 Contato

**Email**: seu-email@example.com  
**LinkedIn**: [seu-perfil](https://linkedin.com/in/seu-perfil)  
**Website**: [seu-website.com](https://seu-website.com)

---

<div align="center">

**[⬆ Voltar ao topo](#-agendabarber)**

Feito com ❤️ e muito ☕

</div>
