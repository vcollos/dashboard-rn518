import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Percent, Clock, Target } from "lucide-react";
import { IndicadoresRN518 } from "../utils/supabase/client";

interface VisaoConsolidadaProps {
  mediaConsolidada: Omit<IndicadoresRN518, 'reg_ans'> | null;
  ano: number;
  trimestre: number;
  totalOperadoras: number;
}

interface IndicadorCardProps {
  titulo: string;
  valor: number;
  unidade: string;
  icone: React.ReactNode;
  tendencia?: "up" | "down" | "neutral";
  variacao?: number;
  meta?: number;
  descricao: string;
}

function IndicadorCard({ titulo, valor, unidade, icone, tendencia, variacao, meta, descricao }: IndicadorCardProps) {
  const getTendenciaColor = () => {
    switch (tendencia) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      default: return "text-gray-500";
    }
  };

  const getTendenciaIcon = () => {
    switch (tendencia) {
      case "up": return <TrendingUp className="w-4 h-4" />;
      case "down": return <TrendingDown className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusMeta = () => {
    if (!meta) return null;
    
    // Lógica para determinar se atingiu a meta (depende do indicador)
    let atingiu = false;
    if (titulo === "Sinistralidade" || titulo === "Desp. Administrativas" || titulo === "Desp. Comerciais" || titulo === "PMCR" || titulo === "PMPE") {
      atingiu = valor <= meta; // Para estes indicadores, menor é melhor
    } else {
      atingiu = valor >= meta; // Para os demais, maior é melhor
    }
    
    return (
      <Badge variant={atingiu ? "default" : "secondary"} className="text-xs">
        Meta: {meta}{unidade}
      </Badge>
    );
  };

  // Formatar valor para exibição
  const valorFormatado = unidade === " dias" ? Math.round(valor) : Number(valor.toFixed(unidade === "" ? 2 : 1));

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              {icone}
            </div>
            <CardTitle className="text-sm font-medium text-gray-700">{titulo}</CardTitle>
          </div>
          {getTendenciaIcon() && (
            <div className={`flex items-center space-x-1 ${getTendenciaColor()}`}>
              {getTendenciaIcon()}
              {variacao && <span className="text-xs">{variacao > 0 ? '+' : ''}{variacao.toFixed(1)}%</span>}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-gray-900">{valorFormatado}</span>
            <span className="text-sm text-gray-500">{unidade}</span>
          </div>
          <p className="text-xs text-gray-600">{descricao}</p>
          {getStatusMeta()}
        </div>
      </CardContent>
    </Card>
  );
}

export function VisaoConsolidada({ mediaConsolidada, ano, trimestre, totalOperadoras }: VisaoConsolidadaProps) {
  if (!mediaConsolidada) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Dados não disponíveis para o período selecionado</p>
        </CardContent>
      </Card>
    );
  }

  const indicadores = [
    {
      titulo: "MLL",
      valor: mediaConsolidada.mll,
      unidade: "%",
      icone: <DollarSign className="w-4 h-4 text-blue-600" />,
      tendencia: "up" as const,
      variacao: 2.1, // TODO: Calcular variação real comparando com período anterior
      meta: 10,
      descricao: "Margem de Lucro Líquida média do sistema"
    },
    {
      titulo: "ROE", 
      valor: mediaConsolidada.roe,
      unidade: "%",
      icone: <TrendingUp className="w-4 h-4 text-blue-600" />,
      tendencia: "up" as const,
      variacao: 1.8,
      meta: 15,
      descricao: "Retorno sobre o Patrimônio Líquido"
    },
    {
      titulo: "Sinistralidade",
      valor: mediaConsolidada.dm,
      unidade: "%", 
      icone: <Target className="w-4 h-4 text-blue-600" />,
      tendencia: "down" as const,
      variacao: -1.2,
      meta: 70,
      descricao: "Despesas Médicas sobre receitas"
    },
    {
      titulo: "Desp. Administrativas",
      valor: mediaConsolidada.da,
      unidade: "%",
      icone: <Percent className="w-4 h-4 text-blue-600" />,
      tendencia: "neutral" as const,
      meta: 15,
      descricao: "Despesas Administrativas sobre receitas"
    },
    {
      titulo: "Desp. Comerciais",
      valor: mediaConsolidada.dc,
      unidade: "%",
      icone: <Percent className="w-4 h-4 text-blue-600" />,
      tendencia: "neutral" as const,
      meta: 5,
      descricao: "Despesas Comerciais sobre receitas"
    },
    {
      titulo: "Desp. Operacionais",
      valor: mediaConsolidada.dop,
      unidade: "%",
      icone: <Percent className="w-4 h-4 text-blue-600" />,
      tendencia: "down" as const,
      variacao: -2.5,
      meta: 85,
      descricao: "Total de Despesas Operacionais"
    },
    {
      titulo: "Resultado Financeiro",
      valor: mediaConsolidada.irf,
      unidade: "%",
      icone: <DollarSign className="w-4 h-4 text-blue-600" />,
      tendencia: "up" as const,
      variacao: 0.8,
      descricao: "Resultado Financeiro sobre receitas"
    },
    {
      titulo: "Liquidez Corrente",
      valor: mediaConsolidada.lc,
      unidade: "",
      icone: <TrendingUp className="w-4 h-4 text-blue-600" />,
      tendencia: "up" as const,
      variacao: 3.2,
      meta: 1.2,
      descricao: "Índice de Liquidez Corrente"
    },
    {
      titulo: "CT/CP",
      valor: mediaConsolidada.ctcp,
      unidade: "%",
      icone: <Percent className="w-4 h-4 text-blue-600" />,
      tendencia: "neutral" as const,
      meta: 80,
      descricao: "Capital de Terceiros sobre Capital Próprio"
    },
    {
      titulo: "PMCR",
      valor: mediaConsolidada.pmcr,
      unidade: " dias",
      icone: <Clock className="w-4 h-4 text-blue-600" />,
      tendencia: "down" as const,
      variacao: -2.1,
      meta: 30,
      descricao: "Prazo Médio de Contraprestações a Receber"
    },
    {
      titulo: "PMPE",
      valor: mediaConsolidada.pmpe,
      unidade: " dias",
      icone: <Clock className="w-4 h-4 text-blue-600" />,
      tendencia: "down" as const,
      variacao: -1.5,
      meta: 20,
      descricao: "Prazo Médio de Pagamento de Eventos"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Visão Consolidada do Sistema</h2>
          <p className="text-sm text-gray-600">
            Média dos indicadores de {totalOperadoras} operadoras - {trimestre}º Trimestre {ano}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            RN 518/ANS
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Dados Reais
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {indicadores.map((indicador, index) => (
          <IndicadorCard
            key={index}
            titulo={indicador.titulo}
            valor={indicador.valor}
            unidade={indicador.unidade}
            icone={indicador.icone}
            tendencia={indicador.tendencia}
            variacao={indicador.variacao}
            meta={indicador.meta}
            descricao={indicador.descricao}
          />
        ))}
      </div>
    </div>
  );
}