import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from './info'

// Tipos baseados na estrutura EXATA fornecida pelo usuário
export interface Operadora {
  registro_operadora: string; // STRING!
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
  data_registro_ans: string; // ISO Date
  data_descredenciamento: string | null; // ISO Date ou null
  motivo_do_descredenciamento: string | null;
}

export interface DemonstracaoFinanceira {
  id: string;
  data: string; // ISO Date
  reg_ans: string; // STRING!
  cd_conta_contabil: string;
  descricao: string;
  vl_saldo_inicial: number;
  vl_saldo_final: number;
  arquivo_origem: string;
  ano: number;
  trimestre: number;
}

export interface BeneficiariosTrimestre {
  cd_operadoras: string; // STRING!
  nm_operadora: string;
  qd_beneficiarios: number;
  ano: number;
  trimestre: number;
}

// Dados processados para uso na aplicação
export interface OperadoraInfo {
  reg_ans: string; // STRING! Mapeado de registro_operadora
  nome: string; // Mapeado de razao_social ou nome_fantasia
  municipio: string; // Mapeado de cidade
  uf: string; // Extraído da regiao_de_comercializacao ou cidade
  total_beneficiarios?: number;
}

export interface IndicadoresRN518 {
  reg_ans: string; // STRING!
  ano: number;
  trimestre: number;
  // 11 indicadores obrigatórios da RN 518
  mll: number;   // 1. Margem de Lucro Líquida
  roe: number;   // 2. Retorno sobre Patrimônio Líquido
  dm: number;    // 3. Sinistralidade (Despesas Médicas)
  da: number;    // 4. Despesas Administrativas
  dc: number;    // 5. Despesas Comerciais
  dop: number;   // 6. Despesas Operacionais
  irf: number;   // 7. Resultado Financeiro
  lc: number;    // 8. Liquidez Corrente
  ctcp: number;  // 9. Capital de Terceiros/Capital Próprio
  pmcr: number;  // 10. Prazo Médio de Contraprestações a Receber
  pmpe: number;  // 11. Prazo Médio de Pagamento de Eventos
}

// Mapeamento das descrições contábeis para categorias dos indicadores
export const MAPEAMENTO_CONTAS = {
  // Receitas
  RECEITA_CONTRAPRESTACOES: [
    'receita de contraprestações',
    'contraprestações pecuniárias',
    'receita de mensalidades',
    'receita operacional',
    'contraprestação',
    'mensalidade',
    'receitas de contraprestacoes',
    'contraprestacoes'
  ],
  
  RECEITA_TOTAL: [
    'receita total',
    'receita operacional total',
    'receitas totais',
    'total das receitas',
    'receita bruta',
    'faturamento',
    'receitas operacionais'
  ],
  
  RECEITAS_FINANCEIRAS: [
    'receitas financeiras',
    'receita financeira',
    'aplicações financeiras',
    'rendimento de aplicações',
    'juros recebidos',
    'resultado financeiro positivo',
    'rendimento financeiro'
  ],
  
  // Despesas
  DESPESAS_MEDICAS: [
    'eventos indenizáveis líquidos',
    'despesas médicas',
    'despesas com eventos',
    'sinistralidade',
    'despesas assistenciais',
    'custos assistenciais',
    'eventos médicos',
    'despesas com sinistros',
    'custos médicos',
    'eventos indenizaveis'
  ],
  
  DESPESAS_ADMINISTRATIVAS: [
    'despesas administrativas',
    'despesas gerais',
    'despesas operacionais administrativas',
    'outras despesas administrativas',
    'despesas de administração',
    'custos administrativos',
    'despesas admin'
  ],
  
  DESPESAS_COMERCIAIS: [
    'despesas comerciais',
    'despesas de comercialização',
    'despesas com vendas',
    'comissões de vendas',
    'marketing',
    'publicidade',
    'despesas de vendas'
  ],
  
  DESPESAS_FINANCEIRAS: [
    'despesas financeiras',
    'despesa financeira',
    'encargos financeiros',
    'juros pagos',
    'resultado financeiro negativo',
    'custos financeiros'
  ],
  
  // Patrimônio e Capital
  PATRIMONIO_LIQUIDO: [
    'patrimônio líquido',
    'capital social',
    'reservas',
    'total do patrimônio líquido',
    'patrimonio liquido',
    'pl'
  ],
  
  LUCRO_LIQUIDO: [
    'lucro líquido',
    'resultado líquido',
    'resultado do exercício',
    'lucro do período',
    'lucro liquido',
    'll',
    'resultado liquido'
  ],
  
  // Ativo e Passivo
  ATIVO_CIRCULANTE: [
    'ativo circulante',
    'total do ativo circulante',
    'disponibilidades',
    'aplicações',
    'caixa e equivalentes',
    'ac'
  ],
  
  PASSIVO_CIRCULANTE: [
    'passivo circulante',
    'total do passivo circulante',
    'eventos a pagar',
    'obrigações correntes',
    'pc'
  ],
  
  CAPITAL_TERCEIROS: [
    'capital de terceiros',
    'passivo total',
    'total do passivo',
    'empréstimos e financiamentos',
    'dívidas',
    'financiamentos'
  ],
  
  // Contas específicas
  CONTRAPRESTACOES_RECEBER: [
    'contraprestações a receber',
    'mensalidades a receber',
    'créditos de contraprestações',
    'contas a receber',
    'clientes'
  ],
  
  EVENTOS_PAGAR: [
    'eventos a pagar',
    'provisão para eventos a liquidar',
    'despesas médicas a pagar',
    'provisões técnicas',
    'fornecedores médicos'
  ]
};

