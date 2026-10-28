# Knowledge search

The sidebar on every `/knowledge` URL: query, intent filter, and the result list.

## Sub-features

- query: type a topic or symptom. The URL `q` updates after a short pause.
- intent-filter: All, Incident, Design, or Toolchain. The URL `intent` updates immediately. All
  clears `intent`.
- results: article rows, with chunk hits nested under the article when both match.
- pending: skeleton rows while the list is loading.
- empty: a short message when the list has loaded and nothing matches.

## How to get to it (user POV)

Open `/knowledge`. The sidebar is already there, including after an article is open. Type in
"Search Knowledge by topic or symptom". Press an intent button. Click an article title or a nested
chunk title.

## Driving it

Harness: none.

- Search field: accessible name "Search Knowledge by topic or symptom". Placeholder
  `biome prettier setup`.
- Intent toolbar: accessible name "Intent". Buttons `All`, `Incident`, `Design`, `Toolchain`.
- Result list: article title links to `/knowledge/$id` and keeps the current `q` and `intent`. A
  chunk link adds the chunk hash.
- Empty copy: "No Knowledge articles match your search."
- Loading: the result region is a status list of skeleton rows, and the toolbar fades. It is not
  the empty message.

## Gotchas

- The field updates the URL about 300ms after the last keystroke. Reading `q` in the same moment
  as the keystroke still shows the old query.
- `results` missing means loading. An empty array means no match. The skeleton is not the empty
  state.
- A chunk-only hit has no article row above it. A hit with both shows the chunk indented under the
  article.
- The wordmark at the bottom of the sidebar goes to `/`, off this page.
