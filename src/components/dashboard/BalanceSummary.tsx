import type { FinancialItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

interface BalanceSummaryProps {
  incomes: FinancialItem[];
  expenses: FinancialItem[];
}

export default function BalanceSummary({ incomes, expenses }: BalanceSummaryProps) {
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="grid gap-4 md:grid-cols-3 my-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total de Receitas</CardTitle>
          <TrendingUp className="h-5 w-5 text-positive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-positive">{formatCurrency(totalIncome)}</div>
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total de Despesas</CardTitle>
          <TrendingDown className="h-5 w-5 text-negative" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-negative">{formatCurrency(totalExpenses)}</div>
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
          <Scale className={`h-5 w-5 ${netBalance >= 0 ? 'text-positive' : 'text-negative'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-positive' : 'text-negative'}`}>
            {formatCurrency(netBalance)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {netBalance >= 0 ? "Saldo positivo!" : "Saldo negativo."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