// Cliente Supabase
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Função para verificar conectividade com TIPOS CORRETOS
export async function verificarConectividade(): Promise<{ conectado: boolean; erro?: string }> {
  try {
    console.log('🔍 TESTE COM TIPOS CORRETOS');
    console.log('📊 registro_operadora: STRING | reg_ans: STRING');
    
    // Teste da tabela operadoras com tipos corretos
    console.log('🔄 Testando: operadoras (registro_operadora como STRING)');
    const { data, error } = await supabase
      .from('operadoras')
      .select('registro_operadora, razao_social, nome_fantasia, modalidade, cidade')
      .limit(1);
    
    if (error) {
      console.log('❌ ERRO na tabela operadoras:', error);
      return { 
        conectado: false, 
        erro: `Erro na operadoras: ${error.message} (Code: ${error.code})` 
      };
    }
    
    console.log('✅ SUCESSO! Operadoras acessível com tipos corretos');
    console.log(`📊 Dados: ${data?.length || 0} registros`);
    
    if (data && data.length > 0) {
      console.log('📋 Primeiro registro (tipos corretos):');
      console.log('   Registro Operadora (string):', data[0].registro_operadora, typeof data[0].registro_operadora);
      console.log('   Razão Social:', data[0].razao_social);
      console.log('   Nome Fantasia:', data[0].nome_fantasia);
      console.log('   Modalidade:', data[0].modalidade);
      console.log('   Cidade:', data[0].cidade);
    }
    
    return { conectado: true };
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
    console.log('💥 EXCEÇÃO:', errorMessage);
    return { 
      conectado: false, 
      erro: `Exceção: ${errorMessage}` 
    };
  }
}

