import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useState } from "react";
import { BarChart3, Trophy, AlertTriangle } from "lucide-react";
import { IndicadoresRN518, OperadoraInfo } from "../utils/supabase/client";

interface ComparativoOperadorasProps {
  indicadores: IndicadoresRN518[];
  operadoras: OperadoraInfo[];
  ano: number;
  trimestre: number;
}

export function ComparativoOperadoras({ indicadores, operadoras, ano, trimestre }: ComparativoOperadorasProps) {
  const [indicadorSelecionado, setIndicadorSelecionado] = useState<string>("mll");

  const indicadoresInfo = {
    mll: { nome: "Margem de Lucro Líquida", unidade: "%", cor: "#3b82f6", bom: "alto" },
    roe: { nome: "Retorno sobre Patrimônio Líquido", unidade: "%", cor: "#10b981", bom: "alto" },
    dm: { nome: "Sinistralidade", unidade: "%", cor: "#f59e0b", bom: "baixo" },
    da: { nome: "Despesas Administrativas", unidade: "%", cor: "#ef4444", bom: "baixo" },
    dc: { nome: "Despesas Comerciais", unidade: "%", cor: "#8b5cf6", bom: "baixo" },
    dop: { nome: "Despesas Operacionais", unidade: "%", cor: "#06b6d4", bom: "baixo" },
    irf: { nome: "Resultado Financeiro", unidade: "%", cor: "#84cc16", bom: "alto" },
    lc: { nome: "Liquidez Corrente", unidade: "", cor: "#06b6d4", bom: "alto" },
    ctcp: { nome: "CT/CP", unidade: "%", cor: "#f97316", bom: "baixo" },
    pmcr: { nome: "PMCR", unidade: " dias", cor: "#84cc16", bom: "baixo" },
    pmpe: { nome: "PMPE", unidade: " dias", cor: "#f97316", bom: "baixo" }
  };

  // Preparar dados para o gráfico
  const dadosGrafico = indicadores.map(indicador => {
    const operadora = operadoras.find(op => op.reg_ans === indicador.reg_ans);
    return {
      nome: operadora?.nome.replace("Uniodonto ", "") || `Operadora ${indicador.reg_ans}`,
      nomeCompleto: operadora?.nome || `Operadora ${indicador.reg_ans}`,
      valor: Number((indicador[indicadorSelecionado as keyof IndicadoresRN518] as number).toFixed(2)),
      regAns: indicador.reg_ans,
      uf: operadora?.uf || "N/A"
    };
  }).sort((a, b) => {
    const info = indicadoresInfo[indicadorSelecionado as keyof typeof indicadoresInfo];
    return info.bom === "alto" ? b.valor - a.valor : a.valor - b.valor;
  });

  // Definir cores baseadas na performance
  const getCellColor = (index: number, total: number) => {
    if (total <= 1) return indicadoresInfo[indicadorSelecionado as keyof typeof indicadoresInfo].cor;
    
    if (index === 0) return "#10b981"; // Verde para o melhor
    if (index === total - 1) return "#ef4444"; // Vermelho para o pior
    return indicadoresInfo[indicadorSelecionado as keyof typeof indicadoresInfo].cor; // Cor padrão para os demais
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const info = indicadoresInfo[indicadorSelecionado as keyof typeof indicadoresInfo];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.nomeCompleto}</p>
          <p className="text-sm text-gray-600">{data.uf} • ANS: {data.regAns}</p>
          <p className="text-lg font-bold" style={{ color: payload[0].color }}>
            {data.valor}{info.unidade}
          </p>
          <p className="text-xs text-gray-500">{info.nome}</p>
        </div>
      );
    }
    return null;
  };

  const melhorOperadora = dadosGrafico[0];
  const piorOperadora = dadosGrafico[dadosGrafico.length - 1];

  if (!indicadores.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Dados não disponíveis para comparação no período selecionado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Comparativo entre Operadoras</h2>
          <p className="text-sm text-gray-600">
            Ranking por indicador - {trimestre}º Trimestre {ano}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Indicador:</span>
          </div>
          <Select value={indicadorSelecionado} onValueChange={setIndicadorSelecionado}>
            <SelectTrigger className="w-[250px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(indicadoresInfo).map(([key, info]) => (
                <SelectItem key={key} value={key}>
                  {info.nome} ({info.unidade.trim()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Gráfico Principal */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">
              {indicadoresInfo[indicadorSelecionado as keyof typeof indicadoresInfo].nome}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="nome" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                    {dadosGrafico.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCellColor(index, dadosGrafico.length)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resumo e Destaques */}
        <div className="space-y-4">
          {/* Melhor Performance */}
          {melhorOperadora && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-green-600" />
                  <CardTitle className="text-sm text-green-800">Melhor Performance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <p className="font-medium text-green-900">{melhorOperadora.nomeCompleto}</p>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-lg font-bold text-green-900">
                      {melhorOperadora.valor}
                    </span>
                    <span className="text-sm text-green-700">
                      {indicadoresInfo[indicadorSelecionado as keyof typeof indicadoresInfo].unidade}
                    </span>
                  </div>
                  <p className="text-xs text-green-700">
                    ANS: {melhorOperadora.regAns}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pior Performance */}
          {piorOperadora && dadosGrafico.length > 1 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <CardTitle className="text-sm text-red-800">Atenção Necessária</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <p className="font-medium text-red-900">{piorOperadora.nomeCompleto}</p>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-lg font-bold text-red-900">
                      {piorOperadora.valor}
                    </span>
                    <span className="text-sm text-red-700">
                      {indicadoresInfo[indicadorSelecionado as keyof typeof indicadoresInfo].unidade}
                    </span>
                  </div>
                  <p className="text-xs text-red-700">
                    ANS: {piorOperadora.regAns}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estatísticas Gerais */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-700">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Operadoras:</span>
                <span className="font-medium">{dadosGrafico.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Média:</span>
                <span className="font-medium">
                  {dadosGrafico.length > 0 
                    ? (dadosGrafico.reduce((acc, curr) => acc + curr.valor, 0) / dadosGrafico.length).toFixed(1)
                    : '0'
                  }
                  {indicadoresInfo[indicadorSelecionado as keyof typeof indicadoresInfo].unidade}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Máximo:</span>
                <span className="font-medium">
                  {dadosGrafico.length > 0 ? Math.max(...dadosGrafico.map(d => d.valor)).toFixed(1) : '0'}
                  {indicadoresInfo[indicadorSelecionado as keyof typeof indicadoresInfo].unidade}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mínimo:</span>
                <span className="font-medium">
                  {dadosGrafico.length > 0 ? Math.min(...dadosGrafico.map(d => d.valor)).toFixed(1) : '0'}
                  {indicadoresInfo[indicadorSelecionado as keyof typeof indicadoresInfo].unidade}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}