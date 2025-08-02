import { 
  supabase, 
  DemonstracaoFinanceira, 
  Operadora,
  BeneficiariosTrimestre,
  IndicadoresRN518, 
  OperadoraInfo, 
  MAPEAMENTO_CONTAS,
  verificarConectividade, 
  executarDiagnosticoCompleto,
  somarPorCategoria,
  testeRapidoEDireto,
  testarDemonstracaoFinanceiras,
  testarBeneficiarios
} from '../utils/supabase/client';

export class DemonstracoesService {
  private conexao_testada = false;
  private ultimo_erro: string | null = null;
  private diagnostico_completo: any = null;
  private operadoras_cache: Map<string, Operadora> = new Map(); // Chave: STRING!

  // Teste com TIPOS CORRETOS (todos os IDs são STRING)
  private async testarConexao(): Promise<boolean> {
    console.log('🚀 TESTE COM TIPOS CORRETOS');
    console.log('📊 registro_operadora: STRING | reg_ans: STRING | cd_operadoras: STRING');
    
    // SEMPRE LIMPA CACHE
    this.conexao_testada = false;
    this.ultimo_erro = null;
    this.operadoras_cache.clear();

    try {
      // Executar teste rápido com tipos corretos
      await testeRapidoEDireto();
      
      // Teste de conectividade básica
      const conectividade = await verificarConectividade();
      if (!conectividade.conectado) {
        this.ultimo_erro = conectividade.erro || 'Falha na conectividade';
        this.conexao_testada = true;
        return false;
      }

      console.log('✅ CONECTIVIDADE OK!');

      // Teste detalhado das operadoras com tipos corretos
      console.log('🔍 Teste detalhado: operadoras (STRING)');
      const { data: operadoras, error: errorOperadoras } = await supabase
        .from('operadoras')
        .select(`
          registro_operadora, 
          razao_social, 
          nome_fantasia, 
          modalidade, 
          logradouro, 
          numero, 
          complemento, 
          bairro, 
          cidade, 
          cep, 
          regiao_de_comercializacao, 
          data_registro_ans,
          data_descredenciamento,
          motivo_do_descredenciamento
        `)
        .limit(5);

      if (errorOperadoras) {
        console.log('❌ ERRO nas operadoras:', errorOperadoras);
        this.ultimo_erro = `Erro na tabela operadoras: ${errorOperadoras.message}`;
        this.conexao_testada = true;
        return false;
      }

      console.log(`✅ ${operadoras?.length || 0} operadoras encontradas`);
      
      if (operadoras && operadoras.length > 0) {
        console.log('📋 OPERADORAS ENCONTRADAS (tipos corretos):');
        operadoras.forEach((op, i) => {
          console.log(`   ${i + 1}. ${op.razao_social} (REG: "${op.registro_operadora}" - tipo: ${typeof op.registro_operadora})`);
          console.log(`      Nome Fantasia: ${op.nome_fantasia || 'N/A'}`);
          console.log(`      Modalidade: ${op.modalidade} | Cidade: ${op.cidade || 'N/A'}`);
          console.log(`      Região: ${op.regiao_de_comercializacao || 'N/A'}`);
          console.log(`      Ativo: ${!op.data_descredenciamento ? 'Sim' : 'Não'}`);
        });
      }

      // Teste detalhado das demonstrações com tipos corretos
      console.log('🔍 Teste detalhado: demonstracoes_financeiras (STRING)');
      const testeDemos = await testarDemonstracaoFinanceiras();
      if (!testeDemos.sucesso) {
        this.ultimo_erro = `Erro na tabela demonstracoes_financeiras: ${testeDemos.erro}`;
        this.conexao_testada = true;
        return false;
      }

      console.log('✅ demonstracoes_financeiras OK com tipos corretos!');

      // Teste detalhado dos beneficiários
      console.log('🔍 Teste detalhado: beneficiarios_trimestre (STRING)');
      const testeBens = await testarBeneficiarios();
      if (!testeBens.sucesso) {
        console.log('⚠️ beneficiarios_trimestre não disponível:', testeBens.erro);
        // Não falha se beneficiários não estiver disponível
      } else {
        console.log('✅ beneficiarios_trimestre OK com tipos corretos!');
      }

      console.log('🎉 TUDO FUNCIONANDO COM TIPOS CORRETOS (STRING)!');
      this.conexao_testada = true;
      this.ultimo_erro = null;
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.log('💥 ERRO no teste:', errorMessage);
      this.ultimo_erro = `Erro de conexão: ${errorMessage}`;
      this.conexao_testada = true;
      return false;
    }
  }

