'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import type { FinancialItem, Category } from '@/types';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types';
import { formatCurrency } from '@/lib/utils/currency';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FinancialChartsProps {
  items: FinancialItem[];
}

const COLORS = {
  income: 'hsl(var(--positive))',
  expense: 'hsl(var(--negative))',
};

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function FinancialCharts({ items }: FinancialChartsProps) {
  // Gráfico de despesas por categoria
  const expensesByCategory = useMemo(() => {
    const expenses = items.filter(item => item.type === 'expense');
    const grouped = expenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {} as Record<Category, number>);

    return Object.entries(grouped)
      .map(([category, amount]) => ({
        category: CATEGORY_LABELS[category as Category],
        icon: CATEGORY_ICONS[category as Category],
        amount,
        value: amount,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [items]);

  // Gráfico de receitas por categoria
  const incomeByCategory = useMemo(() => {
    const incomes = items.filter(item => item.type === 'income');
    const grouped = incomes.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {} as Record<Category, number>);

    return Object.entries(grouped)
      .map(([category, amount]) => ({
        category: CATEGORY_LABELS[category as Category],
        icon: CATEGORY_ICONS[category as Category],
        amount,
        value: amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [items]);

  // Dados mensais
  const monthlyData = useMemo(() => {
    const last6Months = eachMonthOfInterval({
      start: startOfMonth(subMonths(new Date(), 5)),
      end: endOfMonth(new Date()),
    });

    return last6Months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthItems = items.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= monthStart && itemDate <= monthEnd;
      });

      const income = monthItems
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);
      
      const expense = monthItems
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);

      return {
        month: format(month, 'MMM', { locale: ptBR }),
        Receitas: income,
        Despesas: expense,
        Saldo: income - expense,
      };
    });
  }, [items]);

  const chartConfig = {
    Receitas: {
      label: 'Receitas',
      color: COLORS.income,
    },
    Despesas: {
      label: 'Despesas',
      color: COLORS.expense,
    },
    Saldo: {
      label: 'Saldo',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 mt-8">
      {/* Gráfico de linha - Tendência mensal */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência Mensal</CardTitle>
          <CardDescription>Receitas e despesas dos últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value) => formatCurrency(Number(value))}
                  />} 
                />
                <Line
                  type="monotone"
                  dataKey="Receitas"
                  stroke={COLORS.income}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Despesas"
                  stroke={COLORS.expense}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico de barras - Despesas por categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
          <CardDescription>Top 5 categorias de despesas</CardDescription>
        </CardHeader>
        <CardContent>
          {expensesByCategory.length > 0 ? (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expensesByCategory}>
                  <XAxis dataKey="category" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value) => formatCurrency(Number(value))}
                    />} 
                  />
                  <Bar dataKey="amount" fill={COLORS.expense} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              Nenhuma despesa registrada
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de pizza - Receitas por categoria */}
      {incomeByCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Receitas por Categoria</CardTitle>
            <CardDescription>Distribuição das receitas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percent, value }) => 
                      `${category}: ${formatCurrency(Number(value))} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomeByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value) => formatCurrency(Number(value))}
                    />} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

