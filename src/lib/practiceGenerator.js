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

  return shuffleFallback(rng, baseExercises, prefix);
}
