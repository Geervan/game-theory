export type PriceStrategy = 'LOW' | 'HIGH';

export type RepeatedStrategyId =
  | 'TIT_FOR_TAT'
  | 'GRIM_TRIGGER'
  | 'ALWAYS_COOPERATE'
  | 'ALWAYS_DEFECT'
  | 'RANDOM_EXPLORER';

export interface StrategyDefinition {
  id: RepeatedStrategyId;
  name: string;
  shortDescription: string;
  fullDescription: string;
}

export interface MarketParameters {
  marketSize: number;       // total addressable customers (e.g. 10000)
  baseCost: number;         // cost to serve customer in ₹ (e.g. 200)
  highPrice: number;        // ₹ per month (e.g. 600)
  lowPrice: number;         // ₹ per month (e.g. 100)
  demandSensitivity: number;// 0.1 (low) to 0.9 (high), default 0.5
}

export interface PayoffCell {
  ispAPayoff: number;       // in ₹ lakh
  ispBPayoff: number;       // in ₹ lakh
  customersA: number;
  customersB: number;
  isNash: boolean;
  isJointMax: boolean;
}

export interface PayoffMatrix {
  LL: PayoffCell; // (Low, Low)
  LH: PayoffCell; // (Low, High) -> ISP A Low, ISP B High
  HL: PayoffCell; // (High, Low) -> ISP A High, ISP B Low
  HH: PayoffCell; // (High, High)
}

export interface EquilibriumAnalysis {
  dominantStrategyA: PriceStrategy | 'NONE';
  dominantStrategyB: PriceStrategy | 'NONE';
  bestResponseA_toLow: PriceStrategy;
  bestResponseA_toHigh: PriceStrategy;
  bestResponseB_toLow: PriceStrategy;
  bestResponseB_toHigh: PriceStrategy;
  nashEquilibria: Array<{ ispA: PriceStrategy; ispB: PriceStrategy }>;
  isCurrentSelectedNash: boolean;
  explanation: string;
  isPrisonersDilemma: boolean;
  jointOptimal: { ispA: PriceStrategy; ispB: PriceStrategy; totalProfit: number };
}

export interface SimulationRound {
  round: number;
  ispAAction: PriceStrategy;
  ispBAction: PriceStrategy;
  profitA: number;
  profitB: number;
  cumulativeA: number;
  cumulativeB: number;
  discountedCumulativeA: number;
  discountedCumulativeB: number;
  discountWeight: number;
  note?: string;
  isRandomShock?: boolean;
}

export interface RepeatedGameResult {
  rounds: SimulationRound[];
  finalCumulativeA: number;
  finalCumulativeB: number;
  finalDiscountedA: number;
  finalDiscountedB: number;
  cooperativeRoundsCount: number;
  defectiveRoundsCount: number;
  mixedRoundsCount: number;
  deltaThreshold: number | null; // Threshold for Grim Trigger sustaining (High, High)
  deltaMeetsThreshold: boolean;
  observations: string[];
  firstDeviationRound?: number;
  hasRandomShocks?: boolean;
  shockRounds?: number[];
}
