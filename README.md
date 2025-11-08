# 💰 Controle Financeiro

Sistema completo de controle financeiro pessoal desenvolvido com Next.js, React, TypeScript e Firebase. Gerencie suas receitas e despesas de forma eficiente com uma interface moderna e intuitiva.

## 🚀 Funcionalidades

### ✨ Principais Recursos

- **📊 Gestão de Transações**
  - Adicione, edite e exclua receitas e despesas
  - Categorização completa de transações
  - Sistema de tags para organização
  - Descrições detalhadas para cada transação
  - Data personalizada para cada transação
  - Recorrência (diária, semanal, mensal, anual)

- **📈 Análises e Relatórios**
  - Dashboard com gráficos interativos
  - Visualização de tendências mensais
  - Análise de despesas por categoria
  - Distribuição de receitas por categoria
  - Gráficos de linha, barras e pizza

- **🔍 Filtros e Busca**
  - Busca por nome, descrição ou tags
  - Filtro por tipo (receita/despesa)
  - Filtro por categoria
  - Filtro por período (data inicial e final)
  - Combinação de múltiplos filtros

- **💾 Persistência de Dados**
  - Integração com Firebase Firestore
  - Fallback para localStorage quando Firebase não estiver configurado
  - Sincronização automática de dados

- **📤 Exportação de Dados**
  - Exportar dados em CSV
  - Exportar dados em JSON
  - Preservação de todos os campos

- **🎨 Interface Moderna**
  - Design responsivo (mobile, tablet, desktop)
  - Tema claro/escuro com toggle
  - Interface em português (Brasil)
  - Formatação de moeda em BRL (R$)
  - Animações suaves
  - Feedback visual para todas as ações

### 📱 Categorias Disponíveis

**Receitas:**
- 💼 Salário
- 💻 Freelance
- 📈 Investimentos
- 💰 Outras Receitas

**Despesas:**
- 🏠 Moradia
- 🍔 Alimentação
- 🚗 Transporte
- 🏥 Saúde
- 📚 Educação
- 🎬 Entretenimento
- 🛍️ Compras
- 📄 Contas
- 💸 Outras Despesas

## 🛠️ Tecnologias Utilizadas

- **Framework:** Next.js 15.2.3
- **Linguagem:** TypeScript
- **UI Library:** React 18.3.1
- **Estilização:** Tailwind CSS
- **Componentes UI:** shadcn/ui (Radix UI)
- **Validação:** Zod
- **Formulários:** React Hook Form
- **Gráficos:** Recharts
- **Data:** date-fns
- **Banco de Dados:** Firebase Firestore
- **Estado:** React Hooks

## 📦 Instalação

### Pré-requisitos

- Node.js 20 ou superior
- npm ou yarn
- Conta Firebase (opcional, para persistência em nuvem)

### Passos

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd Controle_Financeiro
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente** (opcional)
   Crie um arquivo `.env.local` na raiz do projeto:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=sua-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=seu-app-id
   ```

   **Nota:** Se não configurar o Firebase, o sistema usará localStorage como fallback.

4. **Execute o projeto**
   ```bash
   npm run dev
   ```

5. **Acesse no navegador**
   ```
   http://localhost:9002
   ```

## 🎯 Como Usar

### Adicionar uma Transação

1. Clique em "Adicionar Receita" ou "Adicionar Despesa"
2. Preencha os campos:
   - Nome da transação
   - Valor
   - Categoria
   - Data
   - Descrição (opcional)
   - Tags (opcional)
   - Recorrência (opcional)
3. Clique em "Adicionar"

### Filtrar Transações

1. Na aba "Transações", use os filtros disponíveis:
   - Busca: Digite o nome, descrição ou tag
   - Tipo: Selecione receitas, despesas ou todas
   - Categoria: Escolha uma categoria específica
   - Período: Selecione um intervalo de datas
2. Os resultados serão atualizados automaticamente

### Visualizar Análises

1. Clique na aba "Análises"
2. Visualize os gráficos:
   - Tendência mensal (últimos 6 meses)
   - Despesas por categoria (top 5)
   - Receitas por categoria (distribuição)

### Exportar Dados

1. Clique no botão "Exportar" no topo da página
2. Escolha o formato:
   - CSV: Para uso em planilhas
   - JSON: Para backup ou importação

### Alternar Tema

1. Clique no ícone de sol/lua no canto superior direito
2. O tema será alterado e salvo automaticamente

## 📁 Estrutura do Projeto

```
Controle_Financeiro/
├── src/
│   ├── app/                 # Páginas Next.js
│   │   ├── page.tsx        # Página principal
│   │   ├── layout.tsx      # Layout raiz
│   │   └── globals.css     # Estilos globais
│   ├── components/          # Componentes React
│   │   ├── dashboard/      # Componentes do dashboard
│   │   └── ui/             # Componentes UI reutilizáveis
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Bibliotecas e utilitários
│   │   ├── services/       # Serviços (Firebase, etc.)
│   │   ├── utils/          # Funções utilitárias
│   │   └── schemas.ts      # Schemas de validação
│   └── types/              # Tipos TypeScript
├── public/                 # Arquivos estáticos
└── package.json           # Dependências do projeto
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria uma build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter
- `npm run typecheck` - Verifica os tipos TypeScript

## 🌐 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Firebase Hosting

1. Instale o Firebase CLI: `npm install -g firebase-tools`
2. Faça login: `firebase login`
3. Inicialize: `firebase init hosting`
4. Faça o deploy: `firebase deploy`

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvedor

**Daniel Barbieri Dev**
- 🎮 Desenvolvedor de Jogos
- 💻 Especialista em C/C++
- 🚀 Entusiasta de Tecnologia
- 📧 Contato: [Daniel Barbieri](mailto:dibarbieri21@gmail.com)

## 🐛 Problemas Conhecidos

- O sistema funciona perfeitamente com localStorage quando Firebase não está configurado
- Todos os dados são armazenados localmente até configurar o Firebase


## 🎉 Agradecimentos

- Next.js team
- shadcn/ui
- React team
- Firebase team
- Todos os contribuidores de código aberto

---

**Desenvolvido com Next.js, React, TypeScript e muito café ☕**
# Controle_Financeiro
