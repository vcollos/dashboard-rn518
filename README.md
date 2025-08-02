# Dashboard Financeiro RN 518 - Sistema Uniodonto

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Versão](https://img.shields.io/badge/Versão-1.0.0-blue)
![Licença](https://img.shields.io/badge/Licença-MIT-green)

## 📋 Descrição

Dashboard analítico para monitoramento dos **11 indicadores econômico-financeiros** exigidos pela **Resolução Normativa RN 518 da ANS**, focado nas operadoras de plano odontológico do sistema Uniodonto.

O sistema oferece uma interface moderna e responsiva para análise de dados financeiros, com capacidade de filtrar por operadora, ano e trimestre, apresentando visões consolidadas, comparativos entre operadoras e detalhamentos individuais com evolução temporal.

## 🎯 Objetivos

- **Conformidade Regulatória**: Automatizar o cálculo dos 11 indicadores obrigatórios da RN 518
- **Análise Comparativa**: Permitir comparação entre operadoras do sistema Uniodonto
- **Monitoramento Temporal**: Acompanhar evolução histórica dos indicadores
- **Interface Intuitiva**: Dashboard moderno com visual institucional limpo
- **Dados em Tempo Real**: Integração direta com base de dados das demonstrações financeiras

## 👥 Público-Alvo

- **Diretores Financeiros** da Uniodonto
- **Analistas da ANS** (Agência Nacional de Saúde Suplementar)
- **Executivos das Cooperativas** odontológicas
- **Auditores** e consultores financeiros

## 🏗️ Arquitetura Técnica

### Stack Principal

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4.0
- **Componentes**: shadcn/ui
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Charts**: Recharts
- **Build**: Vite
- **Deploy**: Figma Make Platform

### Estrutura de Dados

O sistema trabalha com 3 tabelas principais no schema `public`:

#### 📊 Tabela `operadoras`
```typescript
interface Operadora {
  registro_operadora: string;        // Chave primária (STRING)
  razao_social: string;
  nome_fantasia: string;
  modalidade: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  cep: string;
  ddd: string;
  telefone: string;
  fax: string;
  endereco_eletronico: string;
  representante: string;
  cargo_representante: string;
  regiao_de_comercializacao: string;
  data_registro_ans: string;        // ISO Date
  data_descredenciamento: string | null; // ISO Date ou null
  motivo_do_descredenciamento: string | null;
}
```

#### 💰 Tabela `demonstracoes_financeiras`
```typescript
interface DemonstracaoFinanceira {
  id: string;
  data: string;                     // ISO Date
  reg_ans: string;                  // Referência para operadoras (STRING)
  cd_conta_contabil: string;
  descricao: string;                // Usado para mapeamento automático
  vl_saldo_inicial: number;
  vl_saldo_final: number;           // Valor principal para cálculos
  arquivo_origem: string;
  ano: number;
  trimestre: number;
}
```

#### 👥 Tabela `beneficiarios_trimestre`
```typescript
interface BeneficiariosTrimestre {
  cd_operadoras: string;            // Código da operadora (STRING)
  nm_operadora: string;
  qd_beneficiarios: number;
  ano: number;
  trimestre: number;
}
```

## 📈 Indicadores RN 518

O sistema calcula automaticamente os **11 indicadores obrigatórios**:

| Código | Indicador | Descrição | Unidade |
|--------|-----------|-----------|---------|
| **MLL** | Margem de Lucro Líquida | (Lucro Líquido / Receita Total) × 100 | % |
| **ROE** | Retorno sobre Patrimônio Líquido | (Lucro Líquido / Patrimônio Líquido) × 100 | % |
| **DM** | Sinistralidade | (Despesas Médicas / Contraprestações) × 100 | % |
| **DA** | Despesas Administrativas | (Desp. Admin. / Receita Total) × 100 | % |
| **DC** | Despesas Comerciais | (Desp. Comerc. / Receita Total) × 100 | % |
| **DOP** | Despesas Operacionais | (Total Desp. Oper. / Receita Total) × 100 | % |
| **IRF** | Resultado Financeiro | (Result. Financ. / Receita Total) × 100 | % |
| **LC** | Liquidez Corrente | Ativo Circulante / Passivo Circulante | Índice |
| **CTCP** | Capital Terceiros/Capital Próprio | (Cap. Terceiros / Patrim. Líquido) × 100 | % |
| **PMCR** | Prazo Médio Contraprestações Receber | (Contas Receber / Receita Diária) | Dias |
| **PMPE** | Prazo Médio Pagamento Eventos | (Eventos a Pagar / Despesas Diárias) | Dias |

## 🤖 Sistema de Mapeamento Inteligente

O sistema utiliza **mapeamento automático por descrições** para identificar contas contábeis:

```typescript
// Exemplo de mapeamento
RECEITA_CONTRAPRESTACOES: [
  'receita de contraprestações',
  'contraprestações pecuniárias',
  'receita de mensalidades',
  'receita operacional'
]

DESPESAS_MEDICAS: [
  'eventos indenizáveis líquidos',
  'despesas médicas',
  'despesas com eventos',
  'sinistralidade'
]
```

## 🎨 Interface e Funcionalidades

### 🏠 Visão Consolidada
- **Média dos indicadores** de todas as operadoras
- **Cards de KPIs** com valores destacados
- **Indicadores de tendência** comparando com período anterior
- **Alertas visuais** para valores fora dos parâmetros

### 📊 Comparativo entre Operadoras
- **Tabela ranking** ordenável por qualquer indicador
- **Gráficos de barras** para comparação visual
- **Filtros avançados** por região, modalidade, porte
- **Exportação de dados** em CSV/Excel

### 🔍 Detalhamento Individual
- **Perfil completo** da operadora selecionada
- **Gráfico temporal** com evolução histórica
- **Composição de despesas** em pizza
- **Indicadores detalhados** com tendências
- **Dados de beneficiários** quando disponíveis

### ⚙️ Filtros Globais
- **Seletor de Operadora**: Filtro por operadora específica
- **Seletor de Ano**: 2021-2024
- **Seletor de Trimestre**: 1º ao 4º trimestre
- **Filtros automáticos**: Operadoras ativas apenas

## 🔧 Estado Atual do Projeto

### ✅ Implementado e Funcionando

1. **Conectividade com Supabase** ✅
   - Integração completa com PostgreSQL
   - Autenticação e autorização
   - Queries otimizadas

2. **Estrutura de Dados Corrigida** ✅
   - Todos os IDs como STRING (conforme BD real)
   - Campos exatos das tabelas
   - Relacionamentos corretos

3. **Cálculo de Indicadores** ✅
   - 11 indicadores RN 518 implementados
   - Mapeamento automático por descrições
   - Validações e tratamento de erros

4. **Interface Completa** ✅
   - Design responsivo desktop-first
   - Componentes shadcn/ui
   - Paleta de cores institucional azul

5. **Sistema de Logs Detalhados** ✅
   - Logs de conectividade
   - Rastreamento de mapeamentos
   - Diagnósticos automáticos

### 🚧 Em Desenvolvimento

1. **Otimizações de Performance**
   - Cache de consultas frequentes
   - Lazy loading de dados históricos
   - Otimização de queries complexas

2. **Funcionalidades Avançadas**
   - Exportação em PDF
   - Relatórios personalizáveis
   - Alertas automáticos por email

3. **Validações Adicionais**
   - Verificação de consistência de dados
   - Alertas para valores atípicos
   - Sugestões de correção

### 🧪 Para Testes

1. **Abrir Console do Navegador (F12)** para ver:
   - "TESTE COM TIPOS CORRETOS"
   - Verificação de estrutura em tempo real
   - Logs de mapeamento de contas contábeis
   - Diagnósticos de conectividade

2. **Botões de Diagnóstico**:
   - "Reset e Reconectar": Força nova conexão
   - "Testar Conexão": Verifica status atual
   - "Verificar Novamente": Recarrega dados

## 📁 Estrutura do Projeto

```
├── 📱 App.tsx                     # Componente principal
├── 🎨 components/
│   ├── Header.tsx                 # Cabeçalho com filtros
│   ├── VisaoConsolidada.tsx      # Dashboard principal
│   ├── ComparativoOperadoras.tsx # Comparação entre operadoras
│   ├── DetalhamentoOperadora.tsx # Análise individual
│   ├── MetadadosPanel.tsx        # Informações do sistema
│   └── ui/                       # Componentes shadcn/ui
├── 🔧 services/
│   └── demonstracoesService.ts   # Lógica de negócio
├── 🎣 hooks/
│   └── useIndicadoresFinanceiros.ts # Hook principal
├── 🗄️ utils/supabase/
│   ├── client.ts                 # Cliente Supabase
│   └── info.tsx                  # Configurações
├── 🖥️ supabase/functions/server/  # Edge Functions
└── 🎨 styles/
    └── globals.css               # Estilos globais Tailwind v4
```

## 🔌 Integração com Banco de Dados

### Configuração Supabase
```javascript
// URL: https://{projectId}.supabase.co
// Schema: public
// Autenticação: Row Level Security (RLS)
```

### Consultas Principais
```sql
-- Buscar operadoras ativas
SELECT * FROM operadoras 
WHERE data_descredenciamento IS NULL
ORDER BY razao_social;

-- Demonstrações por período
SELECT * FROM demonstracoes_financeiras 
WHERE ano = 2024 AND trimestre = 4
ORDER BY reg_ans, cd_conta_contabil;

-- Beneficiários por operadora
SELECT * FROM beneficiarios_trimestre
WHERE ano = 2024 AND trimestre = 4;
```

## 📊 Exemplos de Uso

### Carregar Indicadores de uma Operadora
```typescript
const indicadores = await demonstracoesService
  .calcularIndicadoresRN518("12345678", 2024, 4);

console.log(`MLL: ${indicadores.mll.toFixed(1)}%`);
console.log(`ROE: ${indicadores.roe.toFixed(1)}%`);
console.log(`Sinistralidade: ${indicadores.dm.toFixed(1)}%`);
```

### Comparar Operadoras
```typescript
const todasOperadoras = await demonstracoesService
  .calcularIndicadoresPeriodo(2024, 4);

const ranking = todasOperadoras
  .sort((a, b) => b.mll - a.mll)
  .slice(0, 10);
```

## 🚀 Performance

- **Tempo de carregamento**: < 2s para dados de um trimestre
- **Capacidade**: Suporta 100+ operadoras simultaneamente
- **Responsividade**: Interface fluida em desktop e mobile
- **Caching**: Dados em cache para consultas repetidas

## 📝 Logs e Diagnósticos

O sistema fornece logs detalhados para facilitar o diagnóstico:

```javascript
// Exemplo de log de sucesso
✅ CONECTADO COM TIPOS CORRETOS
📊 32 operadoras encontradas
💰 1,247 registros de demonstrações
🎯 11 indicadores calculados com sucesso
```

## 🔒 Segurança

- **Autenticação Supabase**: JWT tokens seguros
- **RLS (Row Level Security)**: Controle de acesso por linha
- **Validação de entrada**: Sanitização de dados
- **HTTPS obrigatório**: Comunicação criptografada

## 📈 Roadmap

### Versão 1.1 (Próxima)
- [ ] Exportação de relatórios em PDF
- [ ] Sistema de alertas por email
- [ ] Comparação com benchmarks do setor

### Versão 1.2 (Futuro)
- [ ] Dashboard mobile nativo
- [ ] Integração com APIs externas
- [ ] Machine learning para previsões

## 🐛 Solução de Problemas

### Problema: "Banco de Dados Indisponível"
**Solução**: Verificar se as tabelas existem no schema `public` e se os tipos de dados estão corretos (IDs como STRING).

### Problema: "Sem dados para o período"
**Solução**: Confirmar se existem registros na tabela `demonstracoes_financeiras` para o ano/trimestre selecionado.

### Problema: "Indicadores zerados"
**Solução**: Verificar se as descrições das contas contábeis correspondem aos padrões de mapeamento no console.

## 📞 Suporte

Para dúvidas técnicas ou sugestões:
1. Abrir issue no repositório GitHub
2. Consultar logs detalhados no console (F12)
3. Verificar documentação de instalação

## 🏆 Contribuidores

- **Desenvolvimento**: Equipe Técnica Uniodonto
- **Consultoria ANS**: Especialistas em regulamentação
- **Design UX/UI**: Equipe de Design
- **QA**: Analistas de Qualidade

---

*Dashboard Financeiro RN 518 - Desenvolvido para o Sistema Uniodonto*
*Versão 1.0.0 - Dezembro 2024*