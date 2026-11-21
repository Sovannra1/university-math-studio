/**
 * Deterministic Seeded Dynamic Math Exercise Generator
 * Generates varied, mathematically verified sets of 6 exercises (2 Easy, 2 Medium, 2 Hard)
 * per sub-topic for Round 2+ mastery practice.
 */

export const MAX_MASTERY_ROUNDS = 3;

function hashString(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function shuffleWithRng(rng, arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Helper to build a guaranteed-unique 4-option MCQ with shuffled correctIndex
 */
function buildMcq(rng, { id, difficulty, question, correctOption, distractors, hint, explanation }) {
  const uniqueDistractors = [];
  for (const d of distractors) {
    if (d !== correctOption && !uniqueDistractors.includes(d)) {
      uniqueDistractors.push(d);
    }
    if (uniqueDistractors.length === 3) break;
  }
  const all = shuffleWithRng(rng, [correctOption, ...uniqueDistractors]);
  return {
    id,
    difficulty,
    type: "mcq",
    question,
    options: all,
    correctIndex: all.indexOf(correctOption),
    hint,
    explanation,
  };
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function fmtFrac(num, den) {
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den);
  num /= g;
  den /= g;
  if (den === 1) return `${num}`;
  return num < 0 ? `-\\frac{${-num}}{${den}}` : `\\frac{${num}}{${den}}`;
}

// ============================================================================
// Topic-specific generators (each returns 6 exercises: 2 Easy, 2 Medium, 2 Hard)
// ============================================================================

function gen1_1(rng, prefix) {
  const a1 = randInt(rng, 2, 9);
  const a2 = randInt(rng, 2, 8);
  const c = randInt(rng, 1, 5);
  const k = randInt(rng, 2, 6);
  const val = c * c - 2 * c + k;
  const p = randInt(rng, 2, 7);
  const q = randInt(rng, 1, 6);
  return [
    buildMcq(rng, {
      id: `${prefix}-1`,
      difficulty: "Easy",
      question: `រកដែនកំណត់នៃអនុគមន៍ $f(x) = \\sqrt{x - ${a1}}$៖`,
      correctOption: `$[${a1}, +\\infty)$`,
      distractors: [
        `$(${a1}, +\\infty)$`,
        `$(-\\infty, ${a1}]$`,
        `$\\mathbb{R} \\setminus \\{${a1}\\}$`,
      ],
      hint: `លក្ខខណ្ឌឫសការេ៖ $x - ${a1} \\ge 0$។`,
      explanation: `$x - ${a1} \\ge 0 \\iff x \\ge ${a1}$ ដូច្នេះ $D_f = [${a1}, +\\infty)$។`,
    }),
    {
      id: `${prefix}-2`,
      difficulty: "Easy",
      type: "short-answer",
      question: `គេឱ្យ $f(x) = x^2 - 2x + ${k}$។ គណនាតម្លៃ $f(${c})$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${val}`],
      hint: `ជំនួស $x = ${c}$ ចូលក្នុង $f(x)$។`,
      explanation: `$f(${c}) = ${c}^2 - 2(${c}) + ${k} = ${c * c} - ${2 * c} + ${k} = ${val}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-3`,
      difficulty: "Medium",
      question: `រកដែនកំណត់នៃអនុគមន៍ $g(x) = \\frac{1}{\\sqrt{x - ${a2}}}$៖`,
      correctOption: `$(${a2}, +\\infty)$`,
      distractors: [
        `$[${a2}, +\\infty)$`,
        `$\\mathbb{R} \\setminus \\{${a2}\\}$`,
        `$(-\\infty, ${a2})$`,
      ],
      hint: `ឫសការេនៅភាគបែងត្រូវការ $x - ${a2} > 0$ ដាច់ខាត។`,
      explanation: `ត្រូវការ $x - ${a2} > 0 \\iff x > ${a2}$ ដូច្នេះ $D_g = (${a2}, +\\infty)$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-4`,
      difficulty: "Medium",
      question: `តើអនុគមន៍ $h(x) = x^3 - ${p}x$ ជាអនុគមន៍ប្រភេទណា?`,
      correctOption: "អនុគមន៍សេស (Odd function)",
      distractors: [
        "អនុគមន៍គូ (Even function)",
        "មិនមែនគូ និងមិនមែនសេស",
        "អនុគមន៍ថេរ",
      ],
      hint: `គណនា $h(-x)$ រួចប្រៀបធៀបជាមួយ $h(x)$ និង $-h(x)$។`,
      explanation: `$h(-x) = (-x)^3 - ${p}(-x) = -x^3 + ${p}x = -h(x)$ ដូច្នេះ $h$ ជាអនុគមន៍សេស។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-5`,
      difficulty: "Hard",
      question: `រកសំណុំរូបភាព (Range) នៃអនុគមន៍ $f(x) = (x - ${p})^2 + ${q}$ លើ $\\mathbb{R}$៖`,
      correctOption: `$[${q}, +\\infty)$`,
      distractors: [
        `$(${q}, +\\infty)$`,
        `$[${p}, +\\infty)$`,
        `$[-${q}, +\\infty)$`,
      ],
      hint: `សម្គាល់ថា $(x - ${p})^2 \\ge 0$ ចំពោះគ្រប់ $x \\in \\mathbb{R}$។`,
      explanation: `ដោយ $(x - ${p})^2 \\ge 0$ នោះ $f(x) \\ge ${q}$ ដូច្នេះ Range គឺ $[${q}, +\\infty)$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-6`,
      difficulty: "Hard",
      question: `រកដែនកំណត់នៃ $f(x) = \\frac{\\sqrt{x + ${q}}}{x - ${p}}$៖`,
      correctOption: `$[-${q}, ${p}) \\cup (${p}, +\\infty)$`,
      distractors: [
        `$[-${q}, +\\infty)$`,
        `$(-${q}, ${p}) \\cup (${p}, +\\infty)$`,
        `$\\mathbb{R} \\setminus \\{${p}\\}$`,
      ],
      hint: `ផ្គួបលក្ខខណ្ឌ $x + ${q} \\ge 0$ និង $x - ${p} \\neq 0$។`,
      explanation: `ត្រូវការ $x \\ge -${q}$ និង $x \\neq ${p}$ ដូច្នេះ $D_f = [-${q}, ${p}) \\cup (${p}, +\\infty)$។`,
    }),
  ];
}

