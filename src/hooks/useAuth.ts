/**
 * useAuth - Hook personalizado para autenticação
 * 
 * Encapsula toda a lógica de autenticação do Firebase:
 * - login: Login com email e senha
 * - loginWithGoogle: Login com Google
 * - register: Registro de novo usuário
 * - logout: Logout do sistema
 * - resetPassword: Reset de senha por email
 * 
 * Usa o AuthStore (Zustand) para gerenciar estado global.
 */

import { useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '@/firebase';
import { useAuthStore } from '@/store/auth.store';
import { loginSchema, registerSchema } from '@/lib/validations';
import type { z } from 'zod';

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export function useAuth() {
  const { user, loading, error, setLoading, setError, clearError, logout: logoutStore } = useAuthStore();

  /**
   * Login com email e senha
   */
  const login = useCallback(async (data: LoginData) => {
    try {
      setLoading(true);
      clearError();

      // Valida dados antes de enviar
      const validated = loginSchema.parse(data);

      await signInWithEmailAndPassword(
        auth,
        validated.email,
        validated.password
      );

      // O user será atualizado automaticamente pelo listener no App.tsx
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw err;
    }
  }, [setLoading, setError, clearError]);

  /**
   * Login com Google (redirect)
   */
  const loginWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      clearError();

      await signInWithRedirect(auth, googleProvider);
      
      // O redirect vai acontecer e o user será detectado no retorno
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw err;
    }
  }, [setLoading, setError, clearError]);

  /**
   * Registro de novo usuário
   */
  const register = useCallback(async (data: RegisterData) => {
    try {
      setLoading(true);
      clearError();

      // Valida dados antes de enviar
      const validated = registerSchema.parse(data);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        validated.email,
        validated.password
      );

      // Atualiza nome do usuário
      if (userCredential.user && validated.name) {
        await updateProfile(userCredential.user, {
          displayName: validated.name,
        });
      }

      // O user será atualizado automaticamente pelo listener no App.tsx
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw err;
    }
  }, [setLoading, setError, clearError]);

  /**
   * Logout do sistema
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      clearError();

      await signOut(auth);
      logoutStore();

      // Recarrega a página para limpar todo o estado
      window.location.reload();
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw err;
    }
  }, [setLoading, setError, clearError, logoutStore]);

  /**
   * Reset de senha por email
   */
  const resetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      clearError();

      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, clearError]);

  return {
    // Estado
    user,
    loading,
    error,
    isAuthenticated: !!user,

    // Ações
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    clearError,
  };
}

/**
 * Traduz códigos de erro do Firebase para mensagens em português
 */
function getErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/email-already-in-use': 'Este email já está em uso',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres',
    'auth/invalid-email': 'Email inválido',
    'auth/operation-not-allowed': 'Operação não permitida',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
    'auth/user-disabled': 'Usuário desativado',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
    'auth/popup-closed-by-user': 'Login cancelado pelo usuário',
    'auth/app-not-authorized': 'Aplicação não autorizada. Verifique as configurações do Firebase',
    'auth/argument-error': 'Erro na validação dos dados. Tente novamente.',
  };

  // Se for um código não mapeado, tenta extrair a mensagem
  if (code && !errorMessages[code]) {
    // Remove prefixo 'auth/' e formata
    const cleanCode = code.replace('auth/', '');
    console.error('Erro não mapeado do Firebase:', code);
  }

  return errorMessages[code] || 'Erro ao realizar operação. Tente novamente.';
}
