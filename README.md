# So You Think You Can Decide?

**Human vs Machine · Decision Exhibit**

A browser-based interactive game show that puts you up against an algorithm across 8 real-world resource allocation dilemmas — then reveals what your choices say about how your brain works under pressure.

---

## What It Is

Players have 20 seconds to make each decision. The machine has already made its choice. After all 8 rounds, you see your alignment score, your decision-making profile, the cognitive biases at play in your choices, and real-world examples of those same patterns encoded into consequential systems.

The point isn't to beat the machine. It's to understand how the values you hold — urgency, impact, scale, stability — shape what you build, who you serve, and who you miss.

---

## How It Works

### Flow

```
Intro → Name + Sector → 8 Questions (20s each) → Processing → Results
```

1. **Intro** — Players are briefed on the format.
2. **Registration** — Enter a name (optional) and pick your sector: Tech/Product, Nonprofit/NGO, Civic/Government, or Corporate.
3. **Questions** — 8 scenarios, 20 seconds each. Keyboard shortcuts: `A`, `B`, `C` to answer, `S` to skip. No mid-game reveals — you play all 8 before seeing results.
4. **Processing** — A score ring animates your alignment percentage as the machine "thinks."
5. **Results** — Four tabs with the full breakdown.

### Scoring

Each answer carries weighted scores across four dimensions: `urgency`, `impact`, `scale`, and `stability`. Each option also has a pre-set `fit` percentage representing alignment with the machine's choice.

```
alignment = avg(fit scores) − (completion penalty × 0.35)
```

Skipping a question counts against completion. Unanswered questions get `fit: 0`.

---

## Results Tabs

| Tab | What You See |
|-----|-------------|
| **Your Profile** | Your dominant decision archetype, traits, and three questions to ask before building a system |
| **vs The Machine** | Alignment %, exact match count, question-by-question replay, a leaderboard, and a live AI-generated analysis of your specific pattern |
| **Blind Spots** | The 1–2 named cognitive biases (Identifiable Victim Effect, Scope Insensitivity, etc.) that most strongly shaped your choices, with explanations of how they get encoded into systems |
| **In The Wild** | Real algorithms and institutional systems that reflect your decision-making pattern — from FEMA dispatch models to credit scoring to VC allocation |

---

## Decision Profiles

| Profile | Emoji | Dominant Value | The Risk |
|---------|-------|---------------|----------|
| The Firefighter | 🚒 | Urgency | Misses slow, invisible suffering |
| The Architect | 🏛 | Long-term impact | Overlooks people who can't wait |
| The Operator | 📡 | Scale / reach | Loses the hardest cases in aggregate |
| The Steward | ⚓ | Stability | May preserve harmful structures |
| The Juggler | 🎭 | Balanced / contextual | Hard to systematize |

Profile is determined by whichever dimension accumulated the highest score across all 8 answers. Ties default to `balanced`.

---

## AI Integration

The **Machine Analysis** section in the "vs The Machine" tab makes a live call to the Anthropic API (`claude-sonnet-4-20250514`) to generate a personalized 2–3 sentence analysis of the player's specific choice pattern. The prompt passes the player's name, sector, profile, alignment score, and a full question-by-question summary of their picks vs. the machine's choices.

If the API call fails, a static fallback analysis is shown per profile type.

---

## File Structure

```
index.html   — Layout, views, and UI markup
style.css    — All styling (CSS variables, animations, neon effects)
data.js      — Questions, profiles, bias data, real-world examples, sector labels
app.js       — Game logic, scoring, rendering, API call, leaderboard
```

### data.js exports (globals)

| Variable | Description |
|----------|-------------|
| `QS` | Array of 8 question objects with options, scores, and fit percentages |
| `PROFILES` | 5 decision profiles with name, emoji, tagline, description, traits, and systemic meaning |
| `SYSTEM_COMMENTARY` | Dry quips shown during result reveal, keyed by profile |
| `BIAS_DATA` | 4 named cognitive biases with plain language explainers, systemic implications, and real-world examples |
| `SECTOR_LABELS` | Display labels for the 4 sector options |

---

## Local Leaderboard

Scores are saved to `localStorage` under the key `sytcd_v1`. The leaderboard stores up to 8 entries, sorted by alignment score. Each entry includes score, profile name, player name, sector, and timestamp. Session rank is computed after each game and displayed in results.

To reset the leaderboard: `localStorage.removeItem('sytcd_v1')` in the browser console.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `A` | Select option A |
| `B` | Select option B |
| `C` | Select option C |
| `S` | Skip current question |
| `Enter` | Submit name on registration screen |

Shortcuts are only active during the question view and when the name overlay is closed.

---

## Design Notes

- Typography: [Syne](https://fonts.google.com/specimen/Syne) (display), [Syne Mono](https://fonts.google.com/specimen/Syne+Mono) (labels/code), [Inter](https://fonts.google.com/specimen/Inter) (body)
- Color palette: dark surface with neon yellow (`--yellow`) and pink (`--pink`) accents, cyan for machine choices
- No framework dependencies — vanilla JS throughout
- No build step required; open `index.html` directly or serve statically

---

## Content Philosophy

The game isn't designed to make players feel bad about their choices. Every option represents a real value. The point is that *every value has a shadow* — and when that value gets encoded into a system at scale, the shadow affects people who never got a vote.

> *"The machine isn't better. It's indifferent. It doesn't feel urgency, doesn't see the person in front of it, doesn't care who gets left behind. That indifference has its own consequences — which are just harder to see."*
