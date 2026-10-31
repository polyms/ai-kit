# PRD: Knowledge catalog visual redesign

## Problem Statement

A signed-out engineer or agent operator reads published Knowledge on the Kit site. They search by topic or
symptom, narrow by Knowledge intent, and open a Knowledge article. The catalog already does this, but the
hierarchy and density do not match the rest of the Kit site, so scanning the list and reading an article
takes more effort than the content deserves.

People who write Knowledge are not the audience. They work in Ops CMS. Agents that retrieve Knowledge
through tools are not the audience either. This catalog is public read, with no sign-in.

## Solution

Restyle the public catalog on the two screens that already exist: the index at `/knowledge` (sidebar plus
the intro when no article is open) and the article pane at `/knowledge/$id`. Behavior stays. The reader
still searches, filters, scans the list, opens a Knowledge article, and jumps to a Knowledge chunk.

The screens should feel like the same Kit site as the home screen: dark by default, light available from
the existing theme toggle, type from the Kit site font stack, and composed from the shared UI kit. Layout,
spacing, and which components to use belong in the UI spec. This PRD locks the behavior those screens must
keep.

## Success Criteria

Proposed acceptance bar, pending review:

1. A signed-out reader can search, filter by Knowledge intent, open a Knowledge article, and jump to a
   Knowledge chunk. The address still carries the query, the intent, and the chunk hash.
2. Every English string quoted in the stories below is unchanged on the live catalog.
3. Loading, no match, and a missing article stay distinct. Loading uses skeleton rows. No match uses only
   the empty sentence. A missing id uses only the not-found sentence, and the sidebar stays.
4. The catalog shows no way to create, update, or delete Knowledge, and it does not ask the reader to sign
   in.
5. Once a UI spec exists for these two screens, the shipped catalog matches that spec and still uses the
   Kit site dark default plus the light theme toggle.

## User Stories

Priority tags below are a proposal pending review.

### P0 — Find a published article from the catalog

As a signed-out engineer, I want to search Knowledge by topic or symptom and narrow by Knowledge intent, so
that I can find the published article that matches my problem.

Why P0: without search and the intent filter, the catalog does not retrieve anything.

Given the catalog index, when I focus the search field, then its accessible name is "Search Knowledge by
topic or symptom" and its placeholder is `biome prettier setup`.

Given I stop typing, when about 300 milliseconds have passed since the last keystroke, then the query is
reflected in the address as `q`. Article title links keep the current `q` and `intent`.

Given the result set is not ready, when the list renders, then I see skeleton rows and I do not see "No
Knowledge articles match your search."

Given the result set is empty, when the list renders, then I see "No Knowledge articles match your search."

Given the intent toolbar, whose accessible name is "Intent", when I press All, then `intent` is cleared.
When I press Incident, Design, or Toolchain, then `intent` is `incident`, `design`, or `toolchain`.

Given a hit that is only a Knowledge chunk, when the list renders, then there is no Knowledge article row
for that hit. Given a hit that matches both an article and a chunk, when the list renders, then the chunk
is nested under that article. The sidebar wordmark goes to the Kit site home (`/`).

### P0 — Read an article and jump to a chunk

As a signed-out engineer, I want to read a Knowledge article and jump to a Knowledge chunk, so that I can
follow the published answer in reading order.

Why P0: the reading pane is the reason the reader opened the catalog.

Given an article is open, when the pane renders, then the id is plain text, the intent line reads "Intent:
Incident", "Intent: Design", or "Intent: Toolchain" to match the article, and the title is the page
heading. Axis tags show when the article has them. An article checklist shows only when the article has
one. That checklist is not the same thing as a checklist Knowledge chunk.

Given a Knowledge chunk, when it renders, then its badge is one of INCIDENT, SEAM, CONFIG, CHECKLIST, or
PROSE. A config chunk shows the JSON/YAML switch only when the config body parses as a JSON object or
array, and the switch exposes `aria-pressed`. An incident chunk shows Cause, Fix, and Verify only for
lists that are non-empty.

Given more than one Knowledge chunk, when the pane renders, then the reading-order text is "Reading order"
and the on-this-page nav is "On this page". Given exactly one chunk, when the pane renders, then that nav
is absent. A chunk link adds the chunk hash to the address.

Given the id does not match an article, when the pane renders, then the article pane is replaced by
"Knowledge article not found." and the sidebar stays. "Back to knowledge" goes to `/knowledge` with the
default search.

### P0 — Orient when no article is open

As a signed-out engineer, I want a short intro in the center when no article is open, so that I know I can
pick from the list or filter by intent.

Why P0: the index is the default catalog view, and the intro is how a first visit explains the three
Knowledge intents.

Given the index and no article open, when the center pane renders, then the heading is "Knowledge
retrieval for agents" and the body is "Pick an article from the list on the left to read it, or filter by
intent below."

Given the intro cards, when they render, then there are three cards and no All card. Incident reads
"Deploy/CI symptom → cause → fix → verify." Design reads "Seams between stack choices — routing, state,
modules." Toolchain reads "Org-wide setup recipes — formatters, tooling."

Given I press a card, when the catalog updates, then `intent` becomes `incident`, `design`, or `toolchain`
to match the card, and I stay on the intro pane. The sidebar intent toolbar and these cards set the same
`intent`.

### P0 — Recognize the catalog as the Kit site

