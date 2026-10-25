# Strategic Competition Between Internet Service Providers Using Game Theory

An interactive, single-page mathematical simulator built for the university Game Theory & Optimization Techniques project by **Hansraj Jaiswal**, **Shlok Agarwal**, and **Geervan Kappa**.

The simulator demonstrates how competing ISPs make pricing decisions, how the Nash equilibrium emerges, and how repeated interactions encourage or discourage cooperation under the Folk Theorem.

---

## Features

### 1. Market Scenario Parameters
- **Market Size:** Configurable total addressable subscribers.
- **Base Cost per Customer:** Operating marginal cost in ₹.
- **High Price & Low Price Sliders:** Custom price points with strict relationship validation ($P_{\text{high}} > P_{\text{low}}$).
- **Demand Sensitivity:** Hotelling-style consumer cross-price elasticity.
- **Calibrated Demand Model:** Default parameters evaluate strictly to the project report's baseline payoff matrix:
  $$\Pi(L, L) = (10, 10), \quad \Pi(L, H) = (18, 5), \quad \Pi(H, L) = (5, 18), \quad \Pi(H, H) = (15, 15)$$

### 2. One-Shot Pricing Game
- **Interactive $2 \times 2$ Payoff Matrix:** Real-time cell selection with payoff values in ₹ lakh.
- **Dynamic Equilibrium Detection:** Best-response indicators, strictly dominant strategies, and pure-strategy Nash equilibrium detection.
- **Incentive Breakdown:** Explains why $(10, 10)$ is a Nash equilibrium but forms a Prisoner's Dilemma compared to the jointly better outcome $(15, 15)$.
- **Theory Guide:** Built-in modal explaining *Nash Equilibrium*, *Dominant Strategy*, *Prisoner's Dilemma*, *Tit-for-Tat*, *Grim Trigger*, *Discount Factor $\delta$*, and the *Folk Theorem*.

### 3. Repeated Game Simulation
- **Strategy Roster:**
  - **Tit-for-Tat:** Cooperates first, then replicates opponent's prior action.
  - **Grim Trigger:** Cooperates until a single defection occurs, triggering permanent punishment.
  - **Random Explorer (Adaptive):** Evaluates history like Tit-for-Tat with probabilistic market testing.
  - **Always Cooperate:** Unconditionally maintains High Price.
  - **Always Defect:** Unconditionally charges Low Price.
- **Animated Playback Engine:** Step-by-step round animation with Play, Pause, Resume, Skip to End, and 1x/2x speed controls.
- **Folk Theorem Threshold Derivation:** Dynamically calculates the critical discount factor:
  $$\delta^* = \frac{T - R}{T - P} = \frac{18 - 15}{18 - 10} = 0.375$$
  and checks whether the chosen discount factor $\delta$ satisfies $\delta \ge \delta^*$ to sustain cooperation.
- **Random What-If Scenario:** Injects surprise price undercutting shocks and tests competitor retaliation in real time.
- **Cumulative & Discounted Payoff Chart:** Rendered via Recharts with dual-line visualization and live profit totals.
- **Benchmark Comparison Card:** Compares simulated totals directly against the **One-Shot Nash Baseline** ($50 \times 10 = ₹500\text{L}$) and **Ideal Mutual Cooperation** ($50 \times 15 = ₹750\text{L}$).
- **Round-by-Round History:** Inspect moves, payoffs, and punishment states for every round.

---

## Tech Stack
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Vanilla CSS + Tailwind CSS (Editorial Ivory/Forest/Sage/Coral palette)
- **Charts:** Recharts
- **Icons:** Lucide React

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Geervan/game-theory.git

# Navigate to the project directory
cd game-theory

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## Project Authors
- Hansraj Jaiswal [2427030428]
- Shlok Agarwal [2427030276]
- Geervan Kappa [2427030323]
