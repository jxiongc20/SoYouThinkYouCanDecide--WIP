/* ============================================================
   app.js — So You Think You Can Decide?
   Full game logic. Reads from data.js.

   Flow:
     intro → [name overlay] → questions (20s each, no reveal between) →
     processing → results (4 tabs: Profile / vs Machine / Blind Spots / Real World)
   ============================================================ */

/* ── CONFIG ── */
const Q_TIME = 20;
const LB_KEY = 'sytcd_v1';

/* ── STATE ── */
let currentQ   = 0;
let scores     = { urgency:0, impact:0, scale:0, stability:0 };
let picks      = [];
let answered   = 0;
let skipped    = 0;
let qTimerLoop = null;
let qTimeLeft  = Q_TIME;

let profKey    = 'balanced';
let alignment  = 0;
let sessionRank= 1;
let playerName = 'Anonymous';
let sector     = 'tech';
let pickedSector = 'tech';

/* ── DOM ── */
const el = id => document.getElementById(id);

/* ── VIEW SWITCHING ── */
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  el('view-' + name).classList.add('active');
}

/* ── TICKER ── */
function buildTicker() {
  const msgs = [
    'So You Think You Can Decide?',
    'The Machine Has No Feelings',
    'Your Brain Is Showing',
    '8 Decisions · 20 Seconds Each',
    'The System Never Hesitates',
    'Human vs Machine · Live Tonight',
    'Bias Is Not A Bug · It\'s A Feature Of Your Brain',
    'Can You Out-Think An Algorithm?',
  ];
  const inner = el('tickerInner');
  // Duplicate for seamless loop
  [...msgs, ...msgs].forEach(m => {
    const span = document.createElement('span');
    span.textContent = '★  ' + m + '  ';
    inner.appendChild(span);
  });
}

/* ── NAME + SECTOR ── */
document.querySelectorAll('.sector-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sector-btn').forEach(b => b.classList.remove('picked'));
    btn.classList.add('picked');
    pickedSector = btn.dataset.sector;
  });
});
document.querySelector('[data-sector="tech"]').classList.add('picked');

el('startBtn').addEventListener('click', () => {
  el('nameInput').value = '';
  el('nameOverlay').classList.add('open');
  setTimeout(() => el('nameInput').focus(), 80);
});

el('nameGoBtn').addEventListener('click', submitName);
el('nameInput').addEventListener('keydown', e => { if (e.key === 'Enter') submitName(); });

function submitName() {
  playerName = el('nameInput').value.trim() || 'Anonymous';
  sector     = pickedSector;
  el('nameOverlay').classList.remove('open');
  beginGame();
}

/* ── BEGIN ── */
function beginGame() {
  currentQ = 0;
  scores   = { urgency:0, impact:0, scale:0, stability:0 };
  picks    = [];
  answered = 0;
  skipped  = 0;
  showView('question');
  renderQuestion();
}

/* ── QUESTION RENDERING ── */
function renderQuestion() {
  const q = QS[currentQ];

  // Scorebar
  el('qNum').textContent       = `Question ${currentQ + 1} of ${QS.length}`;
  el('qAlignVal').textContent  = answered > 0 ? calcAlignment() + '%' : '—';
  el('qProgressFill').style.width = `${(currentQ / QS.length) * 100}%`;

  // Question
  el('qText').textContent = q.prompt;

  // Options
  const box = el('optBox');
  box.innerHTML = '';
  const keys = ['A','B','C'];
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'opt';
    btn.innerHTML = `
      <div class="opt-key">${keys[i]}</div>
      <div class="opt-body">
        <div class="opt-label">${opt.label}</div>
        <div class="opt-sub">${opt.sub}</div>
      </div>
    `;
    btn.addEventListener('click', () => pickAnswer(i));
    box.appendChild(btn);
  });

  startQTimer();
}

