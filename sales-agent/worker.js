const products=[
{title:"PlayBeat Digital",url:"https://playbeat.digital",repo:"izoko",price:"USD 34,500 — provisional asking price"},
{title:"PlayBeat Live",url:"https://playbeat.live",repo:"playbeat.live",price:"Offers invited; broadcast rights excluded"},
{title:"MakeThisDeal",url:"https://makethisdeal.biz",repo:"makethisdeal.biz",price:"Offers invited"},
{title:"MagXTV",url:"",repo:"magxtv.click",price:"Offers invited; sports content rights excluded"},
{title:"Lead Pulse CRM",url:"",repo:"eaedpulseplus",price:"Offers invited"},
{title:"PropertyAtlas",url:"",repo:"estate",price:"Offers invited"},
{title:"Automotive Dealership",url:"",repo:"dealershipautomotive",price:"Offers invited"},
{title:"Enterprise Business Suite",url:"",repo:"enterprise-",price:"Offers invited"}
];
const safe=v=>String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export default {async fetch(req,env){
const u=new URL(req.url);
if(u.pathname==="/api/projects")return Response.json({status:"unaudited",projects:products});
const cards=products.map(p=>'<article><h2>'+safe(p.title)+'</h2><p>'+safe(p.price)+'</p><a href="https://github.com/uzzirulzz-cyber/'+encodeURIComponent(p.repo)+'">GitHub</a> '+(p.url?'<a href="'+safe(p.url)+'">Website</a> ':'')+'<a href="mailto:playbeatdigital@gmail.com?subject='+encodeURIComponent("Acquisition inquiry: "+p.title)+'">Contact seller</a></article>').join("");
return new Response('<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><title>PlayBeat Business Acquisitions</title><style>body{background:#080f1c;color:#f5f8ff;font:16px system-ui;margin:auto;max-width:1050px;padding:35px}article{background:#152037;border:1px solid #32425b;border-radius:15px;padding:20px;margin:15px 0}a{color:#9bc4ff;margin-right:14px}p{color:#c7d3e8}</style><h1>PlayBeat Digital Business Acquisitions</h1><p>Preliminary opportunities; all products are subject to code, rights, revenue and transfer verification. No payment or automated delivery is offered on this site.</p>'+cards+'<p>All offers require written agreement and verified escrow.</p></html>',{headers:{"content-type":"text/html;charset=utf-8","x-content-type-options":"nosniff"}});
}};
