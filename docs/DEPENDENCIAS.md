# 🔗 Dependências e Relações Críticas

**Última atualização:** 15/10/2025  
**Propósito:** Mapa de dependências entre componentes, stores e features

---

## 📊 Mapa de Dependências por Feature

### DashboardPage
```
DashboardPage (587 linhas)
├── Stores (4)
│   ├── AppointmentsStore → appointments list, stats
│   ├── ClientsStore → total clients count
│   ├── FinancialStore → revenue stats
│   └── UIStore → modals control
├── Modais (5)
│   ├── appointmentForm → Create/Edit appointments
│   ├── appointmentDetails → View appointment
│   ├── clientForm → Quick add client
│   ├── serviceForm → Quick add service
│   └── confirmCancel → Cancel confirmation
└── Sub-componentes
    ├── StatsCard (inline) → Display metrics
    └── AppointmentCard (inline) → List item
```

### ClientsPage
```
ClientsPage (520+ linhas)
├── Stores (2)
│   ├── ClientsStore → CRUD + search/filter
│   └── UIStore → modals + toasts
├── Modais (2)
│   ├── clientForm → Create/Edit client
│   └── confirmDelete → Delete confirmation
└── Features
    ├── Search bar → ClientsStore.setSearchQuery
    ├── Filter tabs → Active/Inactive/All
    └── Client list → Mapped from filteredClients
```

### FinancialPage
```
FinancialPage (500+ linhas)
├── Stores (2)
│   ├── FinancialStore → transactions, stats
│   └── UIStore → modals control
├── Modais (2)
│   ├── transactionForm → Create/Edit transaction
│   └── confirmDelete → Delete confirmation
└── Features
    ├── Stats cards (4) → totalRevenue, totalExpenses, balance, thisMonth
    ├── Payment distribution chart → Pie chart visual
    └── Transactions list → Filterable by type
```

### AppointmentsPage
```
AppointmentsPage (650+ linhas)
├── Stores (4)
│   ├── AppointmentsStore → appointments CRUD
│   ├── ClientsStore → client names
│   ├── ServicesStore → service details
│   └── UIStore → modals + menu
├── Modais (3)
│   ├── appointmentForm → Create/Edit
│   ├── appointmentDetails → View details
│   └── confirmCancel → Cancel confirmation
└── Features
    ├── Timeline view → Chronological list
    ├── Filter tabs → Pendente/Confirmado/Concluído/Cancelado/Todos
    └── Menu actions → Edit, View, Cancel, Mark Complete
```

### AgendaPage
```
AgendaPage (650+ linhas)
├── Stores (3)
│   ├── AppointmentsStore → appointments data
│   ├── ServicesStore → service info
│   └── UIStore → modals
├── Views (3)
│   ├── Timeline → Chronological with time slots
│   ├── Kanban → Status columns (Pendente/Confirmado/Concluído)
│   └── Calendar → Monthly grid view
└── Features
    ├── View switcher → Toggle between 3 views
    ├── Date navigation → Previous/Next/Today
    └── Appointment cards → Drag & drop (Kanban only)
```

### ProfilePage
```
ProfilePage (200+ linhas)
├── Stores (1)
│   └── BarbershopStore → shopInfo (extended)
├── Sections (4)
│   ├── Cover & Logo → coverImageUrl, logoUrl
│   ├── About → name, username, description
│   ├── Contact → address, phone (WhatsApp link)
│   └── Social Media → instagram, facebook, website
└── Features
    ├── Empty state → When profile incomplete
    └── Edit button → Navigate to settings
```

### ShopSettingsPage
```
ShopSettingsPage (400+ linhas)
├── Stores (2)
│   ├── BarbershopStore → barbers, businessHours, paymentMethods
│   └── UIStore → modals
├── Sections (3)
│   ├── Professionals → barbers CRUD
│   ├── Opening Hours → businessHours display (editable - not implemented)
│   └── Payment Methods → toggles for Pix/Dinheiro/Cartão
├── Modais (2)
│   ├── professionalForm → Add/Edit barber
│   └── confirmDelete → Delete barber
└── Sub-componentes (2)
    ├── SettingsItem (inline) → Reusable list item
    └── ToggleSwitch (inline) → Payment method toggle
```

