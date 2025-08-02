# 📚 Documentação Git e GitHub - Dashboard RN 518

Este documento contém todas as instruções para versionamento, colaboração e publicação do projeto no GitHub.

## 🚀 Configuração Inicial do Git

### 1. Configurar Git Localmente

```bash
# Configurar informações do usuário
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"

# Verificar configurações
git config --list

# Configurar editor padrão (opcional)
git config --global core.editor "code --wait"  # VS Code
git config --global core.editor "nano"         # Nano
```

### 2. Inicializar Repositório Local

```bash
# No diretório do projeto
git init

# Verificar status
git status

# Adicionar arquivos ao staging
git add .

# Primeiro commit
git commit -m "feat: initial commit - dashboard rn518 setup"
```

## 📂 Estrutura de Arquivos Git

### .gitignore

```bash
# Criar arquivo .gitignore
touch .gitignore
```

**Conteúdo do `.gitignore`:**

```gitignore
# Dependências
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build e produção
dist/
build/
.next/
out/

# Ambiente e configurações
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# Sistema operacional
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Cache
.cache/
.parcel-cache/
.eslintcache

# Supabase local
.supabase/

# Temporários
tmp/
temp/

# Uploads e arquivos gerados
uploads/
*.tmp

# Certificados SSL locais
*.pem
*.key
*.crt

# Dados sensíveis
database.sql
*.backup
```

### .gitattributes

```bash
# Criar arquivo .gitattributes
touch .gitattributes
```

**Conteúdo do `.gitattributes`:**

```gitattributes
# Auto detect text files and perform LF normalization
* text=auto

# Explicitly declare text files you want to always be normalized and converted
# to native line endings on checkout.
*.ts text
*.tsx text
*.js text
*.jsx text
*.json text
*.md text
*.css text
*.scss text
*.html text
*.xml text
*.yml text
*.yaml text

# Declare files that will always have CRLF line endings on checkout.
*.bat text eol=crlf

# Denote all files that are truly binary and should not be modified.
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.svg binary
*.woff binary
*.woff2 binary
*.ttf binary
*.eot binary
*.mp4 binary
*.webm binary
*.pdf binary
```

## 🌿 Estratégia de Branching

### Git Flow Simplificado

```bash
# Branch principal
main (produção)
├── develop (desenvolvimento)
│   ├── feature/dashboard-consolidado
│   ├── feature/comparativo-operadoras
│   ├── feature/detalhamento-individual
│   └── feature/integracao-supabase
├── hotfix/correcao-critica
└── release/v1.0.0
```

### Criar e Gerenciar Branches

```bash
# Criar branch de desenvolvimento
git checkout -b develop

# Criar feature branch
git checkout -b feature/dashboard-consolidado

# Trabalhar na feature
git add .
git commit -m "feat: implement consolidated dashboard view"

# Voltar para develop
git checkout develop

# Merge da feature
git merge feature/dashboard-consolidado

# Deletar branch após merge
git branch -d feature/dashboard-consolidado
```

## 📝 Padrões de Commit

### Conventional Commits

Utilizamos o padrão **Conventional Commits** para mensagens organizadas:

```bash
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos de Commit

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `feat` | Nova funcionalidade | `feat: add dashboard consolidado` |
| `fix` | Correção de bug | `fix: resolve supabase connection error` |
| `docs` | Documentação | `docs: update installation guide` |
| `style` | Formatação, espaços | `style: format typescript files` |
| `refactor` | Refatoração | `refactor: optimize indicators calculation` |
| `perf` | Melhoria de performance | `perf: optimize database queries` |
| `test` | Testes | `test: add unit tests for indicators` |
| `build` | Build, dependências | `build: update dependencies` |
| `ci` | Integração contínua | `ci: add github actions workflow` |
| `chore` | Manutenção | `chore: update package.json` |

### Exemplos de Commits

```bash
# Feature completa
git commit -m "feat(dashboard): implement consolidated view with 11 indicators

- Add VisaoConsolidada component
- Implement RN 518 calculations
- Add responsive design
- Include error handling

Closes #123"

# Bug fix
git commit -m "fix(database): resolve string type conversion in reg_ans field

- Update all interfaces to use string type
- Fix query filters and comparisons
- Update cache key mapping
- Add type validation logs

Fixes #145"

# Documentação
git commit -m "docs: add comprehensive installation guide

- Add database setup instructions
- Include environment configuration
- Add troubleshooting section
- Update dependency list"

# Refatoração
git commit -m "refactor(services): optimize demonstracoes service performance

- Implement query caching
- Reduce database calls
- Add connection pooling
- Improve error handling"
```

## 🐙 Configuração do GitHub

### 1. Criar Repositório no GitHub

```bash
# No GitHub.com:
# 1. Clique em "New repository"
# 2. Nome: "dashboard-rn518"
# 3. Descrição: "Dashboard Financeiro RN 518 - Sistema Uniodonto"
# 4. Público ou Privado (conforme necessário)
# 5. Não inicializar com README (já temos local)
# 6. Clique em "Create repository"
```

### 2. Conectar Repositório Local ao GitHub

```bash
# Adicionar remote origin
git remote add origin https://github.com/seu-usuario/dashboard-rn518.git

