# AgendaBarber - AI Coding Agent Instructions

This is a mobile-first React SaaS application for barbershop management built with TypeScript, Vite, TailwindCSS, and Firebase.

## 📚 Complete Documentation References

**CRITICAL**: Before implementing any feature, consult these comprehensive documents in the `docs/` folder:

1. **[docs/ANALISE_COMPLETA_UI.md](../docs/ANALISE_COMPLETA_UI.md)** (19.500 palavras)
   - Detailed analysis of all 23 screens
   - 31 reusable components identified
   - 12 TypeScript interfaces defined
   - 8 Zustand stores specified
   - Complete data models for every feature

2. **[docs/FLUXO_NAVEGACAO.md](../docs/FLUXO_NAVEGACAO.md)** (8.200 palavras)
   - 10 main navigation flows with ASCII diagrams
   - Route architecture (public vs protected)
   - Navigation transitions table (24 routes)
   - Zustand data flow patterns
   - Global error handling

3. **[docs/DESCRICAO_FEATURES.md](../docs/DESCRICAO_FEATURES.md)** (23.800 palavras)
   - 11 main features detailed
   - 60+ functionalities specified
   - Complete TypeScript data models
   - Zod validation schemas documented
   - Firebase integrations mapped

4. **[docs/ESTADOS_ESPECIAIS.md](../docs/ESTADOS_ESPECIAIS.md)** (15.400 palavras)
   - 80+ UI states defined
   - Loading, Empty, Error, Success for each feature
   - Animations specified (duration, easing)
   - Standardized skeleton screens
   - Toast notifications (4 types)

5. **[docs/RESUMO_EXECUTIVO.md](../docs/RESUMO_EXECUTIVO.md)** (3.100 palavras)
   - Executive summary of analysis
   - Consolidated statistics
   - 8 key insights
   - Implementation recommendations
   - Prioritized next steps

6. **[docs/TESTE_E2E_PROGRESSO.md](../docs/TESTE_E2E_PROGRESSO.md)** (NEW)
   - Complete E2E testing progress report
   - 20/21 tests passing (95% success rate)
   - 4/12 features tested
   - Testing patterns and corrections
   - Known issues and workarounds

**Total**: 67.000+ words of technical documentation covering every aspect of the system.

**Quick Reference**: See [docs/INDEX.md](../docs/INDEX.md) for full documentation index.

## Architecture Overview

**Mobile-First Design**: The app mimics a mobile experience with `max-w-md mx-auto` container in `Layout.tsx`. All UI components are optimized for touch interactions and small screens.

**Dual-User Architecture**: 
- **Professional Dashboard** (`/dashboard`, `/agenda`, etc.) - Requires Firebase authentication
- **Public Booking Page** (`/booking`) - Client-facing, no authentication required, generates WhatsApp links

**Navigation Pattern**: Uses HashRouter with two navigation systems:
- `BottomNav.tsx` - Fixed bottom navigation for main sections
- `Sidebar.tsx` - Slide-out menu with full navigation and settings

## Core Data Flow & Patterns

**State Management - FASE 2 (90% Complete)**: Successfully migrated from monolithic React state to Zustand stores:
- **AuthStore** (✅ Implemented) - `src/store/auth.store.ts` - Global authentication state
- **AppointmentsStore** (✅ Implemented) - `src/store/appointments.store.ts` - Appointments with real-time updates
- **ClientsStore** (✅ Implemented) - `src/store/clients.store.ts` - Client database with search/filter
- **FinancialStore** (✅ Implemented) - `src/store/financial.store.ts` - Transactions and financial stats
- **ServicesStore** (✅ Implemented) - `src/store/services.store.ts` - Service catalog with CRUD operations
- **BarbershopStore** (✅ Implemented) - `src/store/barbershop.store.ts` - Shop config (professionals, hours, payments, profile)
- **NotificationsStore** (✅ Implemented) - `src/store/notifications.store.ts` - Real-time notifications with Firestore listeners
- **UIStore** (✅ Implemented) - `src/store/ui.store.ts` - Transient UI state (modals, toasts, sidebar)

**Service Layer Pattern**: 
- **BaseService** (✅ Implemented) - `src/services/base.service.ts` - Generic CRUD for Firestore with TypeScript generics
- **AppointmentService** (✅ Implemented) - `src/services/appointment.service.ts` - Specialized appointment operations
- Pattern: `const service = new BaseService<EntityType>('collectionName')`
- All Firebase queries go through services (never direct in components)

**Hook Pattern** (✅ All 8 Implemented):
- **useAuth** - `src/hooks/useAuth.ts` - Authentication with Zod validation
- **useAppointments** - `src/hooks/useAppointments.ts` - Appointments CRUD with helpers
- **useClients** - `src/hooks/useClients.ts` - Client management with search
- **useFinancial** - `src/hooks/useFinancial.ts` - Transactions and statistics
- **useServices** - `src/hooks/useServices.ts` - Service catalog management
- **useBarbershop** - `src/hooks/useBarbershop.ts` - Shop configuration (barbers, hours, payments, profile)
- **useNotifications** - `src/hooks/useNotifications.ts` - Real-time notifications
- **useUI** - `src/hooks/useUI.ts` - Modal/toast/sidebar control
- Pattern: Hooks consume Zustand stores and provide simplified API

**Component Architecture** (✅ 90% Migrated):
- `src/pages/pages.tsx` - **ALMOST EMPTY**: Only HistoryPage remains (1 of 10 pages)
- `src/features/` - ✅ Feature-based structure implemented:
  - `auth/` - LoginPage, RegisterPage
  - `booking/` - BookingPage (public)
  - `dashboard/` - DashboardPage (587 lines)
  - `appointments/` - AppointmentsPage (650 lines)
  - `agenda/` - AgendaPage (650 lines, 3 views)
  - `clients/` - ClientsPage (520 lines)
  - `financial/` - FinancialPage (500 lines)
  - `profile/` - ProfilePage (200 lines)
  - `settings/` - ShopSettingsPage, ServicesSettingsPage, AppSettingsPage (1,100 lines)
