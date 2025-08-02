export interface OperadoraData {
  id: string;
  nome: string;
  codigoANS: string;
  municipio: string;
  uf: string;
  beneficiarios: number;
}

export interface IndicadorFinanceiro {
  operadoraId: string;
  ano: number;
  trimestre: number;
  mll: number; // Margem de Lucro Líquida (%)
  roe: number; // Retorno sobre o Patrimônio Líquido (%)
  dm: number; // Sinistralidade (%)
  da: number; // Despesas Administrativas (%)
  dc: number; // Despesas Comerciais (%)
  dop: number; // Despesas Operacionais (%)
  irf: number; // Resultado Financeiro (%)
  lc: number; // Liquidez Corrente (índice)
  ctcp: number; // Capital de Terceiros sobre Capital Próprio (%)
  pmcr: number; // Prazo Médio de Contraprestações a Receber (dias)
  pmpe: number; // Prazo Médio de Pagamento de Eventos (dias)
}

export const operadoras: OperadoraData[] = [
  {
    id: "uniodonto-sp",
    nome: "Uniodonto São Paulo",
    codigoANS: "301234",
    municipio: "São Paulo",
    uf: "SP",
    beneficiarios: 285000
  },
  {
    id: "uniodonto-rj",
    nome: "Uniodonto Rio de Janeiro",
    codigoANS: "301235",
    municipio: "Rio de Janeiro",
    uf: "RJ",
    beneficiarios: 142000
  },
  {
    id: "uniodonto-mg", 
    nome: "Uniodonto Minas Gerais",
    codigoANS: "301236",
    municipio: "Belo Horizonte",
    uf: "MG",
    beneficiarios: 198000
  },
  {
    id: "uniodonto-rs",
    nome: "Uniodonto Rio Grande do Sul",
    codigoANS: "301237",
    municipio: "Porto Alegre",
    uf: "RS",
    beneficiarios: 167000
  },
  {
    id: "uniodonto-pr",
    nome: "Uniodonto Paraná",
    codigoANS: "301238",
    municipio: "Curitiba",
    uf: "PR",
    beneficiarios: 134000
  },
  {
    id: "uniodonto-ba",
    nome: "Uniodonto Bahia",
    codigoANS: "301239",
    municipio: "Salvador",
    uf: "BA",
    beneficiarios: 118000
  }
];

