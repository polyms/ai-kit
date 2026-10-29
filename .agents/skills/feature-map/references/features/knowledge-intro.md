# Knowledge intro

The center pane at `/knowledge/` when no article is open: a title and three intent rows.

## Sub-features

- title: "Knowledge retrieval for agents", with one line telling the reader to pick an article or
  filter by intent.
- intent-rows: Incident, Design, and Toolchain. Each row shows a one-line description.
- apply-intent: choosing a row sets `intent` on the URL and leaves the reader on this pane.

## How to get to it (user POV)

Open `/knowledge/`. The pane is start-aligned. Read the title, then press a row. The matching
intent button in the sidebar selects too. Opening an article from the sidebar replaces this pane.

## Driving it

Harness: none.

- Title: heading "Knowledge retrieval for agents".
- Body: "Pick an article from the list on the left to read it, or filter by intent below."
- Rows: links named `Incident`, `Design`, `Toolchain`. Descriptions: "Deploy/CI symptom → cause →
  fix → verify.", "Seams between stack choices — routing, state, modules.", "Org-wide setup recipes
  — formatters, tooling."
- After a row press, the URL `intent` is `incident`, `design`, or `toolchain`, and the title is
  still on screen.

## Gotchas

- This pane exists only on the index route. `/knowledge/$id` replaces it. The sidebar does not.
- The body says the filter is below the text. The buttons that filter are in the sidebar. The
  rows under the text set the same `intent`.
- There is no All row. All lives on the sidebar filter.
- A row keeps the current `q`. It does not open an article and it does not clear a query that
  already matches nothing.
