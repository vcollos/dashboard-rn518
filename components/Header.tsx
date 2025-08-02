import { Building2, Filter, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { OperadoraInfo } from "../utils/supabase/client";

interface HeaderProps {
  operadoras: OperadoraInfo[];
  operadoraSelecionada: string | null;
  setOperadoraSelecionada: (value: string | null) => void;
  anoSelecionado: number;
  setAnoSelecionado: (value: number) => void;
  trimestreSelecionado: number;
  setTrimestreSelecionado: (value: number) => void;
}

export function Header({
  operadoras,
  operadoraSelecionada,
  setOperadoraSelecionada,
  anoSelecionado,
  setAnoSelecionado,
  trimestreSelecionado,
  setTrimestreSelecionado
}: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Título */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Dashboard Financeiro RN 518</h1>
                <p className="text-sm text-gray-600">Sistema Uniodonto - Indicadores Regulatórios ANS</p>
              </div>
            </div>
          </div>

          {/* Filtros Globais */}
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filtros:</span>
              </div>
              
              {/* Seletor de Operadora */}
              <div className="min-w-[200px]">
                <Select 
                  value={operadoraSelecionada || ""} 
                  onValueChange={(value) => setOperadoraSelecionada(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a operadora" />
                  </SelectTrigger>
                  <SelectContent>
                    {operadoras.map((operadora) => (
                      <SelectItem key={operadora.reg_ans} value={operadora.reg_ans}>
                        <div className="flex flex-col">
                          <span>{operadora.nome}</span>
                          <span className="text-xs text-gray-500">
                            ANS: {operadora.reg_ans} | {operadora.municipio}/{operadora.uf}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Seletor de Ano */}
              <div className="min-w-[100px]">
                <Select value={anoSelecionado.toString()} onValueChange={(value) => setAnoSelecionado(Number(value))}>
                  <SelectTrigger>
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Seletor de Trimestre */}
              <div className="min-w-[100px]">
                <Select value={trimestreSelecionado.toString()} onValueChange={(value) => setTrimestreSelecionado(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1º Trimestre</SelectItem>
                    <SelectItem value="2">2º Trimestre</SelectItem>
                    <SelectItem value="3">3º Trimestre</SelectItem>
                    <SelectItem value="4">4º Trimestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}