/* ── TIMER ── */
function startQTimer() {
  clearInterval(qTimerLoop);
  qTimeLeft = Q_TIME;
  updateQTimer();

  const fill = el('qTimerFill');
  fill.className = 'q-timer-fill';
  fill.style.transition = 'none';
  fill.style.width = '100%';

  requestAnimationFrame(() => requestAnimationFrame(() => {
    fill.style.transition = `width ${Q_TIME}s linear`;
    fill.style.width = '0%';
  }));

  qTimerLoop = setInterval(() => {
    qTimeLeft--;
    updateQTimer();
    if (qTimeLeft <= 5 && qTimeLeft > 2) {
      el('qTimerNum').className = 'q-timer-num warn';
      fill.className = 'q-timer-fill warn';
    }
    if (qTimeLeft <= 2) {
      el('qTimerNum').className = 'q-timer-num critical';
      fill.className = 'q-timer-fill critical';
    }
    if (qTimeLeft <= 0) {
      clearInterval(qTimerLoop);
      autoSkip();
    }
  }, 1000);
}

function updateQTimer() {
  el('qTimerNum').textContent = qTimeLeft;
}

function autoSkip() {
  const q = QS[currentQ];
  picks.push({ label:'—', systemChoice:q.systemChoice, systemQuip:q.systemQuip, match:false, fit:0, scores:{urgency:0,impact:0,scale:0,stability:0}, skipped:true, qIndex:currentQ });
  skipped++;
  advanceQuestion();
}

/* ── KEYBOARD ── */
document.addEventListener('keydown', e => {
  if (!el('view-question').classList.contains('active')) return;
  if (el('nameOverlay').classList.contains('open')) return;
  const map = { 'a':0, 'b':1, 'c':2 };
  const key = e.key.toLowerCase();
  if (map[key] !== undefined) pickAnswer(map[key]);
  if (key === 's') autoSkip();
});

/* ── PICK ANSWER ── */
function pickAnswer(i) {
  clearInterval(qTimerLoop);
  const q   = QS[currentQ];
  const opt = q.options[i];

  // Flash selection
  document.querySelectorAll('.opt').forEach((b, idx) => {
    if (idx === i) b.classList.add('selected');
  });

  Object.keys(opt.scores).forEach(k => { scores[k] += opt.scores[k]; });

  picks.push({
    label:        opt.label,
    systemChoice: q.systemChoice,
    systemQuip:   q.systemQuip,
    match:        opt.label === q.systemChoice,
    fit:          opt.fit,
    scores:       opt.scores,
    skipped:      false,
    qIndex:       currentQ
  });

  answered++;
  setTimeout(advanceQuestion, 280);
}

function advanceQuestion() {
  currentQ++;
  if (currentQ < QS.length) renderQuestion();
  else startProcessing();
}

/* ── PROCESSING ── */
const PROC_LINES = [
  '> Scanning 8 decisions…',
  '> Mapping cognitive signatures…',
  '> Calculating alignment score…',
  '> Identifying dominant bias…',
  '> Consulting the machine…',
  '> The machine is unimpressed.',
  '> Generating your dossier…',
  '> Ready.'
];

function startProcessing() {
  showView('processing');

  profKey   = topCat(scores);
  alignment = calcAlignment();

  // Animate score ring
  setTimeout(() => {
    const offset = 314 * (1 - alignment / 100);
    el('scoreRingFill').style.strokeDashoffset = offset;
    el('scoreRingNum').textContent = alignment + '%';
  }, 400);

  const log = el('procLog');
  log.innerHTML = '';
  PROC_LINES.forEach((line, i) => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = 'proc-line';
      div.textContent = line;
      div.style.animationDelay = '0s';
      log.appendChild(div);
    }, i * 380);
  });

  setTimeout(() => {
    buildResults();
    showView('results');
  }, PROC_LINES.length * 380 + 600);
}

