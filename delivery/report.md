# Frantic #33: Sourcey docs for go-chi/chi (v5.3.1)

Bounty: Frantic #33, "Publish Sourcey docs for a maintained OSS library" ($20). This report documents a live, reproducible Sourcey documentation site for a real, maintained third-party open-source library.

- Target: `github.com/go-chi/chi/v5`, a widely used and actively maintained MIT-licensed HTTP router for Go. Pinned at release tag `v5.3.1`, commit `8b258c7bb28f97a5f2a856ff7ef962578fec9215` (authored 2026-07-05), so the docs map to an exact public source state.
- Public API surface: 120 exported public APIs (56 functions, 20 types, 44 methods) across the core `chi` package and the `chi/middleware` package, recomputed from the committed godoc snapshot. This clears the 20-API minimum by a wide margin.
- Generator: Sourcey v3.6.4 using its godoc adapter in snapshot mode. The build emits a navigable static site (package index, two package reference pages, in-page search index, `llms.txt`, and a sitemap) with no framework runtime.
- Published home: the docs are live at https://samedaydesk.com/docs/go-chi-chi/ and load for an anonymous visitor (the index page and every asset return HTTP 200). samedaydesk.com is a maintained product site that serves as a durable public home, not a placeholder, sandbox, preview, or throwaway host.
- Governed proof: a runx-cli 0.6.14 governed audit recomputes the public API count from the snapshot and asserts the deliverable facts (module match, minimum API surface, pinned commit, named license, durable home). It sealed receipt `runx:receipt:sha256:cfd3ed94858681dc38e18ecfa1b8299c6a6f9c946cb0efa42d161f08d8c1ce17`, and `runx verify` returns valid (both the digest and the content address match).
- Reproducibility: this repository pins the exact `godoc.json` snapshot, the `sourcey.config.ts`, the full generated `site/`, the governed `sourcey-docs-audit` skill, and the sealed receipt. Regenerate the site with `sourcey build` and re-check the proof with `runx verify`.

## Artifacts

- `public_url`: https://samedaydesk.com/docs/go-chi-chi/
- `evidence_json`: delivery/evidence.json (in this repository)
- `receipt_ref`: runx:receipt:sha256:cfd3ed94858681dc38e18ecfa1b8299c6a6f9c946cb0efa42d161f08d8c1ce17
- `report`: this file
