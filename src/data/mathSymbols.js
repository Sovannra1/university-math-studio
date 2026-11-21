/**
 * Mathematical Notation & Symbols Reference
 * - Sets & Intervals follow English/International standard as primary: (a, b), [a, b], [a, b), (a, b]
 *   with a helpful note for equivalent French bracket notation ]a, b[.
 * - Organized into universal common groups + subject-specific groups.
 */

export const COMMON_SYMBOL_GROUPS = [
  {
    id: "sets-intervals",
    titleKh: "សំណុំចំនួន និងចន្លោះ",
    titleEn: "Sets & Intervals",
    noteKh:
      "ចំណាំ៖ ក្នុងប្រព័ន្ធមេរៀននេះ យើងប្រើទម្រង់ចន្លោះអង់គ្លេស (a, b), [a, b) ជាគោល (សមមូលនឹងទម្រង់បារាំង ]a, b[, [a, b[ ក្នុងឯកសារខ្លះ)។",
    items: [
      {
        symbol: "$\\mathbb{N}, \\; \\mathbb{N}^*$",
        nameKh: "សំណុំចំនួនគត់ធម្មជាតិ",
        meaningKh: "$\\mathbb{N} = \\{0, 1, 2, \\dots\\}$ និង $\\mathbb{N}^* = \\{1, 2, 3, \\dots\\}$",
        example: "$n \\in \\mathbb{N}^*$",
      },
      {
        symbol: "$\\mathbb{Z}$",
        nameKh: "សំណុំចំនួនគត់រ៉ឺឡាទីប",
        meaningKh: "$\\{\\dots, -2, -1, 0, 1, 2, \\dots\\}$",
        example: "$k \\in \\mathbb{Z}$",
      },
      {
        symbol: "$\\mathbb{Q}$",
        nameKh: "សំណុំចំនួនសនិទាន",
        meaningKh: "ចំនួនអាចសរសេរជាប្រភាគ $\\frac{p}{q}$ ($p \\in \\mathbb{Z}, q \\in \\mathbb{N}^*$)",
        example: "$\\frac{3}{4} \\in \\mathbb{Q}$",
      },
      {
        symbol: "$\\mathbb{R}, \\; \\mathbb{R}^*$",
        nameKh: "សំណុំចំនួនពិត",
        meaningKh: "$\\mathbb{R} = (-\\infty, +\\infty)$ និង $\\mathbb{R}^* = \\mathbb{R} \\setminus \\{0\\}$",
        example: "$x \\in \\mathbb{R}$",
      },
      {
        symbol: "$\\mathbb{C}$",
        nameKh: "សំណុំចំនួនកុំផ្លិច",
        meaningKh: "ចំនួនទម្រង់ $a + bi$ ដែល $a, b \\in \\mathbb{R}, \\; i^2 = -1$",
        example: "$z = 2 + 3i \\in \\mathbb{C}$",
      },
      {
        symbol: "$(a, b)$",
        nameKh: "ចន្លោះបើក (Open Interval)",
        meaningKh: "$\\{x \\in \\mathbb{R} \\mid a < x < b\\}$ (សមមូលនឹង $]a, b[$)",
        example: "$x \\in (0, +\\infty)$",
      },
      {
        symbol: "$[a, b]$",
        nameKh: "ចន្លោះបិទ (Closed Interval)",
        meaningKh: "$\\{x \\in \\mathbb{R} \\mid a \\le x \\le b\\}$",
        example: "$x \\in [-1, 1]$",
      },
      {
        symbol: "$[a, b), \\; (a, b]$",
        nameKh: "ចន្លោះកន្លះបើក / កន្លះបិទ",
        meaningKh: "$a \\le x < b$ ឬ $a < x \\le b$ (សមមូលនឹង $[a, b[$ ឬ $]a, b]$)",
        example: "$x \\in [0, +\\infty)$",
      },
      {
        symbol: "$\\in, \\; \\notin$",
        nameKh: "ជាធាតុ / មិនមែនជាធាតុ",
        meaningKh: "បង្ហាញថាធាតុមួយស្ថិតក្នុង ឬមិនស្ថិតក្នុងសំណុំ",
        example: "$2 \\in \\mathbb{R}, \\; 0 \\notin \\mathbb{R}^*$",
      },
      {
        symbol: "$\\subset, \\; \\subseteq$",
        nameKh: "សំណុំរង (Subset)",
        meaningKh: "គ្រប់ធាតុនៃសំណុំទី ១ ស្ថិតក្នុងសំណុំទី ២",
        example: "$\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$",
      },
      {
        symbol: "$\\cup, \\; \\cap, \\; \\setminus$",
        nameKh: "ប្រជុំ ប្រសព្វ និងផលដកសំណុំ",
        meaningKh: "$A \\cup B$ (ឬ), $A \\cap B$ (និង), $A \\setminus B$ (ដកចេញ)",
        example: "$\\mathbb{R} \\setminus \\{1\\} = (-\\infty, 1) \\cup (1, +\\infty)$",
      },
      {
        symbol: "$\\emptyset$",
        nameKh: "សំណុំទទេ (Empty Set)",
        meaningKh: "សំណុំដែលគ្មានធាតុណាមួយសោះ",
        example: "$S = \\emptyset$",
      },
    ],
  },
  {
    id: "logic-general",
    titleKh: "តក្កវិទ្យា និងសញ្ញាទូទៅ",
    titleEn: "Logic & General Symbols",
    items: [
      {
        symbol: "$\\forall$",
        nameKh: "ចំពោះគ្រប់ (For all)",
        meaningKh: "បរិមាណករសកល — ពិតសម្រាប់គ្រប់តម្លៃក្នុងសំណុំ",
        example: "$\\forall x \\in \\mathbb{R}, \\; x^2 \\ge 0$",
      },
      {
        symbol: "$\\exists, \\; \\exists!$",
        nameKh: "មានយ៉ាងតិចមួយ / មានតែមួយគត់",
        meaningKh: "បរិមាណករអត្ថិភាព ($\\exists!$: មានតែមួយគត់)",
        example: "$\\exists! x \\in \\mathbb{R} : 2x = 6$",
      },
      {
        symbol: "$\\implies$",
        nameKh: "នាំឱ្យ (Implies)",
        meaningKh: "បើ $P$ ពិត នោះ $Q$ ពិត",
        example: "មានដេរីវេ $\\implies$ ជាប់",
      },
      {
        symbol: "$\\iff$",
        nameKh: "លុះត្រាតែ / សមមូល (If and only if)",
        meaningKh: "សមមូលតក្កវិទ្យាទាំងពីរទិសដៅ",
        example: "$x^2 = 4 \\iff x = \\pm 2$",
      },
      {
        symbol: "$:=, \\; \\equiv$",
        nameKh: "កំណត់ដោយ / ដូចគ្នាទាំងស្រុង",
        meaningKh: "ប្រើសម្រាប់កំណត់និយមន័យ ឬអត្តសញ្ញាណ",
        example: "$f(x) := x^2 + 1$",
      },
      {
        symbol: "$\\approx, \\; \\neq$",
        nameKh: "ប្រហែលស្មើ / ខុសពី",
        meaningKh: "តម្លៃប្រហែល និងវិសមភាពខុសគ្នា",
        example: "$\\pi \\approx 3.1416, \\; x \\neq 0$",
      },
      {
        symbol: "$|x|$",
        nameKh: "តម្លៃដាច់ខាត (Absolute Value)",
        meaningKh: "ចម្ងាយពី $x$ ទៅ $0$ លើបន្ទាត់ចំនួនពិត",
        example: "$|x| < 1 \\iff -1 < x < 1$",
      },
      {
        symbol: "$\\sum, \\; \\prod$",
        nameKh: "ផលបូក និងផលគុណស៊េរី",
        meaningKh: "$\\sum_{k=1}^n a_k$ (ផលបូក) និង $\\prod_{k=1}^n a_k$ (ផលគុណ)",
        example: "$\\sum_{k=1}^n k = \\frac{n(n+1)}{2}$",
      },
    ],
  },
];

