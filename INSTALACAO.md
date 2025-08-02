# 🚀 Guia de Instalação - Dashboard Financeiro RN 518

Este guia fornece instruções completas para configurar e executar o Dashboard Financeiro RN 518 localmente.

## 📋 Pré-requisitos

### Software Necessário

- **Node.js** 18.0.0 ou superior
- **npm** 9.0.0 ou superior (ou **yarn** 1.22.0+)
- **Git** 2.30.0 ou superior
- **Editor de código** (VS Code recomendado)

### Verificar Instalações

```bash
# Verificar versões
node --version     # v18.0.0 ou superior
npm --version      # 9.0.0 ou superior
git --version      # 2.30.0 ou superior
```

## 🗄️ Configuração do Banco de Dados

### Opção 1: Supabase Cloud (Recomendado)

1. **Criar conta no Supabase**
   ```bash
   # Acesse: https://supabase.com
   # Clique em "Start your project"
   # Faça login com GitHub ou email
   ```

2. **Criar novo projeto**
   ```bash
   # No dashboard do Supabase:
   # - Clique em "New Project"
   # - Nome: "dashboard-rn518"
   # - Database Password: [senha segura]
   # - Region: "South America (São Paulo)"
   ```

3. **Obter credenciais**
   ```bash
   # No projeto criado, vá para Settings > API
   # Copie as seguintes informações:
   # - Project URL
   # - Project API keys (anon/public)
   # - Project Reference ID
   ```

### Opção 2: PostgreSQL Local

```bash
# Instalar PostgreSQL
# Ubuntu/Debian:
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (com Homebrew):
brew install postgresql
brew services start postgresql

# Windows: Baixar do site oficial
# https://www.postgresql.org/download/windows/
```

```sql
-- Criar banco de dados
CREATE DATABASE dashboard_rn518;

-- Criar usuário
CREATE USER dashboard_user WITH PASSWORD 'sua_senha_segura';

-- Conceder privilégios
GRANT ALL PRIVILEGES ON DATABASE dashboard_rn518 TO dashboard_user;
```

## 📦 Instalação do Projeto

### 1. Clonar o Repositório

```bash
# Via HTTPS
git clone https://github.com/seu-usuario/dashboard-rn518.git

# Via SSH (se configurado)
git clone git@github.com:seu-usuario/dashboard-rn518.git

# Entrar no diretório
cd dashboard-rn518
```

### 2. Instalar Dependências

```bash
# Com npm
npm install

# Com yarn (alternativo)
yarn install
```

### 3. Configurar Variáveis de Ambiente

```bash
# Criar arquivo de configuração
cp .env.example .env.local

# Editar o arquivo .env.local
nano .env.local
```

**Conteúdo do `.env.local`:**

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica_anon
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# Database Configuration (se usando PostgreSQL local)
DATABASE_URL=postgresql://dashboard_user:sua_senha@localhost:5432/dashboard_rn518

# Environment
NODE_ENV=development

# Optional: Analytics e Monitoring
NEXT_PUBLIC_ANALYTICS_ID=seu_google_analytics_id
```

## 🗃️ Estrutura do Banco de Dados

### Criar Tabelas (SQL)

Execute os seguintes comandos no seu banco PostgreSQL:

```sql
-- Tabela operadoras
CREATE TABLE public.operadoras (
    registro_operadora VARCHAR(50) PRIMARY KEY,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    modalidade VARCHAR(100),
    logradouro VARCHAR(255),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    cep VARCHAR(20),
    ddd VARCHAR(5),
    telefone VARCHAR(20),
    fax VARCHAR(20),
    endereco_eletronico VARCHAR(255),
    representante VARCHAR(255),
    cargo_representante VARCHAR(100),
    regiao_de_comercializacao VARCHAR(255),
    data_registro_ans DATE,
    data_descredenciamento DATE,
    motivo_do_descredenciamento TEXT
);

