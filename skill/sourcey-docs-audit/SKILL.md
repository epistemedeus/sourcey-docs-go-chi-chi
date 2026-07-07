---
name: sourcey-docs-audit
description: Governed validation of a published Sourcey documentation site. Recomputes the exported public API count from a committed godoc snapshot and asserts the deliverable facts (pinned commit, named license, minimum API surface, durable public home). Reads only local public data; no network, publish, or mutation.
---

# sourcey-docs-audit

A small governed check that a published Sourcey docs site is backed by a real,
pinned, adequately large public API surface.

## Inputs

- `module_path` (string): the Go module the docs cover, e.g. `github.com/go-chi/chi/v5`.
- `tag` (string): the release tag documented, e.g. `v5.3.1`.
- `pinned_commit` (string): the 40-hex commit the docs were generated from.
- `license` (string): the target's license, e.g. `MIT`.
- `public_url` (string): the durable public URL the docs are served from.
- `min_apis` (number, optional, default 20): the minimum documentable public API count.

## What it does

1. Reads the committed `godoc.json` snapshot bundled with the skill.
2. Recomputes the exported public API surface (functions, types, and methods)
   across every package in the snapshot.
3. Runs governed assertions: module matches the snapshot, API count meets the
   minimum, the commit is pinned, the license is named, and the docs live under
   the declared durable home.
4. Emits a `sourcey.docs.audit.result.v1` object with per-package counts and
   observations. Exit 0 seals a passing receipt; any failed assertion is a
   governed stop (exit 64).

The skill performs no network access and publishes nothing.
