import type { FinancialItem, ItemType } from '@/types';
import type { FinancialItemFormData } from '@/lib/schemas';
import FinancialItemForm from './FinancialItemForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface FinancialItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: ItemType;
  onSubmit: (data: FinancialItemFormData) => void;
  itemToEdit?: FinancialItem;
}

export default function FinancialItemModal({
  isOpen,
  onClose,
  itemType,
  onSubmit,
  itemToEdit,
}: FinancialItemModalProps) {
  const title = `${itemToEdit ? 'Editar' : 'Adicionar Nova'} ${itemType === 'income' ? 'Receita' : 'Despesa'}`;
  const description = `Preencha os detalhes da sua ${itemType === 'income' ? 'receita' : 'despesa'}. Clique em salvar quando terminar.`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>
        <FinancialItemForm
          itemType={itemType}
          onSubmit={async (data) => {
            await onSubmit(data);
          }}
          defaultValues={itemToEdit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
