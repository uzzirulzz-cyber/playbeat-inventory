"""Generate honest, reviewable sales listing drafts from latest GitHub inventory."""
import csv,json,pathlib,datetime
ROOT=pathlib.Path("reports")
report=json.loads((ROOT/"latest.json").read_text(encoding="utf-8"))
focus=[
("PlayBeat Digital","izoko","Digital commerce storefront and administrative tooling","Price on request"),
("PlayBeat Live","playbeat.live","Streaming catalog and player software; media rights excluded","Offers invited"),
("MakeThisDeal","makethisdeal.biz","Deals and business marketplace codebase","Offers invited"),
("MagXTV","magxtv.click","Sports portal interface; broadcast rights excluded","Offers invited"),
("Lead Pulse CRM","eaedpulseplus","Lead pipeline and customer relationship tooling","Offers invited"),
("PropertyAtlas","estate","Property management software","Offers invited"),
("Automotive Dealership","dealershipautomotive","Dealership administration software","Offers invited"),
("Enterprise Suite","enterprise-","Enterprise management codebase","Offers invited")]
by_repo={x["repository"]:x for x in report["repositories"]}
rows=[]
for title,repo,scope,price in focus:
    item=by_repo.get(repo)
    has_code=bool(item and item.get("size_kb",0)>0)
    status="TRIAGE_PENDING" if has_code else "REPOSITORY_MISSING_OR_EMPTY"
    desc=(f"{title} — {scope}. GitHub repository: https://github.com/uzzirulzz-cyber/{repo}. "
          f"Asking: {price}. Preliminary listing only; installation, functionality, revenue, "
          "ownership, third-party licensing and transfer rights have not been verified. "
          "All transactions require written agreement, approved escrow and seller approval. "
          "Contact: playbeatdigital@gmail.com")
    rows.append({"asset":title,"repository":repo,"audit_status":status,
                 "listing_status":"DRAFT_REVIEW_REQUIRED","asking":price,
                 "listing_copy":desc,"published_url":"","buyer_contacts":0,
                 "qualified_leads":0,"offers":0,"closed_sales":0})
ROOT.mkdir(exist_ok=True)
(ROOT/"sales-queue.json").write_text(json.dumps({"generated_utc":datetime.datetime.now(datetime.timezone.utc).isoformat(),
 "audit_date":report.get("date"),"inventory_count":report.get("count"),"policy":"Listing drafts only. Never assume published, verified or sold.","listings":rows},indent=2)+"\n",encoding="utf-8")
with (ROOT/"sales-queue.csv").open("w",newline="",encoding="utf-8") as f:
    w=csv.DictWriter(f,fieldnames=rows[0].keys());w.writeheader();w.writerows(rows)
print(f"Created {len(rows)} reviewable listing drafts; 0 published, 0 verified sales.")