export const indicadoresFinanceiros: IndicadorFinanceiro[] = [
  // 2024 - 4º Trimestre
  {
    operadoraId: "uniodonto-sp",
    ano: 2024,
    trimestre: 4,
    mll: 12.4,
    roe: 18.7,
    dm: 68.2,
    da: 15.3,
    dc: 4.7,
    dop: 88.2,
    irf: 2.8,
    lc: 1.45,
    ctcp: 78.3,
    pmcr: 28,
    pmpe: 15
  },
  {
    operadoraId: "uniodonto-rj",
    ano: 2024,
    trimestre: 4,
    mll: 8.9,
    roe: 14.2,
    dm: 72.1,
    da: 18.4,
    dc: 5.2,
    dop: 95.7,
    irf: 1.9,
    lc: 1.32,
    ctcp: 85.1,
    pmcr: 32,
    pmpe: 18
  },
  {
    operadoraId: "uniodonto-mg",
    ano: 2024,
    trimestre: 4,
    mll: 15.1,
    roe: 22.3,
    dm: 65.8,
    da: 14.2,
    dc: 4.1,
    dop: 84.1,
    irf: 3.2,
    lc: 1.58,
    ctcp: 72.4,
    pmcr: 25,
    pmpe: 12
  },
  {
    operadoraId: "uniodonto-rs",
    ano: 2024,
    trimestre: 4,
    mll: 11.7,
    roe: 16.8,
    dm: 69.5,
    da: 16.1,
    dc: 4.9,
    dop: 90.5,
    irf: 2.4,
    lc: 1.41,
    ctcp: 79.6,
    pmcr: 29,
    pmpe: 14
  },
  {
    operadoraId: "uniodonto-pr",
    ano: 2024,
    trimestre: 4,
    mll: 9.8,
    roe: 15.4,
    dm: 71.3,
    da: 17.2,
    dc: 5.1,
    dop: 93.6,
    irf: 2.1,
    lc: 1.36,
    ctcp: 82.3,
    pmcr: 31,
    pmpe: 17
  },
  {
    operadoraId: "uniodonto-ba",
    ano: 2024,
    trimestre: 4,
    mll: 7.2,
    roe: 12.9,
    dm: 74.8,
    da: 19.1,
    dc: 5.8,
    dop: 99.7,
    irf: 1.6,
    lc: 1.28,
    ctcp: 87.2,
    pmcr: 35,
    pmpe: 20
  },
  
  // 2024 - 3º Trimestre
  {
    operadoraId: "uniodonto-sp",
    ano: 2024,
    trimestre: 3,
    mll: 11.8,
    roe: 17.9,
    dm: 69.1,
    da: 15.8,
    dc: 4.9,
    dop: 89.8,
    irf: 2.6,
    lc: 1.42,
    ctcp: 79.1,
    pmcr: 30,
    pmpe: 16
  },
  {
    operadoraId: "uniodonto-rj",
    ano: 2024,
    trimestre: 3,
    mll: 8.4,
    roe: 13.7,
    dm: 73.2,
    da: 18.9,
    dc: 5.4,
    dop: 97.5,
    irf: 1.7,
    lc: 1.29,
    ctcp: 86.3,
    pmcr: 34,
    pmpe: 19
  },
  {
    operadoraId: "uniodonto-mg",
    ano: 2024,
    trimestre: 3,
    mll: 14.6,
    roe: 21.8,
    dm: 66.4,
    da: 14.7,
    dc: 4.3,
    dop: 85.4,
    irf: 3.0,
    lc: 1.55,
    ctcp: 73.2,
    pmcr: 27,
    pmpe: 13
  },
  
  // 2023 - 4º Trimestre
  {
    operadoraId: "uniodonto-sp",
    ano: 2023,
    trimestre: 4,
    mll: 10.2,
    roe: 16.4,
    dm: 70.8,
    da: 16.2,
    dc: 5.1,
    dop: 92.1,
    irf: 2.3,
    lc: 1.38,
    ctcp: 81.7,
    pmcr: 32,
    pmpe: 17
  },
  {
    operadoraId: "uniodonto-rj",
    ano: 2023,
    trimestre: 4,
    mll: 7.8,
    roe: 12.1,
    dm: 75.4,
    da: 19.6,
    dc: 5.9,
    dop: 101.0,
    irf: 1.4,
    lc: 1.25,
    ctcp: 88.9,
    pmcr: 36,
    pmpe: 21
  },
  {
    operadoraId: "uniodonto-mg",
    ano: 2023,
    trimestre: 4,
    mll: 13.9,
    roe: 20.5,
    dm: 67.9,
    da: 15.1,
    dc: 4.6,
    dop: 87.6,
    irf: 2.8,
    lc: 1.51,
    ctcp: 75.8,
    pmcr: 28,
    pmpe: 14
  }
];

export const getIndicadoresPorOperadora = (operadoraId: string, ano?: number, trimestre?: number) => {
  return indicadoresFinanceiros.filter(ind => {
    let match = ind.operadoraId === operadoraId;
    if (ano) match = match && ind.ano === ano;
    if (trimestre) match = match && ind.trimestre === trimestre;
    return match;
  });
};

export const getMediaConsolidada = (ano: number, trimestre: number) => {
  const dados = indicadoresFinanceiros.filter(ind => ind.ano === ano && ind.trimestre === trimestre);
  
  if (dados.length === 0) return null;
  
  const soma = dados.reduce((acc, curr) => ({
    mll: acc.mll + curr.mll,
    roe: acc.roe + curr.roe,
    dm: acc.dm + curr.dm,
    da: acc.da + curr.da,
    dc: acc.dc + curr.dc,
    dop: acc.dop + curr.dop,
    irf: acc.irf + curr.irf,
    lc: acc.lc + curr.lc,
    ctcp: acc.ctcp + curr.ctcp,
    pmcr: acc.pmcr + curr.pmcr,
    pmpe: acc.pmpe + curr.pmpe
  }), {
    mll: 0, roe: 0, dm: 0, da: 0, dc: 0, dop: 0, irf: 0, lc: 0, ctcp: 0, pmcr: 0, pmpe: 0
  });
  
  const count = dados.length;
  return {
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
};

export const metadados = {
  ultimaAtualizacao: "15/01/2025 14:30",
  arquivoOrigem: "4T2024_demonstracoes_contabeis.csv",
  totalRegistros: 1247,
  periodoBase: "4º Trimestre 2024"
};