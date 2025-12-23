import { CableCategory, CommercialSize, CablePreset } from "./types";

// Mapeamento de Cores por Seção (mm²) para identificação visual consistente
export const SECTION_COLORS: Record<number, string> = {
  1.5: '#94a3b8',   // Slate (Cinza)
  2.5: '#ef4444',   // Red (Vermelho)
  4.0: '#f59e0b',   // Amber (Amarelo)
  6.0: '#84cc16',   // Lime (Verde)
  10.0: '#10b981',  // Emerald (Verde Escuro)
  16.0: '#06b6d4',  // Cyan (Ciano)
  25.0: '#3b82f6',  // Blue (Azul)
  35.0: '#6366f1',  // Indigo (Índigo)
  50.0: '#a855f7',  // Purple (Roxo)
  70.0: '#d946ef',  // Fuchsia (Rosa choque)
  95.0: '#ec4899',  // Pink (Rosa)
  120.0: '#8b5cf6', // Violet (Violeta)
  150.0: '#0ea5e9', // Sky (Azul Céu)
  185.0: '#f97316', // Orange (Laranja)
  240.0: '#64748b', // Slate-500 (Cinza Chumbo)
};

// Dados baseados no Catálogo Técnico Prysmian/Pirelli (Sintenax/Afumex/Superastic)
export const CABLE_CATALOG: CableCategory[] = [
  {
    id: 'fio_solido_750v',
    label: 'Fio Sólido (Superastic 750V)',
    voltage: '450/750V',
    insulationType: 'PVC (Sem Cobertura)',
    items: [
      { section: 1.5, diameter: 2.8, area: 6.15 },
      { section: 2.5, diameter: 3.4, area: 9.07 },
      { section: 4.0, diameter: 3.9, area: 11.9 },
      { section: 6.0, diameter: 4.4, area: 15.2 },
      { section: 10.0, diameter: 5.6, area: 24.6 },
    ]
  },
  {
    id: 'cabo_uni_750v',
    label: 'Cabo Flexível (Superastic Flex 750V)',
    voltage: '450/750V',
    insulationType: 'PVC (Sem Cobertura)',
    items: [
      { section: 1.5, diameter: 3.0, area: 7.07 },
      { section: 2.5, diameter: 3.6, area: 10.18 },
      { section: 4.0, diameter: 4.1, area: 13.2 },
      { section: 6.0, diameter: 4.7, area: 17.35 },
      { section: 10.0, diameter: 6.1, area: 29.22 },
      { section: 16.0, diameter: 7.2, area: 40.72 },
      { section: 25.0, diameter: 8.9, area: 62.21 },
      { section: 35.0, diameter: 10.1, area: 80.12 },
      { section: 50.0, diameter: 11.9, area: 111.2 },
      { section: 70.0, diameter: 13.8, area: 149.6 },
      { section: 95.0, diameter: 16.0, area: 201.1 },
      { section: 120.0, diameter: 17.9, area: 251.6 },
      { section: 150.0, diameter: 19.9, area: 311.0 },
      { section: 185.0, diameter: 22.3, area: 390.6 },
      { section: 240.0, diameter: 25.1, area: 494.8 },
    ]
  },
  {
    id: 'cabo_uni_1kv',
    label: 'Cabo Unipolar (Sintenax 0,6/1kV)',
    voltage: '0,6/1kV',
    insulationType: 'HEPR + PVC (Com Cobertura)',
    items: [
      { section: 1.5, diameter: 5.6, area: 24.6 }, 
      { section: 2.5, diameter: 6.0, area: 28.2 },
      { section: 4.0, diameter: 6.5, area: 33.1 },
      { section: 6.0, diameter: 7.0, area: 38.4 },
      { section: 10.0, diameter: 7.9, area: 49.0 },
      { section: 16.0, diameter: 8.9, area: 62.2 },
      { section: 25.0, diameter: 10.6, area: 88.2 },
      { section: 35.0, diameter: 11.7, area: 107.5 },
      { section: 50.0, diameter: 13.2, area: 136.8 },
      { section: 70.0, diameter: 14.9, area: 174.3 },
      { section: 95.0, diameter: 16.9, area: 224.3 },
      { section: 120.0, diameter: 18.6, area: 271.7 },
      { section: 150.0, diameter: 20.7, area: 336.5 },
      { section: 185.0, diameter: 22.9, area: 411.8 },
      { section: 240.0, diameter: 25.6, area: 514.7 },
    ]
  },
  {
    id: 'cabo_multi_1kv',
    label: 'Cabo Multipolar 4 cond. (Sintenax 1kV)',
    voltage: '0,6/1kV',
    insulationType: 'HEPR + PVC (Multipol)',
    items: [
      { section: 1.5, diameter: 11.0, area: 95.0 },
      { section: 2.5, diameter: 12.0, area: 113.0 },
      { section: 4.0, diameter: 13.2, area: 136.8 },
      { section: 6.0, diameter: 14.5, area: 165.1 },
      { section: 10.0, diameter: 16.5, area: 213.8 },
      { section: 16.0, diameter: 18.8, area: 277.5 },
      { section: 25.0, diameter: 22.5, area: 397.6 },
      { section: 35.0, diameter: 24.9, area: 486.9 },
      { section: 50.0, diameter: 28.5, area: 637.9 },
      { section: 70.0, diameter: 32.5, area: 829.5 },
      { section: 95.0, diameter: 36.8, area: 1063.6 },
      { section: 120.0, diameter: 41.0, area: 1320.2 },
      { section: 150.0, diameter: 45.5, area: 1625.9 },
      { section: 185.0, diameter: 50.0, area: 1963.5 },
      { section: 240.0, diameter: 56.5, area: 2507.2 },
    ]
  }
];

