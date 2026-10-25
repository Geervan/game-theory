# Strategic Competition Between Internet Service Providers Using Game Theory

## Project Report

**Prepared by:** Hansraj Jaiswal [2427030428], Shlok Agarwal [2427030276], Geervan Kappa [2427030323]

---

## Abstract

Internet Service Providers (ISPs) compete through subscription prices, internet speeds, network reliability, coverage, customer support, and bundled services. A decision by one ISP can affect the profits and customer base of its competitors. This project demonstrates how game theory can be used to analyze these strategic interactions.

The report presents a simplified pricing game involving two providers, ISP A and ISP B. Each provider independently chooses either a low-price or high-price strategy. A payoff matrix is used to compare the profits associated with each combination of decisions. The analysis identifies the Nash equilibrium and illustrates a version of the prisoner's dilemma: both providers may have an individual incentive to cut prices even though both could earn higher profits if both maintained high prices.

---

## 1. Introduction

Internet connectivity is essential for households, businesses, educational institutions, and public services. ISPs compete for customers who compare subscription prices, speeds, data limits, coverage, reliability, and customer support.

Competition creates strategic interdependence. For example, if ISP A reduces its subscription price, ISP B may lose customers. ISP B must decide whether to match the discount, differentiate its service, or maintain its price and risk losing market share. The outcome depends on the choices of both companies.

Game theory provides a structured way to analyze these decisions. It represents each firm as a player, its available actions as strategies, and the resulting profits or other outcomes as payoffs.

This project presents a simple pricing game that can be demonstrated using a payoff matrix and an interactive strategy selector.

## 2. Problem Statement

ISPs need to attract and retain customers while maintaining sustainable profits. Aggressive price reductions may attract customers in the short term but can reduce profit margins for all providers if competitors respond with similar discounts.

**Problem question:** How can game theory explain the pricing decisions of two competing ISPs, and what outcomes may result when each provider acts in its own interest?

## 3. Aim and Objectives

### 3.1 Aim

To demonstrate strategic competition between two ISPs using a basic game-theoretic model.

### 3.2 Objectives

1. Identify the players and strategies in a simplified ISP market.
2. Construct a payoff matrix for competing pricing decisions.
3. Analyze each provider's best response to its competitor.
4. Identify the Nash equilibrium of the model.
5. Explain the relationship between individual incentives and joint profitability.
6. Present a demonstration in which users can change strategies and observe the resulting payoffs.
7. Discuss the assumptions and limitations of the model.

## 4. Background: Game Theory

Game theory is the mathematical study of decisions made by participants whose outcomes depend on the actions of others.

The main concepts used in this project are:

- **Players:** The decision-makers—in this case, ISP A and ISP B.
- **Strategies:** The actions available to each player.
- **Payoffs:** The outcomes associated with each combination of strategies. In this project, payoffs represent monthly profits.
- **Best response:** A strategy that gives a player the highest payoff for a given strategy chosen by the opponent.
- **Dominant strategy:** A strategy that gives a player a better payoff than its alternatives, regardless of the opponent's choice.
- **Nash equilibrium:** A strategy combination in which no player can improve its payoff by changing its own strategy alone.

A payoff matrix summarizes the outcomes of a game and makes the available choices easier to compare.

## 5. Project Scope and Assumptions

The demonstration models two ISPs serving the same market. Each provider chooses one of two pricing strategies:

- **Low Price (L):** Offer a lower subscription price to attract price-sensitive customers.
- **High Price (H):** Maintain a higher subscription price and seek to preserve the profit margin.

The model uses these assumptions:

1. Both providers choose their pricing strategies simultaneously.
2. Each provider knows the payoff matrix.
3. Each provider seeks to maximize its own profit.
4. The providers offer comparable services, so price is a meaningful competitive factor.
5. Payoffs are monthly profits measured in Indian rupees lakh.
6. The model does not explicitly calculate customer numbers, demand curves, operating costs, taxes, or network capacity.

These assumptions simplify the analysis.

## 6. System Design

### 6.1 Players

| Player | Description                             |
| ------ | --------------------------------------- |
| ISP A  | First provider competing for customers  |
| ISP B  | Second provider competing for customers |

