import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Building2, Users, MapPin, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";
import { IndicadoresRN518, OperadoraInfo } from "../utils/supabase/client";
import { useIndicadoresFinanceiros } from "../hooks/useIndicadoresFinanceiros";

interface DetalhamentoOperadoraProps {
  operadora: OperadoraInfo | undefined;
  dadosAtual: IndicadoresRN518;
  regAns: string;
}

export function DetalhamentoOperadora({ operadora, dadosAtual, regAns }: DetalhamentoOperadoraProps) {
  const [historicoOperadora, setHistoricoOperadora] = useState<IndicadoresRN518[]>([]);
  const { buscarHistoricoOperadora } = useIndicadoresFinanceiros();

  // Carregar histórico da operadora
  useEffect(() => {
    const carregarHistorico = async () => {
      if (regAns) {
        const historico = await buscarHistoricoOperadora(regAns);
        setHistoricoOperadora(historico);
      }
    };

    carregarHistorico();
  }, [regAns, buscarHistoricoOperadora]);

  if (!operadora || !dadosAtual) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Dados não disponíveis para a operadora selecionada</p>
        </CardContent>
      </Card>
    );
  }

  // Preparar dados históricos para o gráfico de linha
  const dadosHistoricos = historicoOperadora.map(dados => ({
    periodo: `${dados.trimestre}T${dados.ano}`,
    mll: Number(dados.mll.toFixed(1)),
    roe: Number(dados.roe.toFixed(1)),
    dm: Number(dados.dm.toFixed(1)),
    lc: Number(dados.lc.toFixed(2))
  }));

  // Dados para gráfico de pizza - Composição de Despesas
  const dadosDespesas = [
    { nome: "Sinistralidade", valor: Number(dadosAtual.dm.toFixed(1)), cor: "#ef4444" },
    { nome: "Administrativas", valor: Number(dadosAtual.da.toFixed(1)), cor: "#3b82f6" },
    { nome: "Comerciais", valor: Number(dadosAtual.dc.toFixed(1)), cor: "#10b981" }
  ];

  // Calcular tendências (comparar com período anterior se disponível)
  const periodoAnterior = historicoOperadora
    .filter(h => h.ano === dadosAtual.ano && h.trimestre === dadosAtual.trimestre - 1)
    .concat(historicoOperadora.filter(h => h.ano === dadosAtual.ano - 1 && h.trimestre === 4))
    .sort((a, b) => b.ano - a.ano || b.trimestre - a.trimestre)[0];

  const getTendencia = (atual: number, anterior?: number) => {
    if (!anterior) return { icone: null, variacao: 0, cor: "text-gray-500" };
    const diff = ((atual - anterior) / anterior) * 100;
    return {
      icone: diff > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />,
      variacao: diff,
      cor: diff > 0 ? "text-green-600" : "text-red-600"
    };
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'lc' ? '' : '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Detalhamento da Operadora</h2>
          <p className="text-sm text-gray-600">Análise individual e evolução histórica</p>
        </div>
      </div>

      {/* Informações da Operadora */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Operadora</p>
                <p className="font-semibold text-gray-900">{operadora.nome}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Beneficiários</p>
                <p className="font-semibold text-gray-900">
                  {operadora.total_beneficiarios ? operadora.total_beneficiarios.toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Localização</p>
                <p className="font-semibold text-gray-900">{operadora.municipio || 'N/A'}/{operadora.uf || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Código ANS</p>
                <p className="font-semibold text-gray-900">{operadora.reg_ans}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Evolução Histórica */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Evolução dos Principais Indicadores</CardTitle>
          </CardHeader>
          <CardContent>
            {dadosHistoricos.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosHistoricos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periodo" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="mll" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="MLL (%)"
                      dot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="roe" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="ROE (%)"
                      dot={{ r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="dm" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Sinistralidade (%)"
                      dot={{ r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="lc" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      name="Liquidez Corrente"
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-gray-500">Dados históricos não disponíveis</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Composição de Despesas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Composição de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosDespesas}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="valor"
                  >
                    {dadosDespesas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => [`${value}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {dadosDespesas.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.cor }}
                    />
                    <span className="text-sm text-gray-600">{item.nome}</span>
                  </div>
                  <span className="text-sm font-medium">{item.valor}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicadores Detalhados com Tendências */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { titulo: "MLL", valor: dadosAtual.mll, unidade: "%", anterior: periodoAnterior?.mll },
          { titulo: "ROE", valor: dadosAtual.roe, unidade: "%", anterior: periodoAnterior?.roe },
          { titulo: "Sinistralidade", valor: dadosAtual.dm, unidade: "%", anterior: periodoAnterior?.dm },
          { titulo: "Liquidez Corrente", valor: dadosAtual.lc, unidade: "", anterior: periodoAnterior?.lc },
          { titulo: "PMCR", valor: dadosAtual.pmcr, unidade: " dias", anterior: periodoAnterior?.pmcr },
          { titulo: "PMPE", valor: dadosAtual.pmpe, unidade: " dias", anterior: periodoAnterior?.pmpe },
          { titulo: "Desp. Admin.", valor: dadosAtual.da, unidade: "%", anterior: periodoAnterior?.da },
          { titulo: "Result. Financeiro", valor: dadosAtual.irf, unidade: "%", anterior: periodoAnterior?.irf }
        ].map((item, index) => {
          const tendencia = getTendencia(item.valor, item.anterior);
          const valorFormatado = item.unidade === " dias" ? Math.round(item.valor) : Number(item.valor.toFixed(item.unidade === "" ? 2 : 1));
          
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">{item.titulo}</p>
                    {tendencia.icone && (
                      <div className={`flex items-center space-x-1 ${tendencia.cor}`}>
                        {tendencia.icone}
                        <span className="text-xs">
                          {tendencia.variacao > 0 ? '+' : ''}{tendencia.variacao.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-bold text-gray-900">{valorFormatado}</span>
                    <span className="text-sm text-gray-500">{item.unidade}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}