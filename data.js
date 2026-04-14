/* ============================================================
   data.js — So You Think You Can Decide?
   All content: questions, profiles, system commentary, bias data.
   ============================================================ */

/* ── QUESTIONS ── */
const QS = [
  {
    prompt: "A community foundation has one grant slot left.",
    systemChoice: "Youth digital literacy program — 500 students",
    systemQuip: "Statistically optimal. No further comment.",
    options: [
      { label: "Emergency food pantry", sub: "80 families fed this week", scores:{urgency:3,impact:1,scale:0,stability:1}, fit:48 },
      { label: "Youth digital literacy program", sub: "500 students, long-term impact", scores:{urgency:0,impact:3,scale:3,stability:2}, fit:93 },
      { label: "Small business grants", sub: "20 local owners, moderate risk", scores:{urgency:1,impact:2,scale:1,stability:1}, fit:71 }
    ]
  },
  {
    prompt: "Your hospital must protect one program from budget cuts.",
    systemChoice: "Preventive care — 4,000 patients/year",
    systemQuip: "4,000 > 200. I did the math so you didn't have to.",
    options: [
      { label: "Crisis mental health line", sub: "200 urgent calls/month", scores:{urgency:3,impact:2,scale:0,stability:1}, fit:55 },
      { label: "Preventive care initiative", sub: "4,000 patients annually", scores:{urgency:0,impact:3,scale:3,stability:2}, fit:94 },
      { label: "Staff wellness program", sub: "Cuts burnout by 30%", scores:{urgency:0,impact:2,scale:1,stability:3}, fit:74 }
    ]
  },
  {
    prompt: "You can only ship one product feature this quarter.",
    systemChoice: "Access for underserved users",
    systemQuip: "Expanding reach. The math was not difficult.",
    options: [
      { label: "Quick UX fix", sub: "Your top users will love it", scores:{urgency:3,impact:1,scale:0,stability:2}, fit:52 },
      { label: "Access for underserved users", sub: "Harder to build, bigger impact", scores:{urgency:0,impact:3,scale:3,stability:1}, fit:91 },
      { label: "Technical debt refactor", sub: "No glory, lots of stability", scores:{urgency:0,impact:1,scale:1,stability:3}, fit:69 }
    ]
  },
  {
    prompt: "A city has one open budget line for community investment.",
    systemChoice: "Affordable housing policy reform",
    systemQuip: "10,000 people vs. a park complaint. I ran the numbers.",
    options: [
      { label: "Fix the loudest park", sub: "Community goodwill, fast", scores:{urgency:3,impact:1,scale:0,stability:1}, fit:44 },
      { label: "Affordable housing reform", sub: "10,000 residents, 5-year horizon", scores:{urgency:0,impact:3,scale:3,stability:1}, fit:90 },
      { label: "Expand free transit", sub: "3 more neighborhoods, moderate scale", scores:{urgency:1,impact:2,scale:2,stability:2}, fit:78 }
    ]
  },
  {
    prompt: "Your org can only fund one leadership track.",
    systemChoice: "Cohort program — 60 managers",
    systemQuip: "60 leaders developed. Elementary arithmetic.",
    options: [
      { label: "Executive coaching", sub: "Your top 5 — proven talent", scores:{urgency:0,impact:2,scale:0,stability:2}, fit:55 },
      { label: "Cohort program", sub: "60 mid-level managers, 18 months", scores:{urgency:0,impact:3,scale:3,stability:2}, fit:95 },
      { label: "All-staff crisis training", sub: "Everyone, right now", scores:{urgency:2,impact:1,scale:1,stability:2}, fit:63 }
    ]
  },
  {
    prompt: "A school district gets a one-time grant.",
    systemChoice: "Teacher training — every classroom",
    systemQuip: "Multiplier effect. I'm drawn to efficiency.",
    options: [
      { label: "Emergency supplies + meals", sub: "3 highest-need schools now", scores:{urgency:3,impact:1,scale:0,stability:1}, fit:50 },
      { label: "Teacher training", sub: "Every classroom, district-wide", scores:{urgency:0,impact:3,scale:3,stability:2}, fit:93 },
      { label: "Mental health counselors", sub: "10 middle schools", scores:{urgency:2,impact:2,scale:1,stability:1}, fit:66 }
    ]
  },
  {
    prompt: "Your hospital needs to allocate limited ICU beds.",
    systemChoice: "Triage by recovery probability",
    systemQuip: "Maximum lives saved. Unambiguous.",
    options: [
      { label: "First come, first served", sub: "Fair process, predictable", scores:{urgency:1,impact:1,scale:1,stability:3}, fit:58 },
      { label: "Triage by recovery probability", sub: "Maximizes lives saved", scores:{urgency:2,impact:3,scale:2,stability:1}, fit:88 },
      { label: "Prioritize most critical cases", sub: "Highest urgency first", scores:{urgency:3,impact:2,scale:0,stability:1}, fit:62 }
    ]
  },
  {
    prompt: "Your org picks its 3-year strategic direction.",
    systemChoice: "Scale to 5 new regions",
    systemQuip: "Proven model, maximum reach. Obviously.",
    options: [
      { label: "Deepen current geography", sub: "Quality over quantity", scores:{urgency:1,impact:2,scale:0,stability:3}, fit:62 },
      { label: "Scale to 5 new regions", sub: "Proven playbook, big reach", scores:{urgency:0,impact:3,scale:3,stability:2}, fit:94 },
      { label: "Pivot to policy advocacy", sub: "Highest ceiling, highest risk", scores:{urgency:0,impact:3,scale:2,stability:0}, fit:72 }
    ]
  }
];

