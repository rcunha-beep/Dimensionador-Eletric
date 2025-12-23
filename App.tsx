import React, { useState, useMemo, useEffect } from 'react';
import { Cable, ConduitType, CommercialSize } from './types';
import { performCalculations, suggestCommercialSize } from './utils/electrical';
import { TRAY_SIZES, CONDUIT_SIZES } from './constants';
import CableManager from './components/CableManager';
import Results from './components/Results';
import Visualization from './components/Visualization';
import { Settings, Zap, ArrowDownUp } from 'lucide-react';

function App() {
  const [cables, setCables] = useState<Cable[]>([]);
  const [conduitType, setConduitType] = useState<ConduitType>('eletrocalha');
  const [reserve, setReserve] = useState<number>(20); // Default 20%
  const [manualSizeId, setManualSizeId] = useState<string>('');

  const handleAddCable = (cable: Cable) => {
    setCables([...cables, cable]);
  };

  const handleRemoveCable = (id: string) => {
    setCables(cables.filter(c => c.id !== id));
  };

  // Perform core calculations (Area, Fill Rate Limit)
  const calculationResult = useMemo(() => {
    return performCalculations(cables, reserve);
  }, [cables, reserve]);

  // Determine the "Ideal" size based on calculation
  const idealSize = useMemo(() => {
    return suggestCommercialSize(calculationResult.minRequiredArea, conduitType);
  }, [calculationResult.minRequiredArea, conduitType]);

  // Available options based on type
  const availableSizes = conduitType === 'eletrocalha' ? TRAY_SIZES : CONDUIT_SIZES;

  // Reset manual selection when type changes or if the list is empty
  useEffect(() => {
    setManualSizeId('');
  }, [conduitType]);

  // Determine the "Current" size to show (Manual override OR Ideal)
  const currentSize = useMemo(() => {
    if (manualSizeId) {
      return availableSizes.find(s => s.id === manualSizeId) || idealSize;
    }
    return idealSize;
  }, [manualSizeId, idealSize, availableSizes]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-yellow-400 w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight">DimensioElétrica <span className="text-slate-400 font-light text-sm ml-2">NBR 5410</span></h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            {/* Settings Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-slate-500" />
                Configuração do Conduto
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Tipo de Conduto</label>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                      onClick={() => setConduitType('eletrocalha')}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                        conduitType === 'eletrocalha' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Eletrocalha
                    </button>
                    <button
                      onClick={() => setConduitType('eletroduto')}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                        conduitType === 'eletroduto' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Eletroduto
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Reserva de Espaço (%)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="5"
                      value={reserve}
                      onChange={(e) => setReserve(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <span className="text-sm font-mono font-bold text-slate-700 w-12 text-right">{reserve}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cable Manager */}
            <CableManager 
              cables={cables} 
              onAddCable={handleAddCable} 
              onRemoveCable={handleRemoveCable} 
            />
            
            {/* Results (Mobile/Small screens: Shows here) */}
            <div className="lg:hidden">
              <Results 
                result={calculationResult} 
                idealSize={idealSize}
                selectedSize={currentSize}
                typeLabel={conduitType === 'eletrocalha' ? 'Eletrocalha' : 'Eletroduto'}
              />
            </div>
          </div>

          {/* Right Column: Visualization & Results */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                 <h2 className="text-lg font-bold text-slate-800">Simulação Gráfica</h2>
                 
                 {/* Size Override Selector */}
                 <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                    <ArrowDownUp className="w-4 h-4 text-slate-400" />
                    <select
                      value={currentSize?.id || ''}
                      onChange={(e) => setManualSizeId(e.target.value)}
                      className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer min-w-[140px]"
                    >
                      <option value="" disabled>Selecione um tamanho...</option>
                      {availableSizes.map((size) => (
                        <option key={size.id} value={size.id}>
                          {size.label} {size.refCode ? `(${size.refCode})` : ''}
                          {idealSize?.id === size.id ? ' (Recomendado)' : ''}
                        </option>
                      ))}
                    </select>
                 </div>
               </div>

               <Visualization 
                  cables={cables} 
                  containerSize={currentSize} 
                  type={conduitType} 
               />
               
               <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    <span>Espaço Livre</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Cabos</span>
                  </div>
                  <span>* Simulação física com gravidade</span>
               </div>
            </div>

            {/* Results (Desktop: Shows here) */}
            <div className="hidden lg:block">
              <Results 
                result={calculationResult} 
                idealSize={idealSize}
                selectedSize={currentSize} 
                typeLabel={conduitType === 'eletrocalha' ? 'Eletrocalha' : 'Eletroduto'}
              />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;