- `src/components/` - Reusable UI components (Card, Modal, Icon, etc.)
- `src/types.ts` - Comprehensive TypeScript interfaces with Portuguese enum values

**BarbershopStore Critical Details**:
- Uses `Barber` type (NOT `Professional`)
- Returns `shopInfo` object (NOT `barbershop`)
- Returns `barbers` array (NOT `professionals`)
- Returns `businessHours` as separate property (NOT nested in shopInfo)
- Methods: `addBarber`, `updateBarber`, `removeBarber` (NOT create/update/delete)
- Payment methods: `addPaymentMethod(single)`, `removePaymentMethod(single)` (NOT batch update)
- shopInfo includes profile fields: username, coverImageUrl, logoUrl, city, state, instagram, facebook, website

## Critical Patterns

**Icon System**: Uses `react-icons/bi` with a custom mapping in `Icon.tsx`. Always use the Icon component instead of importing icons directly.

**Modal Pattern**: All forms use the `Modal.tsx` component. Forms are typically inline components within pages (see `AppointmentForm` in pages.tsx).

**Dark Theme**: Exclusively uses Slate color palette (`slate-900`, `slate-800`, etc.) with violet accents (`violet-600`, `violet-500/20`). Never use light colors.

**Portuguese Localization**: All user-facing text is in Portuguese. Enum values use Portuguese strings (e.g., `AppointmentStatus.Confirmed = "Confirmado"`).

## Firebase Integration

**Project Config**: Uses "saas-barbearia-8d49a" project. 

**Environment Variables**: All Firebase credentials are stored in `.env.local` (never committed). Required variables:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_GEMINI_API_KEY` (optional - for AI features)
- See `.env.example` for full list

**Auth Pattern**: 
- Uses `signInWithRedirect` instead of popup (see detailed comments in `firebase.ts`)
- Auth state managed in App.tsx root component
- Logout clears state and reloads page

**Firestore Structure**: Collection pattern `barbershops/{userId}/appointments` for data isolation.

**Security**:
- ✅ Firestore Rules deployed with proper access control
- ✅ App Check configured in `src/lib/firebase-app-check.ts`
  - **Production:** Uses reCAPTCHA v3 (invisible, no user interaction)
  - **Development:** Uses debug token (bypasses reCAPTCHA)
  - **IMPORTANT:** Use SITE KEY (public) in client, NOT SECRET KEY (private)
  - SITE KEY goes in `.env.local`: `VITE_FIREBASE_APP_CHECK_KEY=6Lc...`
  - Guide: See `GUIA_APP_CHECK_RECAPTCHA.md` for setup instructions
- ✅ Data validation using Zod schemas in `src/lib/validations.ts`

**Firestore Rules Critical Issue**: 
- ⚠️ **NEVER use dot notation for fields named `service`** in `firestore.rules`
- `service` is a RESERVED KEYWORD in Firestore Rules (like `match`, `allow`, `function`)
- ❌ WRONG: `request.resource.data.service.size()`
- ✅ CORRECT: `request.resource.data['service'].size()`
- This applies to ANY reserved keywords used as field names
- Failure to use bracket notation causes cryptic compilation errors: "Unexpected '.size'" and "mismatched input 'service'"
- Deploy command: `firebase deploy --only firestore:rules` (modern syntax, NOT `--only rules`)

## Data Validation

**Zod Schemas**: All data validation uses Zod (v4.1.12) in `src/lib/validations.ts`:
- `loginSchema`, `registerSchema` - Authentication
- `appointmentSchema`, `clientSchema`, `serviceSchema` - Business entities
- `transactionSchema`, `barbershopSchema` - Settings and financial
- Helper functions: `validateData()`, `isValid()`, `parseOrNull()`
- Custom validators: `isValidCPF()`, `isFutureDate()`, `isTimeInRange()`
- Formatters: `formatPhone()`, `formatCPF()`, `formatZipCode()`

**Validation Pattern**: Always validate user input before sending to Firebase:
```typescript
import { appointmentSchema, validateData } from '@/lib/validations';

const result = validateData(appointmentSchema, formData);
if (!result.success) {
  // Handle errors: result.errors or result.errorList
  return;
}
// Use validated data: result.data
```

## Development Workflow

**Build Commands**:
- `npm run dev` - Development server (port 3000)
- `npm run build` - Production build
- `npm run lint` - TypeScript checking (no ESLint)

**Styling**: Uses Tailwind with custom animations defined inline in components (see `Modal.tsx` and `Header.tsx` for examples).

**Component Patterns**:
- Form components use `FormField`, `FormInput`, `FormSelect` helpers
- Cards use hover effects and consistent shadow patterns
- Buttons follow consistent color schemes (violet primary, slate secondary, red danger)

## Key Files for Context

- `src/types.ts` - All TypeScript interfaces and enums
- `src/constants.ts` - Mock data and sample business logic
- `src/pages/pages.tsx` - All page components in one file
- `src/firebase.ts` - Firebase config with detailed troubleshooting comments
- `vite.config.ts` - Build configuration with environment variable handling

## Firebase Deployment

Uses GitHub Actions for automatic deployment to Firebase Hosting. The app is configured as a SPA with all routes redirecting to `/index.html`.

When implementing new features, follow the established patterns: use the existing mock data structure, maintain Portuguese localization, implement mobile-first responsive design, and leverage the component library consistently.