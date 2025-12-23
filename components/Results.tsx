import React from 'react';
import { CalculationResult, CommercialSize } from '../types';
import { Info, AlertTriangle, CheckCircle, FileText, ArrowRight } from 'lucide-react';

interface ResultsProps {
  result: CalculationResult;
  idealSize: CommercialSize | null;
  selectedSize: CommercialSize | null;
  typeLabel: string;
}

const Results: React.FC<ResultsProps> = ({ result, idealSize, selectedSize, typeLabel }) => {
  if (result.totalCablesCount === 0) return null;

  // Calculate occupation based on SELECTED size (simulation), not just the ideal one
  const selectedArea = selectedSize?.area || 0;
  const occupationPercent = selectedArea > 0 ? (result.totalCableArea / selectedArea) : 0;
  const maxOccupation = result.fillRateLimit; // e.g. 0.4 (40%)
  
  const isCompliant = occupationPercent <= maxOccupation;

  return (
    <div className="space-y-6">
      
      {/* Comparison Card */}
      <div className={`border-l-4 p-4 rounded-r-lg shadow-sm bg-white border border-slate-200 ${isCompliant ? 'border-l-green-500' : 'border-l-red-500'}`}>
        
        <h3 className="font-bold text-slate-800 text-lg mb-3 flex items-center gap-2">
            {isCompliant ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />}
            Análise de Conformidade
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recommendation */}
            <div className="bg-slate-50 p-3 rounded border border-slate-100">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Padrão Ideal (Norma)</p>
                <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-lg text-blue-700">
                        {idealSize ? idealSize.label : 'Indefinido'}
                    </span>
                    {idealSize?.refCode && <span className="text-xs text-slate-400">({idealSize.refCode})</span>}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                    Área Útil Mínima: {result.minRequiredArea.toFixed(0)} mm²
                </p>
            </div>

            {/* Simulation Stats */}
            <div className={`p-3 rounded border ${isCompliant ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Simulação Atual ({selectedSize?.label})</p>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Ocupação:</span>
                    <span className={`font-mono font-bold text-lg ${isCompliant ? 'text-green-700' : 'text-red-700'}`}>
                        {(occupationPercent * 100).toFixed(1)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div 
                        className={`h-1.5 rounded-full ${isCompliant ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={{ width: `${Math.min(occupationPercent * 100, 100)}%` }}
                    ></div>
                </div>
                <p className="text-[10px] text-right mt-1 text-slate-500">Máx permitido: {(maxOccupation * 100).toFixed(0)}%</p>
            </div>
        </div>
      </div>

      {/* Calculation Memory */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-800">
                Memória de Cálculo (NBR 5410)
            </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column 1: Input Data */}
            <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dados de Entrada</h4>
                
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Total de Cabos</span>
                    <span className="font-mono font-medium text-slate-900">{result.totalCablesCount} un.</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Somatório Áreas (Sext)</span>
                    <span className="font-mono font-medium text-slate-900">{result.totalCableArea.toFixed(2)} mm²</span>
                </div>

                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-700 font-semibold">Taxa de Ocupação Máxima</span>
                        <span className="font-mono font-bold text-indigo-600">{(result.fillRateLimit * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                        * Conforme NBR 5410 6.2.11.1.6
                    </p>
                </div>
            </div>

            {/* Column 2: Results */}
            <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dados do Conduto Selecionado</h4>

                <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                    <span className="text-slate-600">Dimensão</span>
                    <span className="font-mono font-medium text-slate-900">{selectedSize?.label || '-'}</span>
                </div>

                <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                    <span className="text-slate-600">Área Disponível Total</span>
                    <span className="font-mono font-medium text-slate-900">{selectedSize?.area.toFixed(2) || 0} mm²</span>
                </div>

                {selectedSize && (
                    <div className="flex justify-between items-center text-sm pt-2">
                        <span className="text-slate-600">Espaço Livre (Real)</span>
                        <span className={`font-mono font-bold ${selectedSize.area - result.totalCableArea > 0 ? 'text-slate-600' : 'text-red-600'}`}>
                            {(selectedSize.area - result.totalCableArea).toFixed(2)} mm²
                        </span>
                    </div>
                )}
            </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 italic">
            Nota: O cálculo considera a área da seção transversal externa dos cabos. Para eletrodutos, a área útil considera o diâmetro interno aproximado (referência PVC rígido NBR 6150).
        </div>
      </div>
    </div>
  );
};

export default Results;