import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { VisaoConsolidada } from "./components/VisaoConsolidada";
import { ComparativoOperadoras } from "./components/ComparativoOperadoras";
import { DetalhamentoOperadora } from "./components/DetalhamentoOperadora";
import { MetadadosPanel } from "./components/MetadadosPanel";
import { useIndicadoresFinanceiros } from "./hooks/useIndicadoresFinanceiros";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Loader2, AlertCircle, Wifi, CheckCircle, Database, RefreshCw, Settings } from "lucide-react";
import { Alert, AlertDescription } from "./components/ui/alert";
import { demonstracoesService } from "./services/demonstracoesService";

export default function App() {
  const [operadoraSelecionada, setOperadoraSelecionada] = useState<string | null>(null);
  const [anoSelecionado, setAnoSelecionado] = useState<number>(2024);
  const [trimestreSelecionado, setTrimestreSelecionado] = useState<number>(4);

  const {
    operadoras,
    indicadores,
    mediaConsolidada,
    metadados,
    loading,
    error,
    statusConexao,
    carregarIndicadores,
    buscarIndicadorOperadora,
    tentarReconectar
  } = useIndicadoresFinanceiros();

  // Definir operadora padrão quando as operadoras forem carregadas
  useEffect(() => {
    if (operadoras.length > 0 && !operadoraSelecionada) {
      setOperadoraSelecionada(operadoras[0].reg_ans);
    }
  }, [operadoras, operadoraSelecionada]);

  // Recarregar dados quando período mudar
  useEffect(() => {
    if (anoSelecionado && trimestreSelecionado && statusConexao.conectado) {
      carregarIndicadores(anoSelecionado, trimestreSelecionado);
    }
  }, [anoSelecionado, trimestreSelecionado, statusConexao.conectado, carregarIndicadores]);

  const dadosOperadoraSelecionada = operadoraSelecionada 
    ? buscarIndicadorOperadora(operadoraSelecionada)
    : undefined;

  // Função para forçar reset completo da conexão
  const resetarEReconectar = async () => {
    console.log('🔄 FORÇANDO RESET COMPLETO - Testando nova estrutura...');
    demonstracoesService.resetarConexao();
    await tentarReconectar();
  };

  // Loading state inicial
  if (loading && !statusConexao.conectado) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <CardContent className="flex items-center space-x-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <div>
              <h3 className="font-medium text-gray-900">Conectando ao banco de dados...</h3>
              <p className="text-sm text-gray-600">Testando estrutura com tabelas em minúsculas</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Estado de erro sem conexão
  if (!statusConexao.conectado && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-2xl">
          <CardContent className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Database className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2">Banco de Dados Indisponível</h2>
              <p className="text-sm text-gray-600 mb-4">
                Não foi possível conectar à base de dados de demonstrações financeiras.
              </p>
              
              {/* Alerta sobre estrutura em minúsculas */}
              <Alert className="mb-4 border-blue-200 bg-blue-50">
                <Settings className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <div className="text-left">
                    <strong className="text-blue-800">Estrutura Correta - Tipos String para IDs</strong>
                    <p className="text-sm text-blue-700 mt-1">
                      Sistema configurado para trabalhar com as tabelas no schema public:
                    </p>
                    <div className="text-xs text-blue-600 mt-2 space-y-1">
                      <div>• <code>operadoras</code> (registro_operadora: STRING, razao_social, nome_fantasia, cidade)</div>
                      <div>• <code>demonstracoes_financeiras</code> (reg_ans: STRING, vl_saldo_final: NUMBER, descricao)</div>
                      <div>• <code>beneficiarios_trimestre</code> (cd_operadoras: STRING, qd_beneficiarios: NUMBER)</div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
              
              {statusConexao.erro && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-left mb-4">
                  <p className="text-sm text-red-700">
                    <strong>Erro detalhado:</strong> {statusConexao.erro}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={tentarReconectar} disabled={loading} variant="default">
                <Wifi className="w-4 h-4 mr-2" />
                {loading ? 'Conectando...' : 'Testar Conexão'}
              </Button>
              
              <Button onClick={resetarEReconectar} disabled={loading} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset e Reconectar
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 pt-4 space-y-1">
              <p>💡 Verifique se as tabelas existem no schema public</p>
              <p>💡 Confirme se todos os campos estão em minúsculas</p>
              <p>💡 Abra o console do navegador para logs detalhados</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        operadoras={operadoras}
        operadoraSelecionada={operadoraSelecionada}
        setOperadoraSelecionada={setOperadoraSelecionada}
        anoSelecionado={anoSelecionado}
        setAnoSelecionado={setAnoSelecionado}
        trimestreSelecionado={trimestreSelecionado}
        setTrimestreSelecionado={setTrimestreSelecionado}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Status de Erro para dados específicos */}
        {error && statusConexao.conectado && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="flex items-center justify-between">
              <div className="flex-1">
                <strong>Aviso:</strong> {error}
              </div>
              <div className="flex gap-2 ml-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => carregarIndicadores(anoSelecionado, trimestreSelecionado)}
                  disabled={loading}
                >
                  <Wifi className="w-4 h-4 mr-2" />
                  {loading ? 'Carregando...' : 'Tentar Novamente'}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetarEReconectar}
                  disabled={loading}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading indicator para atualizações */}
        {loading && statusConexao.conectado && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <CardContent className="flex items-center space-x-3 p-0">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-blue-800">
                Processando dados para {trimestreSelecionado}º Trimestre {anoSelecionado}...
              </span>
            </CardContent>
          </Card>
        )}

        {/* Indicador de Sucesso da Conexão */}
        {statusConexao.conectado && !error && indicadores.length > 0 && (
          <Card className="p-4 bg-green-50 border-green-200">
            <CardContent className="flex items-center space-x-3 p-0">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800">
                ✅ Conectado com tipos corretos: {statusConexao.tabelaEncontrada}
              </span>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                Dados Reais ANS
              </Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                {indicadores.length} Operadoras
              </Badge>
              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                IDs STRING
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* Alerta sobre funcionamento com tipos corretos */}
        {statusConexao.conectado && indicadores.length > 0 && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="text-left">
                <strong className="text-green-800">Sistema Funcionando com Tipos Corretos</strong>
                <p className="text-sm text-green-700 mt-1">
                  🎉 Todas as tabelas com tipos corretos (IDs como STRING) estão funcionando perfeitamente! 
                  Os indicadores RN 518 são calculados mapeando descrições contábeis para categorias.
                  Veja logs detalhados no console do navegador.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Alerta sobre mapeamento por descrição */}
        {statusConexao.conectado && indicadores.length > 0 && (
          <Alert className="border-blue-200 bg-blue-50">
            <Settings className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <div className="text-left">
                <strong className="text-blue-800">Sistema de Mapeamento por Descrição</strong>
                <p className="text-sm text-blue-700 mt-1">
                  Os indicadores RN 518 são calculados identificando automaticamente as contas contábeis pelas descrições. 
                  Abra o console do navegador (F12) para ver quais descrições estão sendo encontradas e mapeadas.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Conteúdo principal só aparece se tiver dados */}
        {statusConexao.conectado && indicadores.length > 0 && (
          <>
            {/* Visão Consolidada do Sistema */}
            <VisaoConsolidada 
              mediaConsolidada={mediaConsolidada}
              ano={anoSelecionado}
              trimestre={trimestreSelecionado}
              totalOperadoras={indicadores.length}
            />
            
            {/* Comparativo entre Operadoras */}
            <ComparativoOperadoras 
              indicadores={indicadores}
              operadoras={operadoras}
              ano={anoSelecionado}
              trimestre={trimestreSelecionado}
            />
            
            {/* Detalhamento da Operadora Selecionada */}
            {operadoraSelecionada && dadosOperadoraSelecionada && (
              <DetalhamentoOperadora 
                operadora={operadoras.find(op => op.reg_ans === operadoraSelecionada)}
                dadosAtual={dadosOperadoraSelecionada}
                regAns={operadoraSelecionada}
              />
            )}
            
            {/* Metadados */}
            <MetadadosPanel 
              metadados={metadados}
              totalRegistros={indicadores.length}
              totalOperadoras={operadoras.length}
              statusConexao={statusConexao}
            />
          </>
        )}

        {/* Estado vazio quando conectado mas sem dados para o período */}
        {statusConexao.conectado && !loading && indicadores.length === 0 && !error && (
          <Card className="p-8">
            <CardContent className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Database className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Nenhum Dado Disponível</h3>
                <p className="text-sm text-gray-600">
                  Não foram encontrados dados para o {trimestreSelecionado}º trimestre de {anoSelecionado}.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  ✅ Conexão OK com tipos corretos (IDs como STRING)
                  <br />
                  Verifique se há demonstrações financeiras cadastradas para este período.
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => carregarIndicadores(anoSelecionado, trimestreSelecionado)}
                >
                  <Wifi className="w-4 h-4 mr-2" />
                  Verificar Novamente
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={resetarEReconectar}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Conexão
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}