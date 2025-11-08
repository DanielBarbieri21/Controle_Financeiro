'use client';

import { useState, useEffect, useCallback } from 'react';
import { financialService } from '@/lib/services/financialService';
import type { FinancialItem, ItemType, Category } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface Filters {
  type?: ItemType;
  category?: Category;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export function useFinancialItems(initialFilters?: Filters) {
  const [items, setItems] = useState<FinancialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<Filters>(initialFilters || {});
  const { toast } = useToast();

  const loadItems = useCallback(async (currentFilters?: Filters) => {
    try {
      setLoading(true);
      setError(null);
      const filtersToUse = currentFilters || filters;
      const data = await financialService.getAll(filtersToUse);
      setItems(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Falha ao carregar itens');
      setError(error);
      toast({
        title: 'Erro ao carregar dados',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const updateFilters = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    loadItems(newFilters);
  }, [loadItems]);

  const refresh = useCallback(async () => {
    await loadItems(filters);
  }, [loadItems, filters]);

  const addItem = useCallback(async (item: Omit<FinancialItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newItem = await financialService.create(item);
      await loadItems(filters);
      toast({
        title: 'Sucesso',
        description: 'Item adicionado com sucesso!',
      });
      return newItem;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Falha ao adicionar item');
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, filters, loadItems]);

  const updateItem = useCallback(async (id: string, updates: Partial<FinancialItem>) => {
    try {
      await financialService.update(id, updates);
      await loadItems(filters);
      toast({
        title: 'Sucesso',
        description: 'Item atualizado com sucesso!',
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Falha ao atualizar item');
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, filters, loadItems]);

  const deleteItem = useCallback(async (id: string) => {
    try {
      await financialService.delete(id);
      await loadItems(filters);
      toast({
        title: 'Sucesso',
        description: 'Item removido com sucesso!',
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Falha ao remover item');
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, filters, loadItems]);

  const incomes = items.filter(item => item.type === 'income');
  const expenses = items.filter(item => item.type === 'expense');

  return {
    items,
    incomes,
    expenses,
    loading,
    error,
    filters,
    addItem,
    updateItem,
    deleteItem,
    refresh,
    updateFilters,
  };
}