function gen2_all(rng, prefix) {
  const a = randInt(rng, 2, 7);
  const b = randInt(rng, 1, 6);
  const c = randInt(rng, 2, 6);
  const d = randInt(rng, 2, 5);
  const k = randInt(rng, 2, 7);
  const m = randInt(rng, 2, 6);
  const x0 = randInt(rng, 1, 4);
  const polyVal = a * x0 + b;
  const contAns = k * x0 + b - x0 * x0;
  return [
    {
      id: `${prefix}-1`,
      difficulty: "Easy",
      type: "short-answer",
      question: `គណនាលីមីត $\\lim_{x \\to ${x0}} (${a}x + ${b})$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${polyVal}`],
      hint: `អនុគមន៍ពហុធាជាប់លើ $\\mathbb{R}$ គ្រាន់តែជំនួស $x = ${x0}$។`,
      explanation: `$${a}(${x0}) + ${b} = ${polyVal}$។`,
    },
    {
      id: `${prefix}-2`,
      difficulty: "Easy",
      type: "short-answer",
      question: `គណនាលីមីត $\\lim_{x \\to ${a}} \\frac{x^2 - ${a * a}}{x - ${a}}$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${2 * a}`],
      hint: `ដាក់ភាគយកជាផលគុណកត្តា $(x - ${a})(x + ${a})$ រួចសម្រួល។`,
      explanation: `$\\frac{(x - ${a})(x + ${a})}{x - ${a}} = x + ${a} \\xrightarrow{x \\to ${a}} ${2 * a}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-3`,
      difficulty: "Medium",
      question: `គណនាលីមីត $\\lim_{x \\to 0} \\frac{\\sin(${c}x)}{${d}x}$៖`,
      correctOption: `$${fmtFrac(c, d)}$`,
      distractors: [
        `$${fmtFrac(d, c)}$`,
        `$${c * d}$`,
        `$1$`,
      ],
      hint: `ប្រើរូបមន្ត $\\lim_{u \\to 0} \\frac{\\sin u}{u} = 1$។`,
      explanation: `$\\frac{\\sin(${c}x)}{${d}x} = \\frac{${c}}{${d}} \\cdot \\frac{\\sin(${c}x)}{${c}x} \\to ${fmtFrac(c, d)}$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-4`,
      difficulty: "Medium",
      question: `គណនាលីមីត $\\lim_{x \\to +\\infty} \\frac{${k}x^2 + ${b}x - 1}{${m}x^2 + 3}$៖`,
      correctOption: `$${fmtFrac(k, m)}$`,
      distractors: [
        `$0$`,
        `$+\\infty$`,
        `$${fmtFrac(b, 3)}$`,
      ],
      hint: `ចែកភាគយក និងភាគបែងនឹង $x^2$ (ដឺក្រេខ្ពស់បំផុត)។`,
      explanation: `លីមីតស្មើផលធៀបមេគុណដឺក្រេខ្ពស់បំផុតគឺ $${fmtFrac(k, m)}$។`,
    }),
    {
      id: `${prefix}-5`,
      difficulty: "Hard",
      type: "short-answer",
      question: `រកតម្លៃ $c$ ដើម្បីឱ្យ $f(x) = \\begin{cases} x^2 + c, & x \\le ${x0} \\\\ ${k}x + ${b}, & x > ${x0} \\end{cases}$ ជាប់ត្រង់ $x = ${x0}$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលតម្លៃ c...",
      expectedAnswers: [`${contAns}`],
      hint: `តម្រូវឱ្យលីមីតឆ្វេងស្មើលីមីតស្តាំត្រង់ $x = ${x0}$៖ $${x0}^2 + c = ${k}(${x0}) + ${b}$។`,
      explanation: `$${x0 * x0} + c = ${k * x0 + b} \\implies c = ${contAns}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-6`,
      difficulty: "Hard",
      question: `គណនាលីមីត $\\lim_{x \\to +\\infty} \\frac{${a}x + 1}{\\sqrt{${d * d}x^2 + 5}}$៖`,
      correctOption: `$${fmtFrac(a, d)}$`,
      distractors: [
        `$${fmtFrac(a, d * d)}$`,
        `$-${fmtFrac(a, d)}$`,
        `$+\\infty$`,
      ],
      hint: `ចំពោះ $x > 0$ យើងមាន $\\sqrt{${d * d}x^2 + 5} = x\\sqrt{${d * d} + \\frac{5}{x^2}}$។`,
      explanation: `ចែកនឹង $x > 0$ យើងបាន $\\frac{${a} + 1/x}{\\sqrt{${d * d} + 5/x^2}} \\to ${fmtFrac(a, d)}$។`,
    }),
  ];
}

function gen3_1(rng, prefix) {
  const a = randInt(rng, 2, 8);
  const k = randInt(rng, 2, 5);
  const b = randInt(rng, 1, 7);
  const x0 = randInt(rng, 1, 4);
  const slope = 2 * k * x0 + b;
  const y0 = k * x0 * x0 + b * x0;
  const c = randInt(rng, 2, 6);
  const m = randInt(rng, 2, 5);
  return [
    {
      id: `${prefix}-1`,
      difficulty: "Easy",
      type: "short-answer",
      question: `គណនាតម្លៃលីមីត $\\lim_{h \\to 0} \\frac{(${a} + h)^2 - ${a * a}}{h}$ ដោយប្រើនិយមន័យដេរីវេ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${2 * a}`],
      hint: `នេះគឺជា $f'(${a})$ ចំពោះ $f(x) = x^2$។`,
      explanation: `$\\frac{${a * a} + ${2 * a}h + h^2 - ${a * a}}{h} = ${2 * a} + h \\xrightarrow{h \\to 0} ${2 * a}$។`,
    },
    {
      id: `${prefix}-2`,
      difficulty: "Easy",
      type: "short-answer",
      question: `រកមេគុណប្រាប់ទិសបន្ទាត់ប៉ះនឹងខ្សែកោង $f(x) = ${k}x^2 + ${b}x$ ត្រង់ $x_0 = ${x0}$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${slope}`],
      hint: `គណនា $f'(x) = ${2 * k}x + ${b}$ រួចជំនួស $x = ${x0}$។`,
      explanation: `$f'(${x0}) = ${2 * k}(${x0}) + ${b} = ${slope}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-3`,
      difficulty: "Medium",
      question: `បន្ទាត់ប៉ះនឹងខ្សែកោង $f(x) = ${k}x^2 + ${b}x$ ត្រង់ $x_0 = ${x0}$ (ដែល $f(${x0}) = ${y0}$) មានសមីការ៖`,
      correctOption: `$y = ${slope}x ${y0 - slope * x0 >= 0 ? "+" : "-"} ${Math.abs(y0 - slope * x0)}$`,
      distractors: [
        `$y = ${slope}x + ${y0}$`,
        `$y = ${2 * k}x ${y0 - 2 * k * x0 >= 0 ? "+" : "-"} ${Math.abs(y0 - 2 * k * x0)}$`,
        `$y = ${slope}(x + ${x0}) + ${y0}$`,
      ],
      hint: `ប្រើសមីការ $y = f'(${x0})(x - ${x0}) + f(${x0})$។`,
      explanation: `$y = ${slope}(x - ${x0}) + ${y0} = ${slope}x ${y0 - slope * x0 >= 0 ? "+" : "-"} ${Math.abs(y0 - slope * x0)}$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-4`,
      difficulty: "Medium",
      question: `បើបន្ទាត់ប៉ះត្រង់ $x_0$ មានមេគុណប្រាប់ទិស $m = ${m}$ តើ **បន្ទាត់កែង (Normal Line)** ត្រង់ $x_0$ មានមេគុណប្រាប់ទិសស្មើប៉ុន្មាន?`,
      correctOption: `$-\\frac{1}{${m}}$`,
      distractors: [`$\\frac{1}{${m}}$`, `$-${m}$`, `$${m}$`],
      hint: `បន្ទាត់កែងផ្ទៀងផ្ទាត់ $m_T \\cdot m_N = -1$។`,
      explanation: `$m_N = -\\frac{1}{m_T} = -\\frac{1}{${m}}$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-5`,
      difficulty: "Hard",
      question: `អនុគមន៍ $f(x) = |x - ${c}|$ នៅត្រង់ចំណុច $x_0 = ${c}$៖`,
      correctOption: "ជាប់ ប៉ុន្តែគ្មានដេរីវេ (ព្រោះ $f'_- = -1 \\neq 1 = f'_+$)",
      distractors: [
        "ជាប់ និងមានដេរីវេ $f'(" + c + ") = 0$",
        "មិនជាប់ និងគ្មានដេរីវេ",
        "មានដេរីវេ ប៉ុន្តែមិនជាប់",
      ],
      hint: `ពិនិត្យដេរីវេខាងឆ្វេង និងខាងស្តាំត្រង់ $x = ${c}$។`,
      explanation: `ត្រង់ $x = ${c}$ មានចំណុចមុំ៖ $f'_- (${c}) = -1$ និង $f'_+ (${c}) = 1$ ដូច្នេះជាប់តែគ្មានដេរីវេ។`,
    }),
    {
      id: `${prefix}-6`,
      difficulty: "Hard",
      type: "short-answer",
      question: `គេឱ្យ $f(x) = \\begin{cases} ${k}x^2, & x \\le 1 \\\\ ax + b, & x > 1 \\end{cases}$។ រកតម្លៃ $a$ ដើម្បីឱ្យ $f$ មានដេរីវេត្រង់ $x = 1$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលតម្លៃ a...",
      expectedAnswers: [`${2 * k}`],
      hint: `តម្រូវឱ្យ $f'_-(1) = f'_+(1)$។`,
      explanation: `$f'_-(1) = ${2 * k}(1) = ${2 * k}$ និង $f'_+(1) = a$ ដូច្នេះ $a = ${2 * k}$។`,
    },
  ];
}

function gen3_2(rng, prefix) {
  const a = randInt(rng, 2, 6);
  const b = randInt(rng, 2, 8);
  const c = randInt(rng, 1, 5);
  const u0 = randInt(rng, 2, 6);
  const du0 = randInt(rng, -4, 5) || 2;
  const v0 = randInt(rng, 2, 6);
  const dv0 = randInt(rng, -3, 5) || 3;
  const prodVal = du0 * v0 + u0 * dv0;
  const p = randInt(rng, 2, 5);
  const q = randInt(rng, 1, 5);
  const r = randInt(rng, 1, 4);
  const s = randInt(rng, 1, 6);
  const det = p * s - q * r;
  const m = randInt(rng, 2, 7);
  const n = randInt(rng, 2, 7);
  return [
    buildMcq(rng, {
      id: `${prefix}-1`,
      difficulty: "Easy",
      question: `គណនាដេរីវេនៃ $f(x) = ${a}x^3 - ${2 * b}\\sqrt{x} + ${c}$ លើ $(0, +\\infty)$៖`,
      correctOption: `$${3 * a}x^2 - \\frac{${b}}{\\sqrt{x}}$`,
      distractors: [
        `$${3 * a}x^2 - \\frac{${2 * b}}{\\sqrt{x}}$`,
        `$${3 * a}x^2 + \\frac{${b}}{\\sqrt{x}}$`,
        `$${a}x^2 - \\frac{${b}}{\\sqrt{x}}$`,
      ],
      hint: `ប្រើ $(x^3)' = 3x^2$ និង $(\\sqrt{x})' = \\frac{1}{2\\sqrt{x}}$។`,
      explanation: `$f'(x) = ${3 * a}x^2 - ${2 * b}\\cdot\\frac{1}{2\\sqrt{x}} = ${3 * a}x^2 - \\frac{${b}}{\\sqrt{x}}$។`,
    }),
    {
      id: `${prefix}-2`,
      difficulty: "Easy",
      type: "short-answer",
      question: `គេឱ្យ $f(x) = ${m}\\sin x + ${n}x^2 + 5$។ គណនាតម្លៃ $f'(0)$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${m}`],
      hint: `គណនា $f'(x) = ${m}\\cos x + ${2 * n}x$ រួចជំនួស $x = 0$ ($\\cos 0 = 1$)។`,
      explanation: `$f'(0) = ${m}\\cos(0) + 0 = ${m}$។`,
    },
    {
      id: `${prefix}-3`,
      difficulty: "Medium",
      type: "short-answer",
      question: `គេឱ្យ $u(1) = ${u0}$, $u'(1) = ${du0}$, $v(1) = ${v0}$ និង $v'(1) = ${dv0}$។ គណនា $(uv)'(1)$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${prodVal}`],
      hint: `ប្រើរូបមន្តផលគុណ $(uv)'(1) = u'(1)v(1) + u(1)v'(1)$។`,
      explanation: `$(uv)'(1) = (${du0})(${v0}) + (${u0})(${dv0}) = ${du0 * v0} + ${u0 * dv0} = ${prodVal}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-4`,
      difficulty: "Medium",
      question: `គណនាដេរីវេនៃ $f(x) = \\frac{${p}x + ${q}}{${r}x + ${s}}$ លើ $\\mathbb{R} \\setminus \\left\\{-${fmtFrac(s, r)}\\right\\}$៖`,
      correctOption: `$\\frac{${det}}{(${r}x + ${s})^2}$`,
      distractors: [
        `$\\frac{${-det}}{(${r}x + ${s})^2}$`,
        `$\\frac{${p * s + q * r}}{(${r}x + ${s})^2}$`,
        `$${fmtFrac(p, r)}$`,
      ],
      hint: `ប្រើរូបមន្តផលចែក $\\frac{u'v - uv'}{v^2}$៖ ភាគយក $= ${p}(${s}) - ${q}(${r})$។`,
      explanation: `$f'(x) = \\frac{${p}(${r}x + ${s}) - (${p}x + ${q})(${r})}{(${r}x + ${s})^2} = \\frac{${det}}{(${r}x + ${s})^2}$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-5`,
      difficulty: "Hard",
      question: `គណនាដេរីវេនៃ $g(x) = x^{${a}} \\cos x$ លើ $\\mathbb{R}$៖`,
      correctOption: `$${a}x^{${a - 1}}\\cos x - x^{${a}}\\sin x$`,
      distractors: [
        `$${a}x^{${a - 1}}\\cos x + x^{${a}}\\sin x$`,
        `$-${a}x^{${a - 1}}\\sin x$`,
        `$${a}x^{${a - 1}}\\sin x - x^{${a}}\\cos x$`,
      ],
      hint: `ប្រើរូបមន្តផលគុណ $(uv)' = u'v + uv'$ ដោយ $(\\cos x)' = -\\sin x$។`,
      explanation: `$g'(x) = (${a}x^{${a - 1}})\\cos x + x^{${a}}(-\\sin x) = ${a}x^{${a - 1}}\\cos x - x^{${a}}\\sin x$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-6`,
      difficulty: "Hard",
      question: `គណនាដេរីវេនៃ $h(x) = \\frac{1}{${a}x^2 + ${c}}$ លើ $\\mathbb{R}$៖`,
      correctOption: `$-\\frac{${2 * a}x}{(${a}x^2 + ${c})^2}$`,
      distractors: [
        `$\\frac{${2 * a}x}{(${a}x^2 + ${c})^2}$`,
        `$-\\frac{${a}x}{(${a}x^2 + ${c})^2}$`,
        `$-\\frac{1}{(${2 * a}x)^2}$`,
      ],
      hint: `ប្រើរូបមន្តច្រាស $\\left(\\frac{1}{v}\\right)' = -\\frac{v'}{v^2}$ ជាមួយ $v = ${a}x^2 + ${c}$។`,
      explanation: `ដោយ $v'(x) = ${2 * a}x$ នោះ $h'(x) = -\\frac{${2 * a}x}{(${a}x^2 + ${c})^2}$។`,
    }),
  ];
}

function gen3_3(rng, prefix) {
  const a = randInt(rng, 2, 6);
  const b = randInt(rng, 1, 7);
  const n = randInt(rng, 3, 7);
  const k = randInt(rng, 2, 6);
  const df = randInt(rng, 2, 6);
  const dg = randInt(rng, 2, 7);
  const cx = randInt(rng, 2, 5);
  const cy = pick(rng, [1, -1, 2, -2]);
  const R2 = cx * cx + cy * cy;
  const slopeStr = fmtFrac(-cx, cy);
  const p = randInt(rng, 2, 5);
  return [
    buildMcq(rng, {
      id: `${prefix}-1`,
      difficulty: "Easy",
      question: `គណនាដេរីវេនៃ $f(x) = (${a}x + ${b})^{${n}}$ លើ $\\mathbb{R}$៖`,
      correctOption: `$${a * n}(${a}x + ${b})^{${n - 1}}$`,
      distractors: [
        `$${n}(${a}x + ${b})^{${n - 1}}$`,
        `$${a}(${a}x + ${b})^{${n - 1}}$`,
        `$${a * n}(${a}x + ${b})^{${n}}$`,
      ],
      hint: `ប្រើ $(u^n)' = n u' u^{n-1}$ ជាមួយ $u = ${a}x + ${b}$ ($u' = ${a}$)។`,
      explanation: `$f'(x) = ${n}(${a})(${a}x + ${b})^{${n - 1}} = ${a * n}(${a}x + ${b})^{${n - 1}}$។`,
    }),
    {
      id: `${prefix}-2`,
      difficulty: "Easy",
      type: "short-answer",
      question: `គេឱ្យ $f(2) = 5$, $f'(2) = ${df}$ និង $g'(5) = ${dg}$។ គណនា $(g \\circ f)'(2)$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${df * dg}`],
      hint: `ប្រើច្បាប់បណ្តាក់ $(g \\circ f)'(2) = g'(f(2)) \\cdot f'(2)$។`,
      explanation: `$(g \\circ f)'(2) = g'(5) \\cdot f'(2) = ${dg} \\times ${df} = ${df * dg}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-3`,
      difficulty: "Medium",
      question: `គណនាដេរីវេនៃ $g(x) = \\sqrt{${a}x^2 + ${b}}$ លើ $\\mathbb{R}$៖`,
      correctOption: `$\\frac{${a}x}{\\sqrt{${a}x^2 + ${b}}}$`,
      distractors: [
        `$\\frac{${2 * a}x}{\\sqrt{${a}x^2 + ${b}}}$`,
        `$\\frac{1}{2\\sqrt{${a}x^2 + ${b}}}$`,
        `$\\frac{${a}x}{2\\sqrt{${a}x^2 + ${b}}}$`,
      ],
      hint: `ប្រើ $(\\sqrt{u})' = \\frac{u'}{2\\sqrt{u}}$ ដោយ $u'(x) = ${2 * a}x$ រួចសម្រួលនឹង $2$។`,
      explanation: `$g'(x) = \\frac{${2 * a}x}{2\\sqrt{${a}x^2 + ${b}}} = \\frac{${a}x}{\\sqrt{${a}x^2 + ${b}}}$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-4`,
      difficulty: "Medium",
      question: `គេឱ្យរង្វង់ $x^2 + y^2 = ${R2}$។ រកមេគុណប្រាប់ទិស $y'$ នៃបន្ទាត់ប៉ះត្រង់ $M(${cx}, ${cy})$៖`,
      correctOption: `$${slopeStr}$`,
      distractors: [
        `$${fmtFrac(cx, cy)}$`,
        `$${fmtFrac(-cy, cx)}$`,
        `$${fmtFrac(cy, cx)}$`,
      ],
      hint: `ដេរីវេអាំព្លីស៊ីត $2x + 2yy' = 0 \\implies y' = -\\frac{x}{y}$។`,
      explanation: `ត្រង់ $M(${cx}, ${cy})$៖ $y' = -\\frac{${cx}}{${cy}} = ${slopeStr}$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-5`,
      difficulty: "Hard",
      question: `គណនាដេរីវេនៃ $h(x) = \\arctan(${k}x)$ លើ $\\mathbb{R}$៖`,
      correctOption: `$\\frac{${k}}{1 + ${k * k}x^2}$`,
      distractors: [
        `$\\frac{1}{1 + ${k * k}x^2}$`,
        `$\\frac{${k}}{1 + ${k}x^2}$`,
        `$\\frac{${k}}{\\sqrt{1 - ${k * k}x^2}}$`,
      ],
      hint: `ប្រើ $(\\arctan u)' = \\frac{u'}{1 + u^2}$ ជាមួយ $u = ${k}x$។`,
      explanation: `$h'(x) = \\frac{${k}}{1 + (${k}x)^2} = \\frac{${k}}{1 + ${k * k}x^2}$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-6`,
      difficulty: "Hard",
      question: `គេឱ្យ $f(x) = x^3 + ${p}x + 1$ លើ $\\mathbb{R}$ (មាន $f(1) = ${p + 2}$)។ គណនា $(f^{-1})'(${p + 2})$៖`,
      correctOption: `$\\frac{1}{${3 + p}}$`,
      distractors: [
        `$${3 + p}$`,
        `$\\frac{1}{${p + 2}}$`,
        `$\\frac{1}{${3 * p}}$`,
      ],
      hint: `ប្រើទ្រឹស្តីបទអនុគមន៍ច្រាស $(f^{-1})'(${p + 2}) = \\frac{1}{f'(1)}$។`,
      explanation: `$f'(x) = 3x^2 + ${p} \\implies f'(1) = ${3 + p}$ ដូច្នេះ $(f^{-1})'(${p + 2}) = \\frac{1}{${3 + p}}$។`,
    }),
  ];
}