export const CABLE_DATA: Record<string, CablePreset[]> = {};
CABLE_CATALOG.forEach(cat => {
  CABLE_DATA[cat.id] = cat.items;
});

// Catálogo Parcial de Eletrocalhas
export const TRAY_SIZES: CommercialSize[] = [
  { id: 'cke_50_50', label: '50x50 mm', refCode: 'CKE 500', width: 50, height: 50, area: 2500 },
  { id: 'cke_100_50', label: '100x50 mm', refCode: 'CKE 500', width: 100, height: 50, area: 5000 },
  { id: 'cke_200_50', label: '200x50 mm', refCode: 'CKE 500', width: 200, height: 50, area: 10000 },
  { id: 'cke_300_50', label: '300x50 mm', refCode: 'CKE 500', width: 300, height: 50, area: 15000 },
  { id: 'cke_400_50', label: '400x50 mm', refCode: 'CKE 500', width: 400, height: 50, area: 20000 },
  { id: 'cke_100_100', label: '100x100 mm', refCode: 'CKE 500', width: 100, height: 100, area: 10000 },
  { id: 'cke_200_100', label: '200x100 mm', refCode: 'CKE 500', width: 200, height: 100, area: 20000 },
  { id: 'cke_300_100', label: '300x100 mm', refCode: 'CKE 500', width: 300, height: 100, area: 30000 },
  { id: 'cke_400_100', label: '400x100 mm', refCode: 'CKE 500', width: 400, height: 100, area: 40000 },
  { id: 'cke_500_100', label: '500x100 mm', refCode: 'CKE 500', width: 500, height: 100, area: 50000 },
  { id: 'cke_600_100', label: '600x100 mm', refCode: 'CKE 500', width: 600, height: 100, area: 60000 },
];

// Eletrodutos Rígidos (Ref. PVC NBR 6150 / Aço NBR 5597)
export const CONDUIT_SIZES: CommercialSize[] = [
  { id: 'dn_15', label: '1/2" (DN 15)', internalDiameter: 16, area: 201.06 }, 
  { id: 'dn_20', label: '3/4" (DN 20)', internalDiameter: 21, area: 346.36 },
  { id: 'dn_25', label: '1" (DN 25)', internalDiameter: 27, area: 572.55 },
  { id: 'dn_32', label: '1 1/4" (DN 32)', internalDiameter: 35, area: 962.11 },
  { id: 'dn_40', label: '1 1/2" (DN 40)', internalDiameter: 41, area: 1320.25 },
  { id: 'dn_50', label: '2" (DN 50)', internalDiameter: 53, area: 2206.18 },
  { id: 'dn_65', label: '2 1/2" (DN 65)', internalDiameter: 63, area: 3117.24 },
  { id: 'dn_80', label: '3" (DN 80)', internalDiameter: 78, area: 4778.36 },
  { id: 'dn_100', label: '4" (DN 100)', internalDiameter: 103, area: 8332.28 },
];

export const CABLE_COLORS = Object.values(SECTION_COLORS);