### ServicesSettingsPage
```
ServicesSettingsPage (350+ linhas)
├── Stores (2)
│   ├── ServicesStore → services CRUD
│   └── UIStore → modals + toasts
├── Modais (2)
│   ├── serviceForm → Add/Edit service (with Zod validation)
│   └── confirmDelete → Delete service
└── Features
    ├── Services list → name, duration, price
    ├── Menu actions → Edit, Delete per service
    └── Empty state → CTA to add first service
```

### AppSettingsPage
```
AppSettingsPage (350+ linhas)
├── Stores (2)
│   ├── AuthStore → user email, password reset
│   └── UIStore → modals + toasts
├── Sections (4)
│   ├── Theme → Dark/Light selector (light disabled)
│   ├── Account → Email display, reset password
│   ├── Notifications → Toggles (2)
│   └── More → Privacy, Support (WhatsApp), What's New
├── Modal (1)
│   └── whatsNew → Version changelog
└── Features
    ├── Password reset → Firebase sendPasswordResetEmail
    └── Version footer → "AgendaBarber v1.0.0"
```

---

## 🔄 Fluxo de Dados - Real-time Updates

### Appointment Creation Flow
```
1. User → AppointmentForm (modal)
   ↓
2. AppointmentForm → useAppointments().createAppointment(data)
   ↓
3. useAppointments → AppointmentsStore.createAppointment()
   ↓
4. AppointmentsStore → AppointmentService.create()
   ↓
5. AppointmentService → Firestore.add()
   ↓
6. Firestore → onSnapshot listener
   ↓
7. Listener → AppointmentsStore.setAppointments()
   ↓
8. Store update → All subscribed components re-render
   ├── DashboardPage (updates stats + recent list)
   ├── AppointmentsPage (adds to timeline)
   └── AgendaPage (updates calendar/kanban/timeline)
```

### Client Search Flow
```
1. User → Search input (ClientsPage)
   ↓
2. Input onChange → ClientsStore.setSearchQuery(query)
   ↓
3. Store → Filters clients array
   ↓
4. filteredClients → Derived state (computed)
   ↓
5. ClientsPage → Re-renders with filtered list
```

### Modal Management Flow
```
1. User → Click "Add" button
   ↓
2. Button onClick → UIStore.openModal('modalId')
   ↓
3. UIStore → Sets activeModal state
   ↓
4. Modal component → Checks UIStore.isModalOpen('modalId')
   ↓
5. isModalOpen === true → Modal renders
   ↓
6. User → Submit form or close
   ↓
7. Form onSubmit/onClose → UIStore.closeModal('modalId')
   ↓
8. UIStore → Clears activeModal
   ↓
9. Modal → Unmounts
```

---

## 🎯 Critical Dependencies Matrix

### Store → Store Dependencies
```
None! 🎉
All stores are independent and communicate only through React components.
This is good design - no circular dependencies.
```

### Page → Store Dependencies
| Page | Stores Used | Primary | Secondary |
|------|-------------|---------|-----------|
| DashboardPage | 4 | Appointments | Clients, Financial, UI |
| ClientsPage | 2 | Clients | UI |
| FinancialPage | 2 | Financial | UI |
| AppointmentsPage | 4 | Appointments | Clients, Services, UI |
| AgendaPage | 3 | Appointments | Services, UI |
| ProfilePage | 1 | Barbershop | - |
| ShopSettingsPage | 2 | Barbershop | UI |
| ServicesSettingsPage | 2 | Services | UI |
| AppSettingsPage | 2 | Auth | UI |

### Hook → Store Dependencies
| Hook | Store | Additional Dependencies |
|------|-------|------------------------|
| useAuth | AuthStore | Firebase Auth |
| useAppointments | AppointmentsStore | AppointmentService |
| useClients | ClientsStore | BaseService |
| useFinancial | FinancialStore | BaseService |
| useServices | ServicesStore | BaseService |
| useBarbershop | BarbershopStore | BaseService |
| useNotifications | NotificationsStore | BaseService |
| useUI | UIStore | - |

