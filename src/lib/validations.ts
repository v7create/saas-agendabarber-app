import { z } from 'zod';

// ========================================
// SCHEMAS BÁSICOS REUTILIZÁVEIS
// ========================================

export const emailSchema = z
  .string()
  .min(1, 'Email é obrigatório')
  .email('Email inválido')
  .max(100, 'Email muito longo')
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string()
  .min(6, 'Senha deve ter no mínimo 6 caracteres')
  .max(100, 'Senha muito longa');

export const phoneSchema = z
  .string()
  .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido. Use o formato: (XX) XXXXX-XXXX')
  .trim();

export const cpfSchema = z
  .string()
  .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido. Use o formato: XXX.XXX.XXX-XX')
  .trim();

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida. Use o formato: YYYY-MM-DD');

export const timeSchema = z
  .string()
  .regex(/^\d{2}:\d{2}$/, 'Horário inválido. Use o formato: HH:MM');

export const urlSchema = z
  .string()
  .url('URL inválida')
  .or(z.literal(''))
  .optional();

// ========================================
// SCHEMAS DE AUTENTICAÇÃO
// ========================================

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    name: z.string().min(3, 'Nome muito curto').max(100, 'Nome muito longo').trim(),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    phone: phoneSchema.optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

// ========================================
// SCHEMAS DE AGENDAMENTO
// ========================================

export const appointmentSchema = z.object({
  clientName: z.string().min(3, 'Nome muito curto').max(100, 'Nome muito longo').trim(),
  clientPhone: phoneSchema,
  clientEmail: emailSchema.optional().or(z.literal('')),
  service: z.string().min(1, 'Serviço é obrigatório'),
  date: dateSchema,
  time: timeSchema,
  barberName: z.string().optional(),
  notes: z.string().max(500, 'Notas muito longas').optional().or(z.literal('')),
  status: z.enum(['Pendente', 'Confirmado', 'Em Atendimento', 'Concluído', 'Cancelado', 'Não Compareceu']).default('Pendente'),
  value: z.number().min(0, 'Valor deve ser positivo').optional(),
  paymentMethod: z.enum(['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix', 'Transferência']).optional(),
});

// ========================================
// SCHEMAS DE CLIENTE
// ========================================

export const clientSchema = z.object({
  name: z.string().min(3, 'Nome muito curto').max(100, 'Nome muito longo').trim(),
  phone: phoneSchema,
  email: emailSchema.optional().or(z.literal('')),
  cpf: cpfSchema.optional().or(z.literal('')),
  birthDate: dateSchema.optional().or(z.literal('')),
  notes: z.string().max(500, 'Notas muito longas').optional().or(z.literal('')),
});

// ========================================
// SCHEMAS DE SERVIÇO
// ========================================

export const serviceSchema = z.object({
  name: z.string().min(3, 'Nome muito curto').max(100, 'Nome muito longo').trim(),
  description: z.string().max(500, 'Descrição muito longa').optional().or(z.literal('')),
  price: z.number().min(0, 'Preço deve ser positivo'),
  duration: z.number().min(5, 'Duração mínima de 5 minutos').max(480, 'Duração máxima de 8 horas'),
  active: z.boolean().default(true),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida. Use o formato: #RRGGBB').optional(),
});

// ========================================
// SCHEMAS DE TRANSAÇÃO FINANCEIRA
// ========================================

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  category: z.string().min(3, 'Categoria muito curta').max(100, 'Categoria muito longa').trim(),
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  date: dateSchema,
  description: z.string().max(500, 'Descrição muito longa').trim(),
  paymentMethod: z.enum(['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix', 'Transferência']),
  relatedAppointmentId: z.string().optional(),
});

// ========================================
// SCHEMAS DE BARBEARIA
// ========================================

