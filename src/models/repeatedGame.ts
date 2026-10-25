import type {
  PayoffMatrix,
  PriceStrategy,
  RepeatedStrategyId,
  RepeatedGameResult,
  SimulationRound,
  StrategyDefinition,
} from '../types/gameTheory';

export interface SimulationOptions {
  randomShocks?: boolean;
  shockProbability?: number; // probability of surprise market event per round (default 0.12)
}

export const REPEATED_STRATEGIES: Record<RepeatedStrategyId, StrategyDefinition> = {
  TIT_FOR_TAT: {
    id: 'TIT_FOR_TAT',
    name: 'Tit-for-Tat',
    shortDescription: 'Starts with High Price, then copies opponent’s previous move.',
    fullDescription:
      'Cooperative on round 1. In every subsequent round, it mirrors the exact action taken by the opposing ISP in the immediately preceding round. It forgives defection if the competitor returns to cooperation.',
  },
  GRIM_TRIGGER: {
    id: 'GRIM_TRIGGER',
    name: 'Grim Trigger',
    shortDescription: 'Starts with High Price; if competitor ever defects, punishes forever.',
    fullDescription:
      'Starts by offering High Price. Continues cooperating as long as neither provider has ever charged a Low Price. If either provider defects even once, it switches permanently to Low Price for all remaining rounds.',
  },
  RANDOM_EXPLORER: {
    id: 'RANDOM_EXPLORER',
    name: 'Random Explorer (Adaptive)',
    shortDescription: 'Reacts to past moves with occasional random price tests.',
    fullDescription:
      'Responds to the competitor’s past moves like Tit-for-Tat, but periodically introduces random price shifts (~20% chance) to explore competitor reactions and test market elasticity.',
  },
  ALWAYS_COOPERATE: {
    id: 'ALWAYS_COOPERATE',
    name: 'Always Cooperate (High Price)',
    shortDescription: 'Unconditionally chooses High Price in every round.',
    fullDescription:
      'Maintains High Price regardless of the competitor’s pricing behavior. Vulnerable to continuous undercutting and exploitation by aggressive rivals.',
  },
  ALWAYS_DEFECT: {
    id: 'ALWAYS_DEFECT',
    name: 'Always Defect (Low Price)',
    shortDescription: 'Unconditionally chooses Low Price in every round.',
    fullDescription:
      'Charges Low Price in every round. Represents the one-shot dominant strategy played repetitively, immune to exploitation but capped at the lower Nash payoff.',
  },
};

function getNextAction(
  strategyId: RepeatedStrategyId,
  currentRound: number,
  myHistory: PriceStrategy[],
  opponentHistory: PriceStrategy[]
): PriceStrategy {
  if (strategyId === 'ALWAYS_COOPERATE') {
    return 'HIGH';
  }

  if (strategyId === 'ALWAYS_DEFECT') {
    return 'LOW';
  }

  if (currentRound === 1) {
    if (strategyId === 'RANDOM_EXPLORER' && Math.random() < 0.3) {
      return 'LOW';
    }
    return 'HIGH';
  }

  if (strategyId === 'RANDOM_EXPLORER') {
    // 20% random exploratory move; otherwise respond to opponent's past move
    if (Math.random() < 0.2) {
      return Math.random() < 0.5 ? 'LOW' : 'HIGH';
    }
    const lastOpponentMove = opponentHistory[opponentHistory.length - 1];
    return lastOpponentMove || 'HIGH';
  }

  if (strategyId === 'TIT_FOR_TAT') {
    // Mirror opponent's move in previous round
    const lastOpponentMove = opponentHistory[opponentHistory.length - 1];
    return lastOpponentMove || 'HIGH';
  }

  if (strategyId === 'GRIM_TRIGGER') {
    // If either player has ever chosen LOW in any past round, stay LOW forever
    const opponentDefected = opponentHistory.some((action) => action === 'LOW');
    const iDefected = myHistory.some((action) => action === 'LOW');
    if (opponentDefected || iDefected) {
      return 'LOW';
    }
    return 'HIGH';
  }

  return 'HIGH';
}

export function calculateDeltaThreshold(matrix: PayoffMatrix): number | null {
  // R = Reward for mutual cooperation (HH)
  const R = matrix.HH.ispAPayoff;
  // T = Temptation to defect (LH for player A)
  const T = matrix.LH.ispAPayoff;
  // P = Punishment for mutual defection (LL)
  const P = matrix.LL.ispAPayoff;

  // Folk Theorem / Grim trigger condition:
  // V_coop = R / (1 - δ) >= T + δ * P / (1 - δ)
  // δ >= (T - R) / (T - P)
  if (T <= R) {
    // If defection is not tempting, any delta >= 0 sustains cooperation
    return 0;
  }
  if (T <= P) {
    return null;
  }

  const denom = T - P;
  if (denom <= 0) return null;

  const threshold = (T - R) / denom;
  return Math.max(0, Math.min(1, Math.round(threshold * 1000) / 1000));
}

