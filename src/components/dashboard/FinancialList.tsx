import type { FinancialItem, ItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FinancialListProps {
  title: string;
  items: FinancialItem[];
  itemType: ItemType;
  onAddItem: () => void;
  onEditItem: (item: FinancialItem) => void;
  onDeleteItem: (id: string) => void;
}

export default function FinancialList({
  title,
  items,
  itemType,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: FinancialListProps) {
  const itemColorClass = itemType === 'income' ? 'text-positive' : 'text-negative';

  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-foreground/90">{title}</CardTitle>
        <Button variant="outline" size="sm" onClick={onAddItem} className="text-primary border-primary hover:bg-primary/10">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar {itemType === 'income' ? 'Receita' : 'Despesa'}
        </Button>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-0">
        {items.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground">Nenhuma {itemType === 'income' ? 'receita' : 'despesa'} adicionada ainda.</p>
            <Button variant="link" onClick={onAddItem} className="mt-2 text-primary">
              Adicionar sua primeira {itemType === 'income' ? 'receita' : 'despesa'}
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[400px] flex-grow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">Nome</TableHead>
                  <TableHead className="text-muted-foreground">Categoria</TableHead>
                  <TableHead className="text-muted-foreground">Data</TableHead>
                  <TableHead className="text-right text-muted-foreground">Valor</TableHead>
                  <TableHead className="text-right text-muted-foreground">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-foreground/90">
                      <div>
                        <div>{item.name}</div>
                        {item.description && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                  {item.description}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{item.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {item.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{item.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <span>{CATEGORY_ICONS[item.category]}</span>
                        <span className="hidden sm:inline">{CATEGORY_LABELS[item.category]}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(item.date), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${itemColorClass}`}>
                      {formatCurrency(item.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => onEditItem(item)} className="mr-2 text-foreground/70 hover:text-primary">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteItem(item.id)} className="text-foreground/70 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
