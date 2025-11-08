import { Logo } from '@/components/icons/Logo';
import ThemeToggle from './ThemeToggle';

export default function AppHeader() {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-border">
      <div className="container mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Controle Financeiro</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
