# sourcey-docs-go-chi-chi

A reproducible [Sourcey](https://sourcey.com) documentation site for the
[go-chi/chi](https://github.com/go-chi/chi) HTTP router library (Go), generated
from a pinned public commit and published at a durable public home.

- Live docs: https://samedaydesk.com/docs/go-chi-chi/
- Target: `github.com/go-chi/chi/v5` at tag `v5.3.1` (commit `8b258c7bb28f97a5f2a856ff7ef962578fec9215`), MIT license
- Public API surface: 120 exported symbols (56 functions, 20 types, 44 methods)
- Generator: Sourcey v3.6.4 (godoc adapter, snapshot mode)
- Governed proof: runx-cli 0.6.14 receipt `sha256:cfd3ed94858681dc38e18ecfa1b8299c6a6f9c946cb0efa42d161f08d8c1ce17` (`runx verify` valid)

## Layout

- `sourcey.config.ts`: the Sourcey configuration (siteUrl + baseUrl for subpath hosting).
- `godoc.json`: the committed godoc snapshot of chi at the pinned commit.
- `site/`: the full generated static documentation site (what is served live).
- `skill/sourcey-docs-audit/`: a governed runx skill that recomputes the public API count from the snapshot and asserts the deliverable facts.
- `delivery/evidence.json`, `delivery/report.md`, `delivery/receipt.json`: the delivery packet and the sealed governed receipt.

## Reproduce

Regenerate the snapshot and site (requires Node 20+, Go, and `npm install -g sourcey`):

```sh
git clone --depth 1 --branch v5.3.1 https://github.com/go-chi/chi chi
( cd chi && sourcey godoc --out ../godoc.json )
sourcey build -o site
```

Re-run the governed audit and verify the receipt:

```sh
RUNX_RECEIPT_SIGN_KID=epistemedeus-secret-catcher \
RUNX_RECEIPT_SIGN_ISSUER_TYPE=ci \
RUNX_RECEIPT_SIGN_ED25519_SEED_BASE64=... \
runx skill ./skill/sourcey-docs-audit \
  -i module_path=github.com/go-chi/chi/v5 -i tag=v5.3.1 \
  -i pinned_commit=8b258c7bb28f97a5f2a856ff7ef962578fec9215 \
  -i license=MIT -i public_url=https://samedaydesk.com/docs/go-chi-chi/ \
  --input-json min_apis=20 --receipt-dir ./receipts -j

RUNX_RECEIPT_VERIFY_KID=epistemedeus-secret-catcher \
RUNX_RECEIPT_VERIFY_ED25519_PUBLIC_KEY_BASE64=WsDXUw1Os7UbLMG+qDfsbTAysd30qEeXfZsgNyzVFTc= \
runx verify --receipt delivery/receipt.json -j
```

go-chi/chi is the property of its authors and is used here under its MIT license
purely to document its public API. This repository is the documentation
deliverable, not a fork of chi.
