import React, { useState } from 'react';
import type { PayoffMatrix, PriceStrategy, EquilibriumAnalysis } from '../types/gameTheory';
import { BookOpen, X, Sparkles, Scale, ShieldAlert } from 'lucide-react';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  matrix: PayoffMatrix;
  equilibrium: EquilibriumAnalysis;
  selectedA: PriceStrategy;
  selectedB: PriceStrategy;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({
  isOpen,
  onClose,
  matrix,
  equilibrium,
  selectedA,
  selectedB,
}) => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'repeated' | 'assumptions'>('concepts');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F3] border border-[#DDD8CD] rounded-2xl w-full max-w-2xl max-h-[88vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DDD8CD] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EBF2EE] text-[#173D35] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-serif text-[#173D35]">
                Game Theory Model Guide
              </h3>
              <p className="text-xs text-[#586863]">
                Core definitions and mathematical derivations for the ISP pricing game
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#586863] hover:text-[#1D2926] p-1.5 rounded-lg hover:bg-[#F5F1E8] transition text-sm font-semibold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-[#DDD8CD] bg-[#F5F1E8]/60 px-6 text-xs font-medium">
          <button
            onClick={() => setActiveTab('concepts')}
            className={`py-2.5 px-3 border-b-2 transition ${
              activeTab === 'concepts'
                ? 'border-[#173D35] text-[#173D35] font-semibold'
                : 'border-transparent text-[#586863] hover:text-[#1D2926]'
            }`}
          >
            One-Shot Concepts
          </button>
          <button
            onClick={() => setActiveTab('repeated')}
            className={`py-2.5 px-3 border-b-2 transition ${
              activeTab === 'repeated'
                ? 'border-[#173D35] text-[#173D35] font-semibold'
                : 'border-transparent text-[#586863] hover:text-[#1D2926]'
            }`}
          >
            Repeated Games & Folk Theorem
          </button>
          <button
            onClick={() => setActiveTab('assumptions')}
            className={`py-2.5 px-3 border-b-2 transition ${
              activeTab === 'assumptions'
                ? 'border-[#173D35] text-[#173D35] font-semibold'
                : 'border-transparent text-[#586863] hover:text-[#1D2926]'
            }`}
          >
            Project Assumptions & Scope
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-6 space-y-4 text-xs leading-relaxed text-[#1D2926] flex-1">
          {activeTab === 'concepts' && (
            <div className="space-y-4">
              {/* Context-Sensitive Selected State Banner */}
              <div className="bg-[#FAF8F3] border border-[#DDD8CD] rounded-xl p-3.5 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#173D35]">
                    Current Simulator State: ISP A ({selectedA === 'LOW' ? 'Low' : 'High'}) vs ISP B ({selectedB === 'LOW' ? 'Low' : 'High'})
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${equilibrium.isCurrentSelectedNash ? 'bg-[#173D35] text-white' : 'bg-[#DDD8CD] text-[#586863]'}`}>
                    {equilibrium.isCurrentSelectedNash ? 'Nash Equilibrium' : 'Not an Equilibrium'}
                  </span>
                </div>
                <p className="text-[11px] text-[#586863]">{equilibrium.explanation}</p>
              </div>

              {/* Nash Equilibrium */}
              <div className="bg-white border border-[#DDD8CD] rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-sm text-[#173D35]">
                  <Scale className="w-4 h-4 text-[#F16F52]" />
                  Nash Equilibrium
                </div>
                <p className="text-[#586863]">
                  A strategy profile where <strong>neither player can improve their payoff by unilaterally switching</strong> their strategy while the other stays fixed.
                </p>
                <div className="bg-[#FAF8F3] border border-[#DDD8CD] p-2 rounded-lg font-mono text-[11px] text-[#173D35]">
                  Current Nash in this model:{' '}
                  <strong>
                    (Low Price, Low Price) = (₹{matrix.LL.ispAPayoff}L, ₹{matrix.LL.ispBPayoff}L)
                  </strong>
                </div>
              </div>

              {/* Dominant Strategy */}
              <div className="bg-white border border-[#DDD8CD] rounded-xl p-3.5 space-y-1.5">
                <div className="font-semibold text-sm text-[#173D35]">
                  Dominant Strategy
                </div>
                <p className="text-[#586863]">
                  A strategy that yields a strictly higher payoff than all alternatives, <strong>regardless of the opponent's choice</strong>.
                </p>
                <div className="text-[11px] text-[#586863] bg-[#FAF8F3] p-2 rounded-lg space-y-0.5">
                  <div>
                    • If competitor plays Low: Low Price gives <strong>₹{matrix.LL.ispAPayoff}L</strong> vs High Price <strong>₹{matrix.HL.ispAPayoff}L</strong>.
                  </div>
                  <div>
                    • If competitor plays High: Low Price gives <strong>₹{matrix.LH.ispAPayoff}L</strong> vs High Price <strong>₹{matrix.HH.ispAPayoff}L</strong>.
                  </div>
                  <div className="font-medium text-[#173D35] pt-1">
                    → Low Price is strictly dominant for both ISPs.
                  </div>
                </div>
              </div>

              {/* Prisoner's Dilemma */}
              <div className="bg-white border border-[#DDD8CD] rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-sm text-[#C84E33]">
                  <ShieldAlert className="w-4 h-4 text-[#F16F52]" />
                  The Prisoner's Dilemma
                </div>
                <p className="text-[#586863]">
                  Both ISPs would earn higher profits if they both maintained High Prices (<strong>₹{matrix.HH.ispAPayoff}L each</strong>). However, because each firm has an individual incentive to undercut the rival to earn <strong>₹{matrix.LH.ispAPayoff}L</strong>, rational self-interest drives both to Low Prices (<strong>₹{matrix.LL.ispAPayoff}L each</strong>), resulting in a mutually inferior outcome.
                </p>
              </div>

              {/* Best Response */}
              <div className="bg-white border border-[#DDD8CD] rounded-xl p-3.5 space-y-1">
                <div className="font-semibold text-sm text-[#173D35]">
                  Best Response
                </div>
                <p className="text-[#586863]">
                  The action that maximizes an ISP's payoff given the specific strategy chosen by the opposing ISP.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'repeated' && (
            <div className="space-y-4">
              {/* Folk Theorem & Trigger Strategy */}
              <div className="bg-white border border-[#DDD8CD] rounded-xl p-3.5 space-y-2">
                <div className="font-semibold text-sm text-[#173D35] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#F16F52]" />
                  Folk Theorem & Discount Factor (δ)
                </div>
                <p className="text-[#586863]">
                  In indefinitely repeated interactions, mutual cooperation (High Price) can be sustained as an equilibrium if firms value future profits enough.
                </p>
                <div className="bg-[#FAF8F3] border border-[#DDD8CD] p-3 rounded-lg space-y-1.5 font-mono text-[11px]">
                  <div className="text-[#173D35] font-semibold">Grim Trigger Derivation:</div>
                  <div>• Stay with High Price: V_coop = 15 / (1 - δ)</div>
                  <div>• Deviate once, then Low punishment: V_dev = 18 + 10δ / (1 - δ)</div>
                  <div className="pt-1 text-[#C84E33] font-bold">
                    Condition: 15 / (1 - δ) ≥ 18 + 10δ / (1 - δ)  ⟹  δ ≥ 3/8 = 0.375
                  </div>
                </div>
                <p className="text-[11px] text-[#7F918C]">
                  When δ ≥ 0.375, the long-term penalty of losing ₹5L every future round outweighs the one-time ₹3L gain from undercutting.
                </p>
              </div>

              {/* Tit for Tat */}
              <div className="bg-white border border-[#DDD8CD] rounded-xl p-3.5 space-y-1">
                <div className="font-semibold text-sm text-[#173D35]">
                  Tit-for-Tat
                </div>
                <p className="text-[#586863]">
                  Starts by cooperating (High Price), then replicates the opponent's previous round action. It is clear, retaliates immediately against defection, but forgives instantly if the rival returns to cooperation.
                </p>
              </div>

              {/* Grim Trigger */}
              <div className="bg-white border border-[#DDD8CD] rounded-xl p-3.5 space-y-1">
                <div className="font-semibold text-sm text-[#173D35]">
                  Grim Trigger (Cold War Strategy)
                </div>
                <p className="text-[#586863]">
                  Begins with High Price and continues cooperating as long as both cooperate. If either player defects even once, it executes an irreversible punishment phase (Low Price forever).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'assumptions' && (
            <div className="space-y-3">
              <div className="bg-white border border-[#DDD8CD] rounded-xl p-3.5 space-y-2">
                <div className="font-semibold text-sm text-[#173D35]">
                  Model Assumptions from Project Report
                </div>
                <ul className="space-y-1.5 text-[#586863]">
                  <li>
                    <strong>1. Simultaneous Choices:</strong> Both ISPs decide their prices independently without seeing the other's decision in advance.
                  </li>
                  <li>
                    <strong>2. Complete Information:</strong> Both providers are rational, self-interested, and have complete knowledge of the payoff matrix.
                  </li>
                  <li>
                    <strong>3. Comparable Services:</strong> Both ISPs offer similar speed and reliability, making subscription price the primary competitive factor.
                  </li>
                  <li>
                    <strong>4. Units & Context:</strong> Payoffs are measured in ₹ lakh monthly net profit.
                  </li>
                  <li>
                    <strong>5. Illustrative Parameters:</strong> The Scenario panel demonstrates how subscriber scale and cost sensitivity affect profits.
                  </li>
                </ul>
              </div>

              <div className="bg-[#EBF2EE] border border-[#C9CFB8] rounded-xl p-3 text-xs text-[#173D35]">
                <strong>Academic Notice:</strong> This project is an illustrative game-theoretic model for University coursework. Real-world ISP pricing must independently comply with antitrust regulations and competition laws.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#DDD8CD] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#173D35] hover:bg-[#102B25] text-white text-xs font-medium px-4 py-2 rounded-lg transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