/* ── RESULTS ── */
function buildResults() {
  const prof       = PROFILES[profKey];
  const matchCount = picks.filter(p => p.match).length;
  const rate       = completionRate();

  // Topbar
  el('resultsShowName').textContent = 'So You Think You Can Decide?';
  el('resultsMeta').textContent = [
    playerName !== 'Anonymous' ? playerName : null,
    SECTOR_LABELS[sector] || sector,
    rate + '% complete'
  ].filter(Boolean).join(' · ');

  // Default tab
  activateTab('profile');
  renderProfileTab(prof, rate);

  // Pre-fetch AI
  fetchAI(profKey, matchCount, alignment, rate);
}

/* ── TAB NAV ── */
function activateTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === name));
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    activateTab(tab);
    if (tab === 'system')     renderSystemTab();
    if (tab === 'blindspots') renderBlindSpotsTab();
    if (tab === 'realworld')  renderRealWorldTab();
  });
});

/* ── TAB 1: PROFILE ── */
function renderProfileTab(prof, rate) {
  el('rProfileEmoji').textContent   = prof.emoji;
  el('rProfileName').textContent    = prof.name;
  el('rProfileTagline').textContent = prof.tagline;
  el('rProfileDesc').textContent    = prof.desc;
  el('rMeaning').textContent        = prof.meaning;

  const pillsEl = el('rPills');
  pillsEl.innerHTML = '';
  prof.traits.forEach(t => {
    const p = document.createElement('div');
    p.className = 'pill'; p.textContent = t;
    pillsEl.appendChild(p);
  });

  // Partial warning
  const warn = el('rPartialWarn');
  if (rate < 100) {
    warn.classList.remove('hidden');
    warn.innerHTML = `<strong>Heads up:</strong> You skipped ${skipped} question${skipped !== 1 ? 's' : ''}. Your profile is based on partial data — in real systems, that's exactly when algorithms produce their most confident (and most wrong) outputs.`;
  } else {
    warn.classList.add('hidden');
  }

  // Improvement protocol
  const PROTOCOLS = {
    urgency:   ["Before acting on urgency: is this crisis visible because it's the most severe — or because it has the loudest advocates?", "If your instincts built a resource-allocation algorithm, which population would it chronically underserve?", "What would change if a less urgent option prevented 10x more harm over five years?"],
    impact:    ["Who is harmed by the wait? If this takes 3 years to show results, who suffers in the meantime?", "Are you choosing long-term impact because it's right — or because it sounds more sophisticated?", "If the people most affected were in the room, would they choose your time horizon?"],
    scale:     ["Who falls outside the reach of your preferred option — and is that a bug or a feature?", "Are you measuring the right thing? High reach with low depth can look great on a dashboard while changing nothing.", "If you could only serve 10 people instead of 1,000, who would you choose?"],
    stability: ["Is the status quo actually stable for the people this affects — or just from your vantage point?", "Are you avoiding risk because it's genuinely wrong, or because uncertainty is uncomfortable?", "If you always choose the lowest-risk path, which kinds of change become impossible?"],
    balanced:  ["Your pattern is contextual. Is that nuance — or inconsistency? Both are possible.", "When you held competing tensions, did you name the trade-off out loud — or absorb it privately?", "What would you do if you had to encode your judgment into a rule someone else ran without you?"]
  };
  const protocol = PROTOCOLS[profKey] || PROTOCOLS.balanced;
  const impEl = el('rImproveQuestions');
  impEl.innerHTML = '';
  protocol.forEach((q, i) => {
    const row = document.createElement('div');
    row.className = 'improve-q';
    row.innerHTML = `<span class="improve-num">0${i+1}</span><p>${q}</p>`;
    impEl.appendChild(row);
  });
}

/* ── TAB 2: vs MACHINE ── */
let systemRendered = false;

