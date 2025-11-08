'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Filter, X, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { Category, ItemType } from '@/types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types';
import { DateRange } from 'react-day-picker';

interface FinancialFiltersProps {
  onFilterChange: (filters: {
    type?: ItemType;
    category?: Category;
    search?: string;
    startDate?: Date;
    endDate?: Date;
  }) => void;
}

export default function FinancialFilters({ onFilterChange }: FinancialFiltersProps) {
  const [type, setType] = useState<ItemType | 'all'>('all');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const applyFilters = () => {
    onFilterChange({
      type: type === 'all' ? undefined : type,
      category: category === 'all' ? undefined : category,
      search: search || undefined,
      startDate: dateRange?.from,
      endDate: dateRange?.to,
    });
  };

  const handleClearFilters = () => {
    setType('all');
    setCategory('all');
    setSearch('');
    setDateRange(undefined);
    setTimeout(() => {
      onFilterChange({});
    }, 0);
  };

  const categories = type === 'income' 
    ? INCOME_CATEGORIES 
    : type === 'expense' 
    ? EXPENSE_CATEGORIES 
    : [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          {/* Busca */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Buscar</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                placeholder="Nome, descrição..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                onBlur={applyFilters}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    applyFilters();
                  }
                }}
                className="pl-8"
              />
            </div>
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo</label>
            <Select
              value={type}
              onValueChange={(value) => {
                const newType = value as ItemType | 'all';
                setType(newType);
                setCategory('all');
                setTimeout(() => {
                  onFilterChange({
                    type: newType === 'all' ? undefined : newType,
                    category: undefined,
                    search: search || undefined,
                    startDate: dateRange?.from,
                    endDate: dateRange?.to,
                  });
                }, 0);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
                <SelectItem value="expense">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <Select
              value={category}
              onValueChange={(value) => {
                const newCategory = value as Category | 'all';
                setCategory(newCategory);
                const newType = type === 'all' ? undefined : type as ItemType | undefined;
                setTimeout(() => {
                  onFilterChange({
                    type: newType,
                    category: newCategory === 'all' ? undefined : newCategory,
                    search: search || undefined,
                    startDate: dateRange?.from,
                    endDate: dateRange?.to,
                  });
                }, 0);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <span className="flex items-center gap-2">
                      <span>{CATEGORY_ICONS[cat]}</span>
                      <span>{CATEGORY_LABELS[cat]}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Período */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                    )
                  ) : (
                    <span>Selecione o período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range);
                    if (range?.from && range?.to) {
                      setTimeout(() => {
                        applyFilters();
                      }, 0);
                    }
                  }}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Botão limpar filtros */}
        {(type !== 'all' || category !== 'all' || search || dateRange) && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={handleClearFilters}>
              <X className="mr-2 h-4 w-4" />
              Limpar Filtros
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