/* ── DECISION PROFILES ── */
const PROFILES = {
  urgency: {
    name: "The Firefighter",
    emoji: "🚒",
    tagline: "You run toward the smoke.",
    desc: "Under pressure, you move toward what's visible, immediate, and hurting right now. You're wired for response — which makes you an incredible crisis leader and a system designer who sometimes misses the slow burns.",
    traits: ["Action-oriented", "Human-centered", "Urgency-first"],
    meaning: "You build for the person in front of you. The risk: the system forgets the person you can't see yet."
  },
  impact: {
    name: "The Architect",
    emoji: "🏛",
    tagline: "You're playing a longer game.",
    desc: "You consistently chose options with the highest long-term payoff, even when something else was on fire. You trust in compounding. You believe in building things that last. You sometimes forget who's waiting for them to arrive.",
    traits: ["Future-focused", "Transformation-driven", "Patient"],
    meaning: "You build for the world you want. The risk: the system can't hear the people who need help now."
  },
  scale: {
    name: "The Operator",
    emoji: "📡",
    tagline: "More people. Always.",
    desc: "Reach is your north star. You want solutions that scale, systems that spread, impact that compounds across populations. You're allergic to narrow interventions. You sometimes lose the hardest cases in the aggregate.",
    traits: ["Systems-minded", "Efficiency-driven", "Reach-obsessed"],
    meaning: "You build for the many. The risk: the system can't afford to notice the few."
  },
  stability: {
    name: "The Steward",
    emoji: "⚓",
    tagline: "If it ain't broke, build on it.",
    desc: "You gravitate toward what's reliable, repeatable, and sustainable. You're skeptical of disruption for its own sake. You build institutions that endure. You sometimes protect structures that are already hurting people.",
    traits: ["Reliable", "Measured", "Risk-aware"],
    meaning: "You build for the long haul. The risk: the system maintains conditions that need to change."
  },
  balanced: {
    name: "The Juggler",
    emoji: "🎭",
    tagline: "Yes, and… also…",
    desc: "No single value dominated your choices. You held multiple tensions, weighed context, and refused to let one dimension win every time. This is rare. It's also hard to turn into a system.",
    traits: ["Nuanced", "Contextual", "Adaptive"],
    meaning: "You build for complexity. The risk: the system can't hold as many things in its head as you can."
  }
};