function gen3_4(rng, prefix) {
  const a = randInt(rng, 4, 12);
  const da = randInt(rng, 2, 6);
  const dA = 2 * a * da;
  const base = pick(rng, [2, 3, 4, 5]);
  const x0 = base * base;
  const k = randInt(rng, 1, 4);
  const h = Number((k * 2 * base * 0.01).toFixed(2)); // so h / (2*base) = 0.01 * k cleanly!
  const approx = Number((base + 0.01 * k).toFixed(2));
  const c = randInt(rng, 2, 5);
  const xVal = randInt(rng, 2, 4);
  const derivAtX = 3 * xVal * xVal - c;
  const dyVal = Number((derivAtX * 0.1).toFixed(2));
  const errPct = randInt(rng, 1, 5);
  const r = randInt(rng, 3, 10);
  const dr = randInt(rng, 2, 5);
  return [
    {
      id: `${prefix}-1`,
      difficulty: "Easy",
      type: "short-answer",
      question: `ជ្រុងការេកើនឡើងក្នុងអត្រា $\\frac{da}{dt} = ${da}\\text{ cm/s}$។ រក $\\frac{dA}{dt}$ ($\\text{cm}^2/\\text{s}$) ពេលជ្រុង $a = ${a}\\text{ cm}$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${dA}`],
      hint: `ប្រើ $A = a^2 \\implies \\frac{dA}{dt} = 2a\\frac{da}{dt}$។`,
      explanation: `$\\frac{dA}{dt} = 2(${a})(${da}) = ${dA}\\text{ cm}^2/\\text{s}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-2`,
      difficulty: "Easy",
      question: `រង្វង់មួយមានកាំកើនក្នុងអត្រា $\\frac{dr}{dt} = ${dr}\\text{ m/s}$។ តើផ្ទៃក្រឡា $A = \\pi r^2$ កើនក្នុងអត្រាប៉ុន្មានពេល $r = ${r}\\text{ m}$?`,
      correctOption: `$${2 * r * dr}\\pi\\text{ m}^2/\\text{s}$`,
      distractors: [
        `$${r * dr}\\pi\\text{ m}^2/\\text{s}$`,
        `$${r * r * dr}\\pi\\text{ m}^2/\\text{s}$`,
        `$${2 * r}\\pi\\text{ m}^2/\\text{s}$`,
      ],
      hint: `ដេរីវេ $A = \\pi r^2$ ធៀបនឹង $t$ ដើម្បីបាន $\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt}$។`,
      explanation: `$\\frac{dA}{dt} = 2\\pi(${r})(${dr}) = ${2 * r * dr}\\pi\\text{ m}^2/\\text{s}$។`,
    }),
    {
      id: `${prefix}-3`,
      difficulty: "Medium",
      type: "short-answer",
      question: `ប្រើប៉ាន់ស្មានលីនេអ៊ែរនៃ $f(x) = \\sqrt{x}$ ត្រង់ $x_0 = ${x0}$ ដើម្បីប៉ាន់ស្មានតម្លៃ $\\sqrt{${(x0 + h).toFixed(2)}}$ (បំពេញជាលេខទសភាគ)។`,
      placeholder: `ឧ. ${approx}`,
      expectedAnswers: [`${approx}`, approx.toFixed(2)],
      hint: `ប្រើ $L(x) = ${base} + \\frac{1}{${2 * base}}(x - ${x0})$។`,
      explanation: `$L(${(x0 + h).toFixed(2)}) = ${base} + \\frac{${h}}{${2 * base}} = ${base} + ${(0.01 * k).toFixed(2)} = ${approx}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-4`,
      difficulty: "Medium",
      question: `គេឱ្យ $y = x^3 - ${c}x$។ គណនាឌីផេរ៉ង់ស្យែល $dy$ ត្រង់ $x = ${xVal}$ នៅពេល $dx = 0.1$៖`,
      correctOption: `$${dyVal}$`,
      distractors: [
        `$${(derivAtX * 0.01).toFixed(2)}$`,
        `$${derivAtX}$`,
        `$${((3 * xVal * xVal + c) * 0.1).toFixed(2)}$`,
      ],
      hint: `គណនា $dy = (3x^2 - ${c})\\,dx$ ត្រង់ $x = ${xVal}$ និង $dx = 0.1$។`,
      explanation: `$f'(${xVal}) = 3(${xVal * xVal}) - ${c} = ${derivAtX} \\implies dy = ${derivAtX}(0.1) = ${dyVal}$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-5`,
      difficulty: "Hard",
      question: `បើការវាស់ជ្រុងគូបមានកំហុសអតិបរមា $${errPct}\\%$ តើកំហុសភាគរយនៃមាឌគូប $V = a^3$ ប្រហែលប៉ុន្មាន?`,
      correctOption: `$${3 * errPct}\\%$`,
      distractors: [
        `$${errPct}\\%$`,
        `$${2 * errPct}\\%$`,
        `$${errPct * errPct}\\%$`,
      ],
      hint: `ប្រើ $\\frac{dV}{V} = 3\\frac{da}{a}$។`,
      explanation: `$\\left|\\frac{dV}{V}\\right| = 3\\left|\\frac{da}{a}\\right| = 3(${errPct}\\%) = ${3 * errPct}\\%$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-6`,
      difficulty: "Hard",
      question: `ជណ្តើរប្រវែង $5\\text{ m}$ ($x^2 + y^2 = 25$) មានជើងជណ្តើររំកិលចេញ $\\frac{dx}{dt} = ${da * 0.2}\\text{ m/s}$។ នៅពេល $x = 3\\text{ m}$ ($y = 4\\text{ m}$) រក $\\frac{dy}{dt}$៖`,
      correctOption: `$${(-0.75 * da * 0.2).toFixed(2)}\\text{ m/s}$`,
      distractors: [
        `$${(0.75 * da * 0.2).toFixed(2)}\\text{ m/s}$`,
        `$${((-4 / 3) * da * 0.2).toFixed(2)}\\text{ m/s}$`,
        `$-${(da * 0.2).toFixed(2)}\\text{ m/s}$`,
      ],
      hint: `ប្រើ $x\\frac{dx}{dt} + y\\frac{dy}{dt} = 0 \\implies \\frac{dy}{dt} = -\\frac{3}{4}\\frac{dx}{dt}$។`,
      explanation: `$\\frac{dy}{dt} = -\\frac{3}{4}(${(da * 0.2).toFixed(1)}) = ${(-0.75 * da * 0.2).toFixed(2)}\\text{ m/s}$។`,
    }),
  ];
}

function gen4_1(rng, prefix) {
  const k = randInt(rng, 2, 6);
  const h = randInt(rng, 2, 6);
  const minVal = randInt(rng, 1, 9);
  const cConst = h * h + minVal;
  const a = randInt(rng, 2, 5);
  // Cubic f(x) = x^3 - 3*a*x^2 + d => f'(x) = 3x(x - 2a), critical at 0 and 2a
  const d = randInt(rng, 2, 8);
  // On [0, 2a], f(0) = d, f(2a) = 8a^3 - 12a^3 + d = d - 4a^3
  const minCubic = d - 4 * a * a * a;
  const p = randInt(rng, 2, 5);
  return [
    buildMcq(rng, {
      id: `${prefix}-1`,
      difficulty: "Easy",
      question: `រកចំណុចគ្រឹះ (Critical Numbers) នៃ $f(x) = x^3 - ${3 * k * k}x + 7$ លើ $\\mathbb{R}$៖`,
      correctOption: `$x = -${k}$ និង $x = ${k}$`,
      distractors: [
        `$x = 0$ និង $x = ${k}$`,
        `$x = ${k * k}$`,
        `$x = -${3 * k}$ និង $x = ${3 * k}$`,
      ],
      hint: `ដោះស្រាយ $f'(x) = 3x^2 - ${3 * k * k} = 0$។`,
      explanation: `$f'(x) = 3(x^2 - ${k * k}) = 0 \\iff x = \\pm ${k}$។`,
    }),
    {
      id: `${prefix}-2`,
      difficulty: "Easy",
      type: "short-answer",
      question: `រកតម្លៃអប្បបរមាដាច់ខាតនៃ $f(x) = x^2 - ${2 * h}x + ${cConst}$ លើ $[0, ${h + 3}]$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${minVal}`],
      hint: `សរសេរ $f(x) = (x - ${h})^2 + ${minVal}$ ឬដោះ $f'(x) = 0$។`,
      explanation: `$f'(x) = 2x - ${2 * h} = 0 \\implies x = ${h} \\in (0, ${h + 3})$។ តម្លៃអប្បបរមាគឺ $f(${h}) = ${minVal}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-3`,
      difficulty: "Medium",
      question: `តើអនុគមន៍ $g(x) = x^{2/3}(x - ${5 * p})$ មានចំណុចគ្រឹះលើ $\\mathbb{R}$ នៅត្រង់ណាខ្លះ?`,
      correctOption: `$x = 0$ និង $x = ${2 * p}$`,
      distractors: [
        `ត្រឹមតែ $x = ${2 * p}$`,
        `$x = 0$ និង $x = ${5 * p}$`,
        `គ្មានចំណុចគ្រឹះទេ`,
      ],
      hint: `គណនា $g'(x) = \\frac{5(x - ${2 * p})}{3x^{1/3}}$ ហើយពិនិត្យទាំង $g'(x) = 0$ និងកន្លែង $g'$ មិនកំណត់។`,
      explanation: `$g'(x) = \\frac{5(x - ${2 * p})}{3x^{1/3}}$។ $g' = 0$ ត្រង់ $x = ${2 * p}$ និង $g'$ មិនកំណត់ត្រង់ $x = 0 \\in D_g$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-4`,
      difficulty: "Medium",
      question: `តាមទ្រឹស្តីបទតម្លៃបរមា (Extreme Value Theorem) តើលក្ខខណ្ឌណាធានាថា $f$ តែងមានទាំងអតិបរមា និងអប្បបរមាដាច់ខាត?`,
      correctOption: "$f$ ជាប់លើចន្លោះបិទមានព្រំដែន $[a, b]$",
      distractors: [
        "$f$ ជាប់លើចន្លោះបើក $(a, b)$",
        "$f$ កំណត់លើ $[a, b]$ (មិនចាំបាច់ជាប់)",
        "$f'(x) = 0$ មានឬសលើ $(a, b)$",
      ],
      hint: `ត្រូវការលក្ខខណ្ឌពីរព្រមគ្នា៖ ភាពជាប់ និងចន្លោះបិទ $[a, b]$។`,
      explanation: `Extreme Value Theorem ទាមទារ $f$ ជាប់លើចន្លោះបិទមានព្រំដែន $[a, b]$។`,
    }),
    {
      id: `${prefix}-5`,
      difficulty: "Hard",
      type: "short-answer",
      question: `រកតម្លៃអប្បបរមាដាច់ខាតនៃ $f(x) = x^3 - ${3 * a}x^2 + ${d}$ លើ $[0, ${2 * a}]$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${minCubic}`],
      hint: `គណនា $f'(x) = 3x(x - ${2 * a}) = 0$ រួចប្រៀបធៀប $f(0)$ និង $f(${2 * a})$។`,
      explanation: `លើ $[0, ${2 * a}]$, $f'(x) \\le 0$ ដូច្នេះអប្បបរមាដាច់ខាតគឺ $f(${2 * a}) = ${minCubic}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-6`,
      difficulty: "Hard",
      question: `រកតម្លៃអតិបរមាដាច់ខាតនៃ $h(x) = \\frac{${2 * p}x}{x^2 + 1}$ លើ $[0, 4]$៖`,
      correctOption: `$${p}$`,
      distractors: [`$${2 * p}$`, `$\\frac{${p}}{2}$`, `$0$`],
      hint: `ដោះ $h'(x) = \\frac{${2 * p}(1 - x^2)}{(x^2 + 1)^2} = 0$ ដើម្បីរក $c = 1 \\in (0, 4)$។`,
      explanation: `$h(0) = 0$, $h(1) = ${p}$, $h(4) = \\frac{${8 * p}}{17} < ${p}$ ដូច្នេះអតិបរមាដាច់ខាតស្មើ $${p}$។`,
    }),
  ];
}