  // Buscar operadoras usando TIPOS CORRETOS
  async buscarOperadoras(): Promise<OperadoraInfo[]> {
    console.log('🏢 Buscando operadoras (tipos corretos)...');
    
    const conexaoOk = await this.testarConexao();
    if (!conexaoOk) {
      throw new Error(`Conexão falhou: ${this.ultimo_erro || 'Erro desconhecido'}`);
    }

    const { data: operadoras, error } = await supabase
      .from('operadoras')
      .select(`
        registro_operadora, 
        razao_social, 
        nome_fantasia, 
        modalidade, 
        cidade, 
        regiao_de_comercializacao,
        data_registro_ans,
        data_descredenciamento
      `)
      .order('razao_social');

    if (error) {
      console.error('❌ Erro ao buscar operadoras:', error);
      throw new Error(`Erro ao buscar operadoras: ${error.message}`);
    }

    if (!operadoras || operadoras.length === 0) {
      throw new Error('Nenhuma operadora encontrada');
    }

    // Filtrar operadoras ativas (sem data de descredenciamento)
    const operadorasAtivas = operadoras.filter(op => !op.data_descredenciamento);
    console.log(`✅ ${operadorasAtivas.length} operadoras ativas de ${operadoras.length} total`);

    // Cache usando registro_operadora como chave (STRING)
    this.operadoras_cache.clear();
    operadorasAtivas.forEach(op => {
      this.operadoras_cache.set(op.registro_operadora, op); // STRING como chave
    });

    // Converter para formato da aplicação
    const operadorasInfo: OperadoraInfo[] = operadorasAtivas.map(op => {
      // Extrair UF da região de comercialização ou deixar como padrão
      let uf = 'BR';
      if (op.regiao_de_comercializacao) {
        const match = op.regiao_de_comercializacao.match(/\b([A-Z]{2})\b/);
        if (match) uf = match[1];
      }

      return {
        reg_ans: op.registro_operadora, // STRING!
        nome: op.nome_fantasia || op.razao_social,
        municipio: op.cidade || 'N/A',
        uf: uf,
        total_beneficiarios: undefined
      };
    });

    console.log('📋 Operadoras processadas (tipos corretos):');
    operadorasInfo.slice(0, 3).forEach(op => {
      console.log(`   - ${op.nome} (REG_ANS: "${op.reg_ans}" - tipo: ${typeof op.reg_ans}) - ${op.municipio}/${op.uf}`);
    });
    
    return operadorasInfo;
  }

