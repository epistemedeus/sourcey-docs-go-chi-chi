import fs from "node:fs";
import crypto from "node:crypto";

// sourcey-docs-audit: a governed validation of a published Sourcey docs site.
// It recomputes the exported public API count from the committed godoc snapshot
// and asserts the deliverable facts (pinned commit, named license, minimum API
// surface, and a durable public home). It reads only local, public data and
// performs no network, publish, or mutation. Exit 0 seals a passing receipt;
// a failed assertion is a governed stop (exit 64).

const SCHEMA = "sourcey.docs.audit.result.v1";
const SKILL = "sourcey-docs-audit";
const VERSION = "0.1.0";

function readInputs() {
  const raw = process.env.RUNX_INPUTS_PATH
    ? fs.readFileSync(process.env.RUNX_INPUTS_PATH, "utf8")
    : process.env.RUNX_INPUTS_JSON || "{}";
  return JSON.parse(raw);
}

function countApis(godoc) {
  let funcs = 0, types = 0, methods = 0;
  const packages = [];
  for (const p of godoc.packages || []) {
    const f = (p.funcs || []).length;
    const t = (p.types || []).length;
    const m = (p.types || []).reduce((a, ty) => a + ((ty.methods || []).length), 0);
    funcs += f; types += t; methods += m;
    packages.push({ import_path: p.importPath || p.name, funcs: f, types: t, methods: m });
  }
  return { funcs, types, methods, total: funcs + types + methods, packages };
}

function main() {
  const inp = readInputs();
  const minApis = Number.isFinite(inp.min_apis) ? Number(inp.min_apis) : 20;

  const godocRaw = fs.readFileSync(new URL("./godoc.json", import.meta.url), "utf8");
  const godocSha = crypto.createHash("sha256").update(godocRaw).digest("hex");
  const godoc = JSON.parse(godocRaw);
  const api = countApis(godoc);

  const checks = [];
  const check = (id, pass, detail) => { checks.push({ id, pass: !!pass, detail }); };

  check("module_matches_snapshot",
    !!inp.module_path && godoc.module_path === inp.module_path,
    `snapshot module_path=${godoc.module_path} vs declared=${inp.module_path}`);
  check("api_surface_meets_minimum",
    api.total >= minApis,
    `documented public APIs=${api.total} (funcs=${api.funcs}, types=${api.types}, methods=${api.methods}); minimum=${minApis}`);
  check("commit_is_pinned",
    typeof inp.pinned_commit === "string" && /^[0-9a-f]{40}$/.test(inp.pinned_commit),
    `pinned_commit=${inp.pinned_commit}`);
  check("license_named",
    typeof inp.license === "string" && inp.license.trim().length > 0,
    `license=${inp.license}`);
  check("durable_public_home",
    typeof inp.public_url === "string" && /^https:\/\/samedaydesk\.com\/docs\//.test(inp.public_url),
    `public_url=${inp.public_url}`);

  const failed = checks.filter((c) => !c.pass);
  const decision = failed.length === 0 ? "pass" : "stop";

  const observations = [
    `Target library: ${inp.module_path} pinned at ${inp.tag || "?"} (${inp.pinned_commit}).`,
    `Recomputed public API surface from the committed godoc snapshot: ${api.total} exported symbols (funcs=${api.funcs}, types=${api.types}, methods=${api.methods}) across ${api.packages.length} package(s).`,
    `Per-package: ${api.packages.map((p) => `${p.import_path} [funcs ${p.funcs}, types ${p.types}, methods ${p.methods}]`).join("; ")}.`,
    `Minimum required documentable APIs: ${minApis}; observed ${api.total}; meets_minimum=${api.total >= minApis}.`,
    `License: ${inp.license}. Docs published at: ${inp.public_url}.`,
    `godoc snapshot sha256=${godocSha}; schema_version=${godoc.schema_version}; generated_at=${godoc.generated_at}.`,
    `Governed checks passed: ${checks.length - failed.length}/${checks.length}; decision=${decision}.`,
  ];

  const result = {
    schema: SCHEMA, skill: SKILL, version: VERSION,
    decision,
    target: { module_path: inp.module_path, tag: inp.tag, pinned_commit: inp.pinned_commit, license: inp.license },
    public_url: inp.public_url,
    api_surface: api,
    godoc_sha256: godocSha,
    checks,
    observations,
  };

  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  process.exit(decision === "pass" ? 0 : 64);
}

main();