export const barbershopSchema = z.object({
  name: z.string().min(3, 'Nome muito curto').max(100, 'Nome muito longo').trim(),
  phone: phoneSchema,
  email: emailSchema.optional().or(z.literal('')),
  address: z.string().min(5, 'Endereço muito curto').max(200, 'Endereço muito longo').trim(),
  city: z.string().min(2, 'Cidade muito curta').max(100, 'Cidade muito longa').trim(),
  state: z.string().length(2, 'Estado deve ter 2 caracteres (ex: SP)').toUpperCase(),
  zipCode: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido. Use o formato: XXXXX-XXX'),
  website: urlSchema,
  instagram: z.string().max(100, 'Instagram muito longo').optional().or(z.literal('')),
  logo: z.string().url('Logo deve ser uma URL válida').optional().or(z.literal('')),
});

// ========================================
// SCHEMAS DE CONFIGURAÇÕES
// ========================================

export const workingHoursSchema = z.object({
  dayOfWeek: z.number().min(0).max(6), // 0 = Domingo, 6 = Sábado
  isOpen: z.boolean(),
  openTime: timeSchema.optional(),
  closeTime: timeSchema.optional(),
});

export const settingsSchema = z.object({
  appointmentDuration: z.number().min(5).max(480),
  allowOnlineBooking: z.boolean(),
  requireEmailVerification: z.boolean(),
  sendConfirmationEmail: z.boolean(),
  sendReminderEmail: z.boolean(),
  reminderHoursBefore: z.number().min(1).max(72),
  workingHours: z.array(workingHoursSchema).length(7),
});

// ========================================
// TIPOS TYPESCRIPT INFERIDOS
// ========================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;
export type BarbershopInput = z.infer<typeof barbershopSchema>;
export type WorkingHoursInput = z.infer<typeof workingHoursSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;

// ========================================
// FUNÇÕES UTILITÁRIAS DE VALIDAÇÃO
// ========================================

/**
 * Valida dados contra um schema Zod
 * @param schema - Schema Zod para validação
 * @param data - Dados a serem validados
 * @returns Objeto com success, data validada e erros (se houver)
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
  errorList?: string[];
} {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: formatValidationErrors(error as z.ZodError<any>),
        errorList: (error as z.ZodError<any>).issues.map((err) => err.message),
      };
    }
    return {
      success: false,
      errors: { _general: 'Erro desconhecido na validação' },
      errorList: ['Erro desconhecido na validação'],
    };
  }
}

/**
 * Formata erros do Zod para um objeto mais fácil de usar
 * @param error - ZodError
 * @returns Objeto com campo -> mensagem de erro
 */
export function formatValidationErrors(error: z.ZodError<any>): Record<string, string> {
  return error.issues.reduce(
    (acc, err) => {
      const path = err.path.join('.');
      acc[path || '_general'] = err.message;
      return acc;
    },
    {} as Record<string, string>
  );
}

/**
 * Valida dados de forma síncrona e retorna booleano
 * @param schema - Schema Zod
 * @param data - Dados a validar
 * @returns true se válido, false caso contrário
 */
export function isValid<T>(schema: z.ZodSchema<T>, data: unknown): boolean {
  return schema.safeParse(data).success;
}

/**
 * Valida dados e retorna apenas os dados ou null
 * @param schema - Schema Zod
 * @param data - Dados a validar
 * @returns Dados validados ou null
 */
export function parseOrNull<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  const result = schema.safeParse(data);
  return result.success ? result.data : null;
}

// ========================================
// VALIDADORES CUSTOMIZADOS
// ========================================

/**
 * Valida se uma data está no futuro
 */
export function isFutureDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

/**
 * Valida se um horário está dentro de um intervalo
 */
export function isTimeInRange(time: string, startTime: string, endTime: string): boolean {
  return time >= startTime && time <= endTime;
}

/**
 * Valida CPF (apenas formato e dígitos verificadores)
 */
export function isValidCPF(cpf: string): boolean {
  // Remove formatação
  const cleaned = cpf.replace(/\D/g, '');

  if (cleaned.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  // Valida primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) return false;

  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(10))) return false;

  return true;
}

/**
 * Formata telefone para o padrão brasileiro
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Formata CPF para o padrão brasileiro
 */
export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }
  return cpf;
}

/**
 * Formata CEP para o padrão brasileiro
 */
export function formatZipCode(zipCode: string): string {
  const cleaned = zipCode.replace(/\D/g, '');
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  return zipCode;
}
