import type { MarketParameters, PayoffMatrix, PayoffCell } from '../types/gameTheory';

export const DEFAULT_MARKET_PARAMETERS: MarketParameters = {
  marketSize: 10000,
  baseCost: 200,
  highPrice: 600,
  lowPrice: 100,
  demandSensitivity: 0.5,
};

export interface ParameterValidation {
  isValid: boolean;
  errors: {
    marketSize?: string;
    baseCost?: string;
    highPrice?: string;
    lowPrice?: string;
    demandSensitivity?: string;
    priceRelation?: string;
  };
}

export function validateMarketParameters(params: MarketParameters): ParameterValidation {
  const errors: ParameterValidation['errors'] = {};

  if (!params.marketSize || params.marketSize <= 0) {
    errors.marketSize = 'Market size must be greater than 0';
  } else if (params.marketSize > 1000000) {
    errors.marketSize = 'Market size must not exceed 1,000,000';
  }

  if (params.baseCost < 0) {
    errors.baseCost = 'Base cost cannot be negative';
  }

  if (params.lowPrice <= 0) {
    errors.lowPrice = 'Low price must be positive';
  }

  if (params.highPrice <= 0) {
    errors.highPrice = 'High price must be positive';
  }

  if (params.highPrice <= params.lowPrice) {
    errors.priceRelation = 'High price (₹' + params.highPrice + ') must be greater than low price (₹' + params.lowPrice + ')';
  }

  if (params.demandSensitivity < 0 || params.demandSensitivity > 1) {
    errors.demandSensitivity = 'Demand sensitivity must be between 0 and 1';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Computes the 2x2 payoff matrix given market parameters.
 * Calibrated such that the canonical parameters:
 *   marketSize = 10,000, baseCost = 200, highPrice = 600, lowPrice = 100, demandSensitivity = 0.5
 * yield exactly the project report's baseline payoff matrix:
 *   (Low, Low)   -> (10, 10)  ₹ lakh
 *   (Low, High)  -> (18, 5)   ₹ lakh
 *   (High, Low)  -> (5, 18)   ₹ lakh
 *   (High, High) -> (15, 15)  ₹ lakh
 */
export function calculatePayoffMatrix(params: MarketParameters): PayoffMatrix {
  const { marketSize, baseCost, highPrice, lowPrice, demandSensitivity } = params;

  // Scale relative to canonical report baseline
  const scale = marketSize / 10000;
  const costDelta = (baseCost - 200) / 100;
  const lowPriceRatio = lowPrice / 100;
  const highPriceRatio = highPrice / 600;
  const priceSpread = Math.max(0.1, (highPrice - lowPrice) / 500);

  // Demand share shift under asymmetric prices
  // Shift fraction ranges from ~0.1 to ~0.35 depending on sensitivity and price gap
  const shiftFraction = Math.min(0.42, Math.max(0.1, 0.25 * (demandSensitivity / 0.5) * priceSpread));
  const customersLowWhenAsymmetric = Math.round(marketSize * (0.5 + shiftFraction));
  const customersHighWhenAsymmetric = marketSize - customersLowWhenAsymmetric;
  const symmetricCustomers = Math.round(marketSize / 2);

  // Payoff calculations:
  // 1. Both Low (L, L):
  const rawLL = (10 * lowPriceRatio - costDelta * 1.5) * scale;
  const payoffLL = Math.max(0, Math.round(rawLL * 10) / 10);

  // 2. Both High (H, H):
  const rawHH = (15 * highPriceRatio - costDelta * 1.5) * scale;
  const payoffHH = Math.max(0, Math.round(rawHH * 10) / 10);

  // 3. Low vs High (L, H) - A chooses Low, B chooses High:
  // Undercutting provider captures massive volume boost scaled by sensitivity
  const rawLH_A = ((18 + 10 * (demandSensitivity - 0.5)) * Math.pow(lowPriceRatio, 0.6) * Math.pow(highPriceRatio, 0.4) - costDelta * 2.0) * scale;
  const payoffLH_A = Math.max(0, Math.round(rawLH_A * 10) / 10);

  // High provider loses volume
  const rawLH_B = ((5 - 6 * (demandSensitivity - 0.5)) * highPriceRatio - costDelta * 0.8) * scale;
  const payoffLH_B = Math.max(0, Math.round(rawLH_B * 10) / 10);

  // 4. High vs Low (H, L) - A chooses High, B chooses Low:
  const payoffHL_A = payoffLH_B;
  const payoffHL_B = payoffLH_A;

  const cellLL: PayoffCell = {
    ispAPayoff: payoffLL,
    ispBPayoff: payoffLL,
    customersA: symmetricCustomers,
    customersB: symmetricCustomers,
    isNash: false,
    isJointMax: false,
  };

  const cellLH: PayoffCell = {
    ispAPayoff: payoffLH_A,
    ispBPayoff: payoffLH_B,
    customersA: customersLowWhenAsymmetric,
    customersB: customersHighWhenAsymmetric,
    isNash: false,
    isJointMax: false,
  };

  const cellHL: PayoffCell = {
    ispAPayoff: payoffHL_A,
    ispBPayoff: payoffHL_B,
    customersA: customersHighWhenAsymmetric,
    customersB: customersLowWhenAsymmetric,
    isNash: false,
    isJointMax: false,
  };

  const cellHH: PayoffCell = {
    ispAPayoff: payoffHH,
    ispBPayoff: payoffHH,
    customersA: symmetricCustomers,
    customersB: symmetricCustomers,
    isNash: false,
    isJointMax: false,
  };

  // Determine joint profit maximum
  const sumLL = cellLL.ispAPayoff + cellLL.ispBPayoff;
  const sumLH = cellLH.ispAPayoff + cellLH.ispBPayoff;
  const sumHL = cellHL.ispAPayoff + cellHL.ispBPayoff;
  const sumHH = cellHH.ispAPayoff + cellHH.ispBPayoff;
  const maxSum = Math.max(sumLL, sumLH, sumHL, sumHH);

  cellLL.isJointMax = sumLL === maxSum;
  cellLH.isJointMax = sumLH === maxSum;
  cellHL.isJointMax = sumHL === maxSum;
  cellHH.isJointMax = sumHH === maxSum;

  return {
    LL: cellLL,
    LH: cellLH,
    HL: cellHL,
    HH: cellHH,
  };
}