function gen4_2(rng, prefix) {
  const b = randInt(rng, 2, 7) * 2; // even so c = b/2 is integer
  const cRolle = b / 2;
  const k = randInt(rng, 2, 5);
  const a2 = k * k;
  const b2 = (k + 2) * (k + 2);
  // MVT on sqrt(x) on [k^2, (k+2)^2]: slope = 2 / (4k+4) = 1/(2k+2) => 1/(2sqrt(c)) = 1/(2k+2) => c = (k+1)^2
  const cSqrt = (k + 1) * (k + 1);
  const dist = pick(rng, [120, 140, 160, 180, 200]);
  const hrs = 2;
  const avgSpeed = dist / hrs;
  const x1 = randInt(rng, 1, 4);
  const len = randInt(rng, 2, 5);
  const x2 = x1 + len;
  const y1 = randInt(rng, 3, 10);
  const mMin = randInt(rng, 2, 6);
  const minVal = y1 + mMin * len;
  const d0 = randInt(rng, 3, 9);
  const e0 = randInt(rng, -5, -1);
  const diffConst = d0 - e0;
  return [
    {
      id: `${prefix}-1`,
      difficulty: "Easy",
      type: "short-answer",
      question: `រកតម្លៃ $c \\in (0, ${b})$ តាមទ្រឹស្តីបទ Rolle ចំពោះ $f(x) = x^2 - ${b}x + 5$ លើ $[0, ${b}]$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលតម្លៃ c...",
      expectedAnswers: [`${cRolle}`],
      hint: `ផ្ទៀងផ្ទាត់ $f(0) = f(${b}) = 5$ រួចដោះ $f'(c) = 2c - ${b} = 0$។`,
      explanation: `$f'(c) = 2c - ${b} = 0 \\implies c = ${cRolle} \\in (0, ${b})$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-2`,
      difficulty: "Easy",
      question: `រថយន្តមួយបើកបរចម្ងាយ $${dist}\\text{ km}$ ក្នុងរយៈពេល $${hrs}$ ម៉ោង។ តាមទ្រឹស្តីបទតម្លៃមធ្យម មានខណៈពេលយ៉ាងតិចមួយដែលល្បឿនខណៈស្មើនឹង៖`,
      correctOption: `$${avgSpeed}\\text{ km/h}$`,
      distractors: [
        `$${dist}\\text{ km/h}$`,
        `$${avgSpeed - 15}\\text{ km/h}$`,
        `$${avgSpeed + 20}\\text{ km/h}$`,
      ],
      hint: `ល្បឿនមធ្យមគឺ $\\frac{s(${hrs}) - s(0)}{${hrs} - 0}$។`,
      explanation: `តាម MVT មានខណៈ $c \\in (0, ${hrs})$ ដែល $v(c) = \\frac{${dist}}{${hrs}} = ${avgSpeed}\\text{ km/h}$។`,
    }),
    {
      id: `${prefix}-3`,
      difficulty: "Medium",
      type: "short-answer",
      question: `រកតម្លៃ $c \\in (${a2}, ${b2})$ តាមទ្រឹស្តីបទតម្លៃមធ្យម ចំពោះ $f(x) = \\sqrt{x}$ លើ $[${a2}, ${b2}]$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលតម្លៃ c...",
      expectedAnswers: [`${cSqrt}`],
      hint: `គណនា $\\frac{\\sqrt{${b2}} - \\sqrt{${a2}}}{${b2} - ${a2}} = \\frac{1}{${2 * (k + 1)}}$ រួចដោះ $\\frac{1}{2\\sqrt{c}} = \\frac{1}{${2 * (k + 1)}}$។`,
      explanation: `$\\frac{1}{2\\sqrt{c}} = \\frac{1}{${2 * (k + 1)}} \\implies \\sqrt{c} = ${k + 1} \\implies c = ${cSqrt}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-4`,
      difficulty: "Medium",
      question: `ហេតុអ្វីទ្រឹស្តីបទ Rolle **មិនអាចអនុវត្ត** លើ $f(x) = |x - ${k}|$ លើ $[0, ${2 * k}]$ ទោះ $f(0) = f(${2 * k}) = ${k}$?`,
      correctOption: `$f$ គ្មានដេរីវេត្រង់ $x = ${k} \\in (0, ${2 * k})$`,
      distractors: [
        `$f$ មិនជាប់លើ $[0, ${2 * k}]$`,
        `$f(0) \\neq f(${2 * k})$`,
        `ចន្លោះ $[0, ${2 * k}]$ មិនបិទ`,
      ],
      hint: `ពិនិត្យភាពមានដេរីវេនៃ $|x - ${k}|$ ត្រង់ចំណុចមុំ $x = ${k}$។`,
      explanation: `$|x - ${k}|$ ជាប់លើ $[0, ${2 * k}]$ ប៉ុន្តែគ្មានដេរីវេត្រង់ $x = ${k}$ ដូច្នេះខ្វះលក្ខខណ្ឌទី ២ នៃ Rolle។`,
    }),
    {
      id: `${prefix}-5`,
      difficulty: "Hard",
      type: "short-answer",
      question: `គេឱ្យ $f(${x1}) = ${y1}$ និង $f'(x) \\ge ${mMin}$ ចំពោះគ្រប់ $x \\in [${x1}, ${x2}]$។ រកតម្លៃតូចបំផុតដែលអាចទៅរួចនៃ $f(${x2})$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${minVal}`],
      hint: `ប្រើ MVT៖ $f(${x2}) - f(${x1}) = f'(c)(${x2} - ${x1}) \\ge ${mMin}(${len})$។`,
      explanation: `$f(${x2}) = f(${x1}) + f'(c)(${len}) \\ge ${y1} + ${mMin * len} = ${minVal}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-6`,
      difficulty: "Hard",
      question: `គេឱ្យ $f'(x) = g'(x)$ លើ $\\mathbb{R}$ ដោយ $f(0) = ${d0}$ និង $g(0) = ${e0}$។ គណនា $f(2026) - g(2026)$៖`,
      correctOption: `$${diffConst}$`,
      distractors: [
        `$${d0 + e0}$`,
        `$0$`,
        `$${diffConst * 2}$`,
      ],
      hint: `បើ $f'(x) = g'(x)$ លើចន្លោះ $\\mathbb{R}$ នោះ $f(x) - g(x)$ ជាចំនួនថេរ។`,
      explanation: `$f(x) - g(x) = f(0) - g(0) = ${d0} - (${e0}) = ${diffConst}$ ចំពោះគ្រប់ $x \\in \\mathbb{R}$។`,
    }),
  ];
}

function gen4_3(rng, prefix) {
  const h = randInt(rng, 2, 7);
  const infl = randInt(rng, 1, 5);
  // Cubic f(x) = x^3 - 3*infl*x^2 + k => f''(x) = 6(x - infl) => inflection at x = infl
  const c = randInt(rng, 2, 6);
  const a = randInt(rng, 2, 5);
  // f(x) = x + a^2/x on (0, +inf) => local min at x = a, min value = 2a
  const k = randInt(rng, 1, 5);
  const b = randInt(rng, 1, 4);
  // (x - k)(x + b) + 3 = x^2 + (b - k)x + (3 - kb) => oblique asymptote y = x + b
  const linCoef = b - k;
  const constCoef = 3 - k * b;
  const linStr = linCoef === 0 ? "" : linCoef > 0 ? ` + ${linCoef}x` : ` - ${-linCoef}x`;
  const constStr = constCoef >= 0 ? ` + ${constCoef}` : ` - ${-constCoef}`;
  return [
    buildMcq(rng, {
      id: `${prefix}-1`,
      difficulty: "Easy",
      question: `តើអនុគមន៍ $f(x) = x^2 - ${2 * h}x + 5$ កើនដាច់ខាតលើចន្លោះណា?`,
      correctOption: `$[${h}, +\\infty)$`,
      distractors: [
        `$(-\\infty, ${h}]$`,
        `$[${2 * h}, +\\infty)$`,
        `$[-${h}, +\\infty)$`,
      ],
      hint: `ដោះវិសមីការ $f'(x) = 2x - ${2 * h} > 0$។`,
      explanation: `$f'(x) = 2(x - ${h}) > 0 \\iff x > ${h}$ ដូច្នេះ $f$ កើនដាច់ខាតលើ $[${h}, +\\infty)$។`,
    }),
    {
      id: `${prefix}-2`,
      difficulty: "Easy",
      type: "short-answer",
      question: `រកអាប់ស៊ីស $x$ នៃ **ចំណុចរបត់ (Inflection Point)** នៃខ្សែកោង $f(x) = x^3 - ${3 * infl}x^2 + 4x + 1$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលអាប់ស៊ីស x...",
      expectedAnswers: [`${infl}`],
      hint: `គណនា $f''(x) = 6x - ${6 * infl} = 0$ និងពិនិត្យការប្តូរសញ្ញា។`,
      explanation: `$f''(x) = 6(x - ${infl})$ ស្មើ $0$ និងប្តូរសញ្ញាត្រង់ $x = ${infl}$ ដូច្នេះចំណុចរបត់មានអាប់ស៊ីស $${infl}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-3`,
      difficulty: "Medium",
      question: `តាមតេស្តដេរីវេទី ២ បើ $f'(c) = 0$ និង $f''(c) > 0$ នោះ $f$ មានអ្វីត្រង់ $x = c$?`,
      correctOption: "អប្បបរមាធៀប (Local Minimum)",
      distractors: [
        "អតិបរមាធៀប (Local Maximum)",
        "ចំណុចរបត់ (Inflection Point)",
        "មិនអាចសន្និដ្ឋានបានទេ",
      ],
      hint: `$f''(c) > 0$ មានន័យថាខ្សែកោងផតឡើងលើ ($\\cup$) ជុំវិញ $c$។`,
      explanation: `ពេល $f'(c) = 0$ និង $f''(c) > 0$ ខ្សែកោងផតឡើងលើដូចចាន ដូច្នេះ $f(c)$ ជាអប្បបរមាធៀប។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-4`,
      difficulty: "Medium",
      question: `តើអនុគមន៍ $f(x) = x^3 - ${3 * c}x^2 + 1$ ចុះដាច់ខាតលើចន្លោះណា?`,
      correctOption: `$[0, ${2 * c}]$`,
      distractors: [
        `$(-\\infty, 0]$`,
        `$[${2 * c}, +\\infty)$`,
        `$[0, ${c}]$`,
      ],
      hint: `ដោះ $f'(x) = 3x(x - ${2 * c}) < 0$។`,
      explanation: `$f'(x) = 3x(x - ${2 * c}) < 0 \\iff x \\in (0, ${2 * c})$ ដូច្នេះ $f$ ចុះដាច់ខាតលើ $[0, ${2 * c}]$។`,
    }),
    {
      id: `${prefix}-5`,
      difficulty: "Hard",
      type: "short-answer",
      question: `រក **តម្លៃអប្បបរមាធៀប** នៃអនុគមន៍ $f(x) = x + \\frac{${a * a}}{x}$ លើ $(0, +\\infty)$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${2 * a}`],
      hint: `ដោះ $f'(x) = 1 - \\frac{${a * a}}{x^2} = 0$ លើ $(0, +\\infty)$ រួចគណនា $f(${a})$។`,
      explanation: `$f'(x) = 0 \\implies x = ${a} > 0$, $f''(${a}) = \\frac{${2 * a * a}}{${a}^3} > 0$ ដូច្នេះ Min $= f(${a}) = ${a} + ${a} = ${2 * a}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-6`,
      difficulty: "Hard",
      question: `រកសមីការ **អាស៊ីមតូតទ្រេត** នៃខ្សែកោង $f(x) = \\frac{x^2${linStr}${constStr}}{x - ${k}}$ ពេល $x \\to \\pm\\infty$៖`,
      correctOption: `$y = x + ${b}$`,
      distractors: [
        `$y = x - ${k}$`,
        `$y = x - ${b}$`,
        `$y = x + ${k}$`,
      ],
      hint: `ចែកពហុធាដើម្បីសរសេរជាទម្រង់ $f(x) = (x + ${b}) + \\frac{3}{x - ${k}}$។`,
      explanation: `$f(x) = x + ${b} + \\frac{3}{x - ${k}}$ ដោយ $\\lim_{x \\to \\pm\\infty} \\frac{3}{x - ${k}} = 0$ ដូច្នេះអាស៊ីមតូតទ្រេតគឺ $y = x + ${b}$។`,
    }),
  ];
}

function gen4_4(rng, prefix) {
  const k = randInt(rng, 2, 8);
  const m = randInt(rng, 2, 6);
  // lim_{x->0} (1 - cos(mx))/x^2 = m^2 / 2
  const sumVal = randInt(rng, 4, 12) * 2; // even => max product = (sumVal/2)^2
  const half = sumVal / 2;
  const maxProd = half * half;
  const p = randInt(rng, 2, 7);
  // Fence 2x + y = L (L multiple of 4) => x = L/4, y = L/2, A_max = L^2/8
  const q = randInt(rng, 3, 9);
  const L = q * 8;
  const xOpt = L / 4;
  const maxArea = (L * L) / 8;
  return [
    {
      id: `${prefix}-1`,
      difficulty: "Easy",
      type: "short-answer",
      question: `ប្រើច្បាប់ L'Hôpital គណនាលីមីត $\\lim_{x \\to 0} \\frac{e^{${k}x} - 1}{x}$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${k}`],
      hint: `ពិនិត្យរាង $\\frac{0}{0}$ រួចដេរីវេភាគយក និងភាគបែងដាច់ដោយឡែក។`,
      explanation: `$\\lim_{x \\to 0} \\frac{${k}e^{${k}x}}{1} = ${k}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-2`,
      difficulty: "Easy",
      question: "តើរាងណាមួយខាងក្រោម **មិនមែន** ជារាងមិនកំណត់ (Indeterminate Form)?",
      correctOption: `$+\\infty + (+\\infty)$`,
      distractors: [`$\\frac{0}{0}$`, `$0 \\cdot \\infty$`, `$1^{\\infty}$`],
      hint: `បូកពីរចំនួនធំឥតដែនកំណត់តែងតែខិតទៅរក $+\\infty$ ជាក់លាក់។`,
      explanation: `$+\\infty + (+\\infty) = +\\infty$ កំណត់ច្បាស់លាស់ មិនមែនជារាងមិនកំណត់ទេ។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-3`,
      difficulty: "Medium",
      question: `ប្រើច្បាប់ L'Hôpital គណនាលីមីត $\\lim_{x \\to 0} \\frac{1 - \\cos(${m}x)}{x^2}$៖`,
      correctOption: `$${fmtFrac(m * m, 2)}$`,
      distractors: [
        `$${m}$`,
        `$${m * m}$`,
        `$0$`,
      ],
      hint: `អនុវត្តច្បាប់ L'Hôpital ២ ដងលើរាង $\\frac{0}{0}$។`,
      explanation: `$\\lim_{x\\to 0}\\frac{${m}\\sin(${m}x)}{2x} = \\lim_{x\\to 0}\\frac{${m * m}\\cos(${m}x)}{2} = ${fmtFrac(m * m, 2)}$។`,
    }),
    {
      id: `${prefix}-4`,
      difficulty: "Medium",
      type: "short-answer",
      question: `រកផលគុណធំបំផុត $P = xy$ នៃពីរចំនួនវិជ្ជមានដែលមានផលបូក $x + y = ${sumVal}$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលផលគុណអតិបរមា...",
      expectedAnswers: [`${maxProd}`],
      hint: `សរសេរ $P(x) = x(${sumVal} - x)$ រួចដោះ $P'(x) = 0$។`,
      explanation: `$P'(x) = ${sumVal} - 2x = 0 \\implies x = ${half}, y = ${half} \\implies P_{\\max} = ${maxProd}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-5`,
      difficulty: "Hard",
      question: `គណនាលីមីតរាងមិនកំណត់ $1^{\\infty}$៖ $\\lim_{x \\to +\\infty} \\left(1 + \\frac{${p}}{x}\\right)^x$៖`,
      correctOption: `$e^{${p}}$`,
      distractors: [`$1$`, `$${p}$`, `$e$`],
      hint: `យក $\\ln y = \\frac{\\ln(1 + ${p}/x)}{1/x}$ រួចប្រើច្បាប់ L'Hôpital។`,
      explanation: `$\\lim \\ln y = ${p} \\implies \\lim y = e^{${p}}$។`,
    }),
    {
      id: `${prefix}-6`,
      difficulty: "Hard",
      type: "short-answer",
      question: `ធ្វើរបងព័ទ្ធសួនចតុកោណកែងជាប់មាត់ទន្លេ (៣ ជ្រុង៖ $2x + y = ${L}\\text{ m}$)។ រកផ្ទៃក្រឡាអតិបរមា ($\\text{m}^2$, បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលផ្ទៃក្រឡាអតិបរមា...",
      expectedAnswers: [`${maxArea}`],
      hint: `សរសេរ $A(x) = x(${L} - 2x)$ រួចដោះ $A'(x) = ${L} - 4x = 0$។`,
      explanation: `$A'(x) = 0 \\implies x = ${xOpt}\\text{ m}, y = ${2 * xOpt}\\text{ m} \\implies A_{\\max} = ${maxArea}\\text{ m}^2$។`,
    },
  ];
}

