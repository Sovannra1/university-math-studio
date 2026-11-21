# PROJECT_GUIDELINES.md - University Mathematics Interactive Web App

## 1. Project Overview & Target Audience
- **Goal:** Build an interactive, modular Web App for university-level mathematics instruction and self-study.
- **Target Users:** University Professors (for classroom presentations) and Undergraduate Students (for interactive learning, visualization, and practice).
- **Primary Content Language:** Khmer (with standard English mathematical terminology in parentheses, or kept in English where no standard Khmer term exists).
- **Core Subjects Covered:**
  1. `calculus` (Calculus I, II, III - Limits, Derivatives, Integrals, Multivariable)
  2. `real-analysis` (វិភាគចំនួនពិត - Sequences, Series, Continuity, Metric Spaces, Riemann Integration)
  3. `algebra` (ពីជគណិត - Linear Algebra, Abstract Algebra, Groups, Rings, Vector Spaces)
  4. `topology` (តូប៉ូវិទ្យា - Open/Closed Sets, Continuity, Compactness, Connectedness, Homeomorphisms)

---

## 2. Tech Stack & Libraries
- **Framework:** React / Next.js (App Router)
- **Styling:** Tailwind CSS (Clean, academic, distraction-free UI; ensure proper line-height and font support for Khmer script like `Noto Sans Khmer` or `Kantumruy Pro`).
- **Math Rendering:** `KaTeX` via `MathText.jsx` (inline `\(...\)` or `$...$`, and block `$$...$$` or `\[...\]`).
- **Interactive Visualization:**
  - `SlideGraph.jsx` (Built-in interactive SVG/visual presets embedded directly inside slides)
  - `GraphLab.jsx` (Interactive 2D plots with parameter sliders `a, b, c, x0, epsilon, delta`)
- **Icons:** `Lucide-React`

---

## 3. Directory & Modular Architecture
Strictly separate UI components from Lesson Data so new lessons can be added incrementally without modifying core code.

```text
/src
  /components
    /common          # MathText.jsx (KaTeX + Markdown renderer)
    /layout          # Sidebar (Subject & Lesson selector), Header, Navigation
    /lesson-tabs     # The 5 core tabs for every lesson (in exact order):
      1. SlideViewer.jsx       # ស្លាយបង្រៀន: Fullscreen presentation mode, modern auto-animations, arrow-key nav, laser/pen
         - SlideGraph.jsx      # Visual graph presets embedded in slides
      2. GraphLab.jsx          # មន្ទីរពិសោធន៍ក្រាប: Interactive plots with parameter sliders
      3. DetailedReading.jsx   # ឯកសារអានលម្អិត: Theory per concept + per-concept worked examples + combined worked examples
         - WorkedExamples.jsx  # Accordion step-by-step proof/solution reveal
      4. PracticeQuiz.jsx      # លំហាត់អនុវត្តន៍: Interactive MCQ & Short-Answer with hints & explanations
      5. VideoTutorial.jsx     # វីដេអូបង្រៀន: Responsive YouTube embed + clickable timestamps
  /data
    /calculus        # e.g., calc1-01-functions.json, calc1-02-limits.json
    /real-analysis
    /algebra
    /topology
    subjects.json    # Master index mapping subjects to their respective lesson JSON files
```

---

## 4. Pedagogical & Content Standards (Per Sub-Topic)

### A. 5-Tab Standard Order
Every sub-topic (`subTopics[]`) MUST provide complete data for all 5 tabs in this exact conceptual order:
1. **ស្លាយបង្រៀន (`slides`)**
2. **មន្ទីរពិសោធន៍ក្រាប (`graphConfig`)**
3. **ឯកសារអានលម្អិត (`detailedReading` + `workedExamples`)**
4. **លំហាត់អនុវត្តន៍ (`practiceExercises`)**
5. **វីដេអូបង្រៀន (`videos`)**

### B. Slide Deck Pacing & Count (`slides`)
- **Duration & Length:** **18–25 slides per sub-topic**, designed for a **2–3 hour university lecture** (e.g., 4 sub-topics = ~9 hours total).
- **Pedagogical Progression:**
  1. **Hook & Learning Objectives (`objective`)**: Real-world/mathematical motivation + clear objectives.
  2. **Concept / Intuition (`intuition`)**: Intuitive explanation ("គោលគំនិត" / "បញ្ញត្តិ"), numerical tables, geometric intuition, and `visualGraph` presets.
  3. **Formal Definitions & Theorems (`definition`)**: Rigorous mathematical definitions, notations, existence conditions, and key theorems.
  4. **Scaffolded Worked Examples (`example`)**: Progress from **Easy → Medium → Hard** (at least 3–5 examples across the deck) using `exampleSteps` for step-by-step classroom reveal.
  5. **In-Class Quick Checks (`practice`)**: Short 2–3 minute student checks placed after major concepts, using `practiceAnswer` for instant reveal.
  6. **Common Pitfalls & Summary (`summary`)**: Highlight common student mistakes, exam tips, and next steps.