### 6.2 Strategy choices

Each ISP can choose either a low price or a high price. With two choices for each of two players, there are four possible strategy combinations.

### 6.3 Payoff matrix

Each cell lists **(ISP A profit, ISP B profit)**. The figures represent monthly profit in ₹ lakh.

| ISP A / ISP B      | Low Price (L) | High Price (H) |
| ------------------ | ------------: | -------------: |
| **Low Price (L)**  |      (10, 10) |        (18, 5) |
| **High Price (H)** |       (5, 18) |       (15, 15) |

### 6.4 Interpretation of the outcomes

1. **Both choose low price (L, L):** Each earns ₹10 lakh. Lower prices may attract customers, but reduced margins limit profit.
2. **ISP A chooses low and ISP B chooses high (L, H):** ISP A earns ₹18 lakh and ISP B earns ₹5 lakh.
3. **ISP A chooses high and ISP B chooses low (H, L):** ISP A earns ₹5 lakh and ISP B earns ₹18 lakh.
4. **Both choose high price (H, H):** Each earns ₹15 lakh under the model's assumptions.

The payoffs summarize the assumed effects of pricing, customer switching, and profit margins.

## 7. Game-Theoretic Analysis

### 7.1 Best response for ISP A

If ISP B chooses a low price:

- ISP A earns ₹10 lakh by choosing low.
- ISP A earns ₹5 lakh by choosing high.
- ISP A's best response is low price.

If ISP B chooses a high price:

- ISP A earns ₹18 lakh by choosing low.
- ISP A earns ₹15 lakh by choosing high.
- ISP A's best response is low price.

Therefore, low price is a dominant strategy for ISP A in this payoff matrix.

### 7.2 Best response for ISP B

The matrix is symmetric, so the same reasoning applies to ISP B.

If ISP A chooses a low price, ISP B earns ₹10 lakh by choosing low and ₹5 lakh by choosing high. If ISP A chooses a high price, ISP B earns ₹18 lakh by choosing low and ₹15 lakh by choosing high.

Therefore, low price is also a dominant strategy for ISP B.

### 7.3 Nash equilibrium

Since both players have low price as their dominant strategy, the Nash equilibrium is:

**(Low Price, Low Price) = (₹10 lakh, ₹10 lakh).**

At this outcome, neither ISP can increase its profit by switching to a high price alone while the competitor keeps its price low.

### 7.4 The prisoner's dilemma

The model illustrates a prisoner's dilemma:

- At the Nash equilibrium, both ISPs earn ₹10 lakh.
- If both choose high prices, each earns ₹15 lakh.
- If one ISP's competitor chooses a high price, that ISP can earn ₹18 lakh by choosing low price instead of ₹15 lakh.
- This individual incentive encourages both providers to choose low prices, resulting in a lower-profit outcome for both.

This demonstrates the difference between individually rational decisions and a collectively better outcome. The example does not suggest that firms should coordinate prices. Actual pricing decisions must comply with applicable competition laws.

## 8. ITERATED GAME THEORY AND THE FOLK THEOREM

### 8.1 Why consider repeated interaction?

The original model is a one-shot game: each ISP chooses a price once, and the analysis ends after that decision. In practice, ISPs compete over many billing periods. Each provider can observe past market behaviour and consider how today's decision may affect future profits.

An iterated game repeats the same basic pricing game over multiple rounds. The payoff in each round is taken from the original matrix, and the long-run value of a strategy depends on the sequence of payoffs over time.

### 8.2 The Folk Theorem

The Folk Theorem is a result in repeated-game theory. In broad terms, when a game is repeated indefinitely (or has no known final round), players care sufficiently about future outcomes, and actions and deviations can be observed, a wider range of long-run outcomes may be sustained as equilibria than in the one-shot game. The theorem does not say that every outcome is automatically sustainable: the result depends on feasibility, individual incentives, monitoring, and the assumptions of the repeated-game model.

For this project, the theorem motivates examining whether a higher-profit outcome can be sustained by a repeated-game strategy, rather than assuming the one-shot Nash equilibrium must occur in every period.

### 8.3 Trigger strategy for the ISP model

Consider the following illustrative strategy, called a **grim-trigger strategy**:

1. Start by choosing High Price (H).
2. Continue choosing High Price as long as both ISPs have chosen High Price in every previous round.
3. If either ISP chooses Low Price, switch to Low Price forever after.

The punishment is credible in this simplified model because (Low, Low) is the Nash equilibrium of the one-shot game. Once the punishment phase begins, neither ISP can improve its current payoff by switching alone to High Price.

This is a theoretical illustration of repeated-game incentives, not a recommendation that real ISPs coordinate or agree on prices. Actual firms must make independent pricing decisions and comply with applicable competition laws.

### 8.4 When can High Price be sustained?

Use the original payoff matrix:

- If both choose High Price, each earns ₹15 lakh per round.
- If one ISP deviates to Low Price while the other chooses High Price, the deviating ISP earns ₹18 lakh in that round.
- After the deviation, the grim-trigger rule moves the game to (Low, Low), where each earns ₹10 lakh per round.

Let **δ (delta)** be the discount factor, between 0 and 1. A larger δ means the ISP places greater value on future profits. For an indefinitely repeated game, compare the value of staying with High Price against the value of deviating once.

**Stay with High Price:**

15 + δ(15) + δ²(15) + … = 15 / (1 − δ)

**Deviate once, then receive the Low-Price punishment:**

18 + δ(10) + δ²(10) + … = 18 + 10δ / (1 − δ)

High Price is sustainable under this grim-trigger strategy when staying is at least as profitable as deviating:

15 / (1 − δ) ≥ 18 + 10δ / (1 − δ)

Solving gives:

15 ≥ 18 − 8δ

**δ ≥ 3/8 = 0.375**

Therefore, in this illustrative model, the (High Price, High Price) outcome can be sustained by the specified grim-trigger strategy when the discount factor is at least 0.375, assuming the game continues indefinitely, the payoffs are known, and deviations are observed. This is a result for this particular payoff matrix and strategy—not a universal threshold for all repeated games.

### 8.5 Long-run comparison

| Situation | Current-round payoff to each ISP | Long-run interpretation |
|---|---:|---|
| Both choose Low Price | ₹10 lakh | One-shot Nash equilibrium; also the punishment outcome in the example. |
| Both choose High Price | ₹15 lakh | Higher profit for both; can be sustained by the specified repeated-game strategy if δ ≥ 0.375 and the assumptions hold. |
| One chooses Low and the other High | ₹18 lakh to the Low-Price ISP; ₹5 lakh to the High-Price ISP | The Low-Price ISP gains immediately, but this deviation triggers the modeled future punishment. |

The comparison shows why a short-term incentive and a long-term incentive may differ. A provider may gain ₹3 lakh in the current round by undercutting a High-Price competitor (₹18 lakh instead of ₹15 lakh), but may lose the opportunity to earn ₹15 lakh per round in future rounds if the trigger strategy is followed.

### 8.6 Iterated-game demonstration logic

A simple program can simulate a chosen number of rounds and show how payoffs accumulate.

**Inputs:** number of rounds, discount factor δ, and the strategies used by ISP A and ISP B.

**Suggested procedure:**

1. Begin with both ISPs choosing High Price.
2. If neither deviates, record (₹15 lakh, ₹15 lakh) for the round and continue with High Price.
3. If either ISP chooses Low Price while the other chooses High Price, record the appropriate payoff from the original matrix.
4. Activate the grim-trigger punishment for all subsequent rounds: both choose Low Price and receive (₹10 lakh, ₹10 lakh) per round.
5. Calculate total or discounted profits for each ISP and compare the outcome with repeatedly choosing Low Price.
6. Display whether the selected discount factor meets the threshold δ ≥ 0.375 for sustaining the High-Price outcome under the stated assumptions.

For a finite simulation, the number of rounds is a demonstration setting. The threshold above is derived for an indefinitely repeated game; a known final round can change incentives, so the infinite-horizon result should not be applied automatically to a fixed finite game.

---

## 9. Project Demonstration

### 9.1 Demonstration goal

The demonstration allows a user to select the pricing strategy of ISP A and ISP B and see the resulting payoffs.

### 9.2 User inputs