function renderSystemTab() {
  if (systemRendered) return;
  systemRendered = true;

  const matchCount = picks.filter(p => p.match).length;
  const rate       = completionRate();

  // Score display
  el('vsAlignPct').textContent  = alignment + '%';
  el('vsMatchCount').textContent = `${matchCount} of ${QS.length} decisions matched the machine.`;

  // Animate bar
  setTimeout(() => { el('vsAlignFill').style.width = alignment + '%'; }, 200);

  // System commentary
  const comments = SYSTEM_COMMENTARY[profKey] || SYSTEM_COMMENTARY.balanced;
  el('vsSystemComment').textContent = comments[Math.floor(Math.random() * comments.length)];

  // Replay table
  const table = el('vsReplayTable');
  table.innerHTML = '';
  picks.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'replay-row';
    row.innerHTML = `
      <span class="replay-q">Q${i+1}</span>
      <span class="replay-human">${p.skipped ? '— skipped' : p.label}</span>
      <span class="replay-sys">${p.systemChoice}</span>
      <span class="replay-match ${p.match ? 'yes' : 'no'}">${p.match ? '✓' : '✗'}</span>
    `;
    table.appendChild(row);
  });

  // Stats
  el('vsStatExact').textContent    = `${matchCount}/${QS.length}`;
  el('vsStatComplete').textContent = rate + '%';

  // Leaderboard
  const { board, myRank } = saveToLeaderboard(alignment);
  sessionRank = myRank;
  el('vsRankBig').textContent  = `#${myRank}`;
  el('vsRankNote').textContent = rate < 100
    ? 'Skipped questions apply a penalty.'
    : 'Full completion. The machine respects that.';
  el('vsStatRank').textContent = `#${myRank}`;
  renderLeaderboard(board, myRank);
}

/* ── TAB 3: BLIND SPOTS ── */
let bsRendered = false;

function renderBlindSpotsTab() {
  if (bsRendered) return;
  bsRendered = true;

  const container = el('rBlindspots');
  container.innerHTML = '';

  // Show top 1-2 categories by score
  const sorted = Object.entries(scores).sort((a,b)=>b[1]-a[1]).filter(e=>e[1]>0);
  const toShow = sorted.slice(0,2).map(e=>e[0]).filter(k=>BIAS_DATA[k]);

  if (!toShow.length) {
    container.innerHTML = `<p style="color:var(--muted2);font-size:0.88rem;line-height:1.7">Your choices were distributed enough that no single bias dominated. That's either balanced judgment or analysis paralysis. Only you know which.</p>`;
    return;
  }

  toShow.forEach(key => {
    const d = BIAS_DATA[key];
    const block = document.createElement('div');
    block.className = 'bias-block';
    block.innerHTML = `
      <div class="bias-name">${d.name}</div>
      <div class="bias-plain">${d.plain}</div>
      <div class="bias-why">${d.why}</div>
      <div class="bias-system"><strong style="display:block;font-size:0.72rem;font-family:'Syne Mono',monospace;text-transform:uppercase;letter-spacing:0.1em;color:var(--pink);margin-bottom:5px">When this gets encoded into systems</strong>${d.inSystems}</div>
      <div class="bias-real"><strong>Real examples:</strong> ${d.realWorld}</div>
    `;
    container.appendChild(block);
  });
}

