import React, { useState, useEffect, useRef, useCallback } from 'react';
import type {
  RepeatedStrategyId,
  RepeatedGameResult,
  PayoffMatrix,
} from '../types/gameTheory';
import { REPEATED_STRATEGIES } from '../models/repeatedGame';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Lightbulb,
  ListCollapse,
  CheckCircle2,
  Dices,
  Sparkles,
  TrendingUp,
  SlidersHorizontal,
} from 'lucide-react';

interface RepeatedGamePanelProps {
  strategyA: RepeatedStrategyId;
  strategyB: RepeatedStrategyId;
  roundsCount: number;
  delta: number;
  matrix: PayoffMatrix;
  simulationResult: RepeatedGameResult;
  randomShocksEnabled?: boolean;
  onStrategyAChange: (s: RepeatedStrategyId) => void;
  onStrategyBChange: (s: RepeatedStrategyId) => void;
  onRoundsCountChange: (r: number) => void;
  onDeltaChange: (d: number) => void;
  onRunSimulation?: () => void;
  onTriggerRandomWhatIf?: () => void;
  onToggleRandomShocks?: () => void;
  onRandomizeSetup?: () => void;
}

export const RepeatedGamePanel: React.FC<RepeatedGamePanelProps> = ({
  strategyA,
  strategyB,
  roundsCount,
  delta,
  matrix,
  simulationResult,
  randomShocksEnabled = true,
  onStrategyAChange,
  onStrategyBChange,
  onRoundsCountChange,
  onDeltaChange,
  onTriggerRandomWhatIf,
  onToggleRandomShocks,
  onRandomizeSetup,
}) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [viewMode, setViewMode] = useState<'cumulative' | 'discounted'>('cumulative');
  const [randomizeStrategiesWithShock, setRandomizeStrategiesWithShock] = useState(true);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  // Simulation playback state
  const [isSimulating, setIsSimulating] = useState(false);
  const [visibleRound, setVisibleRound] = useState<number>(roundsCount);
  const [justCompleted, setJustCompleted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(30); // ms per round

  const timerRef = useRef<number | null>(null);

  // Benchmarks
  const neTotalProfit = Math.round(roundsCount * matrix.LL.ispAPayoff * 10) / 10;
  const coopTotalProfit = Math.round(roundsCount * matrix.HH.ispAPayoff * 10) / 10;

  // Clear timer helper
  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  // When roundsCount changes from user input, adjust visibleRound if not running
  useEffect(() => {
    if (!isSimulating) {
      setVisibleRound(roundsCount);
    }
  }, [roundsCount, isSimulating]);

  // Handle Play / Run Simulation
  const handleStartSimulation = useCallback(() => {
    stopTimer();
    setIsSimulating(true);
    setJustCompleted(false);
    setVisibleRound(1);

    let current = 1;
    const interval = window.setInterval(() => {
      current++;
      if (current >= roundsCount) {
        setVisibleRound(roundsCount);
        setIsSimulating(false);
        setJustCompleted(true);
        if (timerRef.current !== null) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
      } else {
        setVisibleRound(current);
      }
    }, playbackSpeed);

    timerRef.current = interval;
  }, [roundsCount, playbackSpeed, stopTimer]);

  // Handle Pause
  const handlePauseSimulation = useCallback(() => {
    stopTimer();
    setIsSimulating(false);
  }, [stopTimer]);

  // Handle Resume
  const handleResumeSimulation = useCallback(() => {
    if (visibleRound >= roundsCount) {
      handleStartSimulation();
      return;
    }
    setIsSimulating(true);
    let current = visibleRound;
    const interval = window.setInterval(() => {
      current++;
      if (current >= roundsCount) {
        setVisibleRound(roundsCount);
        setIsSimulating(false);
        setJustCompleted(true);
        if (timerRef.current !== null) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
      } else {
        setVisibleRound(current);
      }
    }, playbackSpeed);

    timerRef.current = interval;
  }, [visibleRound, roundsCount, playbackSpeed, handleStartSimulation, stopTimer]);

  // Handle Skip to End
  const handleSkipToEnd = useCallback(() => {
    stopTimer();
    setIsSimulating(false);
    setVisibleRound(roundsCount);
    setJustCompleted(true);
  }, [roundsCount, stopTimer]);

  // Handle Trigger Random What-If Shock
  const handleTriggerRandomWhatIfWithPlayback = useCallback(() => {
    if (randomizeStrategiesWithShock && onRandomizeSetup) {
      // Pick random strategies AND inject surprise market shocks
      onRandomizeSetup();
    } else if (onTriggerRandomWhatIf) {
      // Keep current strategies and inject surprise market shocks
      onTriggerRandomWhatIf();
    }
    // Launch playback so user watches the shock and competitor reaction unfold
    setTimeout(() => {
      handleStartSimulation();
    }, 60);
  }, [randomizeStrategiesWithShock, onRandomizeSetup, onTriggerRandomWhatIf, handleStartSimulation]);

  // Handle Randomize Setup with Playback
  const handleRandomizeSetupWithPlayback = useCallback(() => {
    if (onRandomizeSetup) {
      onRandomizeSetup();
    }
    setTimeout(() => {
      handleStartSimulation();
    }, 60);
  }, [onRandomizeSetup, handleStartSimulation]);

  // Prepare chart data sliced up to visibleRound
  const slicedRounds = simulationResult.rounds.slice(0, visibleRound);
  const chartData = [
    {
      round: 0,
      cumA: 0,
      cumB: 0,
      discCumA: 0,
      discCumB: 0,
      actionA: '-',
      actionB: '-',
      isRandomShock: false,
    },
    ...slicedRounds.map((r) => ({
      round: r.round,
      cumA: r.cumulativeA,
      cumB: r.cumulativeB,
      discCumA: r.discountedCumulativeA,
      discCumB: r.discountedCumulativeB,
      actionA: r.ispAAction === 'HIGH' ? 'High' : 'Low',
      actionB: r.ispBAction === 'HIGH' ? 'High' : 'Low',
      profitA: r.profitA,
      profitB: r.profitB,
      note: r.note,
      isRandomShock: r.isRandomShock,
    })),
  ];

  const formatYAxis = (val: number) => {
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
    return `${val}`;
  };

  return (
    <div className="bg-[#FAF8F3] border border-[#DDD8CD] rounded-xl p-5 shadow-card flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header with Randomize Setup shortcut */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-serif text-[#173D35] font-normal tracking-tight">
              Repeated Game Simulation
            </h2>
            <p className="text-xs text-[#586863] mt-1">
              See how cooperation or defection evolves over multiple rounds.
            </p>
          </div>
          <button
            onClick={handleRandomizeSetupWithPlayback}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#173D35] hover:text-[#F16F52] bg-white border border-[#DDD8CD] hover:border-[#173D35] px-2 py-1 rounded-lg transition shadow-xs cursor-pointer"
            title="Randomize strategy matchup and market shocks"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F16F52]" />
            Randomize Matchup
          </button>
        </div>

        {/* Controls Grid */}
        <div className="space-y-3">
          {/* Strategy Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#1D2926] mb-1">
                Strategy for ISP A
              </label>
              <select
                value={strategyA}
                onChange={(e) => {
                  onStrategyAChange(e.target.value as RepeatedStrategyId);
                  setVisibleRound(roundsCount);
                }}
                className="w-full bg-white border border-[#DDD8CD] rounded-lg px-2.5 py-1.5 text-xs text-[#1D2926] focus:outline-none focus:ring-1 focus:ring-[#173D35] focus:border-[#173D35] cursor-pointer"
              >
                {Object.values(REPEATED_STRATEGIES).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#1D2926] mb-1">
                Strategy for ISP B
              </label>
              <select
                value={strategyB}
                onChange={(e) => {
                  onStrategyBChange(e.target.value as RepeatedStrategyId);
                  setVisibleRound(roundsCount);
                }}
                className="w-full bg-white border border-[#DDD8CD] rounded-lg px-2.5 py-1.5 text-xs text-[#1D2926] focus:outline-none focus:ring-1 focus:ring-[#173D35] focus:border-[#173D35] cursor-pointer"
              >
                {Object.values(REPEATED_STRATEGIES).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rounds & Delta */}
          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <label className="block text-[11px] font-medium text-[#1D2926] mb-1">
                Number of rounds
              </label>
              <input
                type="number"
                min={5}
                max={150}
                step={5}
                value={roundsCount}
                onChange={(e) => {
                  const val = Number(e.target.value) || 10;
                  onRoundsCountChange(val);
                  setVisibleRound(val);
                }}
                className="w-full bg-white border border-[#DDD8CD] rounded-lg px-2.5 py-1.5 text-xs text-[#1D2926] focus:outline-none focus:ring-1 focus:ring-[#173D35] font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-medium text-[#1D2926]">
                  Discount factor (δ)
                </label>
                <span className="text-xs font-mono font-semibold text-[#173D35]">
                  {delta.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.99}
                step={0.05}
                value={delta}
                onChange={(e) => onDeltaChange(Number(e.target.value))}
                className="w-full cursor-pointer accent-[#F16F52]"
              />
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-[#DDD8CD]/60">
            <div className="flex items-center gap-2">
              {!isSimulating ? (
                <button
                  onClick={visibleRound < roundsCount && visibleRound > 1 ? handleResumeSimulation : handleStartSimulation}
                  className="bg-[#173D35] hover:bg-[#102B25] text-white text-xs font-medium py-2 px-3 rounded-lg flex items-center gap-1.5 shadow-sm transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  title="Run step-by-step game simulation"
                >
                  {visibleRound >= roundsCount ? (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Run Simulation
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Resume ({visibleRound}/{roundsCount})
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePauseSimulation}
                    className="bg-[#C84E33] hover:bg-[#A93E26] text-white text-xs font-medium py-2 px-2.5 rounded-lg flex items-center gap-1 shadow-sm transition cursor-pointer"
                    title="Pause simulation"
                  >
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    Pause
                  </button>
                  <button
                    onClick={handleSkipToEnd}
                    className="bg-white border border-[#DDD8CD] hover:border-[#173D35] text-[#173D35] text-xs font-medium p-2 rounded-lg transition cursor-pointer"
                    title="Skip to end"
                  >
                    <FastForward className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* What-If Random Shock Button */}
              <button
                onClick={handleTriggerRandomWhatIfWithPlayback}
                className="bg-[#FAF8F3] hover:bg-[#FDF1EE] border border-[#DDD8CD] hover:border-[#F8B6A7] text-[#C84E33] text-xs font-medium py-2 px-3 rounded-lg flex items-center gap-1.5 shadow-xs transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                title="Simulate random market deviations and watch both parties react according to past actions"
              >
                <Dices className="w-3.5 h-3.5 text-[#F16F52]" />
                Random What-If
              </button>

              {visibleRound < roundsCount && !isSimulating && (
                <button
                  onClick={handleStartSimulation}
                  className="bg-white border border-[#DDD8CD] hover:border-[#173D35] text-[#173D35] text-xs font-medium p-2 rounded-lg transition cursor-pointer"
                  title="Restart simulation from round 1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* What-If Configuration Options Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowOptionsMenu((prev) => !prev)}
                className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                  showOptionsMenu
                    ? 'bg-[#173D35] text-white border-[#173D35]'
                    : 'bg-white border-[#DDD8CD] text-[#586863] hover:text-[#173D35] hover:border-[#173D35]'
                }`}
                title="What-If Simulation Options"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Options</span>
              </button>

              {showOptionsMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowOptionsMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1.5 z-40 bg-white border border-[#DDD8CD] rounded-xl shadow-lg p-3 w-60 space-y-2.5 text-xs animate-in fade-in zoom-in-95 duration-100">
                    <div className="text-[11px] font-semibold text-[#173D35] border-b border-[#DDD8CD]/60 pb-1.5 flex items-center justify-between">
                      <span>What-If Settings</span>
                      <span className="text-[9px] bg-[#E8EFEA] text-[#173D35] px-1.5 py-0.2 rounded font-medium">
                        Active by default
                      </span>
                    </div>

                    <label className="flex items-start gap-2.5 cursor-pointer select-none hover:bg-[#FAF8F3] p-1 rounded-md transition">
                      <input
                        type="checkbox"
                        checked={randomizeStrategiesWithShock}
                        onChange={(e) => setRandomizeStrategiesWithShock(e.target.checked)}
                        className="accent-[#F16F52] rounded cursor-pointer mt-0.5"
                      />
                      <div>
                        <span className="text-[#1D2926] font-medium block text-xs">Randomize strategies</span>
                        <span className="text-[10px] text-[#7F918C] block leading-tight">Pick surprise matchups on What-If</span>
                      </div>
                    </label>

                    {onToggleRandomShocks && (
                      <label className="flex items-start gap-2.5 cursor-pointer select-none hover:bg-[#FAF8F3] p-1 rounded-md transition">
                        <input
                          type="checkbox"
                          checked={randomShocksEnabled}
                          onChange={onToggleRandomShocks}
                          className="accent-[#F16F52] rounded cursor-pointer mt-0.5"
                        />
                        <div>
                          <span className="text-[#1D2926] font-medium block text-xs">Market shocks</span>
                          <span className="text-[10px] text-[#7F918C] block leading-tight">Inject unexpected price deviations</span>
                        </div>
                      </label>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Live Simulation Progress Indicator */}
        {(isSimulating || visibleRound < roundsCount || justCompleted) && (
          <div className="bg-white border border-[#DDD8CD] rounded-lg px-3 py-1.5 flex items-center justify-between text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              {isSimulating ? (
                <span className="w-2 h-2 rounded-full bg-[#F16F52] animate-pulse"></span>
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#173D35]" />
              )}
              <span className="text-[#1D2926] font-medium font-mono text-[11px]">
                {isSimulating
                  ? `Simulating round ${visibleRound} of ${roundsCount}...`
                  : visibleRound < roundsCount
                  ? `Paused at round ${visibleRound} of ${roundsCount}`
                  : `Simulation completed across all ${roundsCount} rounds!`}
              </span>
            </div>
            {/* Speed toggle */}
            <div className="flex items-center gap-1 text-[10px] text-[#586863]">
              <span>Speed:</span>
              <button
                onClick={() => setPlaybackSpeed(50)}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${playbackSpeed === 50 ? 'bg-[#173D35] text-white font-semibold' : 'hover:bg-[#EFECE4]'}`}
              >
                1x
              </button>
              <button
                onClick={() => setPlaybackSpeed(20)}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${playbackSpeed === 20 ? 'bg-[#173D35] text-white font-semibold' : 'hover:bg-[#EFECE4]'}`}
              >
                2x
              </button>
            </div>
          </div>
        )}

        {/* Chart Header & Legend with Live Totals */}
        <div className="pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs mb-1.5 gap-1">
            <span className="font-semibold text-[#1D2926]">
              {viewMode === 'discounted' ? 'Discounted' : 'Cumulative'} Profit Over Rounds
            </span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F16F52] inline-block"></span>
                <span className="text-[#586863]">
                  ISP A: <strong className="text-[#F16F52] font-mono">₹{viewMode === 'discounted' ? (slicedRounds[slicedRounds.length - 1]?.discountedCumulativeA ?? 0) : (slicedRounds[slicedRounds.length - 1]?.cumulativeA ?? 0)}L</strong>
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#173D35] inline-block"></span>
                <span className="text-[#586863]">
                  ISP B: <strong className="text-[#173D35] font-mono">₹{viewMode === 'discounted' ? (slicedRounds[slicedRounds.length - 1]?.discountedCumulativeB ?? 0) : (slicedRounds[slicedRounds.length - 1]?.cumulativeB ?? 0)}L</strong>
                </span>
              </span>
            </div>
          </div>

          {/* Recharts Container */}
          <div className="bg-white/80 border border-[#DDD8CD] rounded-xl p-2 h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3DFD5" vertical={false} />
                <XAxis
                  dataKey="round"
                  tick={{ fontSize: 10, fill: '#7F918C' }}
                  tickLine={false}
                  axisLine={{ stroke: '#DDD8CD' }}
                  label={{ value: 'Round', position: 'insideBottomRight', offset: -4, fontSize: 10, fill: '#7F918C' }}
                />
                <YAxis
                  tickFormatter={formatYAxis}
                  tick={{ fontSize: 10, fill: '#7F918C' }}
                  tickLine={false}
                  axisLine={{ stroke: '#DDD8CD' }}
                  label={{
                    value: 'Cumulative profit (₹ lakh)',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 14,
                    fontSize: 9,
                    fill: '#7F918C',
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      if (data.round === 0) return null;
                      return (
                        <div className="bg-[#173D35] text-white p-2.5 rounded-lg shadow-lg text-[11px] space-y-1">
                          <div className="font-semibold text-xs border-b border-white/20 pb-1 flex justify-between items-center">
                            <span>Round {data.round}</span>
                            {data.isRandomShock && (
                              <span className="bg-[#F16F52] text-white text-[9px] px-1 py-0.2 rounded font-bold">
                                ⚡ Surprise Shock
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between gap-3">
                            <span className="text-[#F8B6A7]">ISP A ({data.actionA}):</span>
                            <span className="font-mono">
                              ₹{data.profitA}L (Total: ₹{data.cumA}L)
                            </span>
                          </div>
                          <div className="flex justify-between gap-3">
                            <span className="text-[#D8DCC8]">ISP B ({data.actionB}):</span>
                            <span className="font-mono">
                              ₹{data.profitB}L (Total: ₹{data.cumB}L)
                            </span>
                          </div>
                          {data.note && (
                            <div className="text-[10px] text-white/80 italic pt-0.5">
                              {data.note}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={viewMode === 'discounted' ? 'discCumA' : 'cumA'}
                  stroke="#F16F52"
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: '#F16F52', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey={viewMode === 'discounted' ? 'discCumB' : 'cumB'}
                  stroke="#173D35"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                  dot={{ r: 2, fill: '#173D35', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Toggle between cumulative and discounted + View rounds log */}
          <div className="flex items-center justify-between mt-2 text-[11px] text-[#586863]">
            {/* View Mode Toggle Pill */}
            <div className="inline-flex bg-[#EFECE4] border border-[#DDD8CD] rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('cumulative')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  viewMode === 'cumulative'
                    ? 'bg-white text-[#173D35] shadow-xs'
                    : 'text-[#7F918C] hover:text-[#1D2926]'
                }`}
              >
                Undiscounted
              </button>
              <button
                onClick={() => setViewMode('discounted')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  viewMode === 'discounted'
                    ? 'bg-white text-[#173D35] shadow-xs'
                    : 'text-[#7F918C] hover:text-[#1D2926]'
                }`}
              >
                Discounted (δ)
              </button>
            </div>

            <button
              onClick={() => setShowLogModal(true)}
              className="inline-flex items-center gap-1 text-[#173D35] hover:text-[#F16F52] transition font-medium cursor-pointer"
            >
              <ListCollapse className="w-3.5 h-3.5" />
              Round-by-round log
            </button>
          </div>
        </div>

        {/* Observations */}
        <div>
          <h3 className="text-xs font-semibold text-[#173D35] tracking-wide mb-1.5">
            Observations
          </h3>
          <ul className="space-y-1 text-xs text-[#586863] leading-relaxed">
            {simulationResult.observations.map((obs, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-[#173D35] mt-1">•</span>
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Benchmark Comparison vs. NE and Ideal Cooperation */}
      <div className="mt-4 pt-3 border-t border-[#DDD8CD]/80 space-y-3">
        <div className="bg-[#FAF8F3] border border-[#DDD8CD] rounded-xl p-3 text-xs shadow-subtle">
          <div className="flex items-center gap-1.5 font-semibold text-xs text-[#173D35] mb-2">
            <TrendingUp className="w-4 h-4 text-[#173D35]" />
            Payoff Comparison vs. Equilibrium & Ideal Benchmarks ({roundsCount} Rounds)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="bg-white p-2 rounded-lg border border-[#DDD8CD]">
              <span className="text-[#586863] block">Actual Total Profit:</span>
              <div className="font-mono mt-0.5">
                <span className="text-[#F16F52] font-semibold">A: ₹{simulationResult.finalCumulativeA}L</span>
                <span className="text-[#7F918C] mx-1">|</span>
                <span className="text-[#173D35] font-semibold">B: ₹{simulationResult.finalCumulativeB}L</span>
              </div>
            </div>

            <div className="bg-white p-2 rounded-lg border border-[#DDD8CD]">
              <span className="text-[#586863] block">One-Shot Nash Baseline:</span>
              <strong className="text-[#C84E33] font-mono mt-0.5 block">
                ₹{neTotalProfit}L each
              </strong>
              <span className="text-[10px] text-[#7F918C]">
                Trapped in mutual price cuts (Low, Low)
              </span>
            </div>

            <div className="bg-white p-2 rounded-lg border border-[#DDD8CD]">
              <span className="text-[#586863] block">Ideal Mutual Cooperation:</span>
              <strong className="text-[#173D35] font-mono mt-0.5 block">
                ₹{coopTotalProfit}L each
              </strong>
              <span className="text-[10px] text-[#7F918C]">
                Sustained High Price (₹15L/rnd)
              </span>
            </div>
          </div>
        </div>

        {/* Key Takeaways Box */}
        <div className="bg-[#FAF8F3] border border-[#DDD8CD] rounded-xl p-3 text-xs shadow-subtle">
          <div className="flex items-center gap-1.5 font-semibold text-xs text-[#173D35] mb-1.5">
            <Lightbulb className="w-4 h-4 text-[#173D35]" />
            Key Takeaways
          </div>
          <ul className="space-y-1 text-xs text-[#586863] leading-relaxed">
            <li className="flex items-start gap-1.5">
              <span className="text-[#173D35] mt-1">•</span>
              <span>
                In a one-shot game, low price is the dominant strategy, leading to a Nash equilibrium ({matrix.LL.ispAPayoff} , {matrix.LL.ispBPayoff}).
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#173D35] mt-1">•</span>
              <span>
                Repeated interactions can sustain cooperation (high prices) through strategies like Tit-for-Tat.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#173D35] mt-1">•</span>
              <span>
                If δ ≥ {simulationResult.deltaThreshold !== null ? simulationResult.deltaThreshold : '0.375'} (in this model), cooperation becomes more profitable than defection (Folk Theorem).
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Round-by-round Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F3] border border-[#DDD8CD] rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#DDD8CD] flex items-center justify-between bg-white">
              <div>
                <h3 className="text-lg font-serif text-[#173D35]">
                  Round-by-Round History
                </h3>
                <p className="text-xs text-[#586863]">
                  {REPEATED_STRATEGIES[strategyA]?.name} vs {REPEATED_STRATEGIES[strategyB]?.name} over {roundsCount} rounds (δ = {delta})
                  {simulationResult.hasRandomShocks && ' • ⚡ What-If Shocks Active'}
                </p>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-[#586863] hover:text-[#1D2926] p-1.5 rounded-lg hover:bg-[#F5F1E8] transition text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Table with Opaque Sticky Headers */}
            <div className="overflow-y-auto p-4 flex-1">
              <table className="w-full text-xs text-left [border-collapse:separate] [border-spacing:0]">
                <thead className="sticky top-0 z-20">
                  <tr>
                    <th className="bg-[#EFECE4] py-2.5 px-3 font-semibold text-[#173D35] border-b border-[#DDD8CD] rounded-l-lg">Rnd</th>
                    <th className="bg-[#EFECE4] py-2.5 px-3 font-semibold text-[#173D35] border-b border-[#DDD8CD]">ISP A Action</th>
                    <th className="bg-[#EFECE4] py-2.5 px-3 font-semibold text-[#173D35] border-b border-[#DDD8CD]">ISP B Action</th>
                    <th className="bg-[#EFECE4] py-2.5 px-3 font-semibold text-[#173D35] border-b border-[#DDD8CD]">A Profit</th>
                    <th className="bg-[#EFECE4] py-2.5 px-3 font-semibold text-[#173D35] border-b border-[#DDD8CD]">B Profit</th>
                    <th className="bg-[#EFECE4] py-2.5 px-3 font-semibold text-[#173D35] border-b border-[#DDD8CD]">A Cum.</th>
                    <th className="bg-[#EFECE4] py-2.5 px-3 font-semibold text-[#173D35] border-b border-[#DDD8CD] rounded-r-lg">Event / Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD8CD]/50">
                  {simulationResult.rounds.map((r) => (
                    <tr
                      key={r.round}
                      className={`hover:bg-white/60 transition ${
                        r.isRandomShock ? 'bg-[#FDF1EE]/80 font-medium' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono font-medium border-b border-[#DDD8CD]/30">
                        {r.round}
                        {r.isRandomShock && (
                          <span className="ml-1 text-[10px] text-[#F16F52]">⚡</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 border-b border-[#DDD8CD]/30">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            r.ispAAction === 'HIGH'
                              ? 'bg-[#EBF2EE] text-[#173D35]'
                              : 'bg-[#FDF1EE] text-[#F16F52]'
                          }`}
                        >
                          {r.ispAAction === 'HIGH' ? 'High Price' : 'Low Price'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 border-b border-[#DDD8CD]/30">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            r.ispBAction === 'HIGH'
                              ? 'bg-[#EBF2EE] text-[#173D35]'
                              : 'bg-[#FDF1EE] text-[#F16F52]'
                          }`}
                        >
                          {r.ispBAction === 'HIGH' ? 'High Price' : 'Low Price'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono border-b border-[#DDD8CD]/30">₹{r.profitA}L</td>
                      <td className="py-2.5 px-3 font-mono border-b border-[#DDD8CD]/30">₹{r.profitB}L</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-[#F16F52] border-b border-[#DDD8CD]/30">
                        ₹{r.cumulativeA}L
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-[#586863] border-b border-[#DDD8CD]/30">
                        {r.isRandomShock ? (
                          <span className="text-[#C84E33] font-medium flex items-center gap-1">
                            <span>⚡</span>
                            {r.note}
                          </span>
                        ) : (
                          r.note
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer with Benchmark Comparison */}
            <div className="px-6 py-3.5 border-t border-[#DDD8CD] bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
              <div className="space-y-0.5">
                <div>
                  <strong>Actual Total:</strong> ISP A = <span className="text-[#F16F52] font-mono font-semibold">₹{simulationResult.finalCumulativeA}L</span> | ISP B = <span className="text-[#173D35] font-mono font-semibold">₹{simulationResult.finalCumulativeB}L</span>
                </div>
                <div className="text-[11px] text-[#7F918C]">
                  One-Shot Nash Baseline (Low, Low): <span className="font-mono text-[#1D2926]">₹{neTotalProfit}L</span> each • Ideal Cooperation (High, High): <span className="font-mono text-[#1D2926]">₹{coopTotalProfit}L</span> each
                </div>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="bg-[#173D35] text-white px-4 py-1.5 rounded-lg hover:bg-[#102B25] transition cursor-pointer self-end sm:self-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