- **Projection Readability:** Keep each slide focused on one clear idea (3–5 concise bullets per slide). Use `formulaBox` for key equations, `visualGraph` for diagrams, and `teacherNotes` for lecturer guidance.

### C. Detailed Reading & Worked Examples (`detailedReading` + `workedExamples`)
- **Per-Concept Worked Examples:** Every section in `detailedReading.sections[]` MUST include detailed, easy-to-understand explanations AND its own dedicated `examples[]` right underneath the theory (one concept -> one or more worked examples).
- **Combined Worked Examples:** Place multi-concept / exam-style problems in the top-level `workedExamples[]` array (rendered at the bottom of the Reading tab as "លំហាត់គំរូរួម").

### D. Practice Exercises (`practiceExercises`)
- Include at least **5 interactive exercises** per sub-topic (mix of `"mcq"` and `"short-answer"`), each with `hint` and `explanation`.

### E. Video Tutorials (`videos`)
- Always leave `"youtubeId": ""` empty unless the user provides a specific YouTube ID, and include realistic `timestamps`.

---

## 5. Standard Lesson JSON Schema

```json
{
  "id": "calc1-02",
  "subject": "calculus",
  "titleKh": "មេរៀនទី ២៖ លីមីត និងភាពជាប់នៃអនុគមន៍",
  "titleEn": "Limits and Continuity",
  "subTopics": [
    {
      "id": "2.1",
      "titleKh": "២.១ គោលគំនិត និងនិយមន័យផ្លូវការ (Epsilon-Delta Definition)",
      "titleEn": "Concept & Epsilon-Delta Definition",
      "slides": [
        {
          "slideNumber": 1,
          "slideType": "objective",
          "heading": "គោលបំណងសិក្សា",
          "formulaBox": "\\(\\lim_{x \\to a} f(x) = L\\)",
          "bullets": [
            "**គោលបំណងទី ១៖** យល់ពីគោលគំនិតនៃលីមីត..."
          ],
          "visualGraph": {
            "preset": "hole-limit",
            "captionKh": "ការពណ៌នាក្រាប"
          },
          "exampleSteps": [
            "**ជំហានទី ១៖** ..."
          ],
          "practiceAnswer": "**ចម្លើយ៖** ...",
          "teacherNotes": "កំណត់សម្គាល់សម្រាប់គ្រូបង្រៀន..."
        }
      ],
      "graphConfig": {
        "type": "function-2d",
        "defaultEquation": "a * x^2 + b",
        "sliders": [
          { "variable": "a", "min": -2, "max": 2, "step": 0.1, "default": 0.5, "label": "មេគុណកោង a" }
        ],
        "instructionsKh": "ការណែនាំ..."
      },
      "workedExamples": [
        {
          "id": "ex-2-1-a",
          "difficulty": "Medium",
          "problem": "ចូរស្រាយបញ្ជាក់...",
          "steps": ["ជំហានទី ១៖ ..."]
        }
      ],
      "practiceExercises": [
        {
          "id": "prac-2-1-1",
          "type": "mcq",
          "question": "...",
          "options": ["\\(1\\)", "\\(2\\)"],
          "correctIndex": 0,
          "hint": "...",
          "explanation": "..."
        }
      ],
      "videos": [
        {
          "title": "២.១ វីដេអូបង្រៀន៖ ...",
          "youtubeId": "",
          "timestamps": [
            { "time": "00:00", "label": "គោលគំនិតនៃលីមីត" }
          ]
        }
      ],
      "detailedReading": {
        "sections": [
          {
            "subHeading": "១. គោលគំនិតនៃលីមីត",
            "content": "ការពន្យល់លម្អិត...",
            "examples": [
              {
                "id": "read-ex-2-1-1",
                "difficulty": "Easy",
                "problem": "...",
                "steps": ["ជំហានទី ១៖ ..."]
              }
            ]
          }
        ]
      }
    }
  ],
  "chapterChallenge": {
    "titleKh": "លំហាត់សំយោគបញ្ចប់មេរៀន...",
    "titleEn": "Chapter Mastery & Deep Thinking",
    "descriptionKh": "លំហាត់ហ្វឹកហាត់ការគិតស៊ីជម្រៅប្រចាំមេរៀន...",
    "exercises": [
      {
        "id": "ch1-1",
        "level": "synthesis",
        "topicTag": "ដែនកំណត់ & លោការីត",
        "type": "mcq",
        "question": "...",
        "options": ["...", "..."],
        "correctIndex": 0,
        "hint": "...",
        "explanation": "..."
      },
      {
        "id": "ch1-4",
        "level": "analytical",
        "topicTag": "អនុគមន៍ច្រាស",
        "type": "proof",
        "question": "...",
        "hint": "...",
        "steps": ["..."],
        "finalAnswer": "...",
        "keyTakeaway": "..."
      }
    ]
  }
}
```

