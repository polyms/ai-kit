# Knowledge article

The center pane at `/knowledge/$id`: identity, checklist, chunks, and the on-this-page list.

## Sub-features

- identity: article id, intent badge, title, and axis tags.
- checklist: an accent-edged list of article checklist lines, only when the article has some.
- chunks: one section per chunk, anchored at the chunk slug. Config chunks can switch JSON and
  YAML. Incident chunks list Cause, Fix, and Verify when those lists are non-empty.
- toc: "Reading order" and a nav named "On this page", only when the article has more than one
  chunk.
- missing: "Knowledge article not found." and a link back to the index when the id does not load.

## How to get to it (user POV)

From the sidebar, open an article title or a chunk title. A chunk title scrolls to that section.
Use the on-this-page list to jump between chunks. A bad id shows the missing state. "Back to
knowledge" returns to the index.

## Driving it

Harness: none.

- URL: `/knowledge/$id`. A chunk link keeps `q` and `intent` and sets the hash to the chunk slug.
- Identity: the id is plain text. The intent reads "Intent: Incident", "Intent: Design", or
  "Intent: Toolchain". The title is the page heading.
- Checklist heading: "Checklist".
- Chunk: a heading with the chunk title, a badge `INCIDENT`, `SEAM`, `CONFIG`, `CHECKLIST`, or
  `PROSE`. A config chunk with JSON object or array body has buttons `json` and `yaml`
  (`aria-pressed`).
- Incident lists: "Cause", "Fix", "Verify".
- Toc: text "Reading order", nav "On this page". Each item is a link to `#` plus the chunk slug.
- Missing: "Knowledge article not found." Link name "Back to knowledge" goes to `/knowledge` with
  the default search.

## Gotchas

- One chunk means no on-this-page list. The chunk section is still there.
- The article checklist and a checklist chunk are different blocks. An empty article checklist
  renders nothing.
- The JSON/YAML switch appears only when the config body parses as a JSON object or array. A
  `.yml` filename highlights YAML and does not show the switch.
- Cause, Fix, and Verify render only for an incident chunk, and only for the lists that have
  items.
- The missing state replaces the article pane. The sidebar stays.