  // Buscar demonstrações usando TIPOS CORRETOS
  async buscarDemonstracoes(ano?: number, trimestre?: number, regAns?: string): Promise<DemonstracaoFinanceira[]> {
    console.log(`📊 Buscando demonstrações (tipos corretos)...`);
    console.log(`🔍 Filtros: ano=${ano || 'todos'}, trimestre=${trimestre || 'todos'}, reg_ans="${regAns || 'todas'}"`);
    
    const conexaoOk = await this.testarConexao();
    if (!conexaoOk) {
      throw new Error(`Conexão falhou: ${this.ultimo_erro || 'Erro desconhecido'}`);
    }

    // Construir query das demonstrações com campos reais
    let query = supabase
      .from('demonstracoes_financeiras')
      .select(`
        id, 
        data, 
        reg_ans, 
        cd_conta_contabil, 
        descricao, 
        vl_saldo_inicial, 
        vl_saldo_final, 
        arquivo_origem, 
        ano, 
        trimestre
      `);

    // Aplicar filtros
    if (regAns) {
      query = query.eq('reg_ans', regAns); // STRING!
      console.log(`🎯 Filtrando por REG_ANS: "${regAns}" (tipo: ${typeof regAns})`);
    }

    if (ano) {
      query = query.eq('ano', ano);
      console.log(`📅 Filtrando por ano: ${ano}`);
    }

    if (trimestre) {
      query = query.eq('trimestre', trimestre);
      console.log(`📅 Filtrando por trimestre: ${trimestre}`);
    }

    const { data: demonstracoes, error: errorDemonstracoes } = await query;

    if (errorDemonstracoes) {
      throw new Error(`Erro ao buscar demonstrações: ${errorDemonstracoes.message}`);
    }

    console.log(`✅ ${demonstracoes?.length || 0} demonstrações encontradas`);

    if (demonstracoes && demonstracoes.length > 0) {
      // Estatísticas
      const regsAnsUnicos = [...new Set(demonstracoes.map(d => d.reg_ans))].sort();
      const anos = [...new Set(demonstracoes.map(d => d.ano))].sort();
      const trimestres = [...new Set(demonstracoes.map(d => d.trimestre))].sort();
      const contasContabeis = [...new Set(demonstracoes.map(d => d.cd_conta_contabil))];
      
      console.log(`🏢 REG_ANS únicos: ${regsAnsUnicos.length} operadoras`);
      console.log(`📈 Anos: ${anos.join(', ')}`);
      console.log(`📊 Trimestres: ${trimestres.join(', ')}`);
      console.log(`🔢 Contas contábeis: ${contasContabeis.length} diferentes`);
      
      // Verificar tipos dos dados críticos
      const primeiroRegistro = demonstracoes[0];
      console.log(`🔍 Verificação de tipos:`);
      console.log(`   reg_ans: "${primeiroRegistro.reg_ans}" (tipo: ${typeof primeiroRegistro.reg_ans})`);
      console.log(`   vl_saldo_final: ${primeiroRegistro.vl_saldo_final} (tipo: ${typeof primeiroRegistro.vl_saldo_final})`);
      
      // Amostra de descrições e valores
      const amostraDescricoes = [...new Set(demonstracoes.map(d => d.descricao))].slice(0, 5);
      console.log(`📝 Amostra de descrições:`);
      amostraDescricoes.forEach((desc, i) => {
        const exemploRegistro = demonstracoes.find(d => d.descricao === desc);
        console.log(`   ${i + 1}. "${desc}"`);
        if (exemploRegistro) {
          console.log(`      REG_ANS: "${exemploRegistro.reg_ans}" | Valor: R$ ${exemploRegistro.vl_saldo_final?.toLocaleString('pt-BR')} | Conta: ${exemploRegistro.cd_conta_contabil}`);
        }
      });
    }

    return demonstracoes || [];
  }

  // Carregar beneficiários para operadora (se disponível) - TIPOS CORRETOS
  async carregarBeneficiarios(regAns: string, ano: number, trimestre: number): Promise<number | null> {
    try {
      console.log(`👥 Buscando beneficiários para REG_ANS "${regAns}" em ${trimestre}T${ano}...`);
      
      const { data: beneficiarios, error } = await supabase
        .from('beneficiarios_trimestre')
        .select('cd_operadoras, nm_operadora, qd_beneficiarios, ano, trimestre')
        .eq('cd_operadoras', regAns) // STRING!
        .eq('ano', ano)
        .eq('trimestre', trimestre)
        .limit(1);

      if (error) {
        console.log(`⚠️ Erro ao buscar beneficiários: ${error.message}`);
        return null;
      }

      if (beneficiarios && beneficiarios.length > 0) {
        const qtdBeneficiarios = beneficiarios[0].qd_beneficiarios;
        console.log(`✅ ${qtdBeneficiarios} beneficiários encontrados para ${beneficiarios[0].nm_operadora}`);
        console.log(`   cd_operadoras: "${beneficiarios[0].cd_operadoras}" (tipo: ${typeof beneficiarios[0].cd_operadoras})`);
        return qtdBeneficiarios;
      }

      console.log(`📊 Nenhum dado de beneficiários para REG_ANS "${regAns}" em ${trimestre}T${ano}`);
      return null;
    } catch (error) {
      console.log(`⚠️ Erro ao acessar beneficiários: ${error}`);
      return null;
    }
  }

