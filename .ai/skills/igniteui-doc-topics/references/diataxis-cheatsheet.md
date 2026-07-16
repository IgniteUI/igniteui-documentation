# Diátaxis cheat-sheet

Condensed from https://diataxis.fr (tutorials, how-to, reference, explanation, compass).
This is the *reasoning layer*. For how the four modes attach to Ignite UI sections, see
`house-style.md`. Read this whenever you're unsure what kind of content a topic — or a single
section — should be.

## The compass (use this first, every time)

Two questions decide the mode. Ask them of the *content in front of you* or the *user need*:

| If the content…   | …and serves the user's… | …then it is… |
| ----------------- | ----------------------- | ------------ |
| informs **action**    | **acquisition** of skill (study) | a **tutorial** |
| informs **action**    | **application** of skill (work)  | a **how-to guide** |
| informs **cognition** | **application** of skill (work)  | **reference** |
| informs **cognition** | **acquisition** of skill (study) | **explanation** |

- *action* = doing, practical steps. *cognition* = thinking, propositional knowledge.
- *acquisition* = study/learning. *application* = getting real work done.

Apply the compass at any zoom level: a whole topic, a section, even a sentence. When a section
"feels off," run the compass on it — usually it has drifted into a second mode.

## The four modes at a glance

| Mode | Serves | Question it answers | Cardinal rule | Voice |
|------|--------|---------------------|---------------|-------|
| **Tutorial** | learning by doing | "Teach me, hold my hand" | Ruthlessly minimise explanation; guarantee success | "In this tutorial *we* will…" |
| **How-to guide** | a competent user's task | "Help me get X done" | Action only; no teaching, no digression | "To achieve X, do Y." |
| **Reference** | look-up during work | "What exactly is X / its options?" | Describe and *only* describe; be austere | "The `value` property accepts a number 0–5." |
| **Explanation** | understanding a topic | "Tell me about X / why?" | Discuss, connect, weigh alternatives; stay bounded | "X exists because… An alternative is…" |

### Tutorial — learning-oriented
A lesson. The learner learns *by doing*, under guidance, toward a meaningful, guaranteed-to-succeed
result. Show where they'll end up; deliver visible results early and often; keep a narrative of the
expected ("after a moment you'll see…"); ignore options and alternatives; minimise explanation (link
out instead). Reliability is sacred — it must work for every reader, every time.

### How-to guide — task/goal-oriented
Directions that guide an already-competent user through a real-world problem. Defined by the *user's
goal*, not by the machinery ("How to validate a reactive form," not "The validation API"). A sequence
with flow. Omit the unnecessary; usability beats completeness. Title says exactly what it shows
("How to…"). This is a recipe, not a cooking lesson.

### Reference — information-oriented
Neutral, authoritative technical description of the machinery — properties, methods, events, options.
Structured to mirror the code. Austere: you *consult* it, you don't read it. No instruction, no
opinion, no explanation — link out for those. Tables and examples are ideal. Best when
auto-generated from the typed source so it never drifts.

### Explanation — understanding-oriented
Discursive treatment of a topic that permits reflection. Higher, wider view than the other three.
Answers "Can you tell me about…?" and "Why…?". Make connections, give context and history, weigh
alternatives and admit opinion. Name it with an implicit *"About …"* in front of the title. Keep it
bounded — it tends to absorb instruction and reference that belong elsewhere.

## The two classic confusions (where writers go wrong)

1. **Tutorial vs how-to.** Same steps, different need. A tutorial *teaches* a beginner (success
   guaranteed, no choices, minimal why). A how-to serves a competent user getting a *specific job*
   done (adaptable, may fork, assumes background). Don't merge them.
2. **Reference vs explanation.** Reference *describes* (cognition + work): austere, neutral, complete.
   Explanation *illuminates* (cognition + study): discursive, contextual, opinionated. A properties
   table is reference; "why the component works this way" is explanation. Keep them in separate
   sections and link between them.

## The golden rule

Each unit of documentation should serve **one** need in **one** mode. When two modes want to live in
the same section, split them and cross-link. In Ignite UI topics this happens at the *section* level —
see the composite-topic principle in `SKILL.md`.