- ISP A strategy: Low Price or High Price.
- ISP B strategy: Low Price or High Price.

### 9.3 Processing steps

1. Read the selected strategies.
2. Identify the matching cell in the payoff matrix.
3. Display each ISP's profit.
4. Explain whether the selected outcome is the Nash equilibrium.
5. Indicate whether a player could improve its payoff by changing its own strategy alone.

### 9.4 Pseudocode

```text
START

Define payoff matrix:
    (Low, Low)   -> (10, 10)
    (Low, High)  -> (18, 5)
    (High, Low)  -> (5, 18)
    (High, High) -> (15, 15)

Input ISP A strategy
Input ISP B strategy

Look up the payoff for the selected strategy combination

Display ISP A profit
Display ISP B profit

If both strategies are Low:
    Display "Nash equilibrium in this model"
Else:
    Explain whether a player can improve by changing
    its own strategy while the other strategy stays fixed

END
```

### 9.5 Results

| ISP A | ISP B | ISP A profit | ISP B profit | Nash equilibrium? |
| ----- | ----- | -----------: | -----------: | ----------------- |
| Low   | Low   |     ₹10 lakh |     ₹10 lakh | Yes               |
| Low   | High  |     ₹18 lakh |      ₹5 lakh | No                |
| High  | Low   |      ₹5 lakh |     ₹18 lakh | No                |
| High  | High  |     ₹15 lakh |     ₹15 lakh | No                |

## 10. Potential Extensions

### 10.1 Multiple pricing levels

Instead of only low and high prices, each ISP could choose from several price points. A larger strategy set could be analyzed using an expanded payoff matrix or numerical optimization.

### 10.2 Service quality

Providers could compete on speed, latency, uptime, customer support, or data limits in addition to price. This would help demonstrate product differentiation.

### 10.3 Network investment

Each ISP could choose whether to invest in fiber, expand coverage, or upgrade infrastructure. The model could compare investment costs with potential benefits.

### 10.4 Repeated games

Providers interact over time. A repeated-game model could examine how price changes, customer retention, and competitor responses evolve over multiple periods.

### 10.5 Demand and cost model

A more realistic model would estimate the number of customers attracted at each price, revenue per subscriber, and operating costs. Profit could be calculated as:

**Profit = Revenue − Total Cost**

For example:

**Revenue = Number of Subscribers × Average Revenue per Subscriber**

This approach would allow sensitivity analysis.

## 11. Limitations

1. The model includes only two providers and two pricing choices.
2. It assumes simultaneous decisions and complete knowledge of the payoff matrix.
3. It does not explicitly model customer demand, geographic differences, switching costs, or network constraints.
4. It assumes that both providers maximize monthly profit, although real companies may have additional objectives.
5. It is a static, one-shot model and does not fully represent long-term competition.

## 12. Conclusion

This project demonstrates how game theory can explain strategic pricing decisions in a competitive ISP market. By modeling ISP A and ISP B as players with low-price and high-price strategies, the payoff matrix makes the consequences of each combination explicit.

Under the selected payoffs, low price is a dominant strategy for both ISPs, and the Nash equilibrium occurs when both choose low prices. Although both providers would earn more if both chose high prices, each has an individual incentive to undercut the other. This creates a prisoner's-dilemma outcome.

The demonstration shows that an ISP's best decision depends not only on its own strategy but also on how competitors are likely to respond. More advanced models can incorporate customer demand, network investment, service quality, and repeated interactions to better represent real ISP markets.

## 13. References

The following foundational sources can support the theoretical discussion. Check the edition and citation style required by your institution before submission.

1. Osborne, M. J. (2004). _An Introduction to Game Theory_. Oxford University Press.
2. Tadelis, S. (2013). _Game Theory: An Introduction_. Princeton University Press.
3. Nash, J. (1950). “Equilibrium Points in N-Person Games.” _Proceedings of the National Academy of Sciences_, 36(1), 48–49.
4. Varian, H. R. (2014). _Intermediate Microeconomics: A Modern Approach_. W. W. Norton & Company.
5. Friedman, J. W. (1971). “A Non-Cooperative Equilibrium for Supergames.” _The Review of Economic Studies_, 38(1), 1–12.

---