  // Calcular indicadores para operadora específica com TIPOS CORRETOS
  async calcularIndicadoresRN518(regAns: string, ano: number, trimestre: number): Promise<IndicadoresRN518 | null> {
    console.log(`🧮 Calculando indicadores RN 518 - TIPOS CORRETOS`);
    console.log(`   REG_ANS: "${regAns}" (tipo: ${typeof regAns}) | Período: ${trimestre}T${ano}`);
    console.log(`   Usando: vl_saldo_final, cd_conta_contabil, descricao`);

    const demonstracoes = await this.buscarDemonstracoes(ano, trimestre, regAns);

    if (!demonstracoes || demonstracoes.length === 0) {
      console.log(`📊 Sem dados para REG_ANS "${regAns}" em ${trimestre}T${ano}`);
      return null;
    }

    console.log(`💰 Processando ${demonstracoes.length} registros contábeis para REG_ANS "${regAns}"...`);
    
    // Mostrar amostra dos dados recebidos
    console.log(`📋 Amostra dos dados (primeiros 3 registros):`);
    demonstracoes.slice(0, 3).forEach((demo, i) => {
      console.log(`   ${i + 1}. "${demo.descricao}" - R$ ${demo.vl_saldo_final?.toLocaleString('pt-BR')}`);
      console.log(`      REG_ANS: "${demo.reg_ans}" | Conta: ${demo.cd_conta_contabil} | Arquivo: ${demo.arquivo_origem}`);
    });

    // Função para calcular cada categoria
    const calcularCategoria = (categoria: keyof typeof MAPEAMENTO_CONTAS): number => {
      console.log(`  🔍 Calculando ${categoria}...`);
      const valor = somarPorCategoria(demonstracoes, categoria);
      const valorFormatado = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      
      if (valor !== 0) {
        console.log(`    ✅ ${categoria}: ${valorFormatado}`);
      } else {
        console.log(`    ⚠️ ${categoria}: ${valorFormatado} (sem registros encontrados)`);
      }
      return valor;
    };

    // Calcular todos os valores necessários usando vl_saldo_final
    const receitaContraprestacoes = calcularCategoria('RECEITA_CONTRAPRESTACOES');
    const receitaTotal = calcularCategoria('RECEITA_TOTAL') || receitaContraprestacoes;
    const despesasMedicas = calcularCategoria('DESPESAS_MEDICAS');
    const despesasAdmin = calcularCategoria('DESPESAS_ADMINISTRATIVAS');
    const despesasComerciais = calcularCategoria('DESPESAS_COMERCIAIS');
    const patrimonioLiquido = calcularCategoria('PATRIMONIO_LIQUIDO');
    const lucroLiquido = calcularCategoria('LUCRO_LIQUIDO');
    const ativoCirculante = calcularCategoria('ATIVO_CIRCULANTE');
    const passivoCirculante = calcularCategoria('PASSIVO_CIRCULANTE');
    const capitalTerceiros = calcularCategoria('CAPITAL_TERCEIROS');
    const contraprestacaoReceber = calcularCategoria('CONTRAPRESTACOES_RECEBER');
    const eventosPagar = calcularCategoria('EVENTOS_PAGAR');
    const receitasFinanceiras = calcularCategoria('RECEITAS_FINANCEIRAS');
    const despesasFinanceiras = calcularCategoria('DESPESAS_FINANCEIRAS');

    // Validação mínima
    const totalReceitas = Math.max(receitaTotal, receitaContraprestacoes);
    if (totalReceitas === 0) {
      console.log(`⚠️ NENHUMA RECEITA ENCONTRADA para REG_ANS "${regAns}"`);
      console.log('💡 Verificar se as descrições nas demonstrações correspondem aos padrões de mapeamento');
      
      // Mostrar todas as descrições para diagnóstico
      const todasDescricoes = demonstracoes.map(d => d.descricao);
      console.log('📝 Todas as descrições encontradas:');
      todasDescricoes.slice(0, 10).forEach((desc, i) => {
        console.log(`   ${i + 1}. "${desc}"`);
      });
      
      return null;
    }

    // Carregar beneficiários se disponível
    const beneficiarios = await this.carregarBeneficiarios(regAns, ano, trimestre);

    // Calcular os 11 indicadores obrigatórios da RN 518
    const indicadores: IndicadoresRN518 = {
      reg_ans: regAns, // STRING!
      ano,
      trimestre,
      
      // 1. MLL - Margem de Lucro Líquida (%)
      mll: totalReceitas > 0 ? (lucroLiquido / totalReceitas) * 100 : 0,
      
      // 2. ROE - Retorno sobre o Patrimônio Líquido (%)
      roe: patrimonioLiquido > 0 ? (lucroLiquido / patrimonioLiquido) * 100 : 0,
      
      // 3. DM - Sinistralidade / Despesas Médicas (%)
      dm: receitaContraprestacoes > 0 ? (despesasMedicas / receitaContraprestacoes) * 100 : 0,
      
      // 4. DA - Despesas Administrativas (%)
      da: totalReceitas > 0 ? (despesasAdmin / totalReceitas) * 100 : 0,
      
      // 5. DC - Despesas Comerciais (%)
      dc: totalReceitas > 0 ? (despesasComerciais / totalReceitas) * 100 : 0,
      
      // 6. DOP - Despesas Operacionais (%)
      dop: totalReceitas > 0 ? ((despesasAdmin + despesasComerciais + despesasMedicas) / totalReceitas) * 100 : 0,
      
      // 7. IRF - Resultado Financeiro (%)
      irf: totalReceitas > 0 ? ((receitasFinanceiras - despesasFinanceiras) / totalReceitas) * 100 : 0,
      
      // 8. LC - Liquidez Corrente (índice)
      lc: passivoCirculante > 0 ? ativoCirculante / passivoCirculante : 0,
      
      // 9. CT/CP - Capital de Terceiros sobre Capital Próprio (%)
      ctcp: patrimonioLiquido > 0 ? (capitalTerceiros / patrimonioLiquido) * 100 : 0,
      
      // 10. PMCR - Prazo Médio de Contraprestações a Receber (dias)
      pmcr: receitaContraprestacoes > 0 ? (contraprestacaoReceber / (receitaContraprestacoes / 90)) : 0,
      
      // 11. PMPE - Prazo Médio de Pagamento de Eventos (dias)
      pmpe: despesasMedicas > 0 ? (eventosPagar / (despesasMedicas / 90)) : 0
    };

    console.log(`✅ INDICADORES CALCULADOS para REG_ANS "${regAns}" (tipos corretos):`);
    console.log(`   MLL: ${indicadores.mll.toFixed(1)}% | ROE: ${indicadores.roe.toFixed(1)}% | Sinistralidade: ${indicadores.dm.toFixed(1)}%`);
    console.log(`   Liquidez: ${indicadores.lc.toFixed(2)} | Desp.Operac: ${indicadores.dop.toFixed(1)}%`);
    
    if (beneficiarios) {
      console.log(`   👥 Beneficiários: ${beneficiarios.toLocaleString('pt-BR')}`);
    }

    return indicadores;
  }