### Service → Firebase Dependencies
| Service | Firestore Collections | Real-time? |
|---------|----------------------|------------|
| BaseService | Generic (any) | ✅ Yes (onSnapshot) |
| AppointmentService | `appointments` | ✅ Yes |
| (future) ClientService | `clients` | ✅ Yes |
| (future) FinancialService | `transactions` | ✅ Yes |

---

## ⚠️ Breaking Change Points

### Se BarbershopStore mudar:
**Impacto:**
- ✅ ProfilePage (usa shopInfo com 9+ campos)
- ✅ ShopSettingsPage (usa barbers, businessHours, paymentMethods)
- ✅ useBarbershop hook

**Cuidado com:**
- Nomenclatura: `barbers` não `professionals`
- Estrutura: `shopInfo` separado de `businessHours`
- Métodos: `addBarber` não `createProfessional`

### Se UIStore mudar:
**Impacto:** TODAS as páginas (8 de 9 usam modais)

**Cuidado com:**
- Modal management (openModal, closeModal, isModalOpen)
- Toast messages (success, error, info, warning)
- Sidebar state (toggleSidebar)

### Se AppointmentsStore mudar:
**Impacto:**
- ✅ DashboardPage (stats + recent appointments)
- ✅ AppointmentsPage (full CRUD)
- ✅ AgendaPage (calendar/kanban/timeline views)

**Cuidado com:**
- Real-time listeners (must call unsubscribe)
- Derived data (stats calculations)
- Status changes affecting multiple views

---

## 🔌 External Dependencies

### Firebase Services
```typescript
// Authentication
import { auth } from '@/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';

// Firestore
import { db } from '@/firebase';
import { 
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';

// App Check
import { appCheck } from '@/lib/firebase-app-check';
```

### Zod Validation
```typescript
import { z } from 'zod';
import { 
  appointmentSchema,
  clientSchema,
  serviceSchema,
  validateData
} from '@/lib/validations';
```

### React Router
```typescript
import { 
  HashRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
} from 'react-router-dom';
```

### React Icons
```typescript
import { BiHome, BiCalendar, BiUser, etc } from 'react-icons/bi';
// ⚠️ Usar sempre através do componente Icon
import { Icon } from '@/components/Icon';
```

---

## 📦 Package Dependencies

### Core (package.json)
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "firebase": "^11.0.2",
    "zustand": "^5.0.1",
    "zod": "^4.1.12",
    "react-icons": "^5.3.0"
  }
}
```

### Build Tools
```json
{
  "devDependencies": {
    "vite": "^6.0.1",
    "typescript": "~5.6.2",
    "@vitejs/plugin-react": "^4.3.3",
    "tailwindcss": "^3.4.15",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20"
  }
}
```

---

## 🗺️ Module Resolution

### Path Aliases (tsconfig.json)
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Import Examples
```typescript
// ✅ CORRETO - Com alias
import { useAuth } from '@/hooks/useAuth';
import { Client } from '@/types';
import { Card } from '@/components/Card';

// ❌ ERRADO - Sem alias
import { useAuth } from '../../hooks/useAuth';
import { Client } from '../../types';
```

---

## 🎯 Checklist de Mudanças

Ao fazer mudanças significativas, verificar:

### ✅ Mudança em Store
- [ ] Hook correspondente atualizado?
- [ ] Páginas que usam o store verificadas?
- [ ] Tipos TypeScript atualizados?
- [ ] Real-time listeners funcionando?

### ✅ Mudança em Hook
- [ ] Store subjacente funciona?
- [ ] Páginas que usam o hook testadas?
- [ ] Auto-fetch funcionando (se aplicável)?
- [ ] Cleanup (unsubscribe) implementado?

### ✅ Mudança em Page
- [ ] Imports atualizados no App.tsx?
- [ ] Barrel export criado/atualizado?
- [ ] Zero TypeScript errors?
- [ ] Modais funcionando com UIStore?

### ✅ Mudança em Types
- [ ] Stores usando o tipo atualizados?
- [ ] Schemas Zod correspondentes atualizados?
- [ ] Páginas re-validadas?
- [ ] Services atualizados?

---

**Última atualização:** 15/10/2025  
**Versão:** 1.0  
**Próxima revisão:** Após Fase 2 completa (100%)
