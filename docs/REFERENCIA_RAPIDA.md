# 🧭 Referência Rápida - AgendaBarber

**Última atualização:** 15/10/2025  
**Propósito:** Guia rápido de APIs, patterns e dependências críticas

---

## 📦 Stores Zustand - Quick Reference

### 1. AuthStore
```typescript
import { useAuthStore } from '@/store/auth.store';

// No componente
const { user, loading, login, logout } = useAuthStore();

// Métodos disponíveis
await login(email, password);           // Login com validação
await logout();                         // Logout e limpa estado
await registerUser(email, password);    // Registro
await resetPassword(email);             // Reset senha
```

### 2. AppointmentsStore
```typescript
import { useAppointmentsStore } from '@/store/appointments.store';

const { 
  appointments,      // Appointment[]
  loading,          // boolean
  error,            // string | null
  createAppointment,
  updateAppointment,
  deleteAppointment,
  fetchAppointments
} = useAppointmentsStore();

// Real-time listener
const unsubscribe = startRealtimeListener();
// Lembrar de chamar unsubscribe() no cleanup
```

### 3. ClientsStore
```typescript
import { useClientsStore } from '@/store/clients.store';

const {
  clients,          // Client[]
  filteredClients,  // Client[] (com filtros aplicados)
  loading,
  searchQuery,
  setSearchQuery,   // (query: string) => void
  createClient,
  updateClient,
  deleteClient
} = useClientsStore();
```

### 4. FinancialStore
```typescript
import { useFinancialStore } from '@/store/financial.store';

const {
  transactions,     // Transaction[]
  stats,           // { totalRevenue, totalExpenses, balance, thisMonth }
  loading,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  calculateStats
} = useFinancialStore();
```

### 5. ServicesStore
```typescript
import { useServicesStore } from '@/store/services.store';

const {
  services,        // Service[]
  loading,
  createService,
  updateService,
  deleteService
} = useServicesStore();
```

### 6. BarbershopStore ⚠️ IMPORTANTE
```typescript
import { useBarbershopStore } from '@/store/barbershop.store';

const {
  shopInfo,         // { name, phone, address, username, coverImageUrl, ... }
  barbers,          // Barber[] (NOT professionals!)
  businessHours,    // { opening, closing, daysOfWeek }
  paymentMethods,   // string[] (ex: ['Pix', 'Dinheiro', 'Cartão'])
  loading,
  
  // Barbers (NOT professionals!)
  addBarber,        // (barber: Omit<Barber, 'id'>) => Promise<string>
  updateBarber,     // (id: string, data: Partial<Barber>) => Promise<void>
  removeBarber,     // (id: string) => Promise<void>
  
  // Payment methods (individual, NOT batch!)
  addPaymentMethod,    // (method: string) => Promise<void>
  removePaymentMethod, // (method: string) => Promise<void>
  
  // Shop info
  updateShopInfo,      // (info: Partial<shopInfo>) => Promise<void>
  updateBusinessHours  // (hours: Partial<businessHours>) => Promise<void>
} = useBarbershopStore();

// ⚠️ CUIDADO: Nomenclatura diferente do esperado!
// ❌ ERRADO: professionals, createProfessional, barbershop
// ✅ CORRETO: barbers, addBarber, shopInfo
```

### 7. NotificationsStore
```typescript
import { useNotificationsStore } from '@/store/notifications.store';

const {
  notifications,    // Notification[]
  unreadCount,      // number
  loading,
  markAsRead,       // (id: string) => Promise<void>
  markAllAsRead,    // () => Promise<void>
  deleteNotification
} = useNotificationsStore();
```

### 8. UIStore
```typescript
import { useUIStore } from '@/store/ui.store';

const {
  isSidebarOpen,
  activeModal,
  openModal,        // (modalId: string) => void
  closeModal,       // (modalId: string) => void
  isModalOpen,      // (modalId: string) => boolean
  toggleSidebar,
  success,          // (message: string) => void
  error,            // (message: string) => void
  info,             // (message: string) => void
  warning           // (message: string) => void
} = useUIStore();
```

---