  // Calcular para todas as operadoras
  async calcularIndicadoresPeriodo(ano: number, trimestre: number): Promise<IndicadoresRN518[]> {
    console.log(`🔄 CALCULANDO PARA TODAS AS OPERADORAS - ${trimestre}T${ano}`);
    console.log(`📊 Usando tipos corretos: vl_saldo_final, reg_ans: STRING`);

    const operadoras = await this.buscarOperadoras();
    const indicadores: IndicadoresRN518[] = [];

    console.log(`📈 Processando ${operadoras.length} operadoras...`);

    let processadas = 0;
    let comDados = 0;
    let semDados = 0;

    for (const operadora of operadoras) {
      try {
        processadas++;
        console.log(`\n[${processadas}/${operadoras.length}] ${operadora.nome} (REG_ANS: "${operadora.reg_ans}")`);
        
        const indicador = await this.calcularIndicadoresRN518(operadora.reg_ans, ano, trimestre);
        
        if (indicador) {
          indicadores.push(indicador);
          comDados++;
          console.log(`  ✅ Sucesso - Indicadores calculados`);
        } else {
          semDados++;
          console.log(`  ⚠️ Sem dados suficientes`);
        }
        
      } catch (error) {
        semDados++;
        console.error(`  💥 Erro: ${error}`);
      }
    }

    console.log(`\n🎉 PROCESSAMENTO CONCLUÍDO (tipos corretos)!`);
    console.log(`📊 Resultado: ${comDados} operadoras com dados | ${semDados} sem dados | ${processadas} total`);
    
    if (comDados > 0) {
      const exemplo = indicadores[0];
      console.log(`📋 Exemplo (REG_ANS "${exemplo.reg_ans}"): MLL=${exemplo.mll.toFixed(1)}%, ROE=${exemplo.roe.toFixed(1)}%, DM=${exemplo.dm.toFixed(1)}%`);
    }
    
    return indicadores;
  }