function gen5_1(rng, prefix) {
  const a = randInt(rng, 2, 5);
  const b = randInt(rng, 2, 6);
  const c = randInt(rng, 1, 7);
  const f0 = randInt(rng, 1, 6);
  // F'(x) = 2x + b, F(0) = f0 => F(x) = x^2 + b*x + f0 => F(2) = 4 + 2b + f0
  const f2 = 4 + 2 * b + f0;
  const nSum = randInt(rng, 4, 8);
  const sumSq = (nSum * (nSum + 1) * (2 * nSum + 1)) / 6;
  const k = randInt(rng, 2, 6);
  // R_3 for f(x) = k*x + 1 on [0, 3], dx = 1: (k+1) + (2k+1) + (3k+1) = 6k + 3
  const r3 = 6 * k + 3;
  const m = randInt(rng, 2, 5);
  // Area of x^2 on [0, 3*m] = (3m)^3 / 3 = 9 m^3? Keep small: [0, m] -> m^3 / 3 or 3x^2 on [0, m] -> m^3
  return [
    buildMcq(rng, {
      id: `${prefix}-1`,
      difficulty: "Easy",
      question: `រកព្រីមីទីវទូទៅ $\\int (${3 * a}x^2 - ${2 * b}x + ${c})\\,dx$ លើ $\\mathbb{R}$៖`,
      correctOption: `$${a}x^3 - ${b}x^2 + ${c}x + C$`,
      distractors: [
        `$${3 * a}x^3 - ${2 * b}x^2 + ${c}x + C$`,
        `$${6 * a}x - ${2 * b} + C$`,
        `$${a}x^3 + ${b}x^2 + ${c}x + C$`,
      ],
      hint: `ប្រើ $\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C$។`,
      explanation: `$\\int (${3 * a}x^2 - ${2 * b}x + ${c})\\,dx = ${a}x^3 - ${b}x^2 + ${c}x + C$។`,
    }),
    {
      id: `${prefix}-2`,
      difficulty: "Easy",
      type: "short-answer",
      question: `គេឱ្យ $F'(x) = 2x + ${b}$ លើ $\\mathbb{R}$ និង $F(0) = ${f0}$។ គណនា $F(2)$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលតម្លៃ F(2)...",
      expectedAnswers: [`${f2}`],
      hint: `រក $F(x) = x^2 + ${b}x + C$ រួចប្រើ $F(0) = ${f0}$ ដើម្បីរក $C$។`,
      explanation: `$F(x) = x^2 + ${b}x + ${f0} \\implies F(2) = 4 + ${2 * b} + ${f0} = ${f2}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-3`,
      difficulty: "Medium",
      question: `រកអាំងតេក្រាលមិនកំណត់ $\\int \\left(\\frac{${k}}{x} + ${b}\\cos x\\right)\\,dx$ លើ $(0, +\\infty)$៖`,
      correctOption: `$${k}\\ln x + ${b}\\sin x + C$`,
      distractors: [
        `$${k}\\ln x - ${b}\\sin x + C$`,
        `$-\\frac{${k}}{x^2} - ${b}\\sin x + C$`,
        `$${k}\\ln x + ${b}\\cos x + C$`,
      ],
      hint: `ប្រើ $\\int \\frac{1}{x}\\,dx = \\ln x + C$ ($x > 0$) និង $\\int \\cos x\\,dx = \\sin x + C$។`,
      explanation: `$\\int \\left(\\frac{${k}}{x} + ${b}\\cos x\\right)\\,dx = ${k}\\ln x + ${b}\\sin x + C$។`,
    }),
    {
      id: `${prefix}-4`,
      difficulty: "Medium",
      type: "short-answer",
      question: `គណនាផលបូក $\\sum_{k=1}^{${nSum}} k^2$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${sumSq}`],
      hint: `ប្រើរូបមន្ត $\\sum_{k=1}^n k^2 = \\frac{n(n+1)(2n+1)}{6}$។`,
      explanation: `$\\frac{${nSum}(${nSum + 1})(${2 * nSum + 1})}{6} = ${sumSq}$។`,
    },
    {
      id: `${prefix}-5`,
      difficulty: "Hard",
      type: "short-answer",
      question: `គណនាផលបូក Riemann ខាងស្តាំ $R_3$ នៃ $f(x) = ${k}x + 1$ លើ $[0, 3]$ ដោយ $n = 3$ ($\\Delta x = 1$, បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលតម្លៃ R3...",
      expectedAnswers: [`${r3}`],
      hint: `ចំណុចចុងស្តាំគឺ $x_1 = 1, x_2 = 2, x_3 = 3$ ដូច្នេះ $R_3 = [f(1) + f(2) + f(3)]\\cdot 1$។`,
      explanation: `$R_3 = (${k + 1}) + (${2 * k + 1}) + (${3 * k + 1}) = ${r3}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-6`,
      difficulty: "Hard",
      question: `គណនាលីមីតផលបូក Riemann $\\lim_{n \\to \\infty} \\sum_{k=1}^n 3\\left(\\frac{${m}k}{n}\\right)^2 \\cdot \\frac{${m}}{n}$៖`,
      correctOption: `$${m * m * m}$`,
      distractors: [
        `$${3 * m * m}$`,
        `$${m * m}$`,
        `$${3 * m * m * m}$`,
      ],
      hint: `ទាញ $\\frac{3\\cdot ${m}^3}{n^3}$ ចេញក្រៅផលបូក រួចប្រើ $\\sum_{k=1}^n k^2 = \\frac{n(n+1)(2n+1)}{6}$។`,
      explanation: `$\\frac{3(${m * m * m})}{n^3} \\cdot \\frac{n(n+1)(2n+1)}{6} \\xrightarrow{n \\to \\infty} \\frac{3(${m * m * m})\\cdot 2}{6} = ${m * m * m}$។`,
    }),
  ];
}

function gen5_2(rng, prefix) {
  const a = randInt(rng, 1, 4);
  const b = randInt(rng, 2, 5);
  const p = randInt(rng, 2, 6);
  const q = randInt(rng, 1, 5);
  // Q1: int_0^b (3a x^2 + 2q x) dx = a*b^3 + q*b^2
  const ans1 = a * b * b * b + q * b * b;
  // Q2: Chasles int_1^5 f = A, int_1^3 f = B => int_3^5 f = A - B
  const int15 = randInt(rng, 8, 18);
  const int13 = randInt(rng, 2, 7);
  const int35 = int15 - int13;
  // Q3: Symmetry on [-m, m]: int_{-m}^m (p x^3 + 3 x^2 - q x) dx = 2 * m^3
  const m = randInt(rng, 2, 4);
  const ansSym = 2 * m * m * m;
  // Q4: FTC Part 1 with Chain Rule: d/dx int_1^{x^2} (t + c) dt = (x^2 + c) * 2x
  const c = randInt(rng, 1, 6);
  // Evaluate at x = 2 => (4 + c) * 4
  const ftcVal = (4 + c) * 4;
  // Q5: Average value of f(x) = 3x^2 + k on [0, 2]: (1/2) * [x^3 + kx]_0^2 = (8 + 2k)/2 = 4 + k
  const k = randInt(rng, 1, 7);
  const avgVal = 4 + k;
  // Q6: int_0^2 |x - 1| dx generalized: int_0^{2r} |x - r| dx = r^2
  const r = randInt(rng, 2, 5);
  const absArea = r * r;

  return [
    {
      id: `${prefix}-1`,
      difficulty: "Easy",
      type: "short-answer",
      question: `ប្រើទ្រឹស្តីបទគ្រឹះនៃ Calculus (FTC ផ្នែកទី ២) គណនា $\\int_0^{${b}} (${3 * a}x^2 + ${2 * q}x)\\,dx$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${ans1}`],
      hint: `រកព្រីមីទីវ $F(x) = ${a}x^3 + ${q}x^2$ រួចគណនា $F(${b}) - F(0)$។`,
      explanation: `$\\left[${a}x^3 + ${q}x^2\\right]_0^{${b}} = ${a}(${b}^3) + ${q}(${b}^2) - 0 = ${ans1}$។`,
    },
    {
      id: `${prefix}-2`,
      difficulty: "Easy",
      type: "short-answer",
      question: `គេដឹងថា $\\int_1^5 f(x)\\,dx = ${int15}$ និង $\\int_1^3 f(x)\\,dx = ${int13}$។ ប្រើទំនាក់ទំនង Chasles រក $\\int_3^5 f(x)\\,dx$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${int35}`],
      hint: `ប្រើ $\\int_1^5 f = \\int_1^3 f + \\int_3^5 f$។`,
      explanation: `$\\int_3^5 f(x)\\,dx = \\int_1^5 f(x)\\,dx - \\int_1^3 f(x)\\,dx = ${int15} - ${int13} = ${int35}$។`,
    },
    {
      id: `${prefix}-3`,
      difficulty: "Medium",
      type: "short-answer",
      question: `ប្រើលក្ខណៈស៊ីមេទ្រីលើ $[-${m}, ${m}]$ គណនា $\\int_{-${m}}^{${m}} (${p}x^3 + 3x^2 - ${q}x)\\,dx$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${ansSym}`],
      hint: `តួសេស ${p}x^3 និង -${q}x មានអាំងតេក្រាលស្មើ $0$ លើ $[-${m}, ${m}]$ ហើយតួគូ $3x^2$ ផ្តល់ $2\\int_0^{${m}} 3x^2\\,dx$។`,
      explanation: `$\\int_{-${m}}^{${m}} (${p}x^3 - ${q}x)\\,dx = 0$ និង $2\\int_0^{${m}} 3x^2\\,dx = 2[x^3]_0^{${m}} = ${ansSym}$។`,
    },
    {
      id: `${prefix}-4`,
      difficulty: "Medium",
      type: "short-answer",
      question: `គេឱ្យ $g(x) = \\int_1^{x^2} (t + ${c})\\,dt$។ ប្រើ FTC ផ្នែកទី ១ និងច្បាប់បណ្តាក់ រកតម្លៃ $g'(2)$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលតម្លៃ g'(2)...",
      expectedAnswers: [`${ftcVal}`],
      hint: `$g'(x) = (x^2 + ${c}) \\cdot (x^2)' = 2x(x^2 + ${c})$។`,
      explanation: `$g'(x) = (x^2 + ${c})\\cdot 2x \\implies g'(2) = (4 + ${c})\\cdot 4 = ${ftcVal}$។`,
    },
    {
      id: `${prefix}-5`,
      difficulty: "Hard",
      type: "short-answer",
      question: `គណនា **តម្លៃមធ្យម ($f_{\\text{avg}}$)** នៃអនុគមន៍ $f(x) = 3x^2 + ${k}$ លើចន្លោះ $[0, 2]$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលតម្លៃមធ្យម...",
      expectedAnswers: [`${avgVal}`],
      hint: `ប្រើ $f_{\\text{avg}} = \\frac{1}{2 - 0}\\int_0^2 (3x^2 + ${k})\\,dx$។`,
      explanation: `$f_{\\text{avg}} = \\frac{1}{2}\\left[x^3 + ${k}x\\right]_0^2 = \\frac{8 + ${2 * k}}{2} = ${avgVal}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-6`,
      difficulty: "Hard",
      question: `គណនាអាំងតេក្រាលកំណត់ $\\int_0^{${2 * r}} |x - ${r}|\\,dx$៖`,
      correctOption: `$${absArea}$`,
      distractors: [
        `$0$`,
        `$${2 * absArea}$`,
        `$${r}$`,
      ],
      hint: `បំបែកត្រង់ $x = ${r}$ តាម Chasles ឬគណនាក្រឡាផ្ទៃត្រីកោណ ២ ខាងលើអ័ក្ស $Ox$។`,
      explanation: `$\\int_0^{${r}} (${r} - x)\\,dx + \\int_{${r}}^{${2 * r}} (x - ${r})\\,dx = \\frac{${r}^2}{2} + \\frac{${r}^2}{2} = ${absArea}$។`,
    }),
  ];
}

