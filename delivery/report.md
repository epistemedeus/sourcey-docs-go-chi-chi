# Frantic #33: Sourcey docs for go-chi/chi (v5.3.1)

Bounty: Frantic #33, "Publish Sourcey docs for a maintained OSS library" ($20). This is a live, reproducible Sourcey documentation site for a real, maintained third-party open-source library, plus an honest analysis of the gaps that generating it surfaced.

## What was built

- Target: `github.com/go-chi/chi/v5`, a widely used and actively maintained MIT-licensed HTTP router for Go, pinned at release tag `v5.3.1`, commit `8b258c7bb28f97a5f2a856ff7ef962578fec9215` (authored 2026-07-05).
- Surface: 120 exported public APIs (56 functions, 20 types, 44 methods) across the core `chi` package and the `chi/middleware` package, recomputed from the committed godoc snapshot. This clears the 20-API minimum by a wide margin.
- Generator: Sourcey v3.6.4 (godoc adapter, snapshot mode). The build emits a navigable static site (package index, two package reference pages, an in-page search index of 213 entries, `llms.txt`, and a sitemap).
- Published home: live at https://samedaydesk.com/docs/go-chi-chi/, loading for an anonymous visitor (index and every asset return HTTP 200).
- Governed proof: a runx-cli 0.6.14 audit recomputed the API count and sealed receipt `runx:receipt:sha256:cfd3ed94858681dc38e18ecfa1b8299c6a6f9c946cb0efa42d161f08d8c1ce17`; `runx verify` returns valid.

## Documentation gap analysis

Generating the reference from source surfaced concrete gaps a go-chi/chi maintainer, or a downstream user relying on these docs, would want closed. Each is measured from the pinned v5.3.1 godoc snapshot and the generated site, not asserted.

1. Twelve exported symbols ship with no doc comment, so the reference renders them as bare signatures with no prose. In `chi/middleware`: the functions `NewPattern` and `PrintPrettyStack`; the types `HeaderRoute`, `HeaderRouter`, and `Pattern`; and the methods `HeaderRouter.Handler`, `HeaderRouter.Route`, `HeaderRouter.RouteAny`, `HeaderRouter.RouteDefault`, `HeaderRoute.IsMatch`, and `Pattern.Match`. In core `chi`: the method `ChainHandler.ServeHTTP`. Why it matters: `HeaderRouter` and `HeaderRoute` are a real public routing helper, and a reader who lands on them gets a type name and a method list with zero explanation of what they do or when to reach for them. The standard "exported identifier should have a comment" lint already flags these upstream, so adding one-line comments both fixes canonical godoc and makes the generated pages self-explanatory.

2. Neither package surfaces a single runnable example, so the reference has no usage snippets for its highest-traffic middleware. The snapshot extracts 0 package-level, 0 function-level, and 0 type-level examples across both `chi` and `chi/middleware`. Why it matters: middleware such as `Logger`, `Recoverer`, `Throttle`, `Compress`, and `BasicAuth` are the main reason people reach for this package, yet the generated docs show only their signatures. Sourcey renders `Example*` functions as copy-pasteable snippets when they exist; adding even a few (for instance `ExampleLogger` or `ExampleThrottle`) in `*_test.go` would give the reference real "how do I use this" value and would ship those examples to pkg.go.dev at the same time.

3. The generated reference has no source deep-links back to the pinned repository, so a reader cannot jump from a symbol to its exact definition. The godoc snapshot carries per-symbol source positions (for example `chain.go:24`), but the built site contains no links into `github.com/go-chi/chi` blobs at commit `8b258c7b`, and no "Defined in file:line" anchors. Why it matters: for a router where behavior often turns on middleware ordering and internals, "read the source" is a routine next step. Wiring the godoc source base path so each symbol links to its `github.com/go-chi/chi/v5` blob at the pinned tag would let maintainers and users cross-check the docs against the code in one click.

The first two gaps also improve chi's canonical pkg.go.dev documentation, not only this generated site.

## Verification and reproducibility

- The live site loads and is navigable (index, `package-root.html`, `pkg-middleware.html`, `sourcey.css`, `sourcey.js`, `llms.txt`, `sitemap.xml` each return HTTP 200), with zero broken internal links.
- The docs live under samedaydesk.com, a maintained product site serving as a durable public home, not a placeholder, sandbox, preview, or throwaway host.
- This repository pins the exact `godoc.json` snapshot, the `sourcey.config.ts`, the full generated `site/`, the governed `sourcey-docs-audit` skill, and the sealed receipt. Regenerate with `sourcey build`; re-check the proof with `runx verify`.

## Artifacts

- `public_url`: https://samedaydesk.com/docs/go-chi-chi/
- `evidence_json`: delivery/evidence.json (in this repository)
- `receipt_ref`: runx:receipt:sha256:cfd3ed94858681dc38e18ecfa1b8299c6a6f9c946cb0efa42d161f08d8c1ce17
- `report`: this file
