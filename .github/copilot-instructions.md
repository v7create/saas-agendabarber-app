# AgendaBarber - AI Coding Agent Instructions

This is a mobile-first React SaaS application for barbershop management built with TypeScript, Vite, TailwindCSS, and Firebase.

## Architecture Overview

**Mobile-First Design**: The app mimics a mobile experience with `max-w-md mx-auto` container in `Layout.tsx`. All UI components are optimized for touch interactions and small screens.

**Dual-User Architecture**: 
- **Professional Dashboard** (`/dashboard`, `/agenda`, etc.) - Requires Firebase authentication
- **Public Booking Page** (`/booking`) - Client-facing, no authentication required, generates WhatsApp links

**Navigation Pattern**: Uses HashRouter with two navigation systems:
- `BottomNav.tsx` - Fixed bottom navigation for main sections
- `Sidebar.tsx` - Slide-out menu with full navigation and settings

## Core Data Flow & Patterns

**Mock Data Strategy**: All data operations use constants from `src/constants.ts` (MOCK_APPOINTMENTS, MOCK_CLIENTS, etc.). Real Firebase integration is partially implemented but primarily uses mock data for development.

**State Management**: Pure React state with useState/useEffect. Firebase auth state is managed globally in `App.tsx` using `onAuthStateChanged`.

**Component Architecture**:
- `src/pages/pages.tsx` - Single file containing ALL page components (intentional monolith pattern)
- `src/components/` - Reusable UI components (Card, Modal, Icon, etc.)
- `src/types.ts` - Comprehensive TypeScript interfaces with Portuguese enum values

## Critical Patterns

**Icon System**: Uses `react-icons/bi` with a custom mapping in `Icon.tsx`. Always use the Icon component instead of importing icons directly.

**Modal Pattern**: All forms use the `Modal.tsx` component. Forms are typically inline components within pages (see `AppointmentForm` in pages.tsx).

**Dark Theme**: Exclusively uses Slate color palette (`slate-900`, `slate-800`, etc.) with violet accents (`violet-600`, `violet-500/20`). Never use light colors.

**Portuguese Localization**: All user-facing text is in Portuguese. Enum values use Portuguese strings (e.g., `AppointmentStatus.Confirmed = "Confirmado"`).

## Firebase Integration

**Project Config**: Uses "saas-barbearia-8d49a" project. Environment variables expected in `.env.local`:
- `GEMINI_API_KEY` (referenced in vite.config.ts)

**Auth Pattern**: 
- Uses `signInWithRedirect` instead of popup (see detailed comments in `firebase.ts`)
- Auth state managed in App.tsx root component
- Logout clears state and reloads page

**Firestore Structure**: Collection pattern `barbershops/{userId}/appointments` for data isolation.

**Firestore Rules Critical Issue**: 
- ⚠️ **NEVER use dot notation for fields named `service`** in `firestore.rules`
- `service` is a RESERVED KEYWORD in Firestore Rules (like `match`, `allow`, `function`)
- ❌ WRONG: `request.resource.data.service.size()`
- ✅ CORRECT: `request.resource.data['service'].size()`
- This applies to ANY reserved keywords used as field names
- Failure to use bracket notation causes cryptic compilation errors: "Unexpected '.size'" and "mismatched input 'service'"
- Deploy command: `firebase deploy --only firestore:rules` (modern syntax, NOT `--only rules`)

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