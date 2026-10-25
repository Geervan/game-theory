import React from 'react';
import type { MarketParameters } from '../types/gameTheory';
import type { ParameterValidation } from '../models/payoffModel';
import { DEFAULT_MARKET_PARAMETERS } from '../models/payoffModel';
import { Info, RotateCcw, AlertTriangle } from 'lucide-react';

interface ScenarioPanelProps {
  parameters: MarketParameters;
  validation: ParameterValidation;
  onChange: (updated: Partial<MarketParameters>) => void;
  onReset: () => void;
}

export const ScenarioPanel: React.FC<ScenarioPanelProps> = ({
  parameters,
  validation,
  onChange,
  onReset,
}) => {
  const isDefault =
    parameters.marketSize === DEFAULT_MARKET_PARAMETERS.marketSize &&
    parameters.baseCost === DEFAULT_MARKET_PARAMETERS.baseCost &&
    parameters.highPrice === DEFAULT_MARKET_PARAMETERS.highPrice &&
    parameters.lowPrice === DEFAULT_MARKET_PARAMETERS.lowPrice &&
    parameters.demandSensitivity === DEFAULT_MARKET_PARAMETERS.demandSensitivity;

  return (
    <div className="bg-[#FAF8F3] border border-[#DDD8CD] rounded-xl p-5 shadow-card flex flex-col justify-between h-full">
      <div className="space-y-5">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif text-[#173D35] font-normal tracking-tight">Scenario</h2>
            {!isDefault && (
              <button
                onClick={onReset}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#173D35] hover:text-[#F16F52] transition-colors py-1 px-2 rounded-md hover:bg-[#D8DCC8]/30"
                title="Reset parameters to canonical project report values"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
          <p className="text-xs text-[#586863] mt-1 leading-relaxed">
            Adjust the market parameters and see how the game changes.
          </p>
        </div>

        {/* Validation Error Banner if any */}
        {!validation.isValid && (
          <div className="bg-[#FDF1EE] border border-[#F8B6A7] rounded-lg p-3 text-xs text-[#C84E33] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              {validation.errors.priceRelation && <p>{validation.errors.priceRelation}</p>}
              {validation.errors.marketSize && <p>{validation.errors.marketSize}</p>}
              {validation.errors.baseCost && <p>{validation.errors.baseCost}</p>}
            </div>
          </div>
        )}

        {/* Market size input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[#1D2926]">
            Market size (customers)
          </label>
          <input
            type="number"
            value={parameters.marketSize}
            min={100}
            max={500000}
            step={500}
            onChange={(e) => onChange({ marketSize: Number(e.target.value) || 0 })}
            className="w-full bg-white border border-[#DDD8CD] rounded-lg px-3 py-2 text-sm text-[#1D2926] focus:outline-none focus:ring-1 focus:ring-[#173D35] focus:border-[#173D35] transition"
          />
        </div>

        {/* Base cost input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[#1D2926]">
            Base cost per customer (₹)
          </label>
          <input
            type="number"
            value={parameters.baseCost}
            min={0}
            max={2000}
            step={25}
            onChange={(e) => onChange({ baseCost: Number(e.target.value) || 0 })}
            className="w-full bg-white border border-[#DDD8CD] rounded-lg px-3 py-2 text-sm text-[#1D2926] focus:outline-none focus:ring-1 focus:ring-[#173D35] focus:border-[#173D35] transition"
          />
        </div>

        {/* High price slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-medium text-[#1D2926]">High price (₹ per month)</label>
            <span className="font-semibold text-[#173D35] tabular-nums font-mono">
              ₹ {parameters.highPrice}
            </span>
          </div>
          <input
            type="range"
            min={150}
            max={1200}
            step={25}
            value={parameters.highPrice}
            onChange={(e) => onChange({ highPrice: Number(e.target.value) })}
            className="w-full cursor-pointer accent-[#F16F52]"
          />
          <div className="flex justify-between text-[10px] text-[#7F918C]">
            <span>₹ 150</span>
            <span>₹ 1200</span>
          </div>
        </div>

        {/* Low price slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-medium text-[#1D2926]">Low price (₹ per month)</label>
            <span className="font-semibold text-[#F16F52] tabular-nums font-mono">
              ₹ {parameters.lowPrice}
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={500}
            step={25}
            value={parameters.lowPrice}
            onChange={(e) => onChange({ lowPrice: Number(e.target.value) })}
            className="w-full cursor-pointer accent-[#F16F52]"
          />
          <div className="flex justify-between text-[10px] text-[#7F918C]">
            <span>₹ 50</span>
            <span>₹ 500</span>
          </div>
        </div>

        {/* Demand sensitivity slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-medium text-[#1D2926]">Demand sensitivity</label>
            <span className="text-[11px] text-[#586863]">
              {parameters.demandSensitivity <= 0.3
                ? 'Sticky (Low)'
                : parameters.demandSensitivity >= 0.7
                ? 'Elastic (High)'
                : 'Balanced'}
            </span>
          </div>
          <input
            type="range"
            min={0.1}
            max={0.9}
            step={0.05}
            value={parameters.demandSensitivity}
            onChange={(e) => onChange({ demandSensitivity: Number(e.target.value) })}
            className="w-full cursor-pointer accent-[#F16F52]"
          />
          <div className="flex justify-between text-[10px] text-[#7F918C]">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Illustrative model note */}
      <div className="mt-6 pt-4 border-t border-[#DDD8CD]/80">
        <div className="bg-[#FAF8F3] border border-[#DDD8CD] rounded-lg p-3 text-xs text-[#586863] flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#7F918C] flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            These parameters are used to generate the payoff values. They are illustrative and based on a simple demand model.
          </p>
        </div>
      </div>
    </div>
  );
};
