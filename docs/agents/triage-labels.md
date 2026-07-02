# Triage Labels

Skills speak in **canonical triage roles**. This file maps those roles to the actual label strings used in this repo's issue tracker.

## State roles

| Canonical role    | Label in our tracker | Meaning                                  |
| ----------------- | -------------------- | ---------------------------------------- |
| `needs-triage`    | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`      | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent` | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human` | `ready-for-human`    | Requires human implementation            |
| `wontfix`         | `wontfix`            | Will not be actioned                     |

## Category roles

| Canonical role | Label in our tracker | Meaning                    |
| -------------- | -------------------- | -------------------------- |
| `bug`          | `bug`                | Something is broken        |
| `enhancement`  | `enhancement`        | New feature or improvement |

When a skill mentions a role (e.g. "apply the `ready-for-agent` label"), use the corresponding **Label in our tracker** string from this table.

## GitHub labels (manual)

Create matching labels on the remote tracker before triaging. Example:

```bash
gh label create "needs-triage" --description "Maintainer needs to evaluate" --color "FBCA04"
gh label create "needs-info" --description "Waiting on reporter" --color "D4C5F9"
gh label create "ready-for-agent" --description "Fully specified, AFK-ready" --color "0E8A16"
gh label create "ready-for-human" --description "Requires human implementation" --color "1D76DB"
gh label create "wontfix" --description "Will not be actioned" --color "FFFFFF"
gh label create "bug" --description "Something is broken" --color "D73A4A"
gh label create "enhancement" --description "New feature or improvement" --color "A2EEEF"
```
