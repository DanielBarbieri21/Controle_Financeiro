export const formatCurrency = (amount: number, currency: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const parseCurrency = (value: string): number => {
  // Remove tudo exceto números e vírgula/ponto
  const cleaned = value.replace(/[^\d,.-]/g, '');
  // Substitui vírgula por ponto para parsing
  const normalized = cleaned.replace(',', '.');
  return parseFloat(normalized) || 0;
};