## 🎣 Custom Hooks - Simplified APIs

### Pattern Comum
Todos os hooks seguem este pattern:
```typescript
export function useEntityName(options?: { autoFetch?: boolean }) {
  const store = useEntityStore();
  
  useEffect(() => {
    if (options?.autoFetch) {
      store.fetchEntity();
    }
  }, [options?.autoFetch]);
  
  return {
    // Data
    entity: store.entity,
    loading: store.loading,
    error: store.error,
    
    // Actions
    create: store.createEntity,
    update: store.updateEntity,
    delete: store.deleteEntity,
    
    // Helpers (específicos do domínio)
    // ...
  };
}
```

### Exemplo de Uso
```typescript
// Com auto-fetch
const { clients, loading, createClient } = useClients({ autoFetch: true });

// Sem auto-fetch (fetch manual)
const { clients, loading, fetchClients } = useClients();
useEffect(() => {
  fetchClients();
}, []);
```

---

## 🔧 Services - BaseService Pattern

### BaseService API
```typescript
import { BaseService } from '@/services/base.service';
import { EntityType } from '@/types';

// Criar serviço
const service = new BaseService<EntityType>('collectionName');

// Métodos disponíveis
await service.getAll();                    // Buscar todos
await service.getById(id);                 // Buscar por ID
await service.create(data);                // Criar
await service.update(id, data);            // Atualizar
await service.delete(id);                  // Deletar
await service.query(filters, orderBy);     // Query customizada

// Real-time listener
const unsubscribe = service.onSnapshot(callback);
```

### Specialized Services
```typescript
import { AppointmentService } from '@/services/appointment.service';

const appointmentService = new AppointmentService();

// Métodos especializados
await appointmentService.getByDate(date);
await appointmentService.getByProfessional(professionalId);
await appointmentService.getByStatus(status);
await appointmentService.checkConflict(appointment);
```

---

## 🎨 UI Components - Reusable

### Card
```typescript
<Card className="optional-classes">
  {children}
</Card>
```

### Modal
```typescript
<Modal
  isOpen={isModalOpen('modalId')}
  onClose={() => closeModal('modalId')}
  title="Título do Modal"
>
  {children}
</Modal>
```

### Icon
```typescript
<Icon 
  name="iconName"      // Ver Icon.tsx para mapeamento
  className="w-5 h-5"
/>
```

---

## 📁 Estrutura de Features

### Pattern de Feature
```
src/features/{feature}/
├── pages/
│   └── {Feature}Page.tsx
├── components/          # (opcional - componentes específicos)
│   └── {Feature}Form.tsx
└── index.ts            # Barrel export
```

### Barrel Export
```typescript
// src/features/{feature}/index.ts
export { FeaturePage } from './pages/FeaturePage';
export { FeatureForm } from './components/FeatureForm';  // se houver
```

### Import no App.tsx
```typescript
import { FeaturePage } from './features/{feature}';
```

---

## 🔥 Firebase Patterns

### Firestore Structure
```
barbershops/
  {userId}/
    appointments/     # Agendamentos
    clients/          # Clientes
    services/         # Serviços
    transactions/     # Transações
    settings/         # Configurações (documento único)
```

### Firestore Rules Pattern
```javascript
match /barbershops/{userId}/{collection}/{docId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

### Real-time Listener Pattern
```typescript
useEffect(() => {
  const unsubscribe = startRealtimeListener();
  
  return () => {
    unsubscribe();  // Cleanup
  };
}, []);
```

---

## 🎯 Validation with Zod

### Import
```typescript
import { appointmentSchema, validateData } from '@/lib/validations';
```

### Uso
```typescript
const result = validateData(appointmentSchema, formData);

if (!result.success) {
  // result.errors: Record<string, string>
  // result.errorList: Array<{field, message}>
  console.error(result.errors);
  return;
}

// result.data: tipo validado
const validatedData = result.data;
```

### Schemas Disponíveis
- `loginSchema`
- `registerSchema`
- `appointmentSchema`
- `clientSchema`
- `serviceSchema`
- `transactionSchema`
- `barbershopSchema`

---

## 🎨 Styling Patterns

### Dark Theme Palette
```typescript
// Backgrounds
bg-slate-900     // Fundo principal
bg-slate-800     // Cards, containers
bg-slate-700     // Inputs, hovers