# Verificar remote
git remote -v

# Push inicial
git branch -M main
git push -u origin main

# Push da branch develop
git checkout develop
git push -u origin develop
```

### 3. Configurar SSH (Recomendado)

```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -C "seu.email@exemplo.com"

# Adicionar ao ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub
# Colar no GitHub: Settings > SSH and GPG keys > New SSH key

# Testar conexão
ssh -T git@github.com

# Atualizar remote para SSH
git remote set-url origin git@github.com:seu-usuario/dashboard-rn518.git
```

## 🔄 Workflow de Desenvolvimento

### 1. Fluxo Padrão de Feature

```bash
# 1. Atualizar develop
git checkout develop
git pull origin develop

# 2. Criar feature branch
git checkout -b feature/nova-funcionalidade

# 3. Desenvolver e commit
# ... fazer alterações ...
git add .
git commit -m "feat: implement nova funcionalidade"

# 4. Push da feature
git push -u origin feature/nova-funcionalidade

# 5. Abrir Pull Request no GitHub
# 6. Review e merge
# 7. Deletar branch local
git branch -d feature/nova-funcionalidade
```

### 2. Pull Request Template

Criar arquivo `.github/pull_request_template.md`:

```markdown
## 📋 Descrição

Breve descrição das mudanças implementadas.

## 🎯 Tipo de Mudança

- [ ] Bug fix (mudança que corrige um problema)
- [ ] Nova feature (mudança que adiciona funcionalidade)
- [ ] Breaking change (mudança que quebra compatibilidade)
- [ ] Documentação (mudança apenas na documentação)

## 🧪 Como Testar

1. Passos para reproduzir/testar as mudanças
2. Comandos específicos
3. Dados de teste necessários

## 📸 Screenshots

Se aplicável, adicione screenshots das mudanças visuais.

## ✅ Checklist

- [ ] Código passou nos testes locais
- [ ] Documentação foi atualizada
- [ ] Mudanças foram testadas em diferentes navegadores
- [ ] Console está livre de erros
- [ ] Performance não foi degradada

## 🔗 Issues Relacionadas

Closes #123
Resolves #456
Related to #789
```

## 🏷️ Versionamento e Releases

### Semantic Versioning (SemVer)

```bash
# Formato: MAJOR.MINOR.PATCH
# Exemplo: 1.0.0

# MAJOR: Mudanças incompatíveis (breaking changes)
# MINOR: Novas funcionalidades compatíveis
# PATCH: Correções de bugs compatíveis
```

### Criar Tags e Releases

```bash
# Criar tag anotada
git tag -a v1.0.0 -m "Release v1.0.0: Initial stable version

Features:
- Dashboard consolidado com 11 indicadores RN 518
- Comparativo entre operadoras
- Detalhamento individual com histórico
- Integração completa com Supabase
- Interface responsiva e moderna"

# Push da tag
git push origin v1.0.0

# Listar tags
git tag -l

# Ver detalhes da tag
git show v1.0.0
```

### GitHub Release Automation

Criar arquivo `.github/workflows/release.yml`:

```yaml
name: Create Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: |
            ## Changelog
            
            ### Features
            - Nova funcionalidade X
            - Melhoria Y
            
            ### Bug Fixes
            - Correção Z
            
            ### Documentation
            - Atualização da documentação
            
            ## Instalação
            
            ```bash
            git clone https://github.com/seu-usuario/dashboard-rn518.git
            cd dashboard-rn518
            npm install
            npm run dev
            ```
          draft: false
          prerelease: false
```

## 🤝 Colaboração e Code Review

### Configurar Branch Protection

No GitHub, vá para Settings > Branches:

```bash
# Proteger branch main
✅ Require pull request reviews before merging
✅ Require status checks to pass before merging
✅ Require up-to-date branches before merging
✅ Include administrators
✅ Restrict pushes to matching branches
```

### Code Review Guidelines

**Para Reviewers:**

```markdown
## 📝 Code Review Checklist

### Funcionalidade
- [ ] O código faz o que deveria fazer?
- [ ] A lógica está correta?
- [ ] Edge cases foram considerados?

### Qualidade
- [ ] Código está limpo e legível?
- [ ] Nomes de variáveis são descritivos?
- [ ] Funções têm responsabilidade única?

### Performance
- [ ] Não há vazamentos de memória?
- [ ] Queries são otimizadas?
- [ ] Componentes são eficientes?

### Segurança
- [ ] Dados sensíveis não estão expostos?
- [ ] Inputs são validados?
- [ ] Autenticação está correta?

### Testes
- [ ] Testes cobrem os casos principais?
- [ ] Testes passam consistentemente?
- [ ] Mocks são apropriados?
```

## 🔧 GitHub Actions (CI/CD)

### Workflow de CI

Criar arquivo `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run type check
      run: npm run type-check
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm test
    
    - name: Build project
      run: npm run build
      
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      if: matrix.node-version == '18.x'
```

### Workflow de Deploy

Criar arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
    
    - name: Deploy to Production
      # Configurar conforme seu provedor
      run: echo "Deploy configured"
```