As a signed-out engineer, I want the Knowledge catalog to look like the rest of the Kit site, so that
reading published Knowledge feels like the same product as the home screen.

Why P0: this work exists to redo the look. Shipping the old layout with the same behavior misses the
outcome.

Given the catalog, when it renders, then it uses the Kit site dark default, the existing light theme
toggle, the Kit site font stack, and shared UI kit components. Hierarchy and density follow the UI spec
for these two screens. Exact layout is not fixed in this PRD.

## Implementation Decisions

- This is a visual redesign of the shipped public catalog. It is easy to reverse and adds no new
  architectural trade-off, so no new architecture decision is required. The accepted Kit site stack stays:
  Vite, React, the shared UI kit, the Kit site router, catalog filters in the address search params, dark
  as the default with a light toggle, and the Kit site font stack (Quicksand for interface text, JetBrains
  Mono for mono).
- Catalog copy on this surface stays the English strings in the stories. The rest of the Kit site chrome
  is Vietnamese first, with an English toggle. This redesign does not add a locale project and does not
  translate these strings.
- The address stays shareable through `q`, `intent`, and the chunk hash. The query updates about 300
  milliseconds after the last keystroke. Do not change that delay, the parameter names, the empty,
  loading, or missing copy, how a chunk-only hit and a dual hit render, when the JSON/YAML switch
  appears, the difference between an article checklist and a checklist chunk, or when Cause, Fix, and
  Verify appear.
- The intro cards and the sidebar intent toolbar remain two controls that write the same `intent`. All on
  the toolbar clears `intent`. There is no All card.
- The intro body still says the filter is below the text. Keep that sentence. The cards sit with the
  intro. The toolbar stays in the sidebar.
- Public read stays on `/knowledge` and `/knowledge/$id`. Writes stay in Ops CMS. The catalog does not
  gain sign-in. The Knowledge schema does not change. There is no new CMS, and the retrieval tools agents
  already call do not change.
- The catalog does not generate text. It shows published Knowledge. There is no model-output section: the
  same stored article is not an answer that can vary, and a missing id is the not-found state above.
- Colors, spacing, and component choice belong in the UI spec. The nearest Kit site screen is the home
  screen: a dark-first engineering artifact, shared UI kit primitives, and distinct loading, empty,
  missing, and ready states. The catalog should feel like that screen, not like a separate product.

## Testing Decisions

These checks block release. Each one covers a P0 behavior:

- Search field name, placeholder, `q` updating after the last keystroke, and title links that keep `q`
  and `intent`.
- Intent toolbar: All clears `intent`; Incident, Design, and Toolchain set it. The accessible name is
  "Intent".
- Loading shows skeleton rows and hides the empty sentence. An empty result set shows only "No Knowledge
  articles match your search."
- A Knowledge chunk hit with no article has no article row. A hit on both nests the chunk under the
  article.
- Intro heading, body, three card descriptions, no All card, and a card press that sets `intent` without
  leaving the intro.
- Article id, intent line, title heading, axis tags, optional article checklist, chunk badges, the
  JSON/YAML switch rules including `aria-pressed`, and Cause, Fix, and Verify only for non-empty incident
  lists.
- More than one chunk shows "Reading order" and "On this page". One chunk does not.
- A missing id shows "Knowledge article not found.", keeps the sidebar, and "Back to knowledge" returns to
  `/knowledge` with the default search.
- These screens do not prompt for sign-in and do not offer create, update, or delete.
- After the UI spec is approved, the two screens match it, including the dark default and the light theme
  toggle. Until that spec exists, visual polish alone is not a pass or fail check.

Advisory: assert what a reader can see and what the address contains. Do not assert private component
structure. Keyboard access to the search field, the intent controls, article links, chunk links, and the
JSON/YAML switch is covered by the accessible names in the blocker checks.

Prior art is the catalog as it ships today. Tests should lock the strings and the address rules, not the
previous spacing.

## Out of Scope

- Ops CMS, including Knowledge admin. Authors keep writing there. This PRD is public read only.
- Schema changes, and any new CMS. The redesign does not change what is stored.
- Changes to the retrieval tools agents call. Agents do not use these screens.
- Legacy runbook and guide addresses that already redirect. Leave them alone.
- Translating the catalog, a locale project, or new Knowledge intent values.
- Analytics events on these screens.
- Changing the search delay, address parameters, empty, loading, and missing copy, chunk nesting, the
  JSON/YAML switch rule, the checklist distinction, or the Cause, Fix, and Verify rules.
- The Kit site home screen and the skill catalog. They are a different surface.
- Ops CMS authors, and agents using retrieval tools. They are not users of this redesign.

## Assumptions

- This is a visual redesign. Success is a clearer hierarchy and density on the same two routes, dark
  first, composed from the shared UI kit. Search, intro, and article behavior stay as they ship today.
- English catalog copy stays, even though other Kit site chrome is Vietnamese first.
- The address remains shareable through `q`, `intent`, and the chunk hash.
- The intro cards and the sidebar intent toolbar stay as two controls for one `intent`.
- "Back to knowledge" keeps today's default search on `/knowledge`. This PRD does not redefine that
  address.

## Open Questions

None. No blocking fork was left open.

## Further Notes

The next product step is a UI spec for the index and the article pane. Implementation waits on that spec.
Priority tags and the "match the UI spec" acceptance bar are proposals pending review.

No model-behavior section: the catalog displays stored Knowledge and does not produce an answer that can
vary for the same input.
