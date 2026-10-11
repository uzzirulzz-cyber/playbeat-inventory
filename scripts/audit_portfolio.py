import csv,json,os,urllib.request,datetime,pathlib,time
OWNER="uzzirulzz-cyber"
API="https://api.github.com"
TOKEN=os.getenv("GH_TOKEN","")
headers={"Accept":"application/vnd.github+json","User-Agent":"PlayBeat-Portfolio-Audit","X-GitHub-Api-Version":"2022-11-28"}
if TOKEN: headers["Authorization"]="Bearer "+TOKEN
def get(path):
    req=urllib.request.Request(API+path,headers=headers)
    try:
        with urllib.request.urlopen(req,timeout=20) as r: return json.load(r)
    except Exception as e: return {"_error":str(e)}
def probe(name,path):
    p=get(f"/repos/{OWNER}/{name}/contents/{path}")
    return isinstance(p,dict) and not p.get("_error") and p.get("type")=="file"
repos=[]
for page in range(1,11):
    batch=get(f"/users/{OWNER}/repos?per_page=100&page={page}&type=owner")
    if not isinstance(batch,list):
        print("Repository enumeration failed:",batch)
        break
    repos.extend(batch)
    if len(batch)<100:break
today=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
rows=[]
for i,r in enumerate(repos):
    name=r["name"]
    nonempty=(r.get("size") or 0)>0
    manifest=probe(name,"package.json") or probe(name,"pyproject.toml") or probe(name,"requirements.txt") or probe(name,"composer.json") if nonempty else False
    readme=probe(name,"README.md") if nonempty else False
    tests=any(probe(name,p) for p in ["tests/pages-api.test.ts","pytest.ini","vitest.config.ts","jest.config.js"]) if manifest else False
    actions=probe(name,".github/workflows/deploy.yml") if manifest else False
    rows.append({"repository":name,"github_url":r["html_url"],"size_kb":r.get("size",0),"manifest":manifest,"readme":readme,"test_indicator":tests,"deploy_workflow_indicator":actions,"completion":"UNVERIFIED" if nonempty else "EMPTY","sale_ready":"NO - requires human verification"})
    if i%25==0:print(f"Checked {i+1}/{len(repos)}")
pathlib.Path("reports").mkdir(exist_ok=True)
with open("reports/latest.csv","w",newline="",encoding="utf-8") as f:
    w=csv.DictWriter(f,fieldnames=rows[0].keys() if rows else ["repository"])
    w.writeheader();w.writerows(rows)
with open("reports/latest.json","w",encoding="utf-8") as f:
    json.dump({"date":today,"count":len(repos),"method":"Metadata/file-presence triage only. No build, tests, ownership or legal transfer verified.","repositories":rows},f,indent=2)
print(f"Recorded {len(rows)} repositories; no repository was automatically declared complete.")
