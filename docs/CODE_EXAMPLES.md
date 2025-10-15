# 🎨 Exemplos de Código Refatorado - AgendaBarber

## 📋 Índice
1. [Custom Hooks](#custom-hooks)
2. [Componentes Otimizados](#componentes-otimizados)
3. [Gerenciamento de Estado](#gerenciamento-de-estado)
4. [Tratamento de Erros](#tratamento-de-erros)
5. [Testes](#testes)

---

## 🎣 CUSTOM HOOKS

### `src/hooks/useAuth.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { LoginInput, RegisterInput, validateData, loginSchema, registerSchema } from '../lib/validations';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (data: LoginInput) => Promise<void>;
  signUp: (data: RegisterInput) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthError = useCallback((err: any) => {
    console.error('Auth error:', err);
    
    switch (err.code) {
      case 'auth/unauthorized-domain':
        return 'Domínio não autorizado. Configure no Firebase Console.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Email ou senha inválidos.';
      case 'auth/email-already-in-use':
        return 'Este email já está em uso.';
      case 'auth/weak-password':
        return 'Senha muito fraca. Use pelo menos 6 caracteres.';
      case 'auth/network-request-failed':
        return 'Erro de conexão. Verifique sua internet.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde.';
      default:
        return 'Ocorreu um erro. Tente novamente.';
    }
  }, []);

  const signIn = useCallback(async (data: LoginInput) => {
    setLoading(true);
    setError(null);

    // Validar dados
    const validation = validateData(loginSchema, data);
    if (!validation.success) {
      setError(validation.errors?.[0] || 'Dados inválidos');
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (err) {
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  const signUp = useCallback(async (data: RegisterInput) => {
    setLoading(true);
    setError(null);

    // Validar dados
    const validation = validateData(registerSchema, data);
    if (!validation.success) {
      setError(validation.errors?.[0] || 'Dados inválidos');
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
    } catch (err) {
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      setError(handleAuthError(err));
      setLoading(false);
    }
  }, [handleAuthError]);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await firebaseSignOut(auth);
    } catch (err) {
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    clearError
  };
}
```

---

### `src/hooks/useAppointments.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';
import { appointmentService } from '../services/appointment.service';
import { Appointment, AppointmentStatus } from '../types';
import { AppointmentInput, validateData, appointmentSchema } from '../lib/validations';

interface UseAppointmentsOptions {
  date?: string;
  status?: AppointmentStatus;
  autoFetch?: boolean;
}

interface UseAppointmentsReturn {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<void>;
  createAppointment: (data: AppointmentInput) => Promise<string | null>;
  updateAppointment: (id: string, data: Partial<AppointmentInput>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  updateStatus: (id: string, status: AppointmentStatus) => Promise<void>;
}

export function useAppointments(options: UseAppointmentsOptions = {}): UseAppointmentsReturn {
  const { date, status, autoFetch = true } = options;
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let data: Appointment[];

      if (date) {
        data = await appointmentService.getByDate(date);
      } else if (status) {
        data = await appointmentService.getByStatus(status);
      } else {
        data = await appointmentService.getAll();
      }

      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar agendamentos');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [date, status]);

  useEffect(() => {
    if (autoFetch) {
      fetchAppointments();
    }
  }, [fetchAppointments, autoFetch]);

  const createAppointment = useCallback(async (data: AppointmentInput): Promise<string | null> => {
    setLoading(true);
    setError(null);

    // Validar dados
    const validation = validateData(appointmentSchema, data);
    if (!validation.success) {
      setError(validation.errors?.[0] || 'Dados inválidos');
      setLoading(false);
      return null;
    }

    try {
      const id = await appointmentService.create(validation.data!);
      await fetchAppointments(); // Recarregar lista
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar agendamento');
      console.error('Error creating appointment:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchAppointments]);

  const updateAppointment = useCallback(async (id: string, data: Partial<AppointmentInput>) => {
    setLoading(true);
    setError(null);

    try {
      await appointmentService.update(id, data as Partial<Appointment>);
      await fetchAppointments(); // Recarregar lista
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar agendamento');
      console.error('Error updating appointment:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchAppointments]);

  const deleteAppointment = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await appointmentService.delete(id);
      await fetchAppointments(); // Recarregar lista
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar agendamento');
      console.error('Error deleting appointment:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchAppointments]);

  const updateStatus = useCallback(async (id: string, status: AppointmentStatus) => {
    setLoading(true);
    setError(null);

    try {
      await appointmentService.updateStatus(id, status);
      await fetchAppointments(); // Recarregar lista
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
      console.error('Error updating status:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchAppointments]);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    updateStatus
  };
}
```

---

### `src/hooks/useForm.ts`

```typescript
import { useState, useCallback, ChangeEvent } from 'react';
import { z } from 'zod';
import { formatValidationErrors } from '../lib/validations';

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: z.ZodSchema<T>;
  onSubmit: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  resetForm: () => void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setValues(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validar campo individual se schema existir
    if (validationSchema) {
      try {
        validationSchema.parse(values);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors = formatValidationErrors(error);
          if (fieldErrors[name]) {
            setErrors(prev => ({
              ...prev,
              [name]: fieldErrors[name]
            }));
          }
        }
      }
    }
  }, [values, validationSchema]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Marcar todos os campos como touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    // Validar todos os campos
    if (validationSchema) {
      try {
        validationSchema.parse(values);
        setErrors({});
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors(formatValidationErrors(error));
          setIsSubmitting(false);
          return;
        }
      }
    }

    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validationSchema, onSubmit]);

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field as string]: error
    }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm
  };
}
```

---

## 🎨 COMPONENTES OTIMIZADOS

### `src/features/auth/components/LoginForm.tsx`

```typescript
import React, { memo } from 'react';
import { useForm } from '../../../hooks/useForm';
import { LoginInput, loginSchema } from '../../../lib/validations';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Alert } from '../../../components/common/Alert';

interface LoginFormProps {
  onSubmit: (data: LoginInput) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export const LoginForm = memo<LoginFormProps>(({ onSubmit, loading, error }) => {
  const form = useForm<LoginInput>({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginSchema,
    onSubmit
  });

  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}

      <Input
        label="Email"
        type="email"
        name="email"
        value={form.values.email}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.touched.email ? form.errors.email : undefined}
        placeholder="seu@email.com"
        autoComplete="email"
        required
      />

      <Input
        label="Senha"
        type="password"
        name="password"
        value={form.values.password}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.touched.password ? form.errors.password : undefined}
        placeholder="••••••"
        autoComplete="current-password"
        required
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading || form.isSubmitting}
        disabled={!form.isValid}
      >
        Entrar
      </Button>
    </form>
  );
});

LoginForm.displayName = 'LoginForm';
```

---

### `src/components/common/Input.tsx`

```typescript
import React, { forwardRef, InputHTMLAttributes, memo } from 'react';
import { clsx } from 'clsx';
import { Icon } from './Icon';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  fullWidth?: boolean;
}

export const Input = memo(forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    id,
    ...props
  }, ref) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s/g, '-')}`;

    return (
      <div className={clsx('space-y-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-400"
          >
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name={leftIcon} className="w-5 h-5" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full bg-slate-700/50 border rounded-lg px-3 py-2',
              'text-slate-100 placeholder:text-slate-500',
              'focus:outline-none focus:ring-2 transition-all',
              error
                ? 'border-red-500 focus:ring-red-500/50'
                : 'border-slate-600 focus:ring-violet-500',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              props.disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name={rightIcon} className="w-5 h-5" />
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-400 flex items-center gap-1"
            role="alert"
          >
            <Icon name="x" className="w-4 h-4" />
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-slate-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
));

Input.displayName = 'Input';
```

---

### `src/components/common/Button.tsx`

```typescript
import React, { ButtonHTMLAttributes, forwardRef, memo } from 'react';
import { clsx } from 'clsx';
import { Icon } from './Icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
}

export const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    leftIcon,
    rightIcon,
    className,
    disabled,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center gap-2',
          'font-semibold rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900',
          
          // Variants
          {
            'bg-violet-600 text-white hover:bg-violet-700 focus:ring-violet-500 shadow-lg shadow-violet-600/20':
              variant === 'primary',
            'bg-slate-700 text-slate-100 hover:bg-slate-600 focus:ring-slate-500':
              variant === 'secondary',
            'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg shadow-red-600/20':
              variant === 'danger',
            'bg-transparent text-slate-300 hover:bg-slate-800 focus:ring-slate-500':
              variant === 'ghost',
          },
          
          // Sizes
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          
          // States
          fullWidth && 'w-full',
          isDisabled && 'opacity-50 cursor-not-allowed',
          loading && 'relative',
          
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <span className={clsx('flex items-center gap-2', loading && 'invisible')}>
          {leftIcon && <Icon name={leftIcon} className="w-5 h-5" />}
          {children}
          {rightIcon && <Icon name={rightIcon} className="w-5 h-5" />}
        </span>
      </button>
    );
  }
));

Button.displayName = 'Button';
```

---

## 🗄️ GERENCIAMENTO DE ESTADO

### `src/store/auth.store.ts` (usando Zustand)

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        loading: false 
      }),
      
      setLoading: (loading) => set({ loading }),
      
      clearAuth: () => set({ 
        user: null, 
        isAuthenticated: false, 
        loading: false 
      }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
```

---

## 🚨 TRATAMENTO DE ERROS

### `src/components/ErrorBoundary.tsx`

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Icon } from './common/Icon';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log error to external service (Sentry, LogRocket, etc)
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
          <Card className="max-w-md w-full text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <Icon name="x" className="w-8 h-8 text-red-400" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-100 mb-2">
                  Algo deu errado
                </h2>
                <p className="text-slate-400">
                  Desculpe, ocorreu um erro inesperado. Por favor, tente novamente.
                </p>
              </div>

              {import.meta.env.DEV && this.state.error && (
                <details className="w-full text-left">
                  <summary className="text-sm text-slate-400 cursor-pointer mb-2">
                    Detalhes do erro (modo desenvolvimento)
                  </summary>
                  <pre className="text-xs text-red-400 bg-slate-800 p-3 rounded overflow-auto max-h-40">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}

              <div className="flex gap-3 w-full">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => window.location.href = '/'}
                >
                  Voltar ao início
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={this.handleReset}
                >
                  Tentar novamente
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## ✅ TESTES

### `src/hooks/__tests__/useAuth.test.ts`

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../useAuth';
import * as firebaseAuth from 'firebase/auth';

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should sign in successfully', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    vi.mocked(firebaseAuth.signInWithEmailAndPassword).mockResolvedValue({
      user: mockUser
    } as any);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle sign in error', async () => {
    const error = { code: 'auth/invalid-credential' };
    vi.mocked(firebaseAuth.signInWithEmailAndPassword).mockRejectedValue(error);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Email ou senha inválidos.');
      expect(result.current.loading).toBe(false);
    });
  });

  it('should validate email format', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn({
        email: 'invalid-email',
        password: 'password123'
      });
    });

    await waitFor(() => {
      expect(result.current.error).toContain('Email inválido');
    });
  });
});
```

---

### `src/components/__tests__/Button.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../common/Button';

describe('Button', () => {
  it('should render children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should show loading state', () => {
    render(<Button loading>Click me</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should apply correct variant classes', () => {
    const { rerender } = render(<Button variant="primary">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-violet-600');

    rerender(<Button variant="danger">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');
  });

  it('should render icons', () => {
    render(
      <Button leftIcon="check" rightIcon="arrow-right">
        With Icons
      </Button>
    );
    
    const icons = screen.getAllByRole('img', { hidden: true });
    expect(icons).toHaveLength(2);
  });
});
```

---

Este arquivo demonstra os principais padrões de refatoração recomendados. Cada seção pode ser expandida conforme necessário durante a implementação.