function gen5_3(rng, prefix) {
  const k = randInt(rng, 2, 7);
  const c = randInt(rng, 1, 6);
  const n = randInt(rng, 3, 6);
  // Q4: int_0^b 6x (x^2 + 1)^2 dx = [(x^2 + 1)^3]_0^b = (b^2 + 1)^3 - 1
  const b = randInt(rng, 1, 3);
  const uTop = b * b + 1;
  const ansDef = uTop * uTop * uTop - 1;
  // Q5: int_0^{pi/2} sin^p(x) cos(x) dx = 1 / (p + 1)
  const p = randInt(rng, 2, 6);
  // Q6: int_1^{e^m} (2 ln x) / x dx = [ (ln x)^2 ]_1^{e^m} = m^2
  const m = randInt(rng, 2, 6);
  const ansLog = m * m;

  return [
    buildMcq(rng, {
      id: `${prefix}-1`,
      difficulty: "Easy",
      question: `ប្រើវិធីប្តូរអថេរគណនាអាំងតេក្រាលមិនកំណត់ $\\int \\cos(${k}x)\\,dx$ លើ $\\mathbb{R}$៖`,
      correctOption: `$\\frac{1}{${k}}\\sin(${k}x) + C$`,
      distractors: [
        `$${k}\\sin(${k}x) + C$`,
        `$-\\frac{1}{${k}}\\sin(${k}x) + C$`,
        `$\\sin(${k}x) + C$`,
      ],
      hint: `តាង $u = ${k}x \\implies dx = \\frac{1}{${k}}\\,du$។`,
      explanation: `$\\int \\cos u \\cdot \\frac{du}{${k}} = \\frac{1}{${k}}\\sin u + C = \\frac{1}{${k}}\\sin(${k}x) + C$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-2`,
      difficulty: "Easy",
      question: `ប្រើការប្តូរអថេរ $u = x^2 + ${c}$ គណនា $\\int 2x(x^2 + ${c})^{${n}}\\,dx$ លើ $\\mathbb{R}$៖`,
      correctOption: `$\\frac{(x^2 + ${c})^{${n + 1}}}{${n + 1}} + C$`,
      distractors: [
        `$\\frac{(x^2 + ${c})^{${n + 1}}}{${2 * (n + 1)}} + C$`,
        `$${n}(x^2 + ${c})^{${n - 1}} + C$`,
        `$2x \\cdot \\frac{(x^2 + ${c})^{${n + 1}}}{${n + 1}} + C$`,
      ],
      hint: `ដោយ $du = 2x\\,dx$ អាំងតេក្រាលបំប្លែងជា $\\int u^{${n}}\\,du$។`,
      explanation: `$\\int u^{${n}}\\,du = \\frac{u^{${n + 1}}}{${n + 1}} + C = \\frac{(x^2 + ${c})^{${n + 1}}}{${n + 1}} + C$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-3`,
      difficulty: "Medium",
      question: `គណនាអាំងតេក្រាលមិនកំណត់ $\\int \\frac{2x}{x^2 + ${c}}\\,dx$ លើ $\\mathbb{R}$៖`,
      correctOption: `$\\ln(x^2 + ${c}) + C$`,
      distractors: [
        `$\\frac{1}{2}\\ln(x^2 + ${c}) + C$`,
        `$2\\ln(x^2 + ${c}) + C$`,
        `$\\arctan(x^2 + ${c}) + C$`,
      ],
      hint: `សង្កេតទម្រង់ $\\int \\frac{u'(x)}{u(x)}\\,dx = \\ln|u(x)| + C$ ដោយ $u(x) = x^2 + ${c} > 0$។`,
      explanation: `តាង $u = x^2 + ${c} > 0 \\implies du = 2x\\,dx \\implies \\int \\frac{du}{u} = \\ln(x^2 + ${c}) + C$។`,
    }),
    {
      id: `${prefix}-4`,
      difficulty: "Medium",
      type: "short-answer",
      question: `ប្រើវិធីប្តូរអថេរ (និងប្តូរគោល) គណនា $\\int_0^{${b}} 6x(x^2 + 1)^2\\,dx$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${ansDef}`],
      hint: `តាង $u = x^2 + 1 \\implies du = 2x\\,dx$, គោលថ្មី $x = 0 \\to u = 1$ និង $x = ${b} \\to u = ${uTop}$។`,
      explanation: `$\\int_1^{${uTop}} 3u^2\\,du = \\left[u^3\\right]_1^{${uTop}} = ${uTop}^3 - 1 = ${ansDef}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-5`,
      difficulty: "Hard",
      question: `គណនាអាំងតេក្រាលកំណត់ $\\int_0^{\\pi/2} \\sin^{${p}} x \\cos x\\,dx$៖`,
      correctOption: `$\\frac{1}{${p + 1}}$`,
      distractors: [
        `$\\frac{1}{${p}}$`,
        `$${p + 1}$`,
        `$0$`,
      ],
      hint: `តាង $u = \\sin x \\implies du = \\cos x\\,dx$ ; គោលថ្មី $u(0) = 0$ និង $u(\\pi/2) = 1$។`,
      explanation: `$\\int_0^1 u^{${p}}\\,du = \\left[\\frac{u^{${p + 1}}}{${p + 1}}\\right]_0^1 = \\frac{1}{${p + 1}}$។`,
    }),
    {
      id: `${prefix}-6`,
      difficulty: "Hard",
      type: "short-answer",
      question: `ប្រើវិធីប្តូរអថេរ $u = \\ln x$ គណនា $\\int_1^{e^{${m}}} \\frac{2\\ln x}{x}\\,dx$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${ansLog}`],
      hint: `តាង $u = \\ln x \\implies du = \\frac{1}{x}\\,dx$ ; គោលថ្មី $u(1) = 0$ និង $u(e^{${m}}) = ${m}$។`,
      explanation: `$\\int_0^{${m}} 2u\\,du = \\left[u^2\\right]_0^{${m}} = ${m}^2 = ${ansLog}$។`,
    },
  ];
}