// Função para testar demonstracoes_financeiras com TIPOS CORRETOS
export async function testarDemonstracaoFinanceiras(): Promise<{ sucesso: boolean; dados?: any[]; erro?: string }> {
  try {
    console.log('🔄 TESTE DEMONSTRAÇÕES - TIPOS CORRETOS');
    console.log('📊 reg_ans: STRING, vl_saldo_final: NUMBER');
    
    const { data, error } = await supabase
      .from('demonstracoes_financeiras')
      .select('id, data, reg_ans, cd_conta_contabil, descricao, vl_saldo_inicial, vl_saldo_final, arquivo_origem, ano, trimestre')
      .limit(5);
    
    if (error) {
      console.log('❌ ERRO em demonstracoes_financeiras:', error);
      return { 
        sucesso: false, 
        erro: `${error.message} (Code: ${error.code})` 
      };
    }
    
    console.log('✅ demonstracoes_financeiras OK com tipos corretos!');
    console.log(`📊 Registros: ${data?.length || 0}`);
    
    if (data && data.length > 0) {
      console.log('📋 Exemplos (verificando tipos):');
      data.forEach((item, i) => {
        console.log(`   ${i + 1}. REG_ANS: "${item.reg_ans}" (tipo: ${typeof item.reg_ans})`);
        console.log(`      Descrição: "${item.descricao}"`);
        console.log(`      Saldo Final: ${item.vl_saldo_final} (tipo: ${typeof item.vl_saldo_final})`);
        console.log(`      Conta: ${item.cd_conta_contabil} | ${item.trimestre}T${item.ano}`);
      });
    }
    
    return { sucesso: true, dados: data };
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
    console.log('💥 EXCEÇÃO em demonstracoes:', errorMessage);
    return { 
      sucesso: false, 
      erro: `Exceção: ${errorMessage}` 
    };
  }
}

