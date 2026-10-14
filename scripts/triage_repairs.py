"""Prioritize repository triage; never equate file presence with completion."""
import json, csv, pathlib
p=pathlib.Path("reports")
source=json.loads((p/"latest.json").read_text())
candidates=[]
for r in source["repositories"]:
    if not r.get("manifest") or not r.get("size_kb",0): continue
    name=r["repository"]
    low=name.lower()
    risk=[]
    if any(x in low for x in ("iptv","stream","tv","broadcast","sports")):risk.append("MEDIA_RIGHTS_REVIEW")
    if any(x in low for x in ("coin","block","exchange","trade","wallet","gateway","payment","jazz","bank")):risk.append("FINANCIAL_REGULATORY_REVIEW")
    if any(x in low for x in ("omniroute",)):risk.append("UPSTREAM_LICENSE_REVIEW")
    score=30+int(bool(r.get("readme")))*20+int(bool(r.get("test_indicator")))*20+int(bool(r.get("deploy_workflow_indicator")))*15+int(r["size_kb"]>=500)*5
    blockers=[]
    if not r.get("readme"):blockers.append("WRITE_SETUP_AND_FEATURE_DOCUMENTATION")
    if not r.get("test_indicator"):blockers.append("VERIFY_TEST_SUITE_AND_RUN_CRITICAL_FLOWS")
    if not r.get("deploy_workflow_indicator"):blockers.append("VERIFY_DEPLOYMENT_AND_CONFIG")
    blockers+=["BUILD_AND_AUTH_CHECK","SECRET_SCAN","OWNERSHIP_AND_LICENSE_REVIEW","VERIFY_DUPLICATES"]
    candidates.append({"repository":name,"github_url":r["github_url"],"priority_score_not_completion":score,
     "triage_band":"HIGH_PRIORITY" if score>=55 else "REVIEW",
     "status":"UNVERIFIED","known_gaps":";".join(blockers),"risk_flags":";".join(risk),
     "next_step":"Build in isolated CI; fix failures on reviewed branch; verify demo and rights before listing",
     "build_verified":False,"sale_ready":False})
candidates.sort(key=lambda x:(-x["priority_score_not_completion"],x["repository"].lower()))
result={"source_audit_date":source["date"],"total_manifest_candidates":len(candidates),"note":"Priority scores are not percent complete. Duplicates, builds, correctness and rights remain unverified.","candidates":candidates}
(p/"repair-queue.json").write_text(json.dumps(result,indent=2)+"\n")
with (p/"repair-queue.csv").open("w",newline="") as f:
    fields=list(candidates[0])
    w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows(candidates)
print("Triage candidates:",len(candidates))