// Borders
border-slate-600

// Text
text-slate-100   // Texto principal
text-slate-200   // Texto secundário
text-slate-400   // Texto terciário

// Accent
bg-violet-600    // Botões primários
text-violet-500  // Links, highlights
```

### Mobile-First Container
```typescript
// App Layout
<div className="max-w-md mx-auto min-h-screen bg-slate-900">
  {children}
</div>
```

---

## ⚠️ Pegadinhas Comuns

### 1. BarbershopStore Nomenclature
```typescript
// ❌ ERRADO
const { barbershop, professionals, createProfessional } = useBarbershop();

// ✅ CORRETO
const { shopInfo, barbers, addBarber } = useBarbershop();
```

### 2. businessHours Location
```typescript
// ❌ ERRADO
shopInfo.businessHours.opening

// ✅ CORRETO
businessHours.opening  // É uma propriedade separada!
```

### 3. Payment Methods
```typescript
// ❌ ERRADO
paymentMethods.pix

// ✅ CORRETO
paymentMethods.includes('Pix')
```

### 4. Modal State
```typescript
// ❌ ERRADO - Estado local
const [isOpen, setIsOpen] = useState(false);

// ✅ CORRETO - UIStore
const { openModal, closeModal, isModalOpen } = useUI();
```

---

## 📚 Documentação Completa

Para informações detalhadas, consultar:

1. **STATUS_PROJETO.md** - Progresso geral
2. **FASE_2_COMPLETO.md** - Detalhes da Fase 2
3. **ANALISE_COMPLETA_UI.md** - Análise de todas as telas
4. **FLUXO_NAVEGACAO.md** - Fluxos de navegação
5. **DESCRICAO_FEATURES.md** - Features detalhadas
6. **.github/copilot-instructions.md** - Instruções para AI

---

## 🚀 Quick Start Para Nova Feature

### 1. Criar Store
```typescript
// src/store/newFeature.store.ts
import { create } from 'zustand';

interface NewFeatureState {
  data: EntityType[];
  loading: boolean;
  error: string | null;
  
  fetchData: () => Promise<void>;
  createData: (data: Omit<EntityType, 'id'>) => Promise<string>;
  // ...
}

export const useNewFeatureStore = create<NewFeatureState>((set) => ({
  data: [],
  loading: false,
  error: null,
  
  fetchData: async () => { /* implementação */ },
  createData: async (data) => { /* implementação */ },
}));
```

### 2. Criar Hook
```typescript
// src/hooks/useNewFeature.ts
import { useEffect } from 'react';
import { useNewFeatureStore } from '@/store/newFeature.store';

export function useNewFeature(options?: { autoFetch?: boolean }) {
  const store = useNewFeatureStore();
  
  useEffect(() => {
    if (options?.autoFetch) {
      store.fetchData();
    }
  }, [options?.autoFetch]);
  
  return {
    data: store.data,
    loading: store.loading,
    error: store.error,
    create: store.createData,
    // ... helpers
  };
}
```

### 3. Criar Feature Folder
```bash
mkdir -p src/features/newFeature/pages
```

### 4. Criar Page
```typescript
// src/features/newFeature/pages/NewFeaturePage.tsx
import React from 'react';
import { useNewFeature } from '@/hooks/useNewFeature';

export const NewFeaturePage: React.FC = () => {
  const { data, loading, create } = useNewFeature({ autoFetch: true });
  
  // ... implementação
};
```

### 5. Barrel Export
```typescript
// src/features/newFeature/index.ts
export { NewFeaturePage } from './pages/NewFeaturePage';
```

### 6. Adicionar Rota
```typescript
// src/App.tsx
import { NewFeaturePage } from './features/newFeature';

// No Routes
<Route path="/new-feature" element={<NewFeaturePage />} />
```

---

**Última atualização:** 15/10/2025  
**Versão:** 1.0  
**Fase:** 2 (90% completa)
