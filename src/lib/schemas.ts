import { z } from 'zod';
import type { Category, RecurrenceType } from '@/types';

export const financialItemSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório." }).max(100, { message: "Nome deve ter no máximo 100 caracteres." }),
  amount: z.coerce.number().positive({ message: "Valor deve ser um número positivo." }),
  type: z.enum(['income', 'expense'], { required_error: "Tipo é obrigatório." }),
  category: z.enum([
    'salary', 'freelance', 'investment', 'other_income',
    'housing', 'food', 'transport', 'health', 'education',
    'entertainment', 'shopping', 'bills', 'other_expense'
  ], { required_error: "Categoria é obrigatória." }),
  date: z.coerce.date({ required_error: "Data é obrigatória." }),
  description: z.string().max(500, { message: "Descrição deve ter no máximo 500 caracteres." }).optional(),
  tags: z.array(z.string()).optional(),
  recurrence: z.enum(['none', 'daily', 'weekly', 'monthly', 'yearly']).optional().default('none'),
});

export const budgetSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório." }).max(100, { message: "Nome deve ter no máximo 100 caracteres." }),
  category: z.enum([
    'salary', 'freelance', 'investment', 'other_income',
    'housing', 'food', 'transport', 'health', 'education',
    'entertainment', 'shopping', 'bills', 'other_expense'
  ], { required_error: "Categoria é obrigatória." }),
  amount: z.coerce.number().positive({ message: "Valor deve ser um número positivo." }),
  period: z.enum(['monthly', 'yearly'], { required_error: "Período é obrigatório." }),
});

export type FinancialItemFormData = z.infer<typeof financialItemSchema>;
export type BudgetFormData = z.infer<typeof budgetSchema>;