-- Tabela demonstracoes_financeiras
CREATE TABLE public.demonstracoes_financeiras (
    id VARCHAR(50) PRIMARY KEY,
    data DATE NOT NULL,
    reg_ans VARCHAR(50) NOT NULL REFERENCES operadoras(registro_operadora),
    cd_conta_contabil VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    vl_saldo_inicial DECIMAL(15,2) DEFAULT 0,
    vl_saldo_final DECIMAL(15,2) DEFAULT 0,
    arquivo_origem VARCHAR(255),
    ano INTEGER NOT NULL,
    trimestre INTEGER NOT NULL CHECK (trimestre BETWEEN 1 AND 4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela beneficiarios_trimestre
CREATE TABLE public.beneficiarios_trimestre (
    cd_operadoras VARCHAR(50) NOT NULL,
    nm_operadora VARCHAR(255) NOT NULL,
    qd_beneficiarios INTEGER NOT NULL DEFAULT 0,
    ano INTEGER NOT NULL,
    trimestre INTEGER NOT NULL CHECK (trimestre BETWEEN 1 AND 4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (cd_operadoras, ano, trimestre)
);

-- Índices para performance
CREATE INDEX idx_demonstracoes_reg_ans ON demonstracoes_financeiras(reg_ans);
CREATE INDEX idx_demonstracoes_periodo ON demonstracoes_financeiras(ano, trimestre);
CREATE INDEX idx_demonstracoes_descricao ON demonstracoes_financeiras USING gin(to_tsvector('portuguese', descricao));
CREATE INDEX idx_beneficiarios_periodo ON beneficiarios_trimestre(ano, trimestre);
```

### Dados de Exemplo (Opcional)

```sql
-- Inserir operadora de exemplo
INSERT INTO operadoras (
    registro_operadora, razao_social, nome_fantasia, modalidade, 
    cidade, regiao_de_comercializacao, data_registro_ans
) VALUES (
    '123456789', 
    'COOPERATIVA ODONTOLÓGICA EXEMPLO LTDA', 
    'UniOdonto Exemplo', 
    'Cooperativa Odontológica',
    'São Paulo',
    'São Paulo - SP',
    '2020-01-15'
);

-- Inserir demonstrações de exemplo
INSERT INTO demonstracoes_financeiras (
    id, data, reg_ans, cd_conta_contabil, descricao, 
    vl_saldo_final, ano, trimestre, arquivo_origem
) VALUES 
    ('demo_1', '2024-12-31', '123456789', '3.1.1', 'Receita de Contraprestações', 1000000.00, 2024, 4, 'exemplo.xml'),
    ('demo_2', '2024-12-31', '123456789', '4.1.1', 'Eventos Indenizáveis Líquidos', 750000.00, 2024, 4, 'exemplo.xml'),
    ('demo_3', '2024-12-31', '123456789', '4.2.1', 'Despesas Administrativas', 150000.00, 2024, 4, 'exemplo.xml'),
    ('demo_4', '2024-12-31', '123456789', '2.1.1', 'Patrimônio Líquido', 500000.00, 2024, 4, 'exemplo.xml'),
    ('demo_5', '2024-12-31', '123456789', '3.9.9', 'Lucro Líquido', 80000.00, 2024, 4, 'exemplo.xml');

-- Inserir beneficiários de exemplo
INSERT INTO beneficiarios_trimestre (
    cd_operadoras, nm_operadora, qd_beneficiarios, ano, trimestre
) VALUES (
    '123456789', 'UniOdonto Exemplo', 15000, 2024, 4
);
```

## 🛠️ Dependências Principais

### Frontend

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "tailwindcss": "^4.0.0",
    "lucide-react": "^0.400.0",
    "recharts": "^2.8.0",
    "@supabase/supabase-js": "^2.38.0",
    "clsx": "^2.0.0",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### Componentes shadcn/ui

```bash
# Instalar CLI do shadcn/ui
npx shadcn-ui@latest init

# Adicionar componentes necessários
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add select
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add tooltip
```

## ⚙️ Configuração do Ambiente de Desenvolvimento

### 1. Configurar Tailwind CSS

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Uniodonto
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        }
      }
    },
  },
  plugins: [],
}
```

### 2. Configurar Vite

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./components"),
      "@/utils": path.resolve(__dirname, "./utils"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
```

### 3. Configurar TypeScript

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./components/*"],
      "@/utils/*": ["./utils/*"]
    }
  },
  "include": ["src", "components", "utils"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 🚀 Executar o Projeto

### Modo Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Ou com yarn
yarn dev

# O servidor iniciará em http://localhost:3000
```

### Build de Produção

```bash
# Gerar build otimizado
npm run build

# Pré-visualizar build
npm run preview

# Verificar se build passou
npm run build && npm run preview
```

### Testes

```bash
# Executar testes unitários
npm test

# Testes com cobertura
npm run test:coverage

# Testes end-to-end
npm run test:e2e
```

## 🔧 Scripts Disponíveis

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "db:generate": "supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.types.ts",
    "db:reset": "supabase db reset",
    "db:migrate": "supabase migration up"
  }
}
```

## 🐛 Solução de Problemas Comuns

### Erro: "Module not found"

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar imports relativos
# ❌ import { Button } from '../../components/ui/button'
# ✅ import { Button } from '@/components/ui/button'
```

### Erro: "Supabase connection failed"

```bash
# Verificar variáveis de ambiente
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Testar conectividade
curl -H "apikey: SUA_CHAVE" https://seu-projeto.supabase.co/rest/v1/operadoras
```

### Erro: "Tabela não encontrada"

```sql
-- Verificar se tabelas existem
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verificar permissões
SELECT * FROM pg_tables WHERE schemaname = 'public';
```

### Performance lenta

```bash
# Verificar bundle size
npm run build:analyze

# Otimizar imagens
npm install -D @squoosh/lib

# Habilitar compressão
npm install compression
```

## 📱 Configuração Mobile (Opcional)

### Responsividade

```css
/* globals.css - breakpoints customizados */
@media (max-width: 640px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### PWA (Progressive Web App)

```bash
# Instalar dependências PWA
npm install -D vite-plugin-pwa

# Configurar manifest.json
{
  "name": "Dashboard RN 518",
  "short_name": "Dashboard",
  "description": "Dashboard Financeiro RN 518 - Uniodonto",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff",
  "display": "standalone",
  "scope": "/",
  "start_url": "/"
}
```

## 🔒 Segurança e Deploy

### Variáveis de Produção

```env
# .env.production
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_prod
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_prod

# Configurações de segurança
NEXTAUTH_SECRET=seu_secret_super_seguro
NEXTAUTH_URL=https://seu-dominio.com
```

### SSL e HTTPS

```bash
# Para desenvolvimento local com HTTPS
npm install -D @vitejs/plugin-basic-ssl

# vite.config.ts
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    https: true,
  },
})
```

## 📊 Monitoramento

### Logs de Desenvolvimento

```typescript
// utils/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`ℹ️ ${message}`, data);
    }
  },
  error: (message: string, error?: any) => {
    console.error(`❌ ${message}`, error);
  },
  success: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${message}`, data);
    }
  }
};
```

## 🎯 Verificar Instalação

### Checklist Final

- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas sem erro
- [ ] Banco de dados configurado
- [ ] Tabelas criadas com estrutura correta
- [ ] Variáveis de ambiente configuradas
- [ ] Servidor de desenvolvimento funcionando
- [ ] Console sem erros críticos
- [ ] Conexão com Supabase OK
- [ ] Dados de exemplo carregados

### Comando de Verificação

```bash
# Script de verificação completa
npm run verify

# Ou verificação manual
npm run type-check
npm run lint
npm run build
npm run test
```

## 📞 Suporte Técnico

Se encontrar problemas durante a instalação:

1. **Verificar logs**: Console do navegador (F12)
2. **Verificar versões**: Node.js, npm, dependências
3. **Verificar conectividade**: Banco de dados, APIs
4. **Consultar documentação**: README.md, issues do GitHub
5. **Abrir issue**: Repositório oficial com logs detalhados

---

*Guia de Instalação - Dashboard Financeiro RN 518*
*Versão 1.0.0 - Dezembro 2024*