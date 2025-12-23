export interface Cable {
  id: string;
  name: string;
  quantity: number;
  section: number; // mm²
  diameter: number; // mm (External)
  color: string;
  type: string; // Internal category key
  modelLabel: string; // Display name e.g. "Sintenax 1kV"
}

export type ConduitType = 'eletrocalha' | 'eletroduto';

export interface CalculationResult {
  totalCableArea: number; // mm²
  totalCablesCount: number;
  fillRateLimit: number; // percentage (e.g. 0.4 for 40%)
  minRequiredArea: number; // mm²
  minRequiredDiameter?: number; // mm (only for conduit)
}

export interface CommercialSize {
  id: string;
  label: string;
  refCode?: string; // e.g. CKE 500
  width?: number; // mm
  height?: number; // mm
  internalDiameter?: number; // mm
  area: number; // mm²
}

export interface CablePreset {
  section: number;
  diameter: number;
  area: number;
}

export interface CableCategory {
  id: string;
  label: string;
  voltage: string;
  insulationType: string;
  items: CablePreset[];
}