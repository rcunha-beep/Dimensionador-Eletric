import { Cable, CalculationResult, CommercialSize } from "../types";
import { TRAY_SIZES, CONDUIT_SIZES } from "../constants";

export const calculateCircleArea = (diameter: number): number => {
  return Math.PI * Math.pow(diameter / 2, 2);
};

export const calculateFillRateLimit = (totalCables: number): number => {
  // NBR 5410 Rules
  if (totalCables === 1) return 0.53; // 53%
  if (totalCables === 2) return 0.31; // 31%
  return 0.40; // 40% for 3 or more
};

export const performCalculations = (cables: Cable[], reservePercentage: number): CalculationResult => {
  let totalArea = 0;
  let totalCount = 0;

  cables.forEach(cable => {
    const cableArea = calculateCircleArea(cable.diameter);
    totalArea += cableArea * cable.quantity;
    totalCount += cable.quantity;
  });

  const rateLimit = calculateFillRateLimit(totalCount);
  
  // Area required by cables / Fill Rate
  let minRequiredArea = totalCount > 0 ? totalArea / rateLimit : 0;

  // Add Reserve Space (e.g., +20%)
  if (reservePercentage > 0) {
    minRequiredArea = minRequiredArea * (1 + (reservePercentage / 100));
  }

  return {
    totalCableArea: totalArea,
    totalCablesCount: totalCount,
    fillRateLimit: rateLimit,
    minRequiredArea: minRequiredArea,
  };
};

export const suggestCommercialSize = (
  minArea: number, 
  type: 'eletrocalha' | 'eletroduto'
): CommercialSize | null => {
  if (minArea === 0) return null;

  const list = type === 'eletrocalha' ? TRAY_SIZES : CONDUIT_SIZES;
  
  // Find the smallest size that fits the required area
  const suggested = list.find(size => size.area >= minArea);
  
  return suggested || list[list.length - 1]; // Return largest if none fit, or null/undefined handling in UI
};