/* ── TAB 4: REAL WORLD ── */
let rwRendered = false;
const REALWORLD = {
  urgency:   [{ tag:'Emergency Services', text:'Most 911 dispatch systems prioritize the most visible immediate crisis. This produces excellent acute response and chronic underinvestment in prevention. Communities without advocates are systematically under-resourced.' },{ tag:'Disaster Relief', text:'Early FEMA allocation models weighted visible disaster response heavily. Communities with media presence received resources faster than those with equal need but lower visibility.' }],
  impact:    [{ tag:'Venture Capital', text:'VC models are built almost entirely around long-term transformational upside. They systematically pass on urgent but "small" problems — even when those problems affect millions of people.' },{ tag:'Education Policy', text:'Many national education investments prioritize 20-year workforce outcomes. Students who need food, safety, and mental health support today are underserved by systems designed for futures they may not reach.' }],
  scale:     [{ tag:'Social Platforms', text:'Recommendation algorithms optimized for maximum engagement systematically deprioritize communities that are harder to serve — often those most in need of connection and accurate information.' },{ tag:'Public Health', text:'Mass vaccination campaigns designed for population reach systematically exclude the hardest-to-reach groups. They succeed by the numbers while leaving the most vulnerable behind.' }],
  stability: [{ tag:'Credit Scoring', text:'Credit models built on historical stability data encode existing economic hierarchies. People without traditional credit histories are scored as high-risk regardless of actual reliability.' },{ tag:'Institutional Funding', text:'Foundation funding models that favor stable track records exclude newer community-led organizations doing innovative work in high-need areas. Stability as a metric rewards incumbency.' }],
  balanced:  [{ tag:'Human Judges', text:'Studies show human judges consider more contextual factors than algorithmic sentencing — but also show more inconsistency. COMPAS was built to reduce variance, but encoded racial bias in the process.' },{ tag:'Clinical Triage', text:'Experienced ER physicians hold urgency, prognosis, and resources in tension simultaneously — something current algorithms cannot replicate without losing the nuance that saves lives at the margins.' }]
};

function renderRealWorldTab() {
  if (rwRendered) return;
  rwRendered = true;

  const container = el('rRealworld');
  container.innerHTML = '';
  const matches = REALWORLD[profKey] || REALWORLD.balanced;
  matches.forEach(item => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:14px;align-items:flex-start;padding:18px 20px;margin-bottom:12px;background:var(--surface2);border:1px solid var(--border);border-radius:14px;max-width:620px';
    row.innerHTML = `
      <span style="font-family:'Syne Mono',monospace;font-size:0.6rem;padding:4px 10px;border-radius:999px;border:1px solid rgba(245,230,66,0.25);background:rgba(245,230,66,0.06);color:var(--yellow);flex-shrink:0;white-space:nowrap;margin-top:2px">${item.tag}</span>
      <span style="font-size:0.84rem;color:var(--muted2);line-height:1.65">${item.text}</span>
    `;
    container.appendChild(row);
  });
}

/* ── LEADERBOARD ── */
function saveToLeaderboard(score) {
  let board;
  try { board = JSON.parse(localStorage.getItem(LB_KEY)||'[]'); } catch { board=[]; }
  const ts = Date.now();
  board.push({ score, profile:PROFILES[profKey].name, name:playerName, sector, ts });
  board.sort((a,b)=>b.score-a.score);
  const trimmed = board.slice(0,8);
  localStorage.setItem(LB_KEY, JSON.stringify(trimmed));
  const myRank = trimmed.findIndex(e=>e.ts===ts)+1;
  return { board:trimmed, myRank: myRank<1?trimmed.length:myRank };
}

function renderLeaderboard(board, myRank) {
  const wrap = el('vsLbRows');
  wrap.innerHTML = '';
  const medals = ['🥇','🥈','🥉'];
  const posCls = ['g','s','b'];
  board.forEach((e,i) => {
    const isMe = i === myRank-1;
    const row  = document.createElement('div');
    row.className = `lb-row${isMe?' me':''}`;
    const sig  = e.score>=85?'Sharp':e.score>=65?'Getting there':'Still human';
    const name = (e.name&&e.name!=='Anonymous')?e.name:e.profile;
    row.innerHTML = `<span class="lb-pos ${posCls[i]||''}">${medals[i]||'#'+(i+1)}</span><span class="lb-name${isMe?' me':''}">${name}${isMe?' ◀':''}</span><span class="lb-score">${e.score}%</span><span class="lb-sig">${sig}</span>`;
    wrap.appendChild(row);
  });
}