Supported `slideType` values in `SlideViewer.jsx`: `"objective"`, `"intuition"`, `"definition"`, `"example"`, `"practice"`, `"summary"`.
Supported `chapterChallenge.exercises[].level` values in `ChapterChallengeView.jsx`: `"synthesis"`, `"analytical"`, `"challenge"`.
Supported `chapterChallenge.exercises[].type` values: `"mcq"`, `"short-answer"`, `"proof"`. When `chapterChallenge` is present on a lesson JSON, `Sidebar.jsx` automatically renders a **🏆 លំហាត់បញ្ចប់មេរៀន (ស៊ីជម្រៅ)** entry at the bottom of that lesson's sub-topics (`__chapter_challenge__`).

---

## 6. Rules for AI (Antigravity) When Editing or Generating Code
1. **Context First:** Always read `PROJECT_GUIDELINES.md` before creating new files or modifying architecture.
2. **Component Isolation:** When asked to fix a bug or improve a feature, ONLY modify the specific component/data requested. Do not rewrite unrelated files.
3. **Math & KaTeX Formatting:**
   - Always double-escape backslashes in JSON strings for LaTeX (e.g., `\\frac{a}{b}`, `\\mathbb{R}`, `\\forall`, `\\exists`).
   - **NEVER** place LaTeX commands (such as `\quad`, `\implies`, `\neq`) outside `\(...\)` or `$$...$$` delimiters, otherwise KaTeX will render literal text.
4. **Khmer Terminology:**
   - Translate *Concept* as **«គោលគំនិត»** or **«បញ្ញត្តិ»** (NEVER use «គំនិតវិចារណញ្ញាណ»).
   - Translate *candidate points* as **«ចំណុចត្រូវពិនិត្យ»** (NEVER use «បេក្ខជន»).
   - Translate *Corollary* (*Corollaire*) as **«វិបាក»** (NEVER use «ផលវិបាក»).
   - Keep standard English mathematical terms in parentheses or in English if no standard Khmer translation exists.
5. **Khmer Typography:** Ensure all UI text and reading sections use clean Khmer font styling (`leading-relaxed`, adequate padding) so Khmer vowels and subscripts do not get clipped.
6. **Build Verification (Windows):** Run `npm.cmd run build` (not `npm run build` in PowerShell if execution policy blocks `.ps1`) and validate JSON syntax after data edits.
7. **Web App Versioning Rule (`package.json` & `src/lib/appConfig.js`):**
   - Increment `version` in `package.json` and `APP_VERSION` in `src/lib/appConfig.js` (e.g., `v0.1.1` → `v0.1.2`) **whenever the Web App system, UI, or features are modified**.
   - **Do NOT** bump the Web App version while authoring or adding new lesson content for an unfinished book.
   - Only bump the version for content edits when a book has already been **completed** and its content is later **revised/updated**.
8. **Lesson Authoring Standard (Permanent Default — applies whenever the user gives only a lesson/sub-topic title):**
   - **Sets & Intervals Notation (English/International Standard as Primary):** Always use standard English interval and set notation: `(a, b)`, `[a, b]`, `[a, b)`, `(a, b]`, `(-\infty, a)`, `(a, +\infty)`, `\mathbb{R} \setminus \{a\}`, `\mathbb{N}, \mathbb{N}^*, \mathbb{Z}, \mathbb{Q}, \mathbb{R}, \mathbb{C}`.
   - **Pedagogy, Proofs, Structure & Exercises (French Textbook Rigor):** Write Khmer explanations, proofs, and exercises with French mathematical textbook rigor — explicitly state hypotheses and domain of definition/differentiability on intervals $I, J$, structure as Theorem → Proof → Corollary → Method → Application, include counterexamples for common mistakes, and factor/simplify final derivatives for sign study.
   - **No Explicit Style Labels:** Do **NOT** write labels like `"បែបគណិតវិទ្យាបារាំង"`, `"វិធីបារាំង"`, or `"បទដ្ឋានបារាំង"` inside the lesson content itself; present everything naturally as universal mathematics.
   - **`MathText.jsx` Formatting Compatibility:** In `detailedReading`, `slides`, `workedExamples`, and `practiceExercises`, ONLY use KaTeX (`$...$`, `$$...$$`), `**bold**`, `` `code` ``, paragraphs separated by `\n\n`, and `• ` bullet points. **NEVER** use raw Markdown `####`/`###` headings, `>` blockquotes, `*italic*` single asterisks, `- ` dash lists, or `|---|` Markdown tables. Always set `difficulty` to `"Easy"`, `"Medium"`, or `"Hard"`.
   - **Complete Sub-Topic Deliverables:** Unless requested otherwise, each authored sub-topic includes `20` concise projector-friendly `slides` (with existing `SlideGraph.jsx` presets where visually helpful), `4–5` thorough `detailedReading.sections[]` with per-concept `examples[]`, `3` synthesis `workedExamples[]`, `6` `practiceExercises[]` (`mcq` with 0-based `correctIndex` + `short-answer` with `expectedAnswers`), and `1` `videos[]` outline.
