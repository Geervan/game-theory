import type { PayoffMatrix, PriceStrategy, EquilibriumAnalysis } from '../types/gameTheory';

export function analyzeEquilibrium(
  matrix: PayoffMatrix,
  currentA: PriceStrategy,
  currentB: PriceStrategy
): EquilibriumAnalysis {
  // Best responses for ISP A:
  // When B chooses LOW: compare LL.ispAPayoff vs HL.ispAPayoff
  const brA_toLow: PriceStrategy =
    matrix.LL.ispAPayoff >= matrix.HL.ispAPayoff ? 'LOW' : 'HIGH';

  // When B chooses HIGH: compare LH.ispAPayoff vs HH.ispAPayoff
  const brA_toHigh: PriceStrategy =
    matrix.LH.ispAPayoff >= matrix.HH.ispAPayoff ? 'LOW' : 'HIGH';

  // Best responses for ISP B:
  // When A chooses LOW: compare LL.ispBPayoff vs LH.ispBPayoff
  const brB_toLow: PriceStrategy =
    matrix.LL.ispBPayoff >= matrix.LH.ispBPayoff ? 'LOW' : 'HIGH';

  // When A chooses HIGH: compare HL.ispBPayoff vs HH.ispBPayoff
  const brB_toHigh: PriceStrategy =
    matrix.HL.ispBPayoff >= matrix.HH.ispBPayoff ? 'LOW' : 'HIGH';

  // Dominant strategies
  const dominantStrategyA: PriceStrategy | 'NONE' =
    brA_toLow === brA_toHigh ? brA_toLow : 'NONE';
  const dominantStrategyB: PriceStrategy | 'NONE' =
    brB_toLow === brB_toHigh ? brB_toLow : 'NONE';

  // Pure Strategy Nash Equilibria
  // Cell is Nash if action A is BR to action B AND action B is BR to action A
  const nashEquilibria: Array<{ ispA: PriceStrategy; ispB: PriceStrategy }> = [];

  // Reset flags
  matrix.LL.isNash = false;
  matrix.LH.isNash = false;
  matrix.HL.isNash = false;
  matrix.HH.isNash = false;

  if (brA_toLow === 'LOW' && brB_toLow === 'LOW') {
    nashEquilibria.push({ ispA: 'LOW', ispB: 'LOW' });
    matrix.LL.isNash = true;
  }
  if (brA_toHigh === 'LOW' && brB_toLow === 'HIGH') {
    nashEquilibria.push({ ispA: 'LOW', ispB: 'HIGH' });
    matrix.LH.isNash = true;
  }
  if (brA_toLow === 'HIGH' && brB_toHigh === 'LOW') {
    nashEquilibria.push({ ispA: 'HIGH', ispB: 'LOW' });
    matrix.HL.isNash = true;
  }
  if (brA_toHigh === 'HIGH' && brB_toHigh === 'HIGH') {
    nashEquilibria.push({ ispA: 'HIGH', ispB: 'HIGH' });
    matrix.HH.isNash = true;
  }

  const isCurrentSelectedNash =
    (currentA === 'LOW' && currentB === 'LOW' && matrix.LL.isNash) ||
    (currentA === 'LOW' && currentB === 'HIGH' && matrix.LH.isNash) ||
    (currentA === 'HIGH' && currentB === 'LOW' && matrix.HL.isNash) ||
    (currentA === 'HIGH' && currentB === 'HIGH' && matrix.HH.isNash);

  // Joint optimal
  const sumLL = matrix.LL.ispAPayoff + matrix.LL.ispBPayoff;
  const sumLH = matrix.LH.ispAPayoff + matrix.LH.ispBPayoff;
  const sumHL = matrix.HL.ispAPayoff + matrix.HL.ispBPayoff;
  const sumHH = matrix.HH.ispAPayoff + matrix.HH.ispBPayoff;

  let jointOptimal = { ispA: 'HIGH' as PriceStrategy, ispB: 'HIGH' as PriceStrategy, totalProfit: sumHH };
  if (sumLL > jointOptimal.totalProfit) jointOptimal = { ispA: 'LOW', ispB: 'LOW', totalProfit: sumLL };
  if (sumLH > jointOptimal.totalProfit) jointOptimal = { ispA: 'LOW', ispB: 'HIGH', totalProfit: sumLH };
  if (sumHL > jointOptimal.totalProfit) jointOptimal = { ispA: 'HIGH', ispB: 'LOW', totalProfit: sumHL };

  // Prisoner's dilemma condition:
  // (Low, Low) is unique Nash, but (High, High) yields strictly higher payoff to both players
  const isPrisonersDilemma =
    matrix.LL.isNash &&
    !matrix.HH.isNash &&
    matrix.HH.ispAPayoff > matrix.LL.ispAPayoff &&
    matrix.HH.ispBPayoff > matrix.LL.ispBPayoff;

  // Generate dynamic contextual explanation
  let explanation = '';

  if (currentA === 'LOW' && currentB === 'LOW') {
    if (matrix.LL.isNash) {
      if (isPrisonersDilemma) {
        explanation = `When both ISPs choose low price, neither can increase their profit by unilaterally switching to high price (doing so would drop profit from ₹${matrix.LL.ispAPayoff} lakh to ₹${matrix.HL.ispAPayoff} lakh). This is a Nash equilibrium, but it leads to lower profits compared to the jointly better outcome (${matrix.HH.ispAPayoff} , ${matrix.HH.ispBPayoff}).`;
      } else {
        explanation = `Both ISPs choosing low price forms a Nash equilibrium. Neither player has an incentive to unilaterally deviate to high price.`;
      }
    } else {
      explanation = `Choosing low price is not a stable equilibrium under these parameters; at least one provider earns higher profit by switching to high price.`;
    }
  } else if (currentA === 'HIGH' && currentB === 'HIGH') {
    if (matrix.HH.isNash) {
      explanation = `Mutual high pricing is a Nash equilibrium under these parameters. Neither provider can gain by lowering price.`;
    } else {
      const gainA = Math.round((matrix.LH.ispAPayoff - matrix.HH.ispAPayoff) * 10) / 10;
      const gainB = Math.round((matrix.HL.ispBPayoff - matrix.HH.ispBPayoff) * 10) / 10;
      explanation = `Mutual high pricing yields the highest joint profit (₹${matrix.HH.ispAPayoff} lakh each), but it is NOT a Nash equilibrium. ISP A has a unilateral incentive to undercut to Low Price for a gain of +₹${gainA} lakh, and ISP B has the exact same incentive (+₹${gainB} lakh).`;
    }
  } else if (currentA === 'LOW' && currentB === 'HIGH') {
    const incentiveB = Math.round((matrix.LL.ispBPayoff - matrix.LH.ispBPayoff) * 10) / 10;
    explanation = `ISP A exploits ISP B by charging a low price and earning ₹${matrix.LH.ispAPayoff} lakh, while ISP B earns only ₹${matrix.LH.ispBPayoff} lakh. This outcome is NOT a Nash equilibrium because ISP B can unilaterally improve its profit by +₹${incentiveB} lakh by switching to Low Price.`;
  } else {
    // HIGH, LOW
    const incentiveA = Math.round((matrix.LL.ispAPayoff - matrix.HL.ispAPayoff) * 10) / 10;
    explanation = `ISP B exploits ISP A by charging a low price and earning ₹${matrix.HL.ispBPayoff} lakh, while ISP A earns only ₹${matrix.HL.ispAPayoff} lakh. This is NOT a Nash equilibrium because ISP A can unilaterally improve its profit by +₹${incentiveA} lakh by switching to Low Price.`;
  }

  return {
    dominantStrategyA,
    dominantStrategyB,
    bestResponseA_toLow: brA_toLow,
    bestResponseA_toHigh: brA_toHigh,
    bestResponseB_toLow: brB_toLow,
    bestResponseB_toHigh: brB_toHigh,
    nashEquilibria,
    isCurrentSelectedNash,
    explanation,
    isPrisonersDilemma,
    jointOptimal,
  };
}
