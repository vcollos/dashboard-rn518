import { useState, useEffect, useCallback } from 'react';
import { demonstracoesService } from '../services/demonstracoesService';
import { IndicadoresRN518, OperadoraInfo } from '../utils/supabase/client';

interface StatusConexao {
  conectado: boolean;
  tabelaEncontrada: string | null;
  erro?: string;
  diagnostico?: string;
}

export function useIndicadoresFinanceiros() {
  const [operadoras, setOperadoras] = useState<OperadoraInfo[]>([]);
  const [indicadores, setIndicadores] = useState<IndicadoresRN518[]>([]);
  const [mediaConsolidada, setMediaConsolidada] = useState<Omit<IndicadoresRN518, 'reg_ans'> | null>(null);
  const [metadados, setMetadados] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusConexao, setStatusConexao] = useState<StatusConexao>({ conectado: false, tabelaEncontrada: null });

  // Verificar status da conexão
  const verificarConexao = useCallback(async () => {
    try {
      console.log('🔍 Verificando conexão com Supabase...');
      const status = await demonstracoesService.verificarStatusConexao();
      setStatusConexao(status);
      
      if (!status.conectado) {
        setError(status.erro || 'Banco de dados não disponível');
        console.log('❌ Conexão falhou:', status.erro);
        
        // Log do diagnóstico se disponível
        if (status.diagnostico) {
          console.log('🔍 Diagnóstico detalhado:');
          console.log(status.diagnostico);
        }
      } else {
        setError(null);
        console.log(`✅ Conexão estabelecida com: ${status.tabelaEncontrada}`);
      }
      
      return status.conectado;
    } catch (err) {
      console.error('💥 Erro ao verificar conexão:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro de conexão';
      setStatusConexao({ conectado: false, tabelaEncontrada: null, erro: errorMessage });
      setError(`Erro de conexão: ${errorMessage}`);
      return false;
    }
  }, []);

  // Carregar operadoras disponíveis
  const carregarOperadoras = useCallback(async () => {
    try {
      setError(null);
      console.log('🏢 Carregando operadoras...');
      
      const operadorasData = await demonstracoesService.buscarOperadoras();
      setOperadoras(operadorasData);
      
      console.log(`✅ Operadoras carregadas: ${operadorasData.length} encontradas`);
    } catch (err) {
      console.error('💥 Erro ao carregar operadoras:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      
      // Verificar se é erro de schema/configuração
      if (errorMessage.includes('Schema não exposto') || errorMessage.includes('PGRST301')) {
        setError(`Configuração necessária: ${errorMessage}`);
      } else if (errorMessage.includes('permissão') || errorMessage.includes('permission')) {
        setError(`Erro de permissão: ${errorMessage}`);
      } else {
        setError(`Erro ao carregar operadoras: ${errorMessage}`);
      }
      
      setOperadoras([]);
    }
  }, []);

  // Carregar indicadores para um período específico
  const carregarIndicadores = useCallback(async (ano: number, trimestre: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`📊 Carregando indicadores para ${trimestre}T${ano}...`);

      const indicadoresData = await demonstracoesService.calcularIndicadoresPeriodo(ano, trimestre);
      
      if (indicadoresData.length === 0) {
        const mensagem = `Nenhum dado encontrado para ${trimestre}º Trimestre de ${ano}`;
        setError(mensagem);
        setIndicadores([]);
        setMediaConsolidada(null);
        console.log(`📊 ${mensagem}`);
      } else {
        setIndicadores(indicadoresData);
        const media = demonstracoesService.calcularMediaConsolidada(indicadoresData);
        setMediaConsolidada(media);
        console.log(`✅ Indicadores processados: ${indicadoresData.length} operadoras para ${trimestre}T${ano}`);
      }

    } catch (err) {
      console.error('💥 Erro ao carregar indicadores:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      
      // Categorizar tipos de erro
      if (errorMessage.includes('Schema não exposto') || errorMessage.includes('PGRST301')) {
        setError(`⚙️ Configuração necessária: Exponha o schema "demonstracoes" na API do Supabase`);
      } else if (errorMessage.includes('42P01') || errorMessage.includes('não encontrada')) {
        setError(`🔍 Tabela não encontrada: Verifique se a tabela existe no schema correto`);
      } else if (errorMessage.includes('permissão') || errorMessage.includes('RLS')) {
        setError(`🔒 Acesso negado: Configure as políticas RLS (Row Level Security)`);
      } else if (errorMessage.includes('JWT') || errorMessage.includes('auth')) {
        setError(`🔐 Erro de autenticação: Verifique a chave ANON do projeto`);
      } else {
        setError(`❌ Erro ao processar dados financeiros: ${errorMessage}`);
      }
      
      setIndicadores([]);
      setMediaConsolidada(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar metadados
  const carregarMetadados = useCallback(async () => {
    try {
      console.log('📋 Carregando metadados...');
      const metadadosData = await demonstracoesService.buscarMetadados();
      setMetadados(metadadosData);
      console.log('✅ Metadados carregados');
    } catch (err) {
      console.error('💥 Erro ao carregar metadados:', err);
      setMetadados(null);
    }
  }, []);

  // Buscar indicador específico de uma operadora
  const buscarIndicadorOperadora = useCallback((regAns: string): IndicadoresRN518 | undefined => {
    return indicadores.find(ind => ind.reg_ans === regAns);
  }, [indicadores]);

  // Buscar histórico de uma operadora
  const buscarHistoricoOperadora = useCallback(async (regAns: string): Promise<IndicadoresRN518[]> => {
    try {
      console.log(`📈 Buscando histórico da operadora ${regAns}...`);
      const historico: IndicadoresRN518[] = [];
      
      // Buscar últimos 5 períodos
      const periodos = [
        { ano: 2024, trimestre: 4 },
        { ano: 2024, trimestre: 3 },
        { ano: 2024, trimestre: 2 },
        { ano: 2024, trimestre: 1 },
        { ano: 2023, trimestre: 4 }
      ];

      for (const periodo of periodos) {
        try {
          const indicador = await demonstracoesService.calcularIndicadoresRN518(regAns, periodo.ano, periodo.trimestre);
          if (indicador) {
            historico.push(indicador);
          }
        } catch (periodoError) {
          console.log(`📊 Dados não encontrados para operadora ${regAns} em ${periodo.trimestre}T${periodo.ano}`);
        }
      }

      const historicoOrdenado = historico.sort((a, b) => {
        if (a.ano !== b.ano) return a.ano - b.ano;
        return a.trimestre - b.trimestre;
      });

      console.log(`✅ Histórico carregado: ${historicoOrdenado.length} períodos para operadora ${regAns}`);
      return historicoOrdenado;
    } catch (err) {
      console.error('💥 Erro ao buscar histórico:', err);
      return [];
    }
  }, []);

  // Executar diagnóstico completo
  const executarDiagnostico = useCallback(async () => {
    try {
      console.log('🔍 Executando diagnóstico completo...');
      const diagnostico = await demonstracoesService.executarDiagnostico();
      console.log('📋 Resultado do diagnóstico:', diagnostico);
      return diagnostico;
    } catch (err) {
      console.error('💥 Erro no diagnóstico:', err);
      return {
        status: 'error',
        detalhes: { erro: err instanceof Error ? err.message : 'Erro desconhecido' },
        sugestoes: ['Verifique a conectividade com o Supabase']
      };
    }
  }, []);

  // Tentar reconectar
  const tentarReconectar = useCallback(async () => {
    console.log('🔄 Tentando reconectar...');
    setLoading(true);
    setError(null);
    
    const conectado = await verificarConexao();
    
    if (conectado) {
      await carregarOperadoras();
      await carregarMetadados();
      await carregarIndicadores(2024, 4);
      console.log('✅ Reconexão bem-sucedida!');
    } else {
      console.log('❌ Reconexão falhou');
      
      // Executar diagnóstico para mais informações
      const diagnostico = await executarDiagnostico();
      if (diagnostico.sugestoes.length > 0) {
        console.log('💡 Sugestões para resolver o problema:');
        diagnostico.sugestoes.forEach((sugestao, index) => {
          console.log(`${index + 1}. ${sugestao}`);
        });
      }
    }
    
    setLoading(false);
  }, [verificarConexao, carregarOperadoras, carregarMetadados, carregarIndicadores, executarDiagnostico]);

  // Carregar dados iniciais
  useEffect(() => {
    const inicializar = async () => {
      console.log('🚀 Inicializando sistema de monitoramento financeiro...');
      
      // Primeiro verificar a conexão
      const conectado = await verificarConexao();
      
      if (conectado) {
        // Só carregar dados se estiver conectado
        await carregarOperadoras();
        await carregarMetadados();
        await carregarIndicadores(2024, 4);
        console.log('✅ Inicialização concluída com sucesso');
      } else {
        console.log('❌ Inicialização falhou - problemas de conectividade');
        
        // Executar diagnóstico automático quando falha
        const diagnostico = await executarDiagnostico();
        console.log('🔍 Diagnóstico automático executado');
        
        setLoading(false);
      }
    };

    inicializar();
  }, [verificarConexao, carregarOperadoras, carregarMetadados, carregarIndicadores, executarDiagnostico]);

  return {
    operadoras,
    indicadores,
    mediaConsolidada,
    metadados,
    loading,
    error,
    statusConexao,
    carregarIndicadores,
    buscarIndicadorOperadora,
    buscarHistoricoOperadora,
    tentarReconectar,
    verificarConexao,
    executarDiagnostico,
    refetch: () => carregarIndicadores(2024, 4)
  };
}