export function runRepeatedGameSimulation(
  strategyA: RepeatedStrategyId,
  strategyB: RepeatedStrategyId,
  roundsCount: number,
  delta: number,
  matrix: PayoffMatrix,
  options?: SimulationOptions
): RepeatedGameResult {
  const historyA: PriceStrategy[] = [];
  const historyB: PriceStrategy[] = [];
  const rounds: SimulationRound[] = [];

  let cumA = 0;
  let cumB = 0;
  let discCumA = 0;
  let discCumB = 0;

  let coopCount = 0;
  let defectCount = 0;
  let mixedCount = 0;
  let firstDeviationRound: number | undefined;

  const enableShocks = options?.randomShocks ?? false;
  const shockProb = options?.shockProbability ?? 0.12;
  const shockRounds: number[] = [];

  for (let r = 1; r <= roundsCount; r++) {
    // Programmed strategy decision based on past actions
    let actionA = getNextAction(strategyA, r, historyA, historyB);
    let actionB = getNextAction(strategyB, r, historyB, historyA);
    let isShock = false;
    let shockDetail = '';

    // If random shocks are enabled and round > 1, inject a surprise deviation
    if (enableShocks && r > 1) {
      if (Math.random() < shockProb) {
        // One party unexpectedly deviates to test opponent
        const shockTarget = Math.random() < 0.5 ? 'A' : 'B';
        if (shockTarget === 'A') {
          actionA = actionA === 'HIGH' ? 'LOW' : 'HIGH';
          shockDetail = '⚡ Random shock: ISP A unexpectedly switched price!';
        } else {
          actionB = actionB === 'HIGH' ? 'LOW' : 'HIGH';
          shockDetail = '⚡ Random shock: ISP B unexpectedly switched price!';
        }
        isShock = true;
        shockRounds.push(r);
      }
    }

    let profitA = 0;
    let profitB = 0;

    if (actionA === 'LOW' && actionB === 'LOW') {
      profitA = matrix.LL.ispAPayoff;
      profitB = matrix.LL.ispBPayoff;
      defectCount++;
    } else if (actionA === 'LOW' && actionB === 'HIGH') {
      profitA = matrix.LH.ispAPayoff;
      profitB = matrix.LH.ispBPayoff;
      mixedCount++;
      if (firstDeviationRound === undefined) firstDeviationRound = r;
    } else if (actionA === 'HIGH' && actionB === 'LOW') {
      profitA = matrix.HL.ispAPayoff;
      profitB = matrix.HL.ispBPayoff;
      mixedCount++;
      if (firstDeviationRound === undefined) firstDeviationRound = r;
    } else {
      profitA = matrix.HH.ispAPayoff;
      profitB = matrix.HH.ispBPayoff;
      coopCount++;
    }

    cumA += profitA;
    cumB += profitB;

    const discountWeight = Math.pow(delta, r - 1);
    discCumA += profitA * discountWeight;
    discCumB += profitB * discountWeight;

    historyA.push(actionA);
    historyB.push(actionB);

    let note = '';
    if (isShock) {
      note = shockDetail;
    } else if (actionA === 'HIGH' && actionB === 'HIGH') {
      note = 'Mutual cooperation at High Price';
    } else if (actionA === 'LOW' && actionB === 'LOW') {
      note =
        r > 1 &&
        (strategyA === 'GRIM_TRIGGER' ||
          strategyB === 'GRIM_TRIGGER' ||
          strategyA === 'TIT_FOR_TAT' ||
          strategyB === 'TIT_FOR_TAT')
          ? 'Punishment phase: both charging Low Price'
          : 'Both charging Low Price (Nash outcome)';
    } else if (actionA === 'LOW' && actionB === 'HIGH') {
      note = 'ISP A undercuts ISP B with Low Price';
    } else {
      note = 'ISP B undercuts ISP A with Low Price';
    }

    rounds.push({
      round: r,
      ispAAction: actionA,
      ispBAction: actionB,
      profitA,
      profitB,
      cumulativeA: Math.round(cumA * 10) / 10,
      cumulativeB: Math.round(cumB * 10) / 10,
      discountedCumulativeA: Math.round(discCumA * 10) / 10,
      discountedCumulativeB: Math.round(discCumB * 10) / 10,
      discountWeight: Math.round(discountWeight * 1000) / 1000,
      note,
      isRandomShock: isShock,
    });
  }

  const deltaThreshold = calculateDeltaThreshold(matrix);
  const deltaMeetsThreshold = deltaThreshold !== null ? delta >= deltaThreshold : true;

  // Generate analytical observations
  const observations: string[] = [];

  if (enableShocks && shockRounds.length > 0) {
    observations.push(
      `🎲 What-If Scenario: ${shockRounds.length} surprise deviation(s) occurred (Rounds: ${shockRounds.slice(0, 5).join(', ')}${shockRounds.length > 5 ? '...' : ''}).`
    );
    if (strategyA === 'GRIM_TRIGGER' || strategyB === 'GRIM_TRIGGER') {
      observations.push(
        'Because Grim Trigger was active, the very first surprise defection triggered an irreversible collapse into mutual low pricing for all subsequent rounds.'
      );
    } else if (strategyA === 'TIT_FOR_TAT' || strategyB === 'TIT_FOR_TAT') {
      observations.push(
        'Tit-for-Tat retaliated in the immediate round following the surprise defection, demonstrating how punishment disciplines unexpected deviations.'
      );
    } else {
      observations.push(
        'Both providers reacted to the random deviations based on their programmed rules and the complete history of previous actions.'
      );
    }
  } else if (strategyA === 'TIT_FOR_TAT' && strategyB === 'TIT_FOR_TAT') {
    observations.push('With Tit-for-Tat, both ISPs maintain high prices and earn higher long-term profits.');
    observations.push('If one ISP defects, the other retaliates, leading to lower profits in subsequent rounds.');
    observations.push('Higher discount factors (δ) make cooperation more sustainable, as future profits are valued more.');
  } else if (strategyA === 'GRIM_TRIGGER' && strategyB === 'GRIM_TRIGGER') {
    observations.push('With Grim Trigger, both providers sustain mutual high pricing because any deviation triggers permanent punishment.');
    if (deltaThreshold !== null) {
      observations.push(`Theoretical threshold: δ ≥ ${deltaThreshold}. At δ = ${delta}, cooperation is mathematically stable.`);
    }
    observations.push('A single defection would permanently collapse market profits to the ₹10 lakh Nash level.');
  } else if (strategyA === 'ALWAYS_DEFECT' && strategyB === 'ALWAYS_DEFECT') {
    observations.push('Both providers play the one-shot dominant strategy (Low Price) in every single round.');
    observations.push('Neither player trusts the competitor to cooperate, trapping both in the lower-profit Nash equilibrium (₹10 lakh/round).');
    observations.push(`Over ${roundsCount} rounds, each firm forfeits substantial profits compared to what mutual high pricing could have earned.`);
  } else if (
    (strategyA === 'ALWAYS_DEFECT' && (strategyB === 'TIT_FOR_TAT' || strategyB === 'GRIM_TRIGGER')) ||
    (strategyB === 'ALWAYS_DEFECT' && (strategyA === 'TIT_FOR_TAT' || strategyA === 'GRIM_TRIGGER'))
  ) {
    const defector = strategyA === 'ALWAYS_DEFECT' ? 'ISP A' : 'ISP B';
    const retaliator = strategyA === 'ALWAYS_DEFECT' ? 'ISP B' : 'ISP A';
    observations.push(`${defector} gains in round 1 by undercutting, but ${retaliator} retaliates from round 2 onward.`);
    observations.push(`Retaliation quickly drives both ISPs down to the low-margin Nash equilibrium, eliminating the defector's long-term advantage.`);
  } else if (strategyA === 'RANDOM_EXPLORER' || strategyB === 'RANDOM_EXPLORER') {
    observations.push(
      'The Random Explorer tests price changes probabilistically. The competitor responds strictly to those past actions in each subsequent period.'
    );
  } else {
    observations.push(`Simulation completed across ${roundsCount} rounds: ${coopCount} cooperative, ${defectCount} defective, ${mixedCount} asymmetric.`);
  }

  return {
    rounds,
    finalCumulativeA: Math.round(cumA * 10) / 10,
    finalCumulativeB: Math.round(cumB * 10) / 10,
    finalDiscountedA: Math.round(discCumA * 10) / 10,
    finalDiscountedB: Math.round(discCumB * 10) / 10,
    cooperativeRoundsCount: coopCount,
    defectiveRoundsCount: defectCount,
    mixedRoundsCount: mixedCount,
    deltaThreshold,
    deltaMeetsThreshold,
    observations,
    firstDeviationRound,
    hasRandomShocks: enableShocks && shockRounds.length > 0,
    shockRounds,
  };
}
