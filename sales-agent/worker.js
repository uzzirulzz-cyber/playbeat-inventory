const products=[
["PlayBeat Digital","izoko","https://playbeat.digital","USD 34,500 provisional","Digital commerce"],
["PlayBeat Live","playbeat.live","https://playbeat.live","Offers invited","Streaming software only; rights excluded"],
["MakeThisDeal","makethisdeal.biz","https://makethisdeal.biz","Offers invited","Deals and commerce"],
["MagXTV","magxtv.click","https://magxtv.click","Offers invited","Sports portal software; broadcast rights excluded"],
["Lead Pulse CRM","eaedpulseplus","","Offers invited","CRM and lead management"],
["PropertyAtlas","estate","","Offers invited","Property management"],
["Automotive Dealership","dealershipautomotive","","Offers invited","Automotive management"],
["Enterprise Suite","enterprise-","","Offers invited","Enterprise software"]
,
["PlayBeat Storefront","playbeat-storefront","","USD 2,500–6,000 indicative","Digital product storefront"],
["PlayBeat TV Platform","playbeattv","","USD 3,000–8,000 indicative","Streaming catalog software; rights excluded"],
["MakeThisDeal Marketplace","dealone1","","USD 3,000–7,500 indicative","Business acquisition marketplace software"],
["PlayBeat Broadcasting Tools","playbeatbroadcast","","USD 1,500–4,000 indicative","Broadcast management code; rights excluded"],
["IPTV Management Toolkit","IPTV","","USD 1,000–3,000 indicative","Playlist administration software only"],
["Streaming Application","stream","","USD 1,000–3,000 indicative","Streaming interface and tooling"],
["Live TV Interface","livetv","","USD 750–2,000 indicative","Live television interface code only"],
["MagXTV Sports Toolkit","MagxTV-sports-streaming-w","","USD 1,000–3,000 indicative","Sports UI; media rights excluded"],
["PlayBeat Pulse CRM Edition","PlaybeatPulse1","","USD 1,500–4,000 indicative","CRM codebase; differentiation unverified"],
["PlayBeat CRM Platform","playbeat-crm-platform","","USD 800–2,500 indicative","CRM application codebase"],
["English Learning App","learnenglish","","USD 600–2,000 indicative","Education software codebase"],
["NexTrade Pro Platform","NEXTRADEPRO","","USD 2,000–6,000 indicative","Financial interface code; regulatory review required"],
["Business Platform","platform","","USD 1,500–4,000 indicative","Platform repository; functionality unverified"],
["OmniRoute Software","OmniRoute","","USD 2,000–6,000 indicative","Routing software; license review required"],
["Payment Gateway Toolkit","payment-gateway","","USD 750–2,000 indicative","Payment integration code; no regulated authorization included"],
["JazzCash Integration Toolkit","jazzcash","","USD 750–2,000 indicative","Integration code; payment credentials excluded"],
["PlayBeat Android App","Playbeat-Digital-apk","","USD 750–2,500 indicative","Android application source"],
["PlayBeat Technology Suite","playbeattech","","USD 1,000–3,000 indicative","Technology platform codebase"],
["PlayBeat Digital World","PLAYBEATDIGITAL.WORLD","","USD 1,000–3,000 indicative","Digital commerce repository"],
["Advance PlayBeat","advanceplaybeat","","USD 1,500–4,000 indicative","Digital commerce codebase"]
].map(([title,repo,url,price,category])=>({title,repo,url,price,category,status:"UNVERIFIED"}));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const json=(x,status=200)=>new Response(JSON.stringify(x),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"public,max-age=180","access-control-allow-origin":"*","x-content-type-options":"nosniff"}});
export default {async fetch(req,env){
const url=new URL(req.url);
if(url.pathname==="/inquiry"&&req.method==="POST"){
 if(!env.SALES_DB)return json({error:"Database not configured"},503);
 const ct=req.headers.get("content-type")||"";
 if(!ct.includes("application/x-www-form-urlencoded"))return json({error:"Invalid form submission"},415);
 if(Number(req.headers.get("content-length")||0)>8192)return json({error:"Form too large"},413);
 const data=await req.formData();
 const take=(name,max=250)=>String(data.get(name)||"").trim().slice(0,max);
 if(take("website"))return Response.redirect(url.origin+"/?received=1",303);
 const buyer=take("buyer_name",100),email=take("email",200).toLowerCase(),asset=take("asset",100);
 if(!buyer||!/^\S+@\S+\.\S+$/.test(email)||!products.some(p=>p.title===asset)||take("consent")!=="yes")return json({error:"Valid name, email, asset and privacy consent are required"},400);
 const id=crypto.randomUUID();
 try {await env.SALES_DB.prepare("INSERT INTO leads(id,asset,buyer_name,email,company,budget,acquisition_type,notes,consent) VALUES (?,?,?,?,?,?,?,?,1)").bind(id,asset,buyer,email,take("company",140),take("budget",100),take("acquisition_type",80),take("notes",1500)).run();}
 catch {return json({error:"Unable to store inquiry"},503);}
 return Response.redirect(url.origin+"/?received=1",303);
}
if(url.pathname==="/api/admin/leads"){
 const supplied=req.headers.get("authorization")||"";
 if(!env.ADMIN_TOKEN||supplied!=="Bearer "+env.ADMIN_TOKEN)return json({error:"Unauthorized"},401);
 if(!env.SALES_DB)return json({error:"Database unavailable"},503);
 const result=await env.SALES_DB.prepare("SELECT id,created_at,asset,buyer_name,email,company,budget,acquisition_type,notes,status,source FROM leads ORDER BY created_at DESC LIMIT 200").all();
 return new Response(JSON.stringify({leads:result.results}),{headers:{"content-type":"application/json","cache-control":"no-store","x-content-type-options":"nosniff"}});
}
if(req.method!=="GET"&&req.method!=="HEAD")return json({error:"Method not allowed"},405);
if(url.pathname==="/health")return json({status:"ok",service:"playbeat-sales-agent",catalog:products.length});
if(url.pathname==="/api/projects")return json({status:"unaudited",count:products.length,pricing:"Illustrative code-only asking ranges, not independently appraised values.",projects:products});
if(url.pathname==="/api/inventory"){
 try{const upstream=await fetch("https://raw.githubusercontent.com/uzzirulzz-cyber/playbeat-inventory/main/reports/latest.json",{headers:{"user-agent":"PlayBeat-Sales-Catalog"}});
 if(!upstream.ok)throw Error("report unavailable");
 const report=await upstream.json();
 return json({date:report.date,count:report.count,method:report.method,repositories:report.repositories.map(r=>({repository:r.repository,github_url:r.github_url,completion:r.completion,sale_ready:r.sale_ready}))});
 }catch{return json({error:"Inventory report temporarily unavailable"},503);}
}
if(url.pathname!=="/")return new Response("Not found",{status:404});
const cards=products.map(p=>'<article><div class="head"><h2>'+esc(p.title)+'</h2><span class="tag">Not audited</span></div><p class="category">'+esc(p.category)+'</p><p class="price">'+esc(p.price)+'</p><div class="actions"><a target="_blank" rel="noopener noreferrer" href="https://github.com/uzzirulzz-cyber/'+encodeURIComponent(p.repo)+'">Repository ↗</a>'+(p.url?'<a target="_blank" rel="noopener noreferrer" href="'+esc(p.url)+'">Demo / website ↗</a>':'')+'<a class="cta" href="mailto:playbeatdigital@gmail.com?subject='+encodeURIComponent("Acquisition inquiry: "+p.title)+'&body='+encodeURIComponent("Interested in: "+p.title+"\nAcquisition type: \nBudget: \nBuyer name/company: \nQuestions: ")+'">Inquire</a></div></article>').join("");
const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Explore preliminary software acquisition opportunities from PlayBeat Digital (Private) Limited. Independent verification required."><title>PlayBeat | Software Acquisitions</title><style>*{box-sizing:border-box}body{margin:0;background:#080d18;color:#f4f7ff;font:16px system-ui,-apple-system,sans-serif}header,main,footer{max-width:1140px;margin:auto;padding:30px 22px}nav{display:flex;justify-content:space-between;align-items:center;gap:16px}nav strong{font-size:22px;letter-spacing:.3px}a{color:#a9cbff;text-decoration:none}a:hover{text-decoration:underline}.hero{padding:78px 0 48px}.eyebrow{color:#8caaff;text-transform:uppercase;letter-spacing:2px;font-size:12px;font-weight:700}h1{font-size:clamp(38px,6vw,72px);line-height:1.06;max-width:870px;margin:16px 0}h1 em{font-style:normal;color:#84baff}.sub{color:#b5c4dc;max-width:760px;line-height:1.7}section h2{font-size:27px}.stats{display:flex;gap:12px;flex-wrap:wrap;margin:25px 0}.pill,.tag{border:1px solid #364761;border-radius:100px;padding:8px 12px;color:#c3d1e8;font-size:13px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(275px,1fr));gap:17px}article{background:linear-gradient(150deg,#19263e,#101827);border:1px solid #334159;border-radius:18px;padding:23px;min-height:235px}article .head{display:flex;justify-content:space-between;gap:10px;align-items:start}article h2{font-size:20px;margin:0}.tag{font-size:11px;white-space:nowrap;padding:5px 8px}.category{color:#9aaecb;min-height:35px}.price{font-weight:700}.actions{display:flex;gap:14px;flex-wrap:wrap;margin-top:20px;font-size:14px}.cta{background:#d0e3ff;color:#0b1930;border-radius:8px;padding:9px 12px;font-weight:700}.note{margin:35px 0;padding:22px;background:#101e32;border-left:3px solid #7aa7ec;color:#c9d6e8;line-height:1.7}footer{color:#94a8c5;border-top:1px solid #26344b;margin-top:45px;font-size:14px}@media(max-width:600px){.hero{padding:38px 0 20px}.head{flex-wrap:wrap}}</style></head><body><header><nav><strong>PlayBeat<span style="color:#86b7ff">.</span> Acquisitions</strong><a href="mailto:playbeatdigital@gmail.com">Contact seller ↗</a></nav></header><main><div class="hero"><div class="eyebrow">Software • platforms • business assets</div><h1>Acquire your next <em>digital business.</em></h1><p class="sub">Explore software codebases and potential operating-business acquisitions from PlayBeat Digital (Private) Limited, Pakistan. Each opportunity is preliminary and subject to technical, financial, ownership and transfer verification.</p><div class="stats"><span class="pill">28 preliminary opportunities</span><span class="pill">Buyer due diligence required</span><span class="pill">Qualified offers welcome</span></div></div><section><h2>Featured opportunities</h2><div class="grid">'+cards+'</div></section>'+ (url.searchParams.has("received")?'<p role="status" style="color:#b9f1d7">Inquiry received. We will contact you by email.</p>':'') +'<section id="inquiry"><h2>Request acquisition details</h2><p class="sub">Submit an inquiry for seller follow-up. No payments are accepted here.</p><form action="/inquiry" method="post" style="display:grid;gap:14px;max-width:640px;background:#121f33;padding:22px;border-radius:16px"><label>Project <select required name="asset" style="width:100%;padding:12px;margin-top:6px">' + products.map(p=>'<option>'+esc(p.title)+'</option>').join('') + '</select></label><label>Your name <input required name="buyer_name" maxlength="100" style="width:100%;padding:12px;margin-top:6px"></label><label>Email <input required name="email" type="email" maxlength="200" style="width:100%;padding:12px;margin-top:6px"></label><label>Company <input name="company" maxlength="140" style="width:100%;padding:12px;margin-top:6px"></label><label>Budget <input name="budget" maxlength="100" style="width:100%;padding:12px;margin-top:6px"></label><label>Acquisition type <select name="acquisition_type" style="width:100%;padding:12px;margin-top:6px"><option>Code license</option><option>Asset transfer</option><option>Operating business</option></select></label><label>Questions <textarea name="notes" maxlength="1500" style="width:100%;padding:12px;margin-top:6px" rows="4"></textarea></label><div style="display:none"><label>Website <input name="website" autocomplete="off"></label></div><label><input type="checkbox" name="consent" value="yes" required> I agree to be contacted about this acquisition inquiry.</label><button type="submit" style="padding:14px;background:#bdd8ff;border:0;border-radius:8px;font-weight:bold;cursor:pointer">Submit inquiry</button></form></section><aside class="note"><strong>Buyer protection and transparency.</strong> A live demo or public repository does not establish ownership, profitability, security or transfer rights. Third-party code, content, subscriptions, sensitive customer data and broadcasting rights are excluded unless expressly verified and contracted. No automated payment or delivery. Every transfer requires a signed agreement, transaction-specific owner approval and verified independent escrow.</aside></main><footer>© PlayBeat Digital (Private) Limited · Pakistan · <a href="mailto:playbeatdigital@gmail.com">playbeatdigital@gmail.com</a> · <a href="/api/projects">Catalog API</a> · <a href="/api/inventory">Portfolio inventory</a></footer></body></html>';
return new Response(req.method==="HEAD"?null:html,{headers:{"content-type":"text/html; charset=utf-8","x-content-type-options":"nosniff","referrer-policy":"strict-origin-when-cross-origin","content-security-policy":"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'"}});
}};