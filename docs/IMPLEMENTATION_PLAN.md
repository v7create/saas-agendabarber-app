# 🔧 Plano de Implementação Detalhado - AgendaBarber

## 📋 FASE 1: SEGURANÇA (CRÍTICO - 1-2 dias)

### 1.1 Configurar Variáveis de Ambiente

**Arquivos a criar/modificar:**

#### `.env.example`
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# API Keys (nunca commitar o .env real!)
VITE_GEMINI_API_KEY=your_gemini_key_here

# App Configuration
VITE_APP_NAME=AgendaBarber
VITE_APP_URL=https://your-app-url.com
VITE_WHATSAPP_BUSINESS_PHONE=5511999999999
```

#### Atualizar `.gitignore`
```gitignore
# Environment variables
.env
.env.local
.env.production
.env.development

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Firebase
.firebase/
firebase-debug.log
firestore-debug.log
```

#### Refatorar `src/firebase.ts`
```typescript
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

// Validação de variáveis de ambiente
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

requiredEnvVars.forEach((varName) => {
  if (!import.meta.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics e Performance apenas em produção
let analytics: ReturnType<typeof getAnalytics> | null = null;
let performance: ReturnType<typeof getPerformance> | null = null;

if (import.meta.env.PROD) {
  analytics = getAnalytics(app);
  performance = getPerformance(app);
}

export { analytics, performance };

// Configurações do provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Helper para debug (remover em produção)
if (import.meta.env.DEV) {
  console.log('Firebase initialized with project:', firebaseConfig.projectId);
}
```

---

### 1.2 Criar Firestore Security Rules

**Arquivo:** `firestore.rules`

```rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // ========================================
    // HELPER FUNCTIONS
    // ========================================
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isValidEmail(email) {
      return email.matches('.*@.*\\..*');
    }
    
    function isValidPhone(phone) {
      return phone.matches('[0-9]{10,15}');
    }
    
    // Verifica se é o dono da barbearia
    function isBarbershopOwner(barbershopId) {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/barbershops/$(barbershopId)) &&
             get(/databases/$(database)/documents/barbershops/$(barbershopId)).data.ownerId == request.auth.uid;
    }
    
    // Verifica se é funcionário da barbearia
    function isBarbershopEmployee(barbershopId) {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/barbershops/$(barbershopId)/employees/$(request.auth.uid));
    }
    
    // Verifica se tem acesso à barbearia (dono ou funcionário)
    function hasBarbershopAccess(barbershopId) {
      return isBarbershopOwner(barbershopId) || isBarbershopEmployee(barbershopId);
    }
    
    // ========================================
    // USERS COLLECTION
    // ========================================
    
    match /users/{userId} {
      // Usuário pode ler e escrever seus próprios dados
      allow read: if isOwner(userId);
      allow create: if isOwner(userId) && 
                       request.resource.data.keys().hasAll(['email', 'createdAt']) &&
                       isValidEmail(request.resource.data.email);
      allow update: if isOwner(userId) &&
                       !request.resource.data.diff(resource.data).affectedKeys().hasAny(['createdAt', 'uid']);
      allow delete: if isOwner(userId);
      
      // Subcoleção privada do usuário
      match /private/{document} {
        allow read, write: if isOwner(userId);
      }
    }
    
    // ========================================
    // BARBERSHOPS COLLECTION
    // ========================================
    
    match /barbershops/{barbershopId} {
      // Qualquer um pode ler informações públicas da barbearia
      allow read: if true;
      
      // Apenas autenticados podem criar barbearia
      allow create: if isAuthenticated() &&
                       request.resource.data.ownerId == request.auth.uid &&
                       request.resource.data.keys().hasAll(['name', 'ownerId', 'createdAt']);
      
      // Apenas o dono pode atualizar
      allow update: if isBarbershopOwner(barbershopId) &&
                       !request.resource.data.diff(resource.data).affectedKeys().hasAny(['ownerId', 'createdAt']);
      
      // Apenas o dono pode deletar
      allow delete: if isBarbershopOwner(barbershopId);
      
      // ========================================
      // APPOINTMENTS SUBCOLLECTION
      // ========================================
      
      match /appointments/{appointmentId} {
        // Qualquer um pode ler agendamentos (para tela pública)
        allow read: if true;
        
        // Qualquer um pode criar agendamento (tela pública)
        allow create: if request.resource.data.keys().hasAll([
                          'clientName', 'services', 'date', 'startTime', 
                          'duration', 'status', 'createdAt'
                        ]) &&
                        request.resource.data.status == 'Pendente';
        
        // Apenas dono/funcionário pode atualizar
        allow update: if hasBarbershopAccess(barbershopId);
        
        // Apenas dono/funcionário pode deletar
        allow delete: if hasBarbershopAccess(barbershopId);
      }
      
      // ========================================
      // CLIENTS SUBCOLLECTION
      // ========================================
      
      match /clients/{clientId} {
        // Apenas dono/funcionário pode acessar
        allow read: if hasBarbershopAccess(barbershopId);
        allow write: if hasBarbershopAccess(barbershopId) &&
                        request.resource.data.keys().hasAll(['name', 'phone']) &&
                        isValidPhone(request.resource.data.phone);
      }
      
      // ========================================
      // SERVICES SUBCOLLECTION
      // ========================================
      
      match /services/{serviceId} {
        // Qualquer um pode ler serviços (para tela pública)
        allow read: if true;
        
        // Apenas dono/funcionário pode gerenciar
        allow write: if hasBarbershopAccess(barbershopId) &&
                        request.resource.data.keys().hasAll(['name', 'price', 'duration']);
      }
      
      // ========================================
      // TRANSACTIONS SUBCOLLECTION
      // ========================================
      
      match /transactions/{transactionId} {
        // Apenas dono/funcionário pode acessar
        allow read: if hasBarbershopAccess(barbershopId);
        allow create: if hasBarbershopAccess(barbershopId) &&
                         request.resource.data.keys().hasAll(['type', 'amount', 'date']);
        allow update, delete: if isBarbershopOwner(barbershopId);
      }
      
      // ========================================
      // EMPLOYEES SUBCOLLECTION
      // ========================================
      
      match /employees/{employeeId} {
        // Funcionários podem ler lista de colegas
        allow read: if hasBarbershopAccess(barbershopId);
        
        // Apenas dono pode gerenciar funcionários
        allow write: if isBarbershopOwner(barbershopId);
      }
      
      // ========================================
      // SETTINGS SUBCOLLECTION (PRIVADA)
      // ========================================
      
      match /settings/{document} {
        allow read, write: if isBarbershopOwner(barbershopId);
      }
    }
    
    // ========================================
    // DENY ALL OTHER PATHS
    // ========================================
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

### 1.3 Criar Validações com Zod

**Arquivo:** `src/lib/validations.ts`

```typescript
import { z } from 'zod';

// ========================================
// SCHEMAS DE VALIDAÇÃO
// ========================================

export const emailSchema = z
  .string()
  .email('Email inválido')
  .min(5, 'Email muito curto')
  .max(100, 'Email muito longo');

export const passwordSchema = z
  .string()
  .min(6, 'Senha deve ter no mínimo 6 caracteres')
  .max(100, 'Senha muito longa');

export const phoneSchema = z
  .string()
  .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone inválido. Use (XX) XXXXX-XXXX');

export const cpfSchema = z
  .string()
  .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido. Use XXX.XXX.XXX-XX');

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida. Use YYYY-MM-DD');

export const timeSchema = z
  .string()
  .regex(/^\d{2}:\d{2}$/, 'Horário inválido. Use HH:MM');

// ========================================
// SCHEMAS DE ENTIDADES
// ========================================

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  name: z.string().min(3, 'Nome muito curto').max(100, 'Nome muito longo'),
  phone: phoneSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export const appointmentSchema = z.object({
  clientName: z.string().min(3, 'Nome muito curto').max(100, 'Nome muito longo'),
  services: z.array(z.string()).min(1, 'Selecione pelo menos um serviço'),
  date: dateSchema,
  startTime: timeSchema,
  duration: z.number().positive('Duração deve ser positiva'),
  status: z.enum(['Pendente', 'Confirmado', 'Cancelado', 'Concluído']),
  phone: phoneSchema.optional(),
  notes: z.string().max(500, 'Notas muito longas').optional(),
  price: z.number().positive('Preço deve ser positivo').optional(),
  barberName: z.string().optional(),
});

export const clientSchema = z.object({
  name: z.string().min(3, 'Nome muito curto').max(100, 'Nome muito longo'),
  phone: phoneSchema,
  email: emailSchema.optional(),
  notes: z.string().max(500, 'Notas muito longas').optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(3, 'Nome muito curto').max(100, 'Nome muito longo'),
  price: z.number().positive('Preço deve ser positivo'),
  duration: z.number().positive('Duração deve ser positiva'),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  description: z.string().min(3, 'Descrição muito curta').max(200, 'Descrição muito longa'),
  category: z.string().min(3, 'Categoria muito curta').max(100, 'Categoria muito longa'),
  amount: z.number().positive('Valor deve ser positivo'),
  date: dateSchema,
  time: timeSchema,
  paymentMethod: z.string(),
});

export const barbershopSchema = z.object({
  name: z.string().min(3, 'Nome muito curto').max(100, 'Nome muito longo'),
  phone: phoneSchema,
  email: emailSchema.optional(),
  address: z.string().min(10, 'Endereço muito curto').max(200, 'Endereço muito longo').optional(),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  instagram: z.string().url('URL do Instagram inválida').optional().or(z.literal('')),
  facebook: z.string().url('URL do Facebook inválida').optional().or(z.literal('')),
  website: z.string().url('URL do site inválida').optional().or(z.literal('')),
});

// ========================================
// TIPOS TYPESCRIPT INFERIDOS
// ========================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;
export type BarbershopInput = z.infer<typeof barbershopSchema>;

// ========================================
// FUNÇÕES UTILITÁRIAS
// ========================================

export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      };
    }
    return {
      success: false,
      errors: ['Erro desconhecido na validação']
    };
  }
}

export function formatValidationErrors(error: z.ZodError): Record<string, string> {
  return error.errors.reduce((acc, err) => {
    const path = err.path.join('.');
    acc[path] = err.message;
    return acc;
  }, {} as Record<string, string>);
}
```

---

### 1.4 Configurar Firebase App Check

**Arquivo:** `src/lib/firebase-app-check.ts`

```typescript
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { app } from "../firebase";

// Apenas em produção
if (import.meta.env.PROD && import.meta.env.VITE_FIREBASE_APP_CHECK_KEY) {
  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(import.meta.env.VITE_FIREBASE_APP_CHECK_KEY),
    isTokenAutoRefreshEnabled: true,
  });
  
  console.log('Firebase App Check initialized');
}

// Em desenvolvimento, use o debug token
if (import.meta.env.DEV) {
  // @ts-ignore
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN;
}
```

---

## 📋 FASE 2: ARQUITETURA (3-5 dias)

### 2.1 Estrutura de Pastas Proposta

```
src/
├── assets/              # Imagens, fontes, etc
├── components/          # Componentes reutilizáveis
│   ├── common/         # Componentes básicos (Button, Input, etc)
│   ├── forms/          # Componentes de formulário
│   └── layout/         # Componentes de layout
├── features/           # Features organizadas por domínio
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   ├── appointments/
│   ├── clients/
│   ├── financial/
│   └── settings/
├── hooks/              # Custom hooks globais
├── lib/                # Configurações e utilitários
│   ├── firebase.ts
│   ├── validations.ts
│   └── utils.ts
├── pages/              # Páginas da aplicação
├── services/           # Camada de serviços
├── store/              # Gerenciamento de estado
├── types/              # Tipos TypeScript globais
└── App.tsx
```

### 2.2 Criar Camada de Serviços

**Arquivo:** `src/services/base.service.ts`

```typescript
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
  limit,
  DocumentData,
  QueryConstraint,
  WithFieldValue,
  DocumentReference,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export class BaseService<T extends DocumentData> {
  constructor(protected collectionName: string) {}

  protected getCollectionRef() {
    return collection(db, this.collectionName);
  }

  protected getDocRef(id: string) {
    return doc(db, this.collectionName, id);
  }

  async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const q = query(this.getCollectionRef(), ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as T));
    } catch (error) {
      console.error(`Error getting ${this.collectionName}:`, error);
      throw new Error(`Falha ao buscar ${this.collectionName}`);
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const docRef = this.getDocRef(id);
      const snapshot = await getDoc(docRef);
      
      if (!snapshot.exists()) {
        return null;
      }
      
      return {
        id: snapshot.id,
        ...snapshot.data()
      } as T;
    } catch (error) {
      console.error(`Error getting ${this.collectionName} by id:`, error);
      throw new Error(`Falha ao buscar ${this.collectionName}`);
    }
  }

  async create(data: WithFieldValue<Omit<T, 'id'>>): Promise<string> {
    try {
      const docRef = await addDoc(this.getCollectionRef(), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error);
      throw new Error(`Falha ao criar ${this.collectionName}`);
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = this.getDocRef(id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error);
      throw new Error(`Falha ao atualizar ${this.collectionName}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = this.getDocRef(id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      throw new Error(`Falha ao deletar ${this.collectionName}`);
    }
  }
}
```

**Arquivo:** `src/services/appointment.service.ts`

```typescript
import { where, orderBy, Timestamp } from 'firebase/firestore';
import { BaseService } from './base.service';
import { Appointment, AppointmentStatus } from '../types';

class AppointmentService extends BaseService<Appointment> {
  constructor() {
    super('appointments');
  }

  async getByDate(date: string): Promise<Appointment[]> {
    return this.getAll([
      where('date', '==', date),
      orderBy('startTime', 'asc')
    ]);
  }

  async getByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
    return this.getAll([
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'asc'),
      orderBy('startTime', 'asc')
    ]);
  }

  async getByStatus(status: AppointmentStatus): Promise<Appointment[]> {
    return this.getAll([
      where('status', '==', status),
      orderBy('date', 'desc'),
      orderBy('startTime', 'desc')
    ]);
  }

  async getUpcoming(limitCount: number = 10): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getAll([
      where('date', '>=', today),
      where('status', 'in', [AppointmentStatus.Confirmed, AppointmentStatus.Pending]),
      orderBy('date', 'asc'),
      orderBy('startTime', 'asc'),
      limit(limitCount)
    ]);
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<void> {
    return this.update(id, { status } as Partial<Appointment>);
  }
}

export const appointmentService = new AppointmentService();
```

---

## Continue com as outras fases...

Este documento será extenso demais para um único arquivo. Vou criar arquivos separados para cada fase.
