export type ItemType = 'income' | 'expense';

export type Category = 
  | 'salary' 
  | 'freelance' 
  | 'investment' 
  | 'other_income'
  | 'housing' 
  | 'food' 
  | 'transport' 
  | 'health' 
  | 'education' 
  | 'entertainment' 
  | 'shopping' 
  | 'bills' 
  | 'other_expense';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface FinancialItem {
  id: string;
  name: string;
  amount: number;
  type: ItemType;
  category: Category;
  date: Date | string;
  description?: string;
  tags?: string[];
  recurrence?: RecurrenceType;
  userId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Budget {
  id: string;
  name: string;
  category: Category;
  amount: number;
  period: 'monthly' | 'yearly';
  userId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface FinancialStats {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  incomeByCategory: Record<Category, number>;
  expensesByCategory: Record<Category, number>;
  monthlyData: MonthlyData[];
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export const INCOME_CATEGORIES: Category[] = [
  'salary',
  'freelance',
  'investment',
  'other_income'
];

export const EXPENSE_CATEGORIES: Category[] = [
  'housing',
  'food',
  'transport',
  'health',
  'education',
  'entertainment',
  'shopping',
  'bills',
  'other_expense'
];

export const CATEGORY_LABELS: Record<Category, string> = {
  salary: 'Salário',
  freelance: 'Freelance',
  investment: 'Investimentos',
  other_income: 'Outras Receitas',
  housing: 'Moradia',
  food: 'Alimentação',
  transport: 'Transporte',
  health: 'Saúde',
  education: 'Educação',
  entertainment: 'Entretenimento',
  shopping: 'Compras',
  bills: 'Contas',
  other_expense: 'Outras Despesas'
};

export const CATEGORY_ICONS: Record<Category, string> = {
  salary: '💼',
  freelance: '💻',
  investment: '📈',
  other_income: '💰',
  housing: '🏠',
  food: '🍔',
  transport: '🚗',
  health: '🏥',
  education: '📚',
  entertainment: '🎬',
  shopping: '🛍️',
  bills: '📄',
  other_expense: '💸'
};