// Função para testar beneficiarios_trimestre com TIPOS CORRETOS
export async function testarBeneficiarios(): Promise<{ sucesso: boolean; dados?: any[]; erro?: string }> {
  try {
    console.log('🔄 TESTE BENEFICIÁRIOS - TIPOS CORRETOS');
    console.log('📊 cd_operadoras: STRING, qd_beneficiarios: NUMBER');
    
    const { data, error } = await supabase
      .from('beneficiarios_trimestre')
      .select('cd_operadoras, nm_operadora, qd_beneficiarios, ano, trimestre')
      .limit(5);
    
    if (error) {
      console.log('❌ ERRO em beneficiarios_trimestre:', error);
      return { 
        sucesso: false, 
        erro: `${error.message} (Code: ${error.code})` 
      };
    }
    
    console.log('✅ beneficiarios_trimestre OK com tipos corretos!');
    console.log(`📊 Registros: ${data?.length || 0}`);
    
    if (data && data.length > 0) {
      console.log('📋 Exemplos (verificando tipos):');
      data.forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.nm_operadora}`);
        console.log(`      Código: "${item.cd_operadoras}" (tipo: ${typeof item.cd_operadoras})`);
        console.log(`      Beneficiários: ${item.qd_beneficiarios} (tipo: ${typeof item.qd_beneficiarios})`);
        console.log(`      Período: ${item.trimestre}T${item.ano}`);
      });
    }
    
    return { sucesso: true, dados: data };
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
    console.log('💥 EXCEÇÃO em beneficiarios:', errorMessage);
    return { 
      sucesso: false, 
      erro: `Exceção: ${errorMessage}` 
    };
  }
}

// Função para executar diagnóstico completo com TIPOS CORRETOS
export async function executarDiagnosticoCompleto(): Promise<{
  conectividade: { conectado: boolean; erro?: string };
  tabelas: { [key: string]: { existe: boolean; registros?: number; erro?: string } };
  recomendacoes: string[];
}> {
  console.log('🔍 DIAGNÓSTICO COM TIPOS CORRETOS');
  console.log('📊 Todos os IDs agora são STRING');
  
  const resultado = {
    conectividade: { conectado: false },
    tabelas: {} as { [key: string]: { existe: boolean; registros?: number; erro?: string } },
    recomendacoes: [] as string[]
  };

  // 1. Testar conectividade
  resultado.conectividade = await verificarConectividade();
  
  if (!resultado.conectividade.conectado) {
    resultado.recomendacoes.push('❌ Conectividade básica falhou');
    return resultado;
  }

  // 2. Testar cada tabela com tipos corretos
  const tabelasParaTestar = [
    { 
      nome: 'operadoras', 
      campos: 'registro_operadora, razao_social, nome_fantasia, modalidade, cidade, regiao_de_comercializacao' 
    },
    { 
      nome: 'demonstracoes_financeiras', 
      campos: 'id, data, reg_ans, cd_conta_contabil, descricao, vl_saldo_inicial, vl_saldo_final, ano, trimestre' 
    },
    { 
      nome: 'beneficiarios_trimestre', 
      campos: 'cd_operadoras, nm_operadora, qd_beneficiarios, ano, trimestre' 
    }
  ];

  for (const tabela of tabelasParaTestar) {
    try {
      console.log(`🔄 Testando: ${tabela.nome} (tipos corretos)`);
      
      const { data, error, count } = await supabase
        .from(tabela.nome)
        .select(tabela.campos, { count: 'exact' })
        .limit(1);

      if (error) {
        console.log(`❌ ERRO em ${tabela.nome}:`, error);
        resultado.tabelas[tabela.nome] = {
          existe: false,
          erro: `${error.message} (${error.code})`
        };
        
        if (error.code === 'PGRST116') {
          resultado.recomendacoes.push(`❌ Tabela "${tabela.nome}" não encontrada`);
        } else if (error.message.includes('column') && error.message.includes('does not exist')) {
          resultado.recomendacoes.push(`🔤 Campo inexistente em "${tabela.nome}" - verificar estrutura`);
        }
      } else {
        console.log(`✅ ${tabela.nome}: ${count || 0} registros`);
        resultado.tabelas[tabela.nome] = {
          existe: true,
          registros: count || 0
        };
        
        if (data && data.length > 0) {
          console.log(`📋 Estrutura encontrada em ${tabela.nome}:`, Object.keys(data[0]));
          // Verificar tipos dos campos críticos
          if (tabela.nome === 'operadoras' && data[0].registro_operadora) {
            console.log(`   🔍 Tipo registro_operadora: ${typeof data[0].registro_operadora}`);
          }
          if (tabela.nome === 'demonstracoes_financeiras' && data[0].reg_ans) {
            console.log(`   🔍 Tipo reg_ans: ${typeof data[0].reg_ans}`);
          }
          if (tabela.nome === 'beneficiarios_trimestre' && data[0].cd_operadoras) {
            console.log(`   🔍 Tipo cd_operadoras: ${typeof data[0].cd_operadoras}`);
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.log(`💥 EXCEÇÃO em ${tabela.nome}:`, errorMessage);
      resultado.tabelas[tabela.nome] = {
        existe: false,
        erro: `Exceção: ${errorMessage}`
      };
    }
  }

  // 3. Gerar recomendações
  const tabelasEncontradas = Object.entries(resultado.tabelas)
    .filter(([_, info]) => info.existe).length;

  if (tabelasEncontradas === 0) {
    resultado.recomendacoes.unshift('❌ NENHUMA TABELA encontrada com tipos corretos');
  } else if (tabelasEncontradas < 3) {
    resultado.recomendacoes.unshift(`⚠️ ${tabelasEncontradas}/3 tabelas encontradas`);
  } else {
    resultado.recomendacoes.unshift('✅ TODAS AS TABELAS encontradas com tipos corretos (IDs como STRING)');
  }

  console.log('📋 Diagnóstico com tipos corretos finalizado:', resultado);
  return resultado;
}

// Função utilitária para normalizar texto para comparação
export function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s]/g, ' ') // Remove pontuação
    .replace(/\s+/g, ' ') // Normaliza espaços
    .trim();
}

// Função para encontrar categoria por descrição
export function encontrarCategoriaPorDescricao(descricao: string): string | null {
  const descricaoNormalizada = normalizarTexto(descricao);
  
  for (const [categoria, padroes] of Object.entries(MAPEAMENTO_CONTAS)) {
    for (const padrao of padroes) {
      if (descricaoNormalizada.includes(normalizarTexto(padrao))) {
        return categoria;
      }
    }
  }
  
  return null;
}

// Função para somar valores por categoria usando vl_saldo_final
export function somarPorCategoria(demonstracoes: DemonstracaoFinanceira[], categoria: keyof typeof MAPEAMENTO_CONTAS): number {
  const padroes = MAPEAMENTO_CONTAS[categoria];
  
  const registrosFiltrados = demonstracoes.filter(demo => {
    const descricaoNormalizada = normalizarTexto(demo.descricao);
    return padroes.some(padrao => descricaoNormalizada.includes(normalizarTexto(padrao)));
  });
  
  // Usar vl_saldo_final como valor principal
  const total = registrosFiltrados.reduce((total, demo) => total + (demo.vl_saldo_final || 0), 0);
  
  // Log para depuração
  if (registrosFiltrados.length > 0) {
    console.log(`    ✅ ${categoria}: ${registrosFiltrados.length} registros encontrados`);
    registrosFiltrados.forEach(reg => {
      console.log(`      - REG_ANS "${reg.reg_ans}": "${reg.descricao}"`);
      console.log(`        Saldo Final: R$ ${reg.vl_saldo_final?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
      console.log(`        Conta: ${reg.cd_conta_contabil} | ${reg.trimestre}T${reg.ano}`);
    });
  }
  
  return total;
}