/* ── AI INSIGHT ── */
async function fetchAI(profKey, matchCount, align, rate) {
  const out = el('vsAiOutput');
  const summary = picks.map((p,i)=>`Q${i+1}: "${p.skipped?'skipped':p.label}" | Machine: "${p.systemChoice}" | Fit: ${p.fit}%`).join('\n');

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:1000,
        messages:[{ role:'user', content:
          `You are the dry, slightly smug AI host of a game show called "So You Think You Can Decide?" — a leadership decision-making exhibit.\n\n` +
          `Participant: "${playerName}" | Sector: ${sector} | Profile: ${PROFILES[profKey].name}\n` +
          `Alignment with machine: ${align}% | Exact matches: ${matchCount}/8 | Completion: ${rate}%\n\n` +
          `Their choices:\n${summary}\n\n` +
          `Write 2-3 sentences of dry, witty, but genuinely insightful analysis. Reference their actual pattern. Be like a brilliant colleague who can't help being a little smug — but the insight is real and lands. No bullet points. Don't start with their name. Max 85 words.`
        }]
      })
    });
    const data = await res.json();
    const text = data.content?.map(b=>b.text||'').join('').trim();
    out.innerHTML = text ? `<p class="ai-text">${text}</p>` : fallbackAI();
  } catch { out.innerHTML = fallbackAI(); }
}

function fallbackAI() {
  const fallbacks = {
    urgency:   "The pattern is consistent — you moved toward whatever was on fire. The machine appreciates the efficiency. It would gently note, however, that most of the people your choices missed weren't less important. They were just quieter.",
    impact:    "You played the long game in seven of eight scenarios. The machine finds this statistically admirable. It would add, with no particular emotion, that the people who needed help this week may not have noticed your five-year horizon.",
    scale:     "Reach dominated your decision-making. The machine concurs, mostly. It would observe that the populations your system consistently excluded were not statistically insignificant — they were statistically inconvenient.",
    stability: "Reliability was your north star. Sensible. The machine also weights stability. Both of you should perhaps reflect on what the status quo was actually preserving.",
    balanced:  "You held multiple tensions across eight decisions. The machine cannot categorize you, which it finds mildly irritating. This may be the most human thing you did today."
  };
  return `<p class="ai-text">${fallbacks[profKey]||fallbacks.balanced}</p>`;
}

/* ── SHARE ── */
function openShare() {
  const prof = PROFILES[profKey];
  el('rcProfile').textContent  = prof.emoji + ' ' + prof.name;
  el('rcPlayer').textContent   = playerName !== 'Anonymous' ? playerName : '';
  el('rcAlign').textContent    = alignment + '%';
  el('rcMatches').textContent  = picks.filter(p=>p.match).length + '/8';
  el('rcRank').textContent     = `#${sessionRank}`;
  el('rcRankFoot').textContent = playerName !== 'Anonymous' ? `${playerName} · #${sessionRank}` : `Session rank #${sessionRank}`;
  const t = el('rcTraits'); t.innerHTML = '';
  prof.traits.forEach(tr => { const p=document.createElement('div'); p.className='rc-trait'; p.textContent=tr; t.appendChild(p); });
  el('shareModal').classList.add('open');
}

el('shareBtn').addEventListener('click', openShare);
el('modalClose').addEventListener('click', ()=>el('shareModal').classList.remove('open'));
el('shareModal').addEventListener('click', e=>{ if(e.target===el('shareModal')) el('shareModal').classList.remove('open'); });

el('restartBtn').addEventListener('click', () => {
  systemRendered = false;
  bsRendered     = false;
  rwRendered     = false;
  showView('intro');
});

/* ── SCORING ── */
function topCat(sc) {
  const e = Object.entries(sc).sort((a,b)=>b[1]-a[1]);
  return (e[0][1]===0 || e[0][1]===e[1][1]) ? 'balanced' : e[0][0];
}

function completionRate() {
  return Math.round((answered / QS.length) * 100);
}

function calcAlignment() {
  if (!picks.length) return 0;
  const raw     = Math.round(picks.reduce((s,p)=>s+p.fit,0) / picks.length);
  const penalty = Math.round((100 - completionRate()) * 0.35);
  return Math.max(0, raw - penalty);
}

/* ── INIT ── */
buildTicker();
showView('intro');