  // Calcular média consolidada
  calcularMediaConsolidada(indicadores: IndicadoresRN518[]): Omit<IndicadoresRN518, 'reg_ans'> | null {
    if (!indicadores || indicadores.length === 0) return null;

    const soma = indicadores.reduce((acc, curr) => ({
      mll: acc.mll + (curr.mll || 0),
      roe: acc.roe + (curr.roe || 0),
      dm: acc.dm + (curr.dm || 0),
      da: acc.da + (curr.da || 0),
      dc: acc.dc + (curr.dc || 0),
      dop: acc.dop + (curr.dop || 0),
      irf: acc.irf + (curr.irf || 0),
      lc: acc.lc + (curr.lc || 0),
      ctcp: acc.ctcp + (curr.ctcp || 0),
      pmcr: acc.pmcr + (curr.pmcr || 0),
      pmpe: acc.pmpe + (curr.pmpe || 0)
    }), {
      mll: 0, roe: 0, dm: 0, da: 0, dc: 0, dop: 0, irf: 0, lc: 0, ctcp: 0, pmcr: 0, pmpe: 0
    });

    const count = indicadores.length;
    const primeiro = indicadores[0];

    const media = {
      ano: primeiro.ano,
      trimestre: primeiro.trimestre,
      mll: Number((soma.mll / count).toFixed(1)),
      roe: Number((soma.roe / count).toFixed(1)),
      dm: Number((soma.dm / count).toFixed(1)),
      da: Number((soma.da / count).toFixed(1)),
      dc: Number((soma.dc / count).toFixed(1)),
      dop: Number((soma.dop / count).toFixed(1)),
      irf: Number((soma.irf / count).toFixed(1)),
      lc: Number((soma.lc / count).toFixed(2)),
      ctcp: Number((soma.ctcp / count).toFixed(1)),
      pmcr: Math.round(soma.pmcr / count),
      pmpe: Math.round(soma.pmpe / count)
    };

    console.log(`📊 Média consolidada de ${count} operadoras: MLL=${media.mll}%, ROE=${media.roe}%, DM=${media.dm}%`);
    
    return media;
  }

