# So You Think You Can Decide?

A browser-based game show pitting you against an algorithm across 8 real-world resource allocation scenarios. 20 seconds per decision. No wrong answers — but the machine disagrees.

After all 8 rounds, you get your alignment score, a decision-making profile, the cognitive biases behind your choices, and real-world examples of those patterns encoded into consequential systems.

## Setup

No build step. Open `index.html` in a browser or serve statically.

```
index.html   — markup and views
style.css    — styling and animations
data.js      — questions, profiles, bias data
app.js       — game logic, scoring, API call
```

## Gameplay

`Intro → Register → 8 Questions → Processing → Results`

Pick your sector, enter a name (optional), then answer 8 scenarios before seeing any results. Keyboard: `A` `B` `C` to answer, `S` to skip.

Alignment score = average fit across answers, minus a penalty for skipped questions.

## Results

Four tabs: **Your Profile** (decision archetype), **vs The Machine** (alignment %, replay, AI analysis, leaderboard), **Blind Spots** (your dominant cognitive biases and how they get encoded into systems), **In The Wild** (real algorithms that reflect your pattern).

The AI analysis tab calls the Anthropic API live. If it fails, a static fallback loads per profile type.

## Leaderboard

Stored in `localStorage` under `sytcd_v1`, top 8 by score. Reset with `localStorage.removeItem('sytcd_v1')` in the console.
