import React from 'react';
import type { MarketParameters, PayoffMatrix, PriceStrategy, EquilibriumAnalysis } from '../types/gameTheory';
import { TowerIcon } from './TowerIcon';
import { Trophy, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';

interface OneShotGamePanelProps {
  parameters: MarketParameters;
  matrix: PayoffMatrix;
  equilibrium: EquilibriumAnalysis;
  selectedA: PriceStrategy;
  selectedB: PriceStrategy;
  onSelectA: (s: PriceStrategy) => void;
  onSelectB: (s: PriceStrategy) => void;
  onOpenTheory: () => void;
}

export const OneShotGamePanel: React.FC<OneShotGamePanelProps> = ({
  parameters,
  matrix,
  equilibrium,
  selectedA,
  selectedB,
  onSelectA,
  onSelectB,
  onOpenTheory,
}) => {
  // Current payoffs
  const currentCell =
    selectedA === 'LOW' && selectedB === 'LOW'
      ? matrix.LL
      : selectedA === 'LOW' && selectedB === 'HIGH'
      ? matrix.LH
      : selectedA === 'HIGH' && selectedB === 'LOW'
      ? matrix.HL
      : matrix.HH;

  return (
    <div className="bg-[#FAF8F3] border border-[#DDD8CD] rounded-xl p-5 shadow-card flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-serif text-[#173D35] font-normal tracking-tight">
              One-Shot Pricing Game
            </h2>
            <p className="text-xs text-[#586863] mt-1">
              Both ISPs choose a price at the same time.
            </p>
          </div>
          <button
            onClick={onOpenTheory}
            className="inline-flex items-center gap-1.5 text-xs text-[#173D35] hover:text-[#F16F52] bg-white border border-[#DDD8CD] hover:border-[#173D35] px-2.5 py-1.5 rounded-lg shadow-subtle transition font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            About this model
          </button>
        </div>

        {/* 2x2 Payoff Matrix */}
        <div className="pt-2">
          {/* Top Label: ISP B */}
          <div className="text-center font-semibold text-xs text-[#173D35] pb-1.5 tracking-wide">
            ISP B
          </div>

          <div className="grid grid-cols-[auto_1fr_1fr] gap-2 items-center">
            {/* Corner spacer */}
            <div></div>

            {/* Column Headers for ISP B */}
            <div className="bg-[#EFECE4] border border-[#DDD8CD] rounded-lg py-2 px-2 text-center text-xs font-medium text-[#1D2926]">
              Low Price
              <span className="block text-[11px] text-[#7F918C] font-normal font-mono">
                (₹ {parameters.lowPrice})
              </span>
            </div>
            <div className="bg-[#EFECE4] border border-[#DDD8CD] rounded-lg py-2 px-2 text-center text-xs font-medium text-[#1D2926]">
              High Price
              <span className="block text-[11px] text-[#7F918C] font-normal font-mono">
                (₹ {parameters.highPrice})
              </span>
            </div>

            {/* Row 1: Low Price for ISP A */}
            <div className="flex items-center">
              <span className="[writing-mode:vertical-rl] rotate-180 text-[11px] font-semibold text-[#173D35] tracking-wide mr-2">
                ISP A
              </span>
              <div className="bg-[#EFECE4] border border-[#DDD8CD] rounded-lg py-4 px-2 text-center text-xs font-medium text-[#1D2926] min-w-[76px]">
                Low Price
                <span className="block text-[11px] text-[#7F918C] font-normal font-mono">
                  (₹ {parameters.lowPrice})
                </span>
              </div>
            </div>

            {/* Cell LL */}
            <button
              onClick={() => {
                onSelectA('LOW');
                onSelectB('LOW');
              }}
              className={`relative rounded-xl p-3 text-center transition cursor-pointer flex flex-col items-center justify-center min-h-[78px] ${
                selectedA === 'LOW' && selectedB === 'LOW'
                  ? 'bg-[#FDF1EE] border-2 border-[#F16F52] shadow-sm'
                  : 'bg-white/80 hover:bg-white border border-[#DDD8CD]'
              }`}
            >
              {matrix.LL.isNash && (
                <span className="absolute top-1.5 right-2 text-[10px] bg-[#173D35] text-white px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5 shadow-xs">
                  <Trophy className="w-2.5 h-2.5" /> Nash
                </span>
              )}
              <div className="text-base font-semibold text-[#1D2926] font-mono tracking-tight">
                ( {matrix.LL.ispAPayoff} , {matrix.LL.ispBPayoff} )
              </div>
              <div className="text-[10px] text-[#7F918C] mt-0.5 flex gap-2">
                <span className="text-[#F16F52] font-medium">A: ₹{matrix.LL.ispAPayoff}L</span>
                <span className="text-[#173D35] font-medium">B: ₹{matrix.LL.ispBPayoff}L</span>
              </div>
            </button>

            {/* Cell LH */}
            <button
              onClick={() => {
                onSelectA('LOW');
                onSelectB('HIGH');
              }}
              className={`relative rounded-xl p-3 text-center transition cursor-pointer flex flex-col items-center justify-center min-h-[78px] ${
                selectedA === 'LOW' && selectedB === 'HIGH'
                  ? 'bg-[#FDF1EE] border-2 border-[#F16F52] shadow-sm'
                  : 'bg-white/80 hover:bg-white border border-[#DDD8CD]'
              }`}
            >
              {matrix.LH.isNash && (
                <span className="absolute top-1.5 right-2 text-[10px] bg-[#173D35] text-white px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5 shadow-xs">
                  <Trophy className="w-2.5 h-2.5" /> Nash
                </span>
              )}
              <div className="text-base font-semibold text-[#1D2926] font-mono tracking-tight">
                ( {matrix.LH.ispAPayoff} , {matrix.LH.ispBPayoff} )
              </div>
              <div className="text-[10px] text-[#7F918C] mt-0.5 flex gap-2">
                <span className="text-[#F16F52] font-medium">A: ₹{matrix.LH.ispAPayoff}L</span>
                <span className="text-[#173D35] font-medium">B: ₹{matrix.LH.ispBPayoff}L</span>
              </div>
            </button>

            {/* Row 2: High Price for ISP A */}
            <div className="flex items-center">
              <span className="w-4 mr-2"></span>
              <div className="bg-[#EFECE4] border border-[#DDD8CD] rounded-lg py-4 px-2 text-center text-xs font-medium text-[#1D2926] min-w-[76px]">
                High Price
                <span className="block text-[11px] text-[#7F918C] font-normal font-mono">
                  (₹ {parameters.highPrice})
                </span>
              </div>
            </div>

            {/* Cell HL */}
            <button
              onClick={() => {
                onSelectA('HIGH');
                onSelectB('LOW');
              }}
              className={`relative rounded-xl p-3 text-center transition cursor-pointer flex flex-col items-center justify-center min-h-[78px] ${
                selectedA === 'HIGH' && selectedB === 'LOW'
                  ? 'bg-[#FDF1EE] border-2 border-[#F16F52] shadow-sm'
                  : 'bg-white/80 hover:bg-white border border-[#DDD8CD]'
              }`}
            >
              {matrix.HL.isNash && (
                <span className="absolute top-1.5 right-2 text-[10px] bg-[#173D35] text-white px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5 shadow-xs">
                  <Trophy className="w-2.5 h-2.5" /> Nash
                </span>
              )}
              <div className="text-base font-semibold text-[#1D2926] font-mono tracking-tight">
                ( {matrix.HL.ispAPayoff} , {matrix.HL.ispBPayoff} )
              </div>
              <div className="text-[10px] text-[#7F918C] mt-0.5 flex gap-2">
                <span className="text-[#F16F52] font-medium">A: ₹{matrix.HL.ispAPayoff}L</span>
                <span className="text-[#173D35] font-medium">B: ₹{matrix.HL.ispBPayoff}L</span>
              </div>
            </button>

            {/* Cell HH */}
            <button
              onClick={() => {
                onSelectA('HIGH');
                onSelectB('HIGH');
              }}
              className={`relative rounded-xl p-3 text-center transition cursor-pointer flex flex-col items-center justify-center min-h-[78px] ${
                selectedA === 'HIGH' && selectedB === 'HIGH'
                  ? 'bg-[#FDF1EE] border-2 border-[#F16F52] shadow-sm'
                  : 'bg-white/80 hover:bg-white border border-[#DDD8CD]'
              }`}
            >
              {matrix.HH.isNash ? (
                <span className="absolute top-1.5 right-2 text-[10px] bg-[#173D35] text-white px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5 shadow-xs">
                  <Trophy className="w-2.5 h-2.5" /> Nash
                </span>
              ) : matrix.HH.isJointMax ? (
                <span className="absolute top-1.5 right-2 text-[10px] bg-[#2E544A]/10 text-[#173D35] border border-[#2E544A]/30 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-[#F16F52]" /> Joint Max
                </span>
              ) : null}
              <div className="text-base font-semibold text-[#1D2926] font-mono tracking-tight">
                ( {matrix.HH.ispAPayoff} , {matrix.HH.ispBPayoff} )
              </div>
              <div className="text-[10px] text-[#7F918C] mt-0.5 flex gap-2">
                <span className="text-[#F16F52] font-medium">A: ₹{matrix.HH.ispAPayoff}L</span>
                <span className="text-[#173D35] font-medium">B: ₹{matrix.HH.ispBPayoff}L</span>
              </div>
            </button>
          </div>

          <p className="text-[11px] text-center text-[#7F918C] mt-2">
            Values are monthly profits (in ₹ lakh) for (ISP A , ISP B)
          </p>
        </div>

        {/* Strategy Selector Radios with Tower Icons */}
        <div>
          <h3 className="text-xs font-semibold text-[#173D35] tracking-wide mb-2">
            Choose Strategies
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* ISP A Selector Card */}
            <div className="bg-white border border-[#DDD8CD] rounded-xl p-3 flex items-start gap-3 shadow-subtle">
              <TowerIcon color="#F16F52" size={32} />
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#1D2926]">ISP A</span>
                  {equilibrium.dominantStrategyA !== 'NONE' && (
                    <span className="text-[9px] bg-[#FDF1EE] text-[#C84E33] px-1 py-0.2 rounded font-medium">
                      Dominant: {equilibrium.dominantStrategyA === 'LOW' ? 'Low' : 'High'}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onSelectA('LOW')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs transition cursor-pointer text-left ${
                    selectedA === 'LOW'
                      ? 'bg-[#FDF1EE] border-[#F16F52] text-[#C84E33] font-semibold shadow-xs'
                      : 'bg-white border-[#DDD8CD] text-[#1D2926] hover:bg-[#FAF8F3] hover:border-[#F8B6A7]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${selectedA === 'LOW' ? 'border-[#F16F52] bg-[#F16F52]' : 'border-[#DDD8CD] bg-white'}`}>
                      {selectedA === 'LOW' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </span>
                    <span>Low Price</span>
                  </span>
                  <span className="font-mono text-[11px] text-[#7F918C]">₹{parameters.lowPrice}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectA('HIGH')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs transition cursor-pointer text-left ${
                    selectedA === 'HIGH'
                      ? 'bg-[#FDF1EE] border-[#F16F52] text-[#C84E33] font-semibold shadow-xs'
                      : 'bg-white border-[#DDD8CD] text-[#1D2926] hover:bg-[#FAF8F3] hover:border-[#F8B6A7]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${selectedA === 'HIGH' ? 'border-[#F16F52] bg-[#F16F52]' : 'border-[#DDD8CD] bg-white'}`}>
                      {selectedA === 'HIGH' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </span>
                    <span>High Price</span>
                  </span>
                  <span className="font-mono text-[11px] text-[#7F918C]">₹{parameters.highPrice}</span>
                </button>
              </div>
            </div>

            {/* ISP B Selector Card */}
            <div className="bg-white border border-[#DDD8CD] rounded-xl p-3 flex items-start gap-3 shadow-subtle">
              <TowerIcon color="#173D35" size={32} />
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#1D2926]">ISP B</span>
                  {equilibrium.dominantStrategyB !== 'NONE' && (
                    <span className="text-[9px] bg-[#E8EFEA] text-[#173D35] px-1 py-0.2 rounded font-medium">
                      Dominant: {equilibrium.dominantStrategyB === 'LOW' ? 'Low' : 'High'}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onSelectB('LOW')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs transition cursor-pointer text-left ${
                    selectedB === 'LOW'
                      ? 'bg-[#E8EFEA] border-[#173D35] text-[#173D35] font-semibold shadow-xs'
                      : 'bg-white border-[#DDD8CD] text-[#1D2926] hover:bg-[#FAF8F3] hover:border-[#173D35]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${selectedB === 'LOW' ? 'border-[#173D35] bg-[#173D35]' : 'border-[#DDD8CD] bg-white'}`}>
                      {selectedB === 'LOW' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </span>
                    <span>Low Price</span>
                  </span>
                  <span className="font-mono text-[11px] text-[#7F918C]">₹{parameters.lowPrice}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectB('HIGH')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs transition cursor-pointer text-left ${
                    selectedB === 'HIGH'
                      ? 'bg-[#E8EFEA] border-[#173D35] text-[#173D35] font-semibold shadow-xs'
                      : 'bg-white border-[#DDD8CD] text-[#1D2926] hover:bg-[#FAF8F3] hover:border-[#173D35]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${selectedB === 'HIGH' ? 'border-[#173D35] bg-[#173D35]' : 'border-[#DDD8CD] bg-white'}`}>
                      {selectedB === 'HIGH' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </span>
                    <span>High Price</span>
                  </span>
                  <span className="font-mono text-[11px] text-[#7F918C]">₹{parameters.highPrice}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Result Cards */}
        <div>
          <div className="text-[11px] font-semibold text-[#586863] uppercase tracking-wider mb-1.5">
            Result
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* ISP A Profit */}
            <div className="bg-[#FDF1EE] border border-[#F8B6A7] rounded-xl p-3.5 shadow-subtle">
              <div className="text-xs text-[#7F918C] font-medium">ISP A Profit</div>
              <div className="text-2xl font-bold text-[#F16F52] mt-0.5 font-mono">
                ₹ {currentCell.ispAPayoff} lakh
              </div>
              <div className="text-[10px] text-[#7F918C] mt-1">
                {currentCell.customersA.toLocaleString()} customers
              </div>
            </div>

            {/* ISP B Profit */}
            <div className="bg-[#EBF2EE] border border-[#C9CFB8] rounded-xl p-3.5 shadow-subtle">
              <div className="text-xs text-[#7F918C] font-medium">ISP B Profit</div>
              <div className="text-2xl font-bold text-[#173D35] mt-0.5 font-mono">
                ₹ {currentCell.ispBPayoff} lakh
              </div>
              <div className="text-[10px] text-[#7F918C] mt-1">
                {currentCell.customersB.toLocaleString()} customers
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equilibrium or Incentive Callout */}
      <div className="mt-4">
        {equilibrium.isCurrentSelectedNash ? (
          <div className="bg-[#FDF1EE] border border-[#F8B6A7] rounded-xl p-3.5 text-xs text-[#1D2926] flex items-start gap-3 shadow-subtle">
            <Trophy className="w-5 h-5 text-[#F16F52] flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#C84E33] text-sm">Nash Equilibrium</div>
              <p className="mt-1 leading-relaxed text-[#586863]">
                {equilibrium.explanation}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-[#FAF8F3] border border-[#DDD8CD] rounded-xl p-3.5 text-xs text-[#1D2926] flex items-start gap-3 shadow-subtle">
            <AlertCircle className="w-5 h-5 text-[#173D35] flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#173D35] text-sm">
                Unstable Outcome (Not in Equilibrium)
              </div>
              <p className="mt-1 leading-relaxed text-[#586863]">
                {equilibrium.explanation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
