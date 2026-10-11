# PlayBeat portfolio audit and selling workflow
* Daily automated GitHub file-presence triage: `.github/workflows/portfolio-audit.yml`.
* Results: `reports/latest.csv` and `reports/latest.json`, when workflow completes.
* No source code is cloned or transferred to buyers by the audit.
* Status **UNVERIFIED** does not mean complete. Completion requires working build, functional checkout/auth/admin, deployment health, secret scanning, transfer-rights assessment, and buyer due diligence.
* Sales target: one *verified closed transaction per day*; not a promise or claim.
* Sales intake: seller's published business email link in `sales-agent/worker.js`.
* Payment and transfer: signed agreement, transaction-specific owner approval, funded verified escrow and controlled domain/code handover.
* Any free ad post must use an official permitted method, a truthful description, no duplicate spam, and recorded listing URLs.
* To get the Cloudflare Worker online: run `cd sales-agent && npx wrangler deploy` under an account authorized to edit Workers. The connected Cloudflare API rejected deployment on 2026-10-11, so deployment is **not confirmed**.