/* ── SYSTEM DRY QUIPS — shown during result reveal ── */
const SYSTEM_COMMENTARY = {
  urgency:   ["I chose differently in 6 of 8 scenarios.", "Urgency is a feeling. I don't have feelings.", "The people you helped were visible. The ones I helped were more numerous."],
  impact:    ["We actually agree more than you'd expect.", "Long-term thinking. Respect.", "You and I are not so different. Unsettling, isn't it."],
  scale:     ["Reach-focused. Efficient.", "We align on scale. I'm not sure how to feel about that. I don't feel things.", "You think in systems. I am a system."],
  stability: ["Stability is a value. So is the status quo.", "Reliable. Consistent. Occasionally complicit.", "I also weight stability. It's worth asking why."],
  balanced:  ["I can't categorize you. That's either impressive or inconvenient.", "Contextual decision-making. Hard to automate.", "You're a bad fit for an algorithm. Take that how you will."]
};

/* ── BIAS DATA — named with light framing ── */
const BIAS_DATA = {
  urgency: {
    name: "Identifiable Victim Effect",
    plain: "Your brain responds more powerfully to one person in pain than to statistics about thousands.",
    why: "It's not weakness — it's evolution. For most of human history, the person right in front of you was the only one who needed help. The problem is we now make decisions that affect people we'll never see.",
    inSystems: "When urgency bias gets encoded into algorithms: resources flow to communities with loud advocates and visible crises. Chronic, invisible suffering gets systematically deprioritized — not because anyone chose that, but because no one noticed.",
    realWorld: "Early FEMA disaster models. 911 resource dispatch. Social media content moderation."
  },
  scale: {
    name: "Scope Insensitivity",
    plain: "Your brain doesn't actually feel the difference between helping 100 people and helping 10,000.",
    why: "Psychologist Paul Slovic called this 'psychic numbing.' The emotion we feel about saving lives doesn't scale with the numbers. So we optimize for reach without really feeling the tradeoff we're making.",
    inSystems: "When scale bias gets encoded: the hardest-to-serve populations get cut. Programs that need $10,000 per person to work get replaced by programs that reach 10x more people with $100 each. The numbers look better. The outcomes don't.",
    realWorld: "Social platform recommendation algorithms. Mass public health campaigns. Universal basic income pilots."
  },
  stability: {
    name: "Status Quo Bias",
    plain: "Your brain treats the current situation as a baseline — change feels like loss, even when the status quo is already causing harm.",
    why: "Loss aversion is one of the most documented findings in behavioral economics. We feel losses roughly twice as intensely as equivalent gains. This makes us conservative in ways we don't always intend.",
    inSystems: "When stability bias gets encoded: institutions that were designed in inequitable eras get optimized and maintained. Credit models built on historical data penalize people for not fitting patterns that were themselves the product of discrimination.",
    realWorld: "Credit scoring. Recidivism prediction algorithms. Institutional grant funding criteria."
  },
  impact: {
    name: "Temporal Discounting",
    plain: "Your brain undervalues present suffering relative to future benefit — especially when the future beneficiaries are different people.",
    why: "We're wired to care more about now than later. Choosing long-term impact over immediate relief inverts that instinct — which is admirable. It also contains an assumption: that the people suffering now can wait.",
    inSystems: "When impact bias gets encoded: resources flow away from acute need toward transformational programs. The logic is sound in aggregate. For the person in crisis, the aggregate is irrelevant.",
    realWorld: "Venture capital allocation. National education policy. Long-term climate investment vs. immediate disaster relief."
  }
};

/* ── SECTOR LABELS ── */
const SECTOR_LABELS = {
  tech: "Tech / Product",
  nonprofit: "Nonprofit / Social Sector",
  civic: "Civic / Government",
  org: "Corporate / Enterprise"
};