// Função de teste rápido com TIPOS CORRETOS
export async function testeRapidoEDireto(): Promise<void> {
  console.log('🚀 TESTE RÁPIDO - TIPOS CORRETOS');
  console.log('📊 Todos os IDs agora são STRING');
  console.log('=' .repeat(50));
  
  // Teste 1: Operadoras com tipos corretos
  console.log('1️⃣ Testando operadoras (registro_operadora: STRING)...');
  try {
    const { data: ops, error: errOps } = await supabase
      .from('operadoras')
      .select('registro_operadora, razao_social, nome_fantasia, modalidade, cidade')
      .limit(3);
    
    if (errOps) {
      console.log('❌ Erro operadoras:', errOps.message);
    } else {
      console.log(`✅ ${ops?.length || 0} operadoras encontradas`);
      ops?.forEach(op => {
        console.log(`   - ${op.razao_social} (REG: "${op.registro_operadora}" - tipo: ${typeof op.registro_operadora})`);
        console.log(`     ${op.cidade} - ${op.modalidade}`);
      });
    }
  } catch (e) {
    console.log('💥 Exceção operadoras:', e);
  }
  
  // Teste 2: Demonstrações com tipos corretos
  console.log('\n2️⃣ Testando demonstracoes_financeiras (reg_ans: STRING)...');
  try {
    const { data: demos, error: errDemos } = await supabase
      .from('demonstracoes_financeiras')
      .select('reg_ans, ano, trimestre, descricao, vl_saldo_final, cd_conta_contabil')
      .limit(3);
    
    if (errDemos) {
      console.log('❌ Erro demonstracoes:', errDemos.message);
    } else {
      console.log(`✅ ${demos?.length || 0} demonstrações encontradas`);
      demos?.forEach(demo => {
        console.log(`   - REG_ANS "${demo.reg_ans}" (tipo: ${typeof demo.reg_ans}): ${demo.descricao}`);
        console.log(`     Valor: R$ ${demo.vl_saldo_final} | Conta: ${demo.cd_conta_contabil} | ${demo.trimestre}T${demo.ano}`);
      });
    }
  } catch (e) {
    console.log('💥 Exceção demonstracoes:', e);
  }
  
  // Teste 3: Beneficiários com tipos corretos
  console.log('\n3️⃣ Testando beneficiarios_trimestre (cd_operadoras: STRING)...');
  try {
    const { data: bens, error: errBens } = await supabase
      .from('beneficiarios_trimestre')
      .select('cd_operadoras, nm_operadora, qd_beneficiarios, ano, trimestre')
      .limit(3);
    
    if (errBens) {
      console.log('❌ Erro beneficiarios:', errBens.message);
    } else {
      console.log(`✅ ${bens?.length || 0} registros de beneficiários encontrados`);
      bens?.forEach(ben => {
        console.log(`   - ${ben.nm_operadora} (Código: "${ben.cd_operadoras}" - tipo: ${typeof ben.cd_operadoras})`);
        console.log(`     ${ben.qd_beneficiarios} beneficiários em ${ben.trimestre}T${ben.ano}`);
      });
    }
  } catch (e) {
    console.log('💥 Exceção beneficiarios:', e);
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('🏁 Teste com tipos corretos concluído!');
}