import React, { useState, useEffect } from 'react';
import { Cable } from '../types';
import { SECTION_COLORS, CABLE_CATALOG } from '../constants';
import { Plus, Trash2, Cable as CableIcon } from 'lucide-react';

interface CableManagerProps {
  cables: Cable[];
  onAddCable: (cable: Cable) => void;
  onRemoveCable: (id: string) => void;
}

const CableManager: React.FC<CableManagerProps> = ({ cables, onAddCable, onRemoveCable }) => {
  // Select the first category by default
  const [selectedCategory, setSelectedCategory] = useState(CABLE_CATALOG[1].id);
  const [section, setSection] = useState<number>(2.5);
  const [quantity, setQuantity] = useState<number>(1);
  const [customDiameter, setCustomDiameter] = useState<number | ''>('');
  
  // Get current category data
  const categoryData = CABLE_CATALOG.find(c => c.id === selectedCategory) || CABLE_CATALOG[0];

  // Name generation based on selection
  const getName = () => {
    return `${categoryData.label} - ${section}mm²`;
  };

  // Find standard diameter for current selection
  const standardDiameter = categoryData.items.find(c => c.section === section)?.diameter || 0;

  // Reset section when category changes if the current section doesn't exist in the new category
  useEffect(() => {
    const exists = categoryData.items.find(c => c.section === section);
    if (!exists) {
      setSection(categoryData.items[0].section);
    }
  }, [selectedCategory, categoryData, section]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDiameter = customDiameter !== '' ? Number(customDiameter) : standardDiameter;
    
    if (quantity <= 0 || finalDiameter <= 0) return;

    // Determine color based on section
    const assignedColor = SECTION_COLORS[section] || '#94a3b8';

    const newCable: Cable = {
      id: Math.random().toString(36).substr(2, 9),
      name: getName(),
      quantity,
      diameter: finalDiameter,
      section,
      type: selectedCategory,
      modelLabel: categoryData.label,
      color: assignedColor
    };

    onAddCable(newCable);
    // Reset minimal state
    setCustomDiameter('');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
        <CableIcon className="w-6 h-6 text-blue-600" />
        Gerenciador de Cabos
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        
        {/* Row 1: Type & Section */}
        
        {/* Type Selection - Expanded width */}
        <div className="md:col-span-7">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Modelo do Cabo (Prysmian/NBR)</label>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          >
            {CABLE_CATALOG.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
          <div className="mt-1 text-xs text-blue-600 font-medium">
            Tensão: {categoryData.voltage} | Isolação: {categoryData.insulationType}
          </div>
        </div>

        {/* Section Selection */}
        <div className="md:col-span-5">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Seção Nominal (mm²)</label>
          <div className="relative">
            <select 
              value={section}
              onChange={(e) => setSection(Number(e.target.value))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 outline-none shadow-sm pl-9"
            >
              {categoryData.items.map((c) => (
                <option key={c.section} value={c.section}>{c.section} mm²</option>
              ))}
            </select>
            <div 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border border-slate-300" 
                style={{ backgroundColor: SECTION_COLORS[section] || '#ccc' }}
            ></div>
          </div>
        </div>

        {/* Row 2: Qty, Diameter, Button */}

        {/* Quantity */}
        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Qtd.</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            required
          />
        </div>

        {/* Diameter Preview/Edit */}
        <div className="md:col-span-4">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ø Externo (mm)</label>
          <div className="relative">
             <input
              type="number"
              step="0.1"
              value={customDiameter !== '' ? customDiameter : standardDiameter}
              onChange={(e) => setCustomDiameter(Number(e.target.value))}
              className={`w-full px-4 py-3 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 outline-none shadow-sm ${customDiameter !== '' ? 'border-yellow-400 bg-yellow-50' : 'border-slate-300 bg-slate-50'}`}
            />
            {customDiameter === '' && (
                <span className="absolute right-3 top-3 text-xs text-slate-400 pointer-events-none">Ref.</span>
            )}
          </div>
        </div>

        <div className="md:col-span-5 flex items-end">
            <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:transform active:scale-95 h-[50px]"
            >
            <Plus className="w-5 h-5" />
            Adicionar
            </button>
        </div>

      </form>

      {/* Table Container */}
      <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-sm">
        {cables.length > 0 ? (
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            <table className="w-full text-base text-left text-slate-600">
              <thead className="text-xs font-bold text-slate-700 uppercase bg-slate-50 border-b sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-5 py-4 w-12 bg-slate-50">Cor</th>
                  <th className="px-5 py-4 bg-slate-50">Descrição</th>
                  <th className="px-5 py-4 text-center bg-slate-50">Qtd</th>
                  <th className="px-5 py-4 text-right bg-slate-50">Ø Ext.</th>
                  <th className="px-5 py-4 text-right bg-slate-50">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cables.map((cable) => (
                  <tr key={cable.id} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="w-4 h-4 rounded-full ring-2 ring-slate-100 shadow-sm" style={{ backgroundColor: cable.color }}></div>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {cable.name}
                      {cable.modelLabel && (
                        <div className="text-xs text-slate-400 font-normal mt-0.5">{cable.modelLabel}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="bg-slate-100 text-slate-700 py-1.5 px-3 rounded-md font-mono text-sm font-bold">
                        {cable.quantity}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-slate-700">{cable.diameter.toFixed(1)} mm</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => onRemoveCable(cable.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Remover"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 bg-slate-50">
            <CableIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-lg font-medium">Lista Vazia</p>
            <p className="text-sm mt-1 opacity-70">Utilize o formulário acima para adicionar cabos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CableManager;