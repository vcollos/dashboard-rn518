import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Database, 
  Calendar, 
  FileText, 
  Download, 
  Upload, 
  Clock,
  CheckCircle,
  Info,
  Server,
  Activity,
  AlertTriangle,
  Settings,
  HelpCircle
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface StatusConexao {
  conectado: boolean;
  tabelaEncontrada: string | null;
  erro?: string;
  diagnostico?: string;
}

interface MetadadosPanelProps {
  metadados: any;
  totalRegistros: number;
  totalOperadoras: number;
  statusConexao?: StatusConexao;
}

export function MetadadosPanel({ 
  metadados, 
  totalRegistros, 
  totalOperadoras, 
  statusConexao 
}: MetadadosPanelProps) {
  // Formatação de data
  const formatarData = (dataString: string) => {
    if (!dataString) return "N/A";
    try {
      const data = new Date(dataString);
      return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dataString;
    }
  };

  const ultimaAtualizacao = metadados ? formatarData(metadados.created_at) : "N/A";
  const arquivoOrigem = metadados?.arquivo_origem || "Demonstrações Financeiras ANS";
  const periodoBase = metadados ? `${metadados.trimestre}º Trimestre ${metadados.ano}` : "N/A";

  // Extrair informações sobre a configuração do problema
  const parseConfigurationError = (erro?: string) => {
    if (!erro) return null;
    
    if (erro.includes('Schema não exposto') || erro.includes('PGRST301')) {
      return {
        tipo: 'schema',
        titulo: 'Schema não exposto na API',
        descricao: 'O schema "demonstracoes" precisa ser adicionado aos schemas expostos na API do Supabase'
      };
    } else if (erro.includes('42P01') || erro.includes('não encontrada')) {
      return {
        tipo: 'tabela',
        titulo: 'Tabela não encontrada',
        descricao: 'A tabela não foi encontrada no schema especificado'
      };
    } else if (erro.includes('permissão') || erro.includes('RLS')) {
      return {
        tipo: 'rls',
        titulo: 'Políticas RLS',
        descricao: 'Configure as políticas de Row Level Security para permitir acesso de leitura'
      };
    } else if (erro.includes('JWT') || erro.includes('auth')) {
      return {
        tipo: 'auth',
        titulo: 'Autenticação',
        descricao: 'Problema com a chave ANON ou configuração de autenticação'
      };
    }
    
    return null;
  };

  const problemaConfig = parseConfigurationError(statusConexao?.erro);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Informações dos Dados</h2>
          <p className="text-sm text-gray-600">Metadados e controle de qualidade</p>
        </div>
      </div>

      {/* Alerta de Configuração quando há problemas */}
      {!statusConexao?.conectado && problemaConfig && (
        <Alert className="border-orange-200 bg-orange-50">
          <Settings className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <div className="space-y-2">
              <div>
                <strong className="text-orange-800">{problemaConfig.titulo}</strong>
                <p className="text-sm text-orange-700 mt-1">{problemaConfig.descricao}</p>
              </div>
              
              {problemaConfig.tipo === 'schema' && (
                <div className="text-xs text-orange-600 bg-orange-100 p-2 rounded mt-2">
                  <strong>Como resolver:</strong><br/>
                  1. Acesse: Supabase Studio → Project Settings → API<br/>
                  2. Em "Schemas to expose in API", adicione: <code>demonstracoes</code><br/>
                  3. Clique em "Save" e aguarde alguns segundos
                </div>
              )}
              
              {problemaConfig.tipo === 'rls' && (
                <div className="text-xs text-orange-600 bg-orange-100 p-2 rounded mt-2">
                  <strong>Como resolver:</strong><br/>
                  Execute no SQL Editor:<br/>
                  <code>CREATE POLICY "Allow read to everyone" ON demonstracoes.tabela FOR SELECT USING (true);</code>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Última Atualização */}
        <Card className={`${statusConexao?.conectado ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${statusConexao?.conectado ? 'bg-green-600' : 'bg-gray-400'} rounded-lg flex items-center justify-center`}>
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`text-sm ${statusConexao?.conectado ? 'text-green-700' : 'text-gray-600'}`}>
                  Última Atualização
                </p>
                <p className={`font-semibold ${statusConexao?.conectado ? 'text-green-900' : 'text-gray-700'} text-xs`}>
                  {ultimaAtualizacao}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status da Conexão */}
        <Card className={`${statusConexao?.conectado ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${statusConexao?.conectado ? 'bg-green-600' : 'bg-red-600'} rounded-lg flex items-center justify-center`}>
                <Server className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`text-sm ${statusConexao?.conectado ? 'text-green-700' : 'text-red-700'}`}>
                  Status Conexão
                </p>
                <p className={`font-semibold ${statusConexao?.conectado ? 'text-green-900' : 'text-red-900'} text-xs`}>
                  {statusConexao?.conectado ? 'Conectado' : 'Desconectado'}
                </p>
                {statusConexao?.tabelaEncontrada && (
                  <p className="text-xs text-gray-600 mt-1">
                    {statusConexao.tabelaEncontrada}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total de Operadoras */}
        <Card className={`${totalOperadoras > 0 ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${totalOperadoras > 0 ? 'bg-purple-600' : 'bg-gray-400'} rounded-lg flex items-center justify-center`}>
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`text-sm ${totalOperadoras > 0 ? 'text-purple-700' : 'text-gray-600'}`}>
                  Operadoras Ativas
                </p>
                <p className={`font-semibold ${totalOperadoras > 0 ? 'text-purple-900' : 'text-gray-700'}`}>
                  {totalOperadoras}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Período Base */}
        <Card className={`${metadados ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-gray-50'}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${metadados ? 'bg-orange-600' : 'bg-gray-400'} rounded-lg flex items-center justify-center`}>
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`text-sm ${metadados ? 'text-orange-700' : 'text-gray-600'}`}>
                  Período Base
                </p>
                <p className={`font-semibold ${metadados ? 'text-orange-900' : 'text-gray-700'}`}>
                  {periodoBase}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Painel de Controle e Informações Adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Controles de Exportação */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Exportação</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              disabled={!statusConexao?.conectado}
            >
              <FileText className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              disabled={!statusConexao?.conectado}
            >
              <Database className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              disabled={!statusConexao?.conectado}
            >
              <Upload className="w-4 h-4 mr-2" />
              Nova Carga de Dados
            </Button>
          </CardContent>
        </Card>

        {/* Status da Base de Dados */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              {statusConexao?.conectado ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
              <span>Status dos Dados</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tipo de dados:</span>
              <Badge variant={statusConexao?.conectado ? "default" : "secondary"} 
                     className={statusConexao?.conectado ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {statusConexao?.conectado ? "Dados Reais ANS" : "Indisponível"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Indicadores:</span>
              <Badge variant={statusConexao?.conectado ? "default" : "secondary"} 
                     className={statusConexao?.conectado ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                {statusConexao?.conectado ? "11 calculados" : "Não calculados"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Validação ANS:</span>
              <Badge variant={statusConexao?.conectado ? "default" : "secondary"} 
                     className={statusConexao?.conectado ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {statusConexao?.conectado ? "Aprovado" : "Pendente"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Registros processados:</span>
              <span className="text-sm font-medium">{totalRegistros}</span>
            </div>
            
            {/* Diagnóstico da Conexão */}
            {statusConexao?.erro && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-red-600">
                  <strong>Erro:</strong> {statusConexao.erro}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações Regulatórias e Diagnóstico */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Configuração do Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Resolução:</span>
                <Badge variant="outline" className="text-xs">RN 518/ANS</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Modalidade:</span>
                <span className="text-sm">Odontológico</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sistema:</span>
                <span className="text-sm">Uniodonto</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Base de dados:</span>
                <Badge variant="outline" className="text-xs">Supabase</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Schema:</span>
                <Badge variant="outline" className={`text-xs ${statusConexao?.conectado ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {statusConexao?.tabelaEncontrada?.includes('.') ? 
                    statusConexao.tabelaEncontrada.split('.')[0] : 
                    (statusConexao?.conectado ? 'public' : 'N/A')
                  }
                </Badge>
              </div>
            </div>
            
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                {statusConexao?.conectado ? (
                  "Indicadores calculados automaticamente com base nas demonstrações contábeis enviadas pelas operadoras à ANS conforme RN 518/2019."
                ) : (
                  "Sistema aguardando configuração da base de dados para cálculo dos indicadores da RN 518/2019."
                )}
              </p>
              
              {!statusConexao?.conectado && (
                <div className="mt-2 flex items-center space-x-1 text-xs text-blue-600">
                  <HelpCircle className="w-3 h-3" />
                  <span>Consulte a documentação para configuração</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rodapé com Informações Técnicas */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Sistema de Monitoramento Financeiro - Uniodonto
              </span>
              <div className="flex items-center space-x-2">
                <Activity className="w-3 h-3 text-gray-500" />
                <Badge variant="outline" className="text-xs">
                  {statusConexao?.conectado ? 'Produção' : 'Configuração'}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>ANS - Agência Nacional de Saúde Suplementar</span>
              <span>•</span>
              <span>{statusConexao?.conectado ? 'Dados em tempo real' : 'Aguardando conexão'}</span>
              {statusConexao && (
                <>
                  <span>•</span>
                  <span className={statusConexao.conectado ? 'text-green-600' : 'text-red-600'}>
                    {statusConexao.conectado ? 'Online' : 'Offline'}
                  </span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}