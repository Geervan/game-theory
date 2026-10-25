import React, { useState, useMemo, useCallback } from 'react';
import type {
  MarketParameters,
  PriceStrategy,
  RepeatedStrategyId,
} from './types/gameTheory';
import {
  DEFAULT_MARKET_PARAMETERS,
  validateMarketParameters,
  calculatePayoffMatrix,
} from './models/payoffModel';
import { analyzeEquilibrium } from './models/equilibrium';
import { runRepeatedGameSimulation } from './models/repeatedGame';
import { NetworkHeaderSvg } from './components/NetworkHeaderSvg';
import { ScenarioPanel } from './components/ScenarioPanel';
import { OneShotGamePanel } from './components/OneShotGamePanel';
import { RepeatedGamePanel } from './components/RepeatedGamePanel';
import { TheoryModal } from './components/TheoryModal';

export const App: React.FC = () => {
  // 1. Scenario parameters
  const [parameters, setParameters] = useState<MarketParameters>(DEFAULT_MARKET_PARAMETERS);

  // 2. One-shot game state
  const [selectedA, setSelectedA] = useState<PriceStrategy>('LOW');
  const [selectedB, setSelectedB] = useState<PriceStrategy>('LOW');
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);

  // 3. Repeated game state
  const [repeatedStrategyA, setRepeatedStrategyA] = useState<RepeatedStrategyId>('TIT_FOR_TAT');
  const [repeatedStrategyB, setRepeatedStrategyB] = useState<RepeatedStrategyId>('TIT_FOR_TAT');
  const [roundsCount, setRoundsCount] = useState<number>(50);
  const [delta, setDelta] = useState<number>(0.9);

  // Validation
  const validation = useMemo(() => validateMarketParameters(parameters), [parameters]);

  // Derived Payoff Matrix
  const matrix = useMemo(() => {
    return calculatePayoffMatrix(parameters);
  }, [parameters]);

  // Equilibrium Analysis
  const equilibrium = useMemo(() => {
    return analyzeEquilibrium(matrix, selectedA, selectedB);
  }, [matrix, selectedA, selectedB]);

  // Simulation run trigger / version
  const [simVersion, setSimVersion] = useState(0);
  const [randomShocksEnabled, setRandomShocksEnabled] = useState(true);
  const [shockSeed, setShockSeed] = useState(0);

  // Repeated Game Results
  const simulationResult = useMemo(() => {
    void simVersion;
    void shockSeed;
    return runRepeatedGameSimulation(
      repeatedStrategyA,
      repeatedStrategyB,
      roundsCount,
      delta,
      matrix,
      { randomShocks: randomShocksEnabled }
    );
  }, [repeatedStrategyA, repeatedStrategyB, roundsCount, delta, matrix, simVersion, shockSeed, randomShocksEnabled]);

  // Handlers
  const handleParameterChange = useCallback((updated: Partial<MarketParameters>) => {
    setParameters((prev) => ({ ...prev, ...updated }));
  }, []);

  const handleResetParameters = useCallback(() => {
    setParameters(DEFAULT_MARKET_PARAMETERS);
  }, []);

  const handleRunSimulation = useCallback(() => {
    setSimVersion((v) => v + 1);
  }, []);

  const handleTriggerRandomWhatIf = useCallback(() => {
    setRandomShocksEnabled(true);
    setShockSeed((s) => s + 1);
    setSimVersion((v) => v + 1);
  }, []);

  const handleRandomizeSetup = useCallback(() => {
    const list: RepeatedStrategyId[] = ['TIT_FOR_TAT', 'GRIM_TRIGGER', 'RANDOM_EXPLORER', 'ALWAYS_COOPERATE', 'ALWAYS_DEFECT'];
    const randA = list[Math.floor(Math.random() * list.length)];
    const randB = list[Math.floor(Math.random() * list.length)];
    setRepeatedStrategyA(randA);
    setRepeatedStrategyB(randB);
    setRandomShocksEnabled(true);
    setShockSeed((s) => s + 1);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#1D2926] flex flex-col justify-between selection:bg-[#F16F52]/20 selection:text-[#173D35]">
      {/* Top Banner / Header Container */}
      <header className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 pt-5 pb-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#DDD8CD]/80 pb-4">
          {/* Title and Subtitle */}
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-serif text-[#173D35] font-normal tracking-tight leading-tight">
              Strategic Competition Between ISPs
            </h1>
            <p className="text-sm text-[#586863] mt-1.5 leading-relaxed font-sans">
              An interactive game theory simulator to explore how pricing decisions, competition and repeated interactions affect profits in the ISP market.
            </p>
          </div>

          {/* Bespoke Telecom Skyline SVG Graphic */}
          <div className="w-full md:w-[380px] lg:w-[440px] h-[90px] flex-shrink-0 relative overflow-hidden flex items-center justify-end">
            <NetworkHeaderSvg className="w-full h-full object-contain object-right" />
          </div>
        </div>
      </header>

      {/* Main 3-Column Desktop Workspace */}
      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr_1.1fr] xl:grid-cols-[310px_1fr_1.15fr] gap-5 items-stretch min-h-[640px]">
          {/* Left Column: Scenario Parameters */}
          <section className="h-full">
            <ScenarioPanel
              parameters={parameters}
              validation={validation}
              onChange={handleParameterChange}
              onReset={handleResetParameters}
            />
          </section>

          {/* Centre Column: One-Shot Pricing Game */}
          <section className="h-full">
            <OneShotGamePanel
              parameters={parameters}
              matrix={matrix}
              equilibrium={equilibrium}
              selectedA={selectedA}
              selectedB={selectedB}
              onSelectA={setSelectedA}
              onSelectB={setSelectedB}
              onOpenTheory={() => setIsTheoryOpen(true)}
            />
          </section>

          {/* Right Column: Repeated-Game Simulation */}
          <section className="h-full">
            <RepeatedGamePanel
              strategyA={repeatedStrategyA}
              strategyB={repeatedStrategyB}
              roundsCount={roundsCount}
              delta={delta}
              matrix={matrix}
              simulationResult={simulationResult}
              randomShocksEnabled={randomShocksEnabled}
              onStrategyAChange={setRepeatedStrategyA}
              onStrategyBChange={setRepeatedStrategyB}
              onRoundsCountChange={setRoundsCount}
              onDeltaChange={setDelta}
              onRunSimulation={handleRunSimulation}
              onTriggerRandomWhatIf={handleTriggerRandomWhatIf}
              onToggleRandomShocks={() => setRandomShocksEnabled((prev) => !prev)}
              onRandomizeSetup={handleRandomizeSetup}
            />
          </section>
        </div>
      </main>

      {/* Subtle University Project Footer */}
      <footer className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-3 text-center text-xs text-[#7F918C] border-t border-[#DDD8CD]/60 mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          Game Theory & Optimization Techniques — Academic ISP Competition Model
        </div>
        <div>
          Project by Hansraj Jaiswal, Shlok Agarwal & Geervan Kappa
        </div>
      </footer>

      {/* Educational Theory Modal */}
      <TheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
        matrix={matrix}
        equilibrium={equilibrium}
        selectedA={selectedA}
        selectedB={selectedB}
      />
    </div>
  );
};

export default App;