## 📊 Issues e Project Management

### Issue Templates

Criar arquivo `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: 'bug'
assignees: ''
---

## 🐛 Descrição do Bug

Uma descrição clara e concisa do bug.

## 🔄 Passos para Reproduzir

1. Vá para '...'
2. Clique em '....'
3. Role para baixo até '....'
4. Veja o erro

## ✅ Comportamento Esperado

Descrição clara do que deveria acontecer.

## 📸 Screenshots

Se aplicável, adicione screenshots para ajudar a explicar o problema.

## 🖥️ Ambiente

- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
- Node.js: [e.g. 18.17.0]

## 📝 Informações Adicionais

Qualquer outra informação sobre o problema.
```

### Feature Request Template

Criar arquivo `.github/ISSUE_TEMPLATE/feature_request.md`:

```markdown
---
name: Feature Request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: 'enhancement'
assignees: ''
---

## 🚀 Descrição da Feature

Uma descrição clara e concisa da feature desejada.

## 💡 Motivação

Por que esta feature seria útil? Qual problema resolve?

## 📋 Solução Proposta

Descrição detalhada de como a feature deveria funcionar.

## 🎨 Mockups/Wireframes

Se aplicável, adicione mockups ou wireframes.

## ⚡ Alternativas Consideradas

Descreva alternativas que você considerou.

## 📝 Informações Adicionais

Qualquer outra informação sobre a feature.
```

## 🏗️ GitHub Projects

### Configurar Project Board

1. **Criar Project**: GitHub > Projects > New project
2. **Colunas**: 
   - 📋 Backlog
   - 🔄 In Progress
   - 👀 Review
   - ✅ Done

3. **Automation**:
   ```yaml
   # Auto-move cards
   - When issue is opened: Move to Backlog
   - When PR is opened: Move to Review
   - When PR is merged: Move to Done
   ```

### Labels Organizados

```bash
# Tipos
bug, enhancement, feature, documentation

# Prioridade
priority:high, priority:medium, priority:low

# Status
status:blocked, status:help-wanted, status:wontfix

# Componentes
component:frontend, component:backend, component:database

# Dificuldade
difficulty:easy, difficulty:medium, difficulty:hard
```

## 🔒 Configurações de Segurança

### Dependabot

Criar arquivo `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 5
    reviewers:
      - "seu-usuario"
    assignees:
      - "seu-usuario"
```

### CodeQL Security Analysis

Criar arquivo `.github/workflows/codeql-analysis.yml`:

```yaml
name: "CodeQL"

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '45 6 * * 1'

jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest
    
    strategy:
      fail-fast: false
      matrix:
        language: [ 'javascript' ]
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v3
    
    - name: Initialize CodeQL
      uses: github/codeql-action/init@v2
      with:
        languages: ${{ matrix.language }}
    
    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v2
```

## 📈 Análise e Métricas

### GitHub Insights

Configurar no GitHub:
- **Pulse**: Atividade recente
- **Contributors**: Estatísticas de contribuição
- **Traffic**: Visualizações e clones
- **Dependency graph**: Dependências e vulnerabilidades

### Badges para README

```markdown
![Build Status](https://github.com/seu-usuario/dashboard-rn518/workflows/CI/badge.svg)
![Coverage](https://codecov.io/gh/seu-usuario/dashboard-rn518/branch/main/graph/badge.svg)
![Version](https://img.shields.io/github/v/release/seu-usuario/dashboard-rn518)
![License](https://img.shields.io/github/license/seu-usuario/dashboard-rn518)
![Issues](https://img.shields.io/github/issues/seu-usuario/dashboard-rn518)
![Stars](https://img.shields.io/github/stars/seu-usuario/dashboard-rn518)
```

## 🎯 Checklist de Publicação

### Antes do Primeiro Push

- [ ] README.md completo e atualizado
- [ ] .gitignore configurado
- [ ] .gitattributes configurado
- [ ] Licença escolhida e arquivo LICENSE criado
- [ ] package.json com informações corretas
- [ ] Variáveis sensíveis removidas do código
- [ ] Documentação de instalação criada

### Antes de cada Release

- [ ] Todos os testes passando
- [ ] Documentação atualizada
- [ ] CHANGELOG.md atualizado
- [ ] Versão bumped no package.json
- [ ] Tag criada e pushed
- [ ] Release notes preparadas
- [ ] Deploy testado

### Manutenção Regular

- [ ] Issues respondidas em 48h
- [ ] PRs revisadas em 72h
- [ ] Dependências atualizadas mensalmente
- [ ] Security alerts resolvidas imediatamente
- [ ] Backup do repositório mantido

---

*Documentação Git e GitHub - Dashboard Financeiro RN 518*
*Versão 1.0.0 - Dezembro 2024*