function gen6_1(rng, prefix) {
  // Q1: Area enclosed by y = 3k*x and y = 3x^2 (k = 2m even): intersect at 0, 2m => A = 4 m^3
  const m1 = randInt(rng, 1, 3);
  const k1 = 2 * m1;
  const ans1 = 4 * m1 * m1 * m1;

  // Q3: Crossing curves y = 4m*x^3 and y = 4m*x on [-1, 1] => 2 * int_0^1 4m(x - x^3) dx = 2m
  const m3 = randInt(rng, 1, 5);
  const a3 = 4 * m3;
  const ans3 = 2 * m3;

  // Q5: Area enclosed by x = 3y^2 and x = 3k*y (k = 2m even) => 4 m^3
  const m5 = randInt(rng, 1, 3);
  const k5 = 2 * m5;
  const ans5 = 4 * m5 * m5 * m5;

  // Q6: Area between y = e^x and y = e^{-x} on [0, ln(r)] => (r - 1)^2 / r
  const r6 = randInt(rng, 2, 5);
  const num6 = (r6 - 1) * (r6 - 1);

  return [
    {
      id: `${prefix}-1`,
      difficulty: "Easy",
      type: "short-answer",
      question: `គណនាក្រឡាផ្ទៃព័ទ្ធជុំវិញដោយខ្សែកោង $y = ${3 * k1}x$ និង $y = 3x^2$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលក្រឡាផ្ទៃ...",
      expectedAnswers: [`${ans1}`],
      hint: `រកចំណុចប្រសព្វពី $3x^2 = ${3 * k1}x \\implies x = 0, ${k1}$ រួចគណនា $\\int_0^{${k1}} (${3 * k1}x - 3x^2)\\,dx$។`,
      explanation: `$\\int_0^{${k1}} (${3 * k1}x - 3x^2)\\,dx = \\left[${(3 * k1) / 2}x^2 - x^3\\right]_0^{${k1}} = ${ans1}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-2`,
      difficulty: "Easy",
      question: "ប្រសិនបើ $f(x) \\ge g(x)$ លើ $[a, b]$ (ទោះខ្សែកោងទាំងពីរនៅខាងក្រោមអ័ក្ស $Ox$ ក៏ដោយ) តើក្រឡាផ្ទៃរវាងខ្សែកោងទាំងពីរស្មើនឹងរូបមន្តណា?",
      correctOption: `$A = \\int_a^b [f(x) - g(x)]\\,dx$`,
      distractors: [
        `$A = \\int_a^b [g(x) - f(x)]\\,dx$`,
        `$A = \\int_a^b [f(x) + g(x)]\\,dx$`,
        `$A = -\\int_a^b [f(x) - g(x)]\\,dx$`,
      ],
      hint: `កម្ពស់បន្ទះឈរតែងតែស្មើ $y_{\\text{លើ}} - y_{\\text{ក្រោម}} = f(x) - g(x) \\ge 0$ ដោយមិនអាស្រ័យនឹងទីតាំងអ័ក្ស $Ox$ ទេ។`,
      explanation: `ការរំកិលខ្សែកោងទាំងពីរឡើងលើ $+K$ មិនប្តូរផលដក $(f + K) - (g + K) = f - g$ ឡើយ ដូច្នេះ $A = \\int_a^b [f(x) - g(x)]\\,dx$ ជានិច្ច។`,
    }),
    {
      id: `${prefix}-3`,
      difficulty: "Medium",
      type: "short-answer",
      question: `គណនាក្រឡាផ្ទៃសរុបរវាងខ្សែកោង $y = ${a3}x^3$ និង $y = ${a3}x$ លើចន្លោះ $[-1, 1]$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលក្រឡាផ្ទៃសរុប...",
      expectedAnswers: [`${ans3}`],
      hint: `ខ្សែកោងទាំងពីរកាត់គ្នាត្រង់ $x = -1, 0, 1$ ; ដោយស៊ីមេទ្រី $A = 2\\int_0^1 (${a3}x - ${a3}x^3)\\,dx$។`,
      explanation: `$A = 2\\int_0^1 ${a3}(x - x^3)\\,dx = ${2 * a3}\\left(\\frac{1}{2} - \\frac{1}{4}\\right) = ${ans3}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-4`,
      difficulty: "Medium",
      question: "ពេលគណនាក្រឡាផ្ទៃដោយប្រើបន្ទះដេកតាមអ័ក្ស $Oy$ ($dy$) លើចន្លោះ $y \\in [c, d]$ ដែល $x_{\\text{ស្តាំ}} = f(y)$ និង $x_{\\text{ឆ្វេង}} = g(y)$, តើរូបមន្តណាត្រឹមត្រូវ?",
      correctOption: `$A = \\int_c^d [f(y) - g(y)]\\,dy$`,
      distractors: [
        `$A = \\int_c^d [g(y) - f(y)]\\,dy$`,
        `$A = \\int_a^b [f(y) - g(y)]\\,dy$`,
        `$A = \\int_c^d [f(y) + g(y)]\\,dy$`,
      ],
      hint: `ប្រវែងបន្ទះដេកស្មើ $x_{\\text{ស្តាំ}} - x_{\\text{ឆ្វេង}} \\ge 0$ ហើយគោលត្រូវជាតម្លៃ $y \\in [c, d]$។`,
      explanation: `បន្ទះដេកមានប្រវែង $x_{\\text{ស្តាំ}} - x_{\\text{ឆ្វេង}} = f(y) - g(y)$ និងកម្រាស់ $dy$ លើ $[c, d]$។`,
    }),
    {
      id: `${prefix}-5`,
      difficulty: "Hard",
      type: "short-answer",
      question: `ប្រើការអាំងតេក្រាលតាមអថេរ $y$ ($dy$) គណនាក្រឡាផ្ទៃព័ទ្ធជុំវិញដោយ $x = 3y^2$ និង $x = ${3 * k5}y$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលក្រឡាផ្ទៃ...",
      expectedAnswers: [`${ans5}`],
      hint: `ចំណុចប្រសព្វ៖ $3y^2 = ${3 * k5}y \\implies y = 0, ${k5}$ ; លើ $[0, ${k5}]$ មាន $x_{\\text{ស្តាំ}} = ${3 * k5}y \\ge 3y^2$។`,
      explanation: `$A = \\int_0^{${k5}} (${3 * k5}y - 3y^2)\\,dy = \\left[${(3 * k5) / 2}y^2 - y^3\\right]_0^{${k5}} = ${ans5}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-6`,
      difficulty: "Hard",
      question: `គណនាក្រឡាផ្ទៃរវាងខ្សែកោង $y = e^x$ និង $y = e^{-x}$ លើចន្លោះ $[0, \\ln ${r6}]$៖`,
      correctOption: `$${fmtFrac(num6, r6)}$`,
      distractors: [
        `$${fmtFrac(r6 * r6 - 1, r6)}$`,
        `$${r6 - 1}$`,
        `$${fmtFrac(r6 + 1, r6)}$`,
      ],
      hint: `លើ $[0, \\ln ${r6}]$ មាន $e^x \\ge e^{-x}$ ដូច្នេះ $A = \\int_0^{\\ln ${r6}} (e^x - e^{-x})\\,dx = [e^x + e^{-x}]_0^{\\ln ${r6}}$។`,
      explanation: `$A = \\left(${r6} + \\frac{1}{${r6}}\\right) - (1 + 1) = ${r6} - 2 + \\frac{1}{${r6}} = ${fmtFrac(num6, r6)}$។`,
    }),
  ];
}

function gen6_2(rng, prefix) {
  // Q1: Disk around Ox: y = sqrt(k*x) on [0, b] => pi * k * b^2 / 2
  const k1 = randInt(rng, 2, 6);
  const b1 = randInt(rng, 2, 4);
  const num1 = k1 * b1 * b1;

  // Q2: Cone volume by Disk around Ox: y = a*x on [0, 3] => V = pi * int_0^3 a^2 x^2 dx = 9 a^2 pi
  const a2 = randInt(rng, 2, 5);
  const coef2 = 9 * a2 * a2;

  // Q4: Washer around Ox: y = c (outer) and y = x (inner) on [0, c] => pi * (2/3) c^3
  const c4 = randInt(rng, 2, 4);
  const num4 = 2 * c4 * c4 * c4;

  // Q5: Cylindrical Shells around Oy: y = m * x^2 on [0, b] => 2*pi * m * b^4 / 4 = m * b^4 / 2 * pi
  const m5 = randInt(rng, 1, 4);
  const b5 = randInt(rng, 2, 3);
  const num5 = m5 * b5 * b5 * b5 * b5;

  // Q6: Shifted axis y = -p for region between y = q (top) and y = x^2 (bottom)
  const p6 = randInt(rng, 1, 4);
  const q6 = randInt(rng, 2, 5);

  return [
    buildMcq(rng, {
      id: `${prefix}-1`,
      difficulty: "Easy",
      question: `ប្រើវិធីបន្ទះថាស (Disk Method) គណនាមាឌសូលីតបរិវត្តពេលបង្វិលតំបន់ក្រោម $y = \\sqrt{${k1}x}$ លើ $[0, ${b1}]$ ជុំវិញអ័ក្ស $Ox$៖`,
      correctOption: `$${fmtFrac(num1, 2)}\\pi$`,
      distractors: [
        `$${num1}\\pi$`,
        `$${fmtFrac(k1 * b1, 2)}\\pi$`,
        `$${fmtFrac(num1, 3)}\\pi$`,
      ],
      hint: `ប្រើ $V = \\pi\\int_0^{${b1}} \\bigl(\\sqrt{${k1}x}\\bigr)^2\\,dx = \\pi\\int_0^{${b1}} ${k1}x\\,dx$។`,
      explanation: `$V = \\pi\\left[\\frac{${k1}x^2}{2}\\right]_0^{${b1}} = ${fmtFrac(num1, 2)}\\pi$។`,
    }),
    {
      id: `${prefix}-2`,
      difficulty: "Easy",
      type: "short-answer",
      question: `បង្វិលតំបន់ក្រោមបន្ទាត់ $y = ${a2}x$ លើ $[0, 3]$ ជុំវិញអ័ក្ស $Ox$ បានមាឌ $V = k\\pi$។ រកតម្លៃលេខ $k$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលតម្លៃ k...",
      expectedAnswers: [`${coef2}`],
      hint: `ប្រើវិធីថាស $V = \\pi\\int_0^3 (${a2}x)^2\\,dx = ${a2 * a2}\\pi\\left[\\frac{x^3}{3}\\right]_0^3$។`,
      explanation: `$V = ${a2 * a2}\\pi \\cdot \\frac{27}{3} = ${coef2}\\pi \\implies k = ${coef2}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-3`,
      difficulty: "Medium",
      question: "ក្នុងវិធីចិញ្ចៀន (Washer Method) ដែលមានកាំក្រៅ $R(x)$ និងកាំក្នុង $r(x)$ លើ $[a, b]$, តើរូបមន្តមាឌណាមួយត្រឹមត្រូវ?",
      correctOption: `$V = \\pi\\int_a^b \\bigl([R(x)]^2 - [r(x)]^2\\bigr)\\,dx$`,
      distractors: [
        `$V = \\pi\\int_a^b [R(x) - r(x)]^2\\,dx$`,
        `$V = 2\\pi\\int_a^b [R(x) - r(x)]\\,dx$`,
        `$V = \\pi\\int_a^b \\bigl([R(x)]^2 + [r(x)]^2\\bigr)\\,dx$`,
      ],
      hint: `ក្រឡាផ្ទៃចិញ្ចៀនស្មើ ផ្ទៃរង្វង់ក្រៅ $\\pi R^2$ ដកផ្ទៃរន្ធក្នុង $\\pi r^2$។`,
      explanation: `មុខកាត់ចិញ្ចៀនមានផ្ទៃ $A(x) = \\pi R^2 - \\pi r^2 = \\pi(R^2 - r^2)$ (ហាមប្រើ $(R - r)^2$ ជាដាច់ខាត!)។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-4`,
      difficulty: "Medium",
      question: `ប្រើវិធីចិញ្ចៀនគណនាមាឌពេលបង្វិលតំបន់រវាង $y = ${c4}$ និង $y = x$ លើ $[0, ${c4}]$ ជុំវិញអ័ក្ស $Ox$៖`,
      correctOption: `$${fmtFrac(num4, 3)}\\pi$`,
      distractors: [
        `$${fmtFrac(c4 * c4 * c4, 3)}\\pi$`,
        `$${c4 * c4 * c4}\\pi$`,
        `$${fmtFrac(num4, 2)}\\pi$`,
      ],
      hint: `កាំក្រៅ $R = ${c4}$ និងកាំក្នុង $r = x$ ដូច្នេះ $V = \\pi\\int_0^{${c4}} (${c4 * c4} - x^2)\\,dx$។`,
      explanation: `$V = \\pi\\left[${c4 * c4}x - \\frac{x^3}{3}\\right]_0^{${c4}} = \\pi\\left(${c4 * c4 * c4} - \\frac{${c4 * c4 * c4}}{3}\\right) = ${fmtFrac(num4, 3)}\\pi$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-5`,
      difficulty: "Hard",
      question: `ប្រើវិធីសំបកស៊ីឡាំង (Cylindrical Shells) គណនាមាឌពេលបង្វិលតំបន់ក្រោម $y = ${m5}x^2$ លើ $[0, ${b5}]$ ជុំវិញអ័ក្ស $Oy$៖`,
      correctOption: `$${fmtFrac(num5, 2)}\\pi$`,
      distractors: [
        `$${fmtFrac(num5, 4)}\\pi$`,
        `$${num5}\\pi$`,
        `$${fmtFrac(m5 * b5 * b5 * b5, 3)}\\pi$`,
      ],
      hint: `ប្រើ $V = 2\\pi\\int_0^{${b5}} x \\cdot (${m5}x^2)\\,dx = ${2 * m5}\\pi\\int_0^{${b5}} x^3\\,dx$។`,
      explanation: `$V = ${2 * m5}\\pi\\left[\\frac{x^4}{4}\\right]_0^{${b5}} = ${fmtFrac(num5, 2)}\\pi$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-6`,
      difficulty: "Hard",
      question: `តំបន់រវាង $y = ${q6}$ (ខាងលើ) និង $y = x^2$ (ខាងក្រោម) លើ $[0, \\sqrt{${q6}}]$ ត្រូវបានបង្វិលជុំវិញបន្ទាត់ដេក $y = -${p6}$។ តើកាំក្រៅ $R(x)$ និងកាំក្នុង $r(x)$ ស្មើអ្វី?`,
      correctOption: `$R = ${q6 + p6}$ និង $r = x^2 + ${p6}$`,
      distractors: [
        `$R = ${q6 - p6}$ និង $r = x^2 - ${p6}$`,
        `$R = ${q6}$ និង $r = x^2$`,
        `$R = x^2 + ${p6}$ និង $r = ${q6 + p6}$`,
      ],
      hint: `ចម្ងាយពីខ្សែកោង $y$ ទៅអ័ក្សបង្វិល $y = -${p6}$ គឺ $y - (-${p6}) = y + ${p6}$។`,
      explanation: `ដោយអ័ក្ស $y = -${p6}$ នៅខាងក្រោមតំបន់ នោះ $R(x) = ${q6} - (-${p6}) = ${q6 + p6}$ និង $r(x) = x^2 - (-${p6}) = x^2 + ${p6}$។`,
    }),
  ];
}

function gen6_3(rng, prefix) {
  // Q1: Arc length of line y = (3/4)x + c on [0, 4k] => L = 5k
  const k1 = randInt(rng, 1, 5);
  const c1 = randInt(rng, 1, 6);
  const ans1 = 5 * k1;

  // Q2: Arc length setup for y = x^p on [1, 3]
  const p2 = randInt(rng, 2, 5);

  // Q3: Arc length of y = (2/3) x^(3/2) on [0, b] where 1 + b = m^2 (m = 2, 3, 4 => b = 3, 8, 15)
  const m3 = randInt(rng, 2, 4);
  const b3 = m3 * m3 - 1;
  const num3 = 2 * (m3 * m3 * m3 - 1);

  // Q5: Surface area of spherical zone y = sqrt(R^2 - x^2) on [-h, h] around Ox => 4*pi*R*h
  const R5 = randInt(rng, 3, 6);
  const h5 = randInt(rng, 1, R5 - 1);
  const coef5 = 4 * R5 * h5;

  // Q6: Surface area of y = 2*sqrt(x) on [0, b] (b = m^2 - 1, m = 2 or 3) => (8/3)(m^3 - 1)*pi
  const m6 = randInt(rng, 2, 3);
  const b6 = m6 * m6 - 1;
  const num6 = 8 * (m6 * m6 * m6 - 1);

  return [
    {
      id: `${prefix}-1`,
      difficulty: "Easy",
      type: "short-answer",
      question: `ប្រើរូបមន្តប្រវែងធ្នូ $L = \\int_a^b \\sqrt{1 + [f'(x)]^2}\\,dx$ គណនាប្រវែងកំណាត់បន្ទាត់ $y = \\frac{3}{4}x + ${c1}$ លើ $[0, ${4 * k1}]$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលប្រវែង L...",
      expectedAnswers: [`${ans1}`],
      hint: `$f'(x) = \\frac{3}{4} \\implies \\sqrt{1 + \\frac{9}{16}} = \\frac{5}{4}$ ដូច្នេះ $L = \\int_0^{${4 * k1}} \\frac{5}{4}\\,dx$។`,
      explanation: `$L = \\int_0^{${4 * k1}} \\frac{5}{4}\\,dx = \\frac{5}{4} \\cdot ${4 * k1} = ${ans1}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-2`,
      difficulty: "Easy",
      question: `តើអាំងតេក្រាលណាត្រឹមត្រូវសម្រាប់ **ប្រវែងធ្នូ** នៃខ្សែកោង $y = x^{${p2}}$ លើ $[1, 3]$?`,
      correctOption: `$\\int_1^3 \\sqrt{1 + ${p2 * p2}x^{${2 * (p2 - 1)}}}\\,dx$`,
      distractors: [
        `$\\int_1^3 \\sqrt{1 + ${p2}x^{${p2 - 1}}}\\,dx$`,
        `$\\int_1^3 \\sqrt{1 + x^{${2 * p2}}}\\,dx$`,
        `$\\int_1^3 (1 + ${p2 * p2}x^{${2 * (p2 - 1)}})\\,dx$`,
      ],
      hint: `គណនា $y' = ${p2}x^{${p2 - 1}}$ រួចលើកជាការ៉េ $(y')^2 = ${p2 * p2}x^{${2 * (p2 - 1)}}$ ដាក់ក្នុង $\\sqrt{1 + (y')^2}$។`,
      explanation: `$y' = ${p2}x^{${p2 - 1}} \\implies (y')^2 = ${p2 * p2}x^{${2 * (p2 - 1)}}$ ដូច្នេះ $L = \\int_1^3 \\sqrt{1 + ${p2 * p2}x^{${2 * (p2 - 1)}}}\\,dx$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-3`,
      difficulty: "Medium",
      question: `គណនាប្រវែងធ្នូពិតនៃខ្សែកោង $y = \\frac{2}{3}x^{3/2}$ លើចន្លោះ $[0, ${b3}]$៖`,
      correctOption: `$${fmtFrac(num3, 3)}$`,
      distractors: [
        `$${fmtFrac(m3 * m3 * m3 - 1, 3)}$`,
        `$${fmtFrac(2 * m3 * m3 * m3, 3)}$`,
        `$${b3}$`,
      ],
      hint: `$y' = x^{1/2} \\implies 1 + (y')^2 = 1 + x$ ដូច្នេះ $L = \\int_0^{${b3}} \\sqrt{1 + x}\\,dx = \\left[\\frac{2}{3}(1 + x)^{3/2}\\right]_0^{${b3}}$។`,
      explanation: `$L = \\frac{2}{3}\\bigl((${b3 + 1})^{3/2} - 1\\bigr) = \\frac{2}{3}(${m3 * m3 * m3} - 1) = ${fmtFrac(num3, 3)}$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-4`,
      difficulty: "Medium",
      question: "ពេលបង្វិលខ្សែកោង $y = f(x) \\ge 0$ ($x \\in [a, b]$) ជុំវិញអ័ក្ស $Ox$ តើរូបមន្ត **ក្រឡាផ្ទៃបរិវត្ត $S$** ណាត្រឹមត្រូវ?",
      correctOption: `$S = 2\\pi\\int_a^b f(x)\\sqrt{1 + [f'(x)]^2}\\,dx$`,
      distractors: [
        `$S = 2\\pi\\int_a^b f(x)\\,dx$`,
        `$S = \\pi\\int_a^b [f(x)]^2\\sqrt{1 + [f'(x)]^2}\\,dx$`,
        `$S = 2\\pi\\int_a^b x\\sqrt{1 + [f'(x)]^2}\\,dx$`,
      ],
      hint: `ផ្ទៃបរិវត្តប្រើកំណាត់កោណស្តើង $dS = 2\\pi r\\,ds$ ដែលកាំ $r = f(x)$ និងប្រវែងធ្នូ $ds = \\sqrt{1 + [f'(x)]^2}\\,dx$។`,
      explanation: `ជុំវិញ $Ox$ មានកាំ $r = y = f(x)$ ដូច្នេះ $S = \\int 2\\pi r\\,ds = 2\\pi\\int_a^b f(x)\\sqrt{1 + [f'(x)]^2}\\,dx$។`,
    }),
    {
      id: `${prefix}-5`,
      difficulty: "Hard",
      type: "short-answer",
      question: `បង្វិលធ្នូរង្វង់ $y = \\sqrt{${R5 * R5} - x^2}$ លើ $[-${h5}, ${h5}]$ ជុំវិញអ័ក្ស $Ox$ បានក្រឡាផ្ទៃបរិវត្ត $S = k\\pi$។ រកតម្លៃ $k$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលតម្លៃ k...",
      expectedAnswers: [`${coef5}`],
      hint: `សម្រួល $y\\sqrt{1 + (y')^2} = \\sqrt{${R5 * R5} - x^2}\\cdot\\frac{${R5}}{\\sqrt{${R5 * R5} - x^2}} = ${R5}$ រួចគណនា $2\\pi\\int_{-${h5}}^{${h5}} ${R5}\\,dx$។`,
      explanation: `$S = 2\\pi\\int_{-${h5}}^{${h5}} ${R5}\\,dx = 2\\pi(${R5})(${2 * h5}) = ${coef5}\\pi \\implies k = ${coef5}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-6`,
      difficulty: "Hard",
      question: `គណនាក្រឡាផ្ទៃបរិវត្តពេលបង្វិលខ្សែកោង $y = 2\\sqrt{x}$ លើ $[0, ${b6}]$ ជុំវិញអ័ក្ស $Ox$៖`,
      correctOption: `$${fmtFrac(num6, 3)}\\pi$`,
      distractors: [
        `$${fmtFrac(num6, 6)}\\pi$`,
        `$${fmtFrac(8 * m6 * m6 * m6, 3)}\\pi$`,
        `$${4 * b6}\\pi$`,
      ],
      hint: `$y' = \\frac{1}{\\sqrt{x}} \\implies y\\sqrt{1 + (y')^2} = 2\\sqrt{x}\\sqrt{1 + \\frac{1}{x}} = 2\\sqrt{x + 1}$។`,
      explanation: `$S = 4\\pi\\int_0^{${b6}} \\sqrt{x + 1}\\,dx = \\frac{8\\pi}{3}\\bigl((${b6 + 1})^{3/2} - 1\\bigr) = ${fmtFrac(num6, 3)}\\pi$។`,
    }),
  ];
}

function gen7_1(rng, prefix) {
  const k = randInt(rng, 2, 6);
  const p = randInt(rng, 2, 5);
  const m = randInt(rng, 2, 9);
  const a = randInt(rng, 2, 5);
  // Q4: int_0^1 m * x * e^x dx = m * [x e^x - e^x]_0^1 = m * (0 - (-1)) = m
  return [
    buildMcq(rng, {
      id: `${prefix}-1`,
      difficulty: "Easy",
      question: `តាមក្បួន **LIATE** ដើម្បីគណនា $\\int x^{${p}} \\ln x\\,dx$ ដោយផ្នែក តើគួរជ្រើស $u$ និង $dv$ យ៉ាងដូចម្តេច?`,
      correctOption: `$u = \\ln x$ និង $dv = x^{${p}}\\,dx$`,
      distractors: [
        `$u = x^{${p}}$ និង $dv = \\ln x\\,dx$`,
        `$u = x^{${p}}\\ln x$ និង $dv = dx$`,
        `$u = \\frac{1}{x}$ និង $dv = x^{${p + 1}}\\,dx$`,
      ],
      hint: `ក្នុង LIATE អក្សរ **L** (Logarithmic) មកមុន **A** (Algebraic)!`,
      explanation: `ជ្រើស $u = \\ln x$ ($du = \\frac{1}{x}\\,dx$) និង $dv = x^{${p}}\\,dx$ ($v = \\frac{x^{${p + 1}}}{${p + 1}}$) ធ្វើឱ្យអាំងតេក្រាលថ្មីងាយគណនាបំផុត។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-2`,
      difficulty: "Easy",
      question: `ប្រើអាំងតេក្រាលដោយផ្នែកគណនា $\\int x e^{${k}x}\\,dx$ លើ $\\mathbb{R}$៖`,
      correctOption: `$\\frac{x}{${k}}e^{${k}x} - \\frac{1}{${k * k}}e^{${k}x} + C$`,
      distractors: [
        `$\\frac{x}{${k}}e^{${k}x} + \\frac{1}{${k * k}}e^{${k}x} + C$`,
        `$${k}x e^{${k}x} - ${k * k}e^{${k}x} + C$`,
        `$\\frac{x}{${k}}e^{${k}x} - \\frac{1}{${k}}e^{${k}x} + C$`,
      ],
      hint: `តាង $u = x$ ($du = dx$) និង $dv = e^{${k}x}\\,dx$ ($v = \\frac{1}{${k}}e^{${k}x}$)។`,
      explanation: `$uv - \\int v\\,du = \\frac{x}{${k}}e^{${k}x} - \\frac{1}{${k}}\\int e^{${k}x}\\,dx = \\frac{x}{${k}}e^{${k}x} - \\frac{1}{${k * k}}e^{${k}x} + C$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-3`,
      difficulty: "Medium",
      question: `ប្រើអាំងតេក្រាលដោយផ្នែកគណនា $\\int x\\cos(${a}x)\\,dx$ លើ $\\mathbb{R}$៖`,
      correctOption: `$\\frac{x}{${a}}\\sin(${a}x) + \\frac{1}{${a * a}}\\cos(${a}x) + C$`,
      distractors: [
        `$\\frac{x}{${a}}\\sin(${a}x) - \\frac{1}{${a * a}}\\cos(${a}x) + C$`,
        `$-\\frac{x}{${a}}\\sin(${a}x) + \\frac{1}{${a * a}}\\cos(${a}x) + C$`,
        `$${a}x\\sin(${a}x) + \\cos(${a}x) + C$`,
      ],
      hint: `តាង $u = x$ ($du = dx$) និង $dv = \\cos(${a}x)\\,dx$ ($v = \\frac{1}{${a}}\\sin(${a}x)$)។`,
      explanation: `$\\frac{x}{${a}}\\sin(${a}x) - \\frac{1}{${a}}\\int \\sin(${a}x)\\,dx = \\frac{x}{${a}}\\sin(${a}x) + \\frac{1}{${a * a}}\\cos(${a}x) + C$។`,
    }),
    {
      id: `${prefix}-4`,
      difficulty: "Medium",
      type: "short-answer",
      question: `ប្រើអាំងតេក្រាលដោយផ្នែកគណនាអាំងតេក្រាលកំណត់ $\\int_0^1 ${m}x e^x\\,dx$ (បំពេញជាលេខ)។`,
      placeholder: "បញ្ចូលចម្លើយជាលេខ...",
      expectedAnswers: [`${m}`],
      hint: `ដោយ $\\int x e^x\\,dx = (x - 1)e^x + C$, គណនា $${m}\\Big[(x - 1)e^x\\Big]_0^1$។`,
      explanation: `$${m}\\Big[(x - 1)e^x\\Big]_0^1 = ${m}\\bigl[0 - (-1)\\bigr] = ${m}$។`,
    },
    buildMcq(rng, {
      id: `${prefix}-5`,
      difficulty: "Hard",
      question: `ប្រើវិធីតារាង (Tabular IBP) គណនា $\\int x^2 e^{${a}x}\\,dx$ លើ $\\mathbb{R}$៖`,
      correctOption: `$e^{${a}x}\\left(\\frac{x^2}{${a}} - \\frac{2x}{${a * a}} + \\frac{2}{${a * a * a}}\\right) + C$`,
      distractors: [
        `$e^{${a}x}\\left(\\frac{x^2}{${a}} + \\frac{2x}{${a * a}} + \\frac{2}{${a * a * a}}\\right) + C$`,
        `$e^{${a}x}\\left(\\frac{x^2}{${a}} - \\frac{x}{${a * a}} + \\frac{1}{${a * a * a}}\\right) + C$`,
        `$e^{${a}x}\\left(${a}x^2 - ${2 * a}x + 2\\right) + C$`,
      ],
      hint: `ជួរឈរ D៖ $x^2, 2x, 2, 0$ ; ជួរឈរ I៖ $e^{${a}x}, \\frac{e^{${a}x}}{${a}}, \\frac{e^{${a}x}}{${a * a}}, \\frac{e^{${a}x}}{${a * a * a}}$ ដោយសញ្ញាឆ្លាស់ $+, -, +$។`,
      explanation: `តាមវិធីតារាង៖ $+\\frac{x^2 e^{${a}x}}{${a}} - \\frac{2x e^{${a}x}}{${a * a}} + \\frac{2 e^{${a}x}}{${a * a * a}} + C$។`,
    }),
    buildMcq(rng, {
      id: `${prefix}-6`,
      difficulty: "Hard",
      question: `ប្រើអាំងតេក្រាលដោយផ្នែកវិលជុំ (Cyclic IBP) គណនា $\\int e^{${k}x}\\sin(${k}x)\\,dx$៖`,
      correctOption: `$\\frac{e^{${k}x}}{${2 * k}}\\bigl(\\sin(${k}x) - \\cos(${k}x)\\bigr) + C$`,
      distractors: [
        `$\\frac{e^{${k}x}}{${2 * k}}\\bigl(\\sin(${k}x) + \\cos(${k}x)\\bigr) + C$`,
        `$\\frac{e^{${k}x}}{${k}}\\bigl(\\sin(${k}x) - \\cos(${k}x)\\bigr) + C$`,
        `$\\frac{e^{${k}x}}{${2 * k}}\\bigl(\\cos(${k}x) - \\sin(${k}x)\\bigr) + C$`,
      ],
      hint: `អនុវត្តដោយផ្នែក ២ ដងដើម្បីទទួលបានសមីការ $I = \\dots - I \\implies 2I = \\dots$។`,
      explanation: `បន្ទាប់ពីអនុវត្តដោយផ្នែក ២ ដង បាន $2I = \\frac{e^{${k}x}}{${k}}(\\sin(${k}x) - \\cos(${k}x)) \\implies I = \\frac{e^{${k}x}}{${2 * k}}(\\sin(${k}x) - \\cos(${k}x)) + C$។`,
    }),
  ];
}

/**
 * Fallback: shuffles curated exercises and MCQ options deterministically for any sub-topic
 */
function shuffleFallback(rng, baseExercises, prefix) {
  const shuffled = shuffleWithRng(rng, baseExercises);
  return shuffled.map((ex, idx) => {
    const diff = idx < 2 ? "Easy" : idx < 4 ? "Medium" : "Hard";
    if (ex.type === "mcq" && Array.isArray(ex.options)) {
      const correctText = ex.options[ex.correctIndex];
      const newOpts = shuffleWithRng(rng, ex.options);
      return {
        ...ex,
        id: `${prefix}-${idx + 1}`,
        difficulty: ex.difficulty || diff,
        options: newOpts,
        correctIndex: newOpts.indexOf(correctText),
      };
    }
    return {
      ...ex,
      id: `${prefix}-${idx + 1}`,
      difficulty: ex.difficulty || diff,
    };
  });
}

/**
 * Returns the 6 exercises for a given round:
 * - Round 1: returns baseExercises annotated with Easy/Medium/Hard progression (2 Easy, 2 Medium, 2 Hard)
 * - Round 2+: generates a fresh, deterministic set of 6 varied exercises ordered Easy -> Medium -> Hard
 */
export function getExercisesForRound(baseExercises = [], progressKey = "", round = 1) {
  if (round <= 1) {
    return baseExercises.map((ex, idx) => ({
      ...ex,
      difficulty:
        ex.difficulty ||
        (idx < Math.ceil(baseExercises.length / 3)
          ? "Easy"
          : idx < Math.ceil((2 * baseExercises.length) / 3)
          ? "Medium"
          : "Hard"),
    }));
  }

  const rng = mulberry32(hashString(`${progressKey}::round-${round}`));
  const prefix = `gen-${progressKey}-r${round}`;

  // Extract subTopic id suffix (e.g. "calc1-03-3.4" -> "3.4")
  const match = /(\d+\.\d+)$/.exec(progressKey || "");
  const subId = match ? match[1] : "";

  if (subId === "1.1" || subId === "1.2" || subId === "1.3") return gen1_1(rng, prefix);
  if (subId.startsWith("2.")) return gen2_all(rng, prefix);
  if (subId === "3.1") return gen3_1(rng, prefix);
  if (subId === "3.2") return gen3_2(rng, prefix);
  if (subId === "3.3") return gen3_3(rng, prefix);
  if (subId === "3.4") return gen3_4(rng, prefix);
  if (subId === "4.1") return gen4_1(rng, prefix);
  if (subId === "4.2") return gen4_2(rng, prefix);
  if (subId === "4.3") return gen4_3(rng, prefix);
  if (subId === "4.4") return gen4_4(rng, prefix);
  if (subId === "5.1") return gen5_1(rng, prefix);
  if (subId === "5.2") return gen5_2(rng, prefix);
  if (subId === "5.3") return gen5_3(rng, prefix);
  if (subId === "6.1") return gen6_1(rng, prefix);
  if (subId === "6.2") return gen6_2(rng, prefix);
  if (subId === "6.3") return gen6_3(rng, prefix);
  if (subId === "7.1") return gen7_1(rng, prefix);

  return shuffleFallback(rng, baseExercises, prefix);
}
