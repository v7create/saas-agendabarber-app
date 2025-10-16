# AgendaBarber - AI Instructions

React SaaS for barbershop management: TypeScript + Vite + TailwindCSS + Firebase.

## 🎯 Core Architecture

**Mobile-First**: `max-w-md mx-auto` container. Touch-optimized UI.

**Dual Architecture**:
- `/dashboard`, `/agenda`, `/clients`, `/financial`, `/profile`, `/settings/*` → Protected (Firebase Auth)
- `/booking` → Public (WhatsApp link only, no Firebase save)

**Navigation**: HashRouter with `BottomNav.tsx` + `Sidebar.tsx`

## 📂 Project Structure

```
src/
├── features/           # Feature-based components (auth, booking, dashboard, etc)
├── store/             # 8 Zustand stores (auth, appointments, clients, financial, services, barbershop, notifications, ui)
├── hooks/             # 8 custom hooks (useAuth, useAppointments, useClients, etc)
├── services/          # Firebase services (BaseService + specialized)
├── components/        # Reusable UI (Card, Modal, Icon, etc)
└── lib/               # Validations (Zod), Firebase config, App Check
```

## 🔥 Firebase Setup

**Project**: `saas-barbearia-8d49a`

**Environment Variables** (`.env.local`):
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
VITE_FIREBASE_APP_CHECK_KEY=...      # reCAPTCHA v3 SITE KEY (public)
VITE_GEMINI_API_KEY=...               # Optional
```

**Auth Pattern**: 
- `signInWithRedirect` (NOT popup) - see detailed comments in `firebase.ts`
- `onAuthStateChanged` in App.tsx root

**Firestore Structure**: `barbershops/{userId}/appointments`

**Security**:
- ✅ Firestore Rules deployed
- ✅ App Check (reCAPTCHA v3 production, debug token dev) - see `firebase-app-check.ts`
- ✅ Zod validation - see `lib/validations.ts`

**CRITICAL Firestore Rules Issue**:
- ⚠️ `service` is a RESERVED KEYWORD
- ❌ WRONG: `request.resource.data.service.size()`
- ✅ CORRECT: `request.resource.data['service'].size()`
- Deploy: `firebase deploy --only firestore:rules`

## 🧩 Data Flow Pattern (FASE 2 Complete)

**Store → Hook → Component**:
```typescript
// 1. Store (Zustand)
const useAppointmentsStore = create<AppointmentsState>(...);

// 2. Hook (abstraction)
export const useAppointments = () => {
  const store = useAppointmentsStore();
  return { appointments, createAppointment, ... };
};

// 3. Component
const { appointments, createAppointment } = useAppointments();
```

**Service Layer**:
```typescript
const service = new BaseService<Appointment>('appointments');
await service.create(data);
```

## 🎨 Design System

**Dark Theme Only**:
- Background: `slate-950`, `slate-900`, `slate-800`
- Primary: `violet-600`, `violet-500`
- Text: `white`, `slate-300`
- Success: `green-500` | Error: `red-500`

**Icons**: `react-icons/bi` via `Icon.tsx` component (NEVER import directly)

**Components**: All use Tailwind, no external CSS

## ✅ Validation (Zod v4.1.12)

```typescript
import { appointmentSchema, validateData } from '@/lib/validations';

const result = validateData(appointmentSchema, formData);
if (!result.success) return; // Handle errors
// Use result.data
```

Schemas: `loginSchema`, `registerSchema`, `appointmentSchema`, `clientSchema`, `serviceSchema`, `transactionSchema`, `barbershopSchema`

## 🧪 E2E Testing (Playwright)

**Status**: 20/21 tests passing (95%) - 4/12 features tested

**Credentials**: `teste@exemplo.com` / `senha123`

**Run**: `npx playwright test` (dev server must be running on port 3000)

**Patterns**:
- Login: `button:has-text("Entrar")` NOT `button[type="submit"]`
- Navigation: `page.goto('/#/route')` (direct URL)
- Forms: Use `placeholder` NOT `name` attributes
- Timeout: `test.setTimeout(60000);` inside test function

## 🚀 Development

```bash
npm run dev          # Port 3000
npm run build        # Production
npm run lint         # TypeScript check
```

## 🔑 Critical Patterns

1. **BarbershopStore naming**:
   - Uses `Barber` type (NOT `Professional`)
   - Returns `shopInfo` object (NOT `barbershop`)
   - Returns `barbers` array (NOT `professionals`)
   - Methods: `addBarber`, `updateBarber`, `removeBarber`
   - shopInfo includes: username, coverImageUrl, logoUrl, city, state, social links

2. **Portuguese Localization**: All user-facing text in Portuguese. Enum values use Portuguese strings:
   ```typescript
   AppointmentStatus.Confirmed = "Confirmado"
   ```

3. **Modal Pattern**: Use `Modal.tsx` component. Forms inline within pages.

4. **WhatsApp Integration**: Used in 3 places (Booking, Dashboard cards, Profile contact)

5. **TypeScript Interfaces**: See `src/types.ts` for complete definitions

## 📝 Key Files

- `src/types.ts` - All interfaces/enums
- `src/firebase.ts` - Firebase config with troubleshooting comments
- `src/lib/validations.ts` - All Zod schemas
- `src/store/*.store.ts` - 8 Zustand stores
- `src/hooks/*.ts` - 8 custom hooks
- `vite.config.ts` - Build config

## 🚨 Common Issues

1. **Terminal**: User uses CMD (NOT PowerShell). Always prefix commands with `cmd /c` when running in terminal
2. **Path with Brackets**: Use `-LiteralPath` for paths with brackets `[APP]` in PowerShell
3. **Test Timeouts**: Always use `test.setTimeout()` INSIDE test function
4. **Form Selectors**: Use `placeholder` attributes (inputs don't have `name`)
5. **Services Field**: Uses CHECKBOXES (`input[type="checkbox"]`), NOT `<select multiple>`

---

**Status**: FASE 2 Complete (90% architecture migrated) → FASE 3 (E2E Testing in progress)