export const SUBJECT_SYMBOL_GROUPS = {
  calculus: [
    {
      id: "calc-functions-limits",
      titleKh: "អនុគមន៍ លីមីត និងភាពជាប់",
      titleEn: "Functions, Limits & Continuity",
      items: [
        {
          symbol: "$D_f, \\; \\mathcal{C}_f$",
          nameKh: "ដែនកំណត់ និងខ្សែកោងតាង",
          meaningKh: "$D_f$ ជាដែនកំណត់នៃ $f$ និង $\\mathcal{C}_f$ ជាក្រាបនៃ $f$",
          example: "$D_f = [0, +\\infty)$",
        },
        {
          symbol: "$g \\circ f$",
          nameKh: "អនុគមន៍បណ្តាក់ (Composition)",
          meaningKh: "$(g \\circ f)(x) = g(f(x))$",
          example: "$(g \\circ f)'(x) = g'(f(x))f'(x)$",
        },
        {
          symbol: "$f^{-1}$",
          nameKh: "អនុគមន៍ច្រាស (Inverse Function)",
          meaningKh: "$y = f(x) \\iff x = f^{-1}(y)$ (មិនមែន $\\frac{1}{f(x)}$ ទេ!)",
          example: "$\\arcsin = \\sin^{-1}$",
        },
        {
          symbol: "$\\lim_{x \\to a} f(x)$",
          nameKh: "លីមីតត្រង់ $a$",
          meaningKh: "តម្លៃដែល $f(x)$ ខិតទៅរកពេល $x$ ខិតជិត $a$",
          example: "$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$",
        },
        {
          symbol: "$x \\to a^-, \\; x \\to a^+$",
          nameKh: "លីមីតខាងឆ្វេង និងខាងស្តាំ",
          meaningKh: "$x$ ខិតជិត $a$ ដោយ $x < a$ ($a^-$) ឬ $x > a$ ($a^+$)",
          example: "$\\lim_{x \\to 0^+} \\frac{1}{x} = +\\infty$",
        },
        {
          symbol: "$\\pm\\infty$",
          nameKh: "អនន្ត (Infinity)",
          meaningKh: "តម្លៃធំ ឬតូចឥតដែនកំណត់ (មិនមែនជាចំនួនពិតទេ)",
          example: "$x \\to +\\infty$",
        },
      ],
    },
    {
      id: "calc-derivatives",
      titleKh: "ដេរីវេ និងឌីផេរ៉ង់ស្យែល",
      titleEn: "Derivatives & Differentials",
      items: [
        {
          symbol: "$f'(x), \\; y'$",
          nameKh: "ដេរីវេទី ១ (Lagrange)",
          meaningKh: "អត្រាបម្រែបម្រួលខណៈ ឬមេគុណប្រាប់ទិសបន្ទាត់ប៉ះ",
          example: "$(x^3)' = 3x^2$",
        },
        {
          symbol: "$\\frac{dy}{dx}, \\; \\frac{df}{dx}$",
          nameKh: "ដេរីវេទី ១ (Leibniz)",
          meaningKh: "បញ្ជាក់ច្បាស់ពីដេរីវេនៃ $y$ ធៀបនឹងអថេរ $x$",
          example: "$\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$",
        },
        {
          symbol: "$f''(x), \\; f^{(n)}(x)$",
          nameKh: "ដេរីវេទី ២ និងលំដាប់ $n$",
          meaningKh: "ដេរីវេបន្តបន្ទាប់នៃ $f$ ចំនួន $2$ ឬ $n$ ដង",
          example: "$f''(x) = \\frac{d^2y}{dx^2}$",
        },
        {
          symbol: "$f'_-(x_0), \\; f'_+(x_0)$",
          nameKh: "ដេរីវេខាងឆ្វេង និងខាងស្តាំ",
          meaningKh: "លីមីតផលធៀបកំណើនខាងឆ្វេង ($x \\to x_0^-$) និងខាងស្តាំ ($x \\to x_0^+$)",
          example: "$f'_-(0) = -1, \\; f'_+(0) = 1$",
        },
        {
          symbol: "$\\Delta x, \\; \\Delta y$",
          nameKh: "កំណើន (Increment)",
          meaningKh: "$\\Delta x = x_2 - x_1$ និង $\\Delta y = f(x_2) - f(x_1)$",
          example: "$m_{\\text{sec}} = \\frac{\\Delta y}{\\Delta x}$",
        },
        {
          symbol: "$\\frac{\\partial f}{\\partial x}, \\; \\nabla f$",
          nameKh: "ដេរីវេដោយផ្នែក និងក្រាដ្យង់",
          meaningKh: "ប្រើសម្រាប់អនុគមន៍ច្រើនអថេរ (Calculus III)",
          example: "$\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}\\right)$",
        },
      ],
    },
    {
      id: "calc-integrals",
      titleKh: "អាំងតេក្រាល និងស៊េរី",
      titleEn: "Integrals & Series",
      items: [
        {
          symbol: "$\\int f(x)\\,dx$",
          nameKh: "អាំងតេក្រាលមិនកំណត់",
          meaningKh: "គ្រួសារព្រីមីទីវ $F(x) + C$ ដែល $F'(x) = f(x)$",
          example: "$\\int 2x\\,dx = x^2 + C$",
        },
        {
          symbol: "$\\int_a^b f(x)\\,dx$",
          nameKh: "អាំងតេក្រាលកំណត់",
          meaningKh: "ផ្ទៃក្រឡាមានសញ្ញាក្រោមក្រាប $f$ លើ $[a, b]$",
          example: "$\\int_0^1 x\\,dx = \\frac{1}{2}$",
        },
        {
          symbol: "$\\sum_{n=0}^{\\infty} a_n$",
          nameKh: "ស៊េរីអនន្ត (Infinite Series)",
          meaningKh: "លីមីតនៃផលបូកដោយផ្នែក $S_N = \\sum_{n=0}^N a_n$",
          example: "$e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}$",
        },
        {
          symbol: "$n!$",
          nameKh: "ហ្វាក់តូរីយ៉ែល (Factorial)",
          meaningKh: "$n! = 1 \\cdot 2 \\cdots n$ ($0! = 1$)",
          example: "$4! = 24$",
        },
      ],
    },
  ],

  "linear-algebra": [
    {
      id: "la-vectors-matrices",
      titleKh: "វ៉ិចទ័រ ម៉ាទ្រីស និងលំហវ៉ិចទ័រ",
      titleEn: "Vectors, Matrices & Spaces",
      items: [
        {
          symbol: "$\\vec{v}, \\; \\mathbf{v} \\in \\mathbb{R}^n$",
          nameKh: "វ៉ិចទ័រក្នុង $\\mathbb{R}^n$",
          meaningKh: "ធាតុនៃលំហវ៉ិចទ័រ $n$ វិមាត្រ",
          example: "$\\mathbf{v} = (x_1, x_2, x_3)$",
        },
        {
          symbol: "$A^T, \\; A^{-1}$",
          nameKh: "ម៉ាទ្រីសត្រង់ស្ពូសេ និងម៉ាទ្រីសច្រាស",
          meaningKh: "ប្តូរជួរដេក-ឈរ ($A^T$) និងម៉ាទ្រីសដែល $AA^{-1} = I$",
          example: "$(AB)^{-1} = B^{-1}A^{-1}$",
        },
        {
          symbol: "$\\det(A), \\; \\text{tr}(A)$",
          nameKh: "ដេទែមីណង់ និងត្រាស",
          meaningKh: "ដេទែមីណង់ និងផលបូកធាតុលើអង្កត់ទ្រូងធំ",
          example: "$\\det(A) \\neq 0 \\iff A$ មានច្រាស",
        },
        {
          symbol: "$\\ker(T), \\; \\text{Im}(T)$",
          nameKh: "ស្នូល និងរូបភាពនៃបំប្លែងលីនេអ៊ែរ",
          meaningKh: "$\\ker(T) = \\{v \\mid T(v) = 0\\}$ និងជួរតម្លៃនៃ $T$",
          example: "$\\dim\\ker(T) + \\dim\\text{Im}(T) = n$",
        },
        {
          symbol: "$\\langle u, v \\rangle, \\; \\|v\\|$",
          nameKh: "ផលគុណស្កាលែ និងណម",
          meaningKh: "ផលគុណក្នុង និងប្រវែងនៃវ៉ិចទ័រ",
          example: "$\\|v\\| = \\sqrt{\\langle v, v \\rangle}$",
        },
      ],
    },
  ],

  ode: [
    {
      id: "ode-symbols",
      titleKh: "សមីការឌីផេរ៉ង់ស្យែល",
      titleEn: "Differential Equations",
      items: [
        {
          symbol: "$y', \\; y'', \\; y^{(n)}$",
          nameKh: "ដេរីវេធៀបនឹងអថេរឯករាជ្យ",
          meaningKh: "ដេរីវេលំដាប់ ១, ២, ..., $n$ នៃអនុគមន៍មិនស្គាល់ $y(x)$",
          example: "$y'' + 2y' + y = 0$",
        },
        {
          symbol: "$\\dot{x}, \\; \\ddot{x}$",
          nameKh: "ដេរីវេធៀបនឹងពេល $t$ (Newton)",
          meaningKh: "$\\dot{x} = \\frac{dx}{dt}$ (ល្បឿន), $\\ddot{x} = \\frac{d^2x}{dt^2}$ (សំទុះ)",
          example: "$m\\ddot{x} + kx = 0$",
        },
        {
          symbol: "$\\mathcal{L}\\{f(t)\\}$",
          nameKh: "បំប្លែង Laplace",
          meaningKh: "$F(s) = \\int_0^{\\infty} e^{-st} f(t)\\,dt$",
          example: "$\\mathcal{L}\\{1\\} = \\frac{1}{s}$",
        },
      ],
    },
  ],

  "probability-statistics": [
    {
      id: "prob-symbols",
      titleKh: "ប្រូបាប៊ីលីតេ និងស្ថិតិ",
      titleEn: "Probability & Statistics",
      items: [
        {
          symbol: "$\\Omega, \\; P(A)$",
          nameKh: "លំហគំរូ និងប្រូបាប៊ីលីតេ",
          meaningKh: "$\\Omega$ ជាសំណុំលទ្ធផលទាំងអស់ និង $0 \\le P(A) \\le 1$",
          example: "$P(\\Omega) = 1$",
        },
        {
          symbol: "$P(A \\mid B)$",
          nameKh: "ប្រូបាប៊ីលីតេមានលក្ខខណ្ឌ",
          meaningKh: "ប្រូបាប៊ីលីតេនៃ $A$ ដោយដឹងថា $B$ បានកើតឡើង",
          example: "$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$",
        },
        {
          symbol: "$E[X], \\; \\text{Var}(X)$",
          nameKh: "សង្ឃឹមគណិត និងវ៉ារ្យ៉ង់",
          meaningKh: "តម្លៃមធ្យមរំពឹងទុក និងរង្វាស់ការខ្ចាត់ខ្ចាយ",
          example: "$\\sigma = \\sqrt{\\text{Var}(X)}$",
        },
        {
          symbol: "$\\binom{n}{k}, \\; C_n^k$",
          nameKh: "បន្សំ (Binomial Coefficient)",
          meaningKh: "$\\frac{n!}{k!(n-k)!}$ ចំនួនរបៀបជ្រើស $k$ ពី $n$",
          example: "$\\binom{5}{2} = 10$",
        },
      ],
    },
  ],

  "logic-proofs": [
    {
      id: "logic-proof-symbols",
      titleKh: "តក្កវិទ្យា និងសម្រាយបញ្ជាក់",
      titleEn: "Logic & Proofs",
      items: [
        {
          symbol: "$\\neg P, \\; P \\land Q, \\; P \\lor Q$",
          nameKh: "បដិសេធ និង ឬ",
          meaningKh: "ប្រមាណវិធីតក្កវិទ្យាគ្រឹះលើសំណើ $P, Q$",
          example: "$\\neg(P \\land Q) \\iff (\\neg P) \\lor (\\neg Q)$",
        },
        {
          symbol: "$a \\mid b$",
          nameKh: "$a$ ចែកដាច់ $b$",
          meaningKh: "មាន $k \\in \\mathbb{Z}$ ដែល $b = ak$",
          example: "$3 \\mid 12$",
        },
        {
          symbol: "$a \\equiv b \\pmod n$",
          nameKh: "សមមូលម៉ូឌុយឡូ $n$",
          meaningKh: "$n \\mid (a - b)$",
          example: "$17 \\equiv 2 \\pmod 5$",
        },
      ],
    },
  ],
};

export function getSymbolGroupsForSubject(subjectId) {
  const specific = SUBJECT_SYMBOL_GROUPS[subjectId] || SUBJECT_SYMBOL_GROUPS.calculus;
  return [...COMMON_SYMBOL_GROUPS, ...specific];
}