  // Buscar metadados
  async buscarMetadados() {
    const conexaoOk = await this.testarConexao();
    if (!conexaoOk) {
      throw new Error(`Conexão falhou: ${this.ultimo_erro || 'Erro desconhecido'}`);
    }

    const { data, error } = await supabase
      .from('demonstracoes_financeiras')
      .select('data, ano, trimestre, reg_ans, arquivo_origem')
      .order('data', { ascending: false })
      .limit(1);

    if (error) {
      throw error;
    }

    const metadados = data?.[0];
    if (metadados) {
      console.log(`📅 Última atualização: ${metadados.data} | REG_ANS: "${metadados.reg_ans}" | ${metadados.trimestre}T${metadados.ano}`);
      console.log(`📁 Arquivo origem: ${metadados.arquivo_origem}`);
    }

    return metadados || null;
  }

  // Verificar status da conexão
  async verificarStatusConexao(): Promise<{
    conectado: boolean;
    tabelaEncontrada: string | null;
    erro?: string;
    diagnostico?: string;
  }> {
    console.log('🔍 VERIFICANDO STATUS - Tipos corretos');
    
    // Sempre testa de novo
    this.conexao_testada = false;
    this.ultimo_erro = null;
    
    try {
      const conexaoOk = await this.testarConexao();
      
      if (conexaoOk) {
        return {
          conectado: true,
          tabelaEncontrada: 'public.operadoras (registro_operadora: STRING), public.demonstracoes_financeiras (reg_ans: STRING, vl_saldo_final: NUMBER), public.beneficiarios_trimestre (cd_operadoras: STRING)'
        };
      } else {
        return {
          conectado: false,
          tabelaEncontrada: null,
          erro: this.ultimo_erro || 'Conexão falhou',
          diagnostico: 'Tipos corretos: registro_operadora: STRING | reg_ans: STRING | cd_operadoras: STRING'
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      
      return {
        conectado: false,
        tabelaEncontrada: null,
        erro: `Erro: ${errorMessage}`
      };
    }
  }

  // Executar diagnóstico
  async executarDiagnostico(): Promise<{
    status: string;
    detalhes: any;
    sugestoes: string[];
  }> {
    console.log('🔍 DIAGNÓSTICO - Tipos corretos');
    
    this.conexao_testada = false;
    this.ultimo_erro = null;
    
    const resultado = {
      status: 'unknown',
      detalhes: {} as any,
      sugestoes: [] as string[]
    };

    try {
      resultado.detalhes = await executarDiagnosticoCompleto();
      resultado.sugestoes = resultado.detalhes.recomendacoes;

      if (resultado.detalhes.conectividade.conectado) {
        const tabelasEncontradas = Object.entries(resultado.detalhes.tabelas)
          .filter(([_, info]: [string, any]) => info.existe).length;

        if (tabelasEncontradas >= 2) {
          resultado.status = 'success';
          resultado.sugestoes.unshift('✅ Tipos corretos funcionando: registro_operadora: STRING | reg_ans: STRING');
        } else {
          resultado.status = 'warning';
        }
      } else {
        resultado.status = 'error';
      }

    } catch (error) {
      resultado.status = 'error';
      resultado.detalhes.erro = error instanceof Error ? error.message : 'Erro desconhecido';
      resultado.sugestoes = ['Erro durante diagnóstico'];
    }

    return resultado;
  }

  // Reset da conexão
  resetarConexao(): void {
    console.log('🔄 RESET - Testará tipos corretos na próxima operação');
    this.conexao_testada = false;
    this.ultimo_erro = null;
    this.diagnostico_completo = null;
    this.operadoras_cache.clear();
  }
}

export const demonstracoesService = new DemonstracoesService();