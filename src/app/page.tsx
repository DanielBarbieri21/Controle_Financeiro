'use client';

import { useState, useEffect } from 'react';
import AppHeader from '@/components/dashboard/AppHeader';
import BalanceSummary from '@/components/dashboard/BalanceSummary';
import FinancialList from '@/components/dashboard/FinancialList';
import FinancialItemModal from '@/components/dashboard/FinancialItemModal';
import FinancialCharts from '@/components/dashboard/FinancialCharts';
import FinancialFilters from '@/components/dashboard/FinancialFilters';
import ExportButton from '@/components/dashboard/ExportButton';
import { useFinancialItems } from '@/hooks/use-financial-items';
import type { FinancialItem, ItemType, Category } from '@/types';
import type { FinancialItemFormData } from '@/lib/schemas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardPage() {
  const { items, incomes, expenses, loading, addItem, updateItem, deleteItem, updateFilters, refresh } = useFinancialItems();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItemType, setModalItemType] = useState<ItemType>('income');
  const [itemToEdit, setItemToEdit] = useState<FinancialItem | undefined>(undefined);

  // Effect to ensure client-side only rendering
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleOpenModal = (type: ItemType, item?: FinancialItem) => {
    setModalItemType(type);
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setItemToEdit(undefined);
  };

  const handleSubmitItem = async (data: FinancialItemFormData) => {
    try {
      if (itemToEdit) {
        await updateItem(itemToEdit.id, data);
      } else {
        await addItem({
          ...data,
          type: modalItemType,
        });
      }
      await refresh();
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting item:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItem(id);
      await refresh();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleFilterChange = (filters: {
    type?: ItemType;
    category?: Category;
    search?: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    updateFilters(filters);
  };

  if (!hasMounted || loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 md:px-8 py-6">
          <div className="text-center text-muted-foreground">Carregando dashboard...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 md:px-8 py-6">
        <div className="mb-6">
          <div className="flex justify-end mb-4">
            <ExportButton items={items} />
          </div>
          <BalanceSummary incomes={incomes} expenses={expenses} />
        </div>
        
        <Tabs defaultValue="transactions" className="mt-8">
          <TabsList>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
            <FinancialFilters onFilterChange={handleFilterChange} />
            
            <div className="grid md:grid-cols-2 gap-8">
              <FinancialList
                title="Receitas"
                items={incomes}
                itemType="income"
                onAddItem={() => handleOpenModal('income')}
                onEditItem={(item) => handleOpenModal('income', item)}
                onDeleteItem={handleDeleteItem}
              />
              <FinancialList
                title="Despesas"
                items={expenses}
                itemType="expense"
                onAddItem={() => handleOpenModal('expense')}
                onEditItem={(item) => handleOpenModal('expense', item)}
                onDeleteItem={handleDeleteItem}
              />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <FinancialCharts items={items} />
          </TabsContent>
        </Tabs>
      </main>

      {isModalOpen && (
        <FinancialItemModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          itemType={modalItemType}
          onSubmit={handleSubmitItem}
          itemToEdit={itemToEdit}
        />
      )}
       <footer className="py-6 px-4 md:px-8 border-t border-border mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Controle Financeiro. Todos os direitos reservados.
          </p>
        </footer>
    </div>
  );
}
