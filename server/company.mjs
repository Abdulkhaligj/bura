// İşəgötürən məkanı: şirkət profili, komanda, elan sihirbazı və ATS.
// Youthall təhlilindəki MVP nüvəsi (şirkət → elan → ön seçim → müraciət → mərhələlər) BURA stack-ində.
export const JOB_TYPES=['Təcrübə','Tam ştat','Part-time','Gənc mütəxəssis','Könüllülük','Müqavilə','Freelance'];
export const WORK_MODES=['Ofisdə','Hibrid','Uzaqdan'];
export const SIZES=['1–10','11–50','51–200','201–1000','1000+'];
export const STAGES=['submitted','reviewing','interview','offer','accepted','rejected'];
export const STAGE_LABELS={submitted:'Göndərildi',reviewing:'Baxılır',interview:'Müsahibə',offer:'Təklif',accepted:'Qəbul edildi',rejected:'Qəbul edilmədi',withdrawn:'Geri götürüldü'};
const ROLES=['owner','recruiter','viewer'];
const EDITORS=['owner','recruiter'];
const clip=(x,max)=>typeof x==='string'?x.trim().slice(0,max):'';
const low=x=>String(x||'').trim().toLocaleLowerCase('az');
export const skillList=x=>(Array.isArray(x)?x:String(x||'').split(',')).map(v=>clip(String(v),44)).filter(Boolean);

// Ön seçim sualları: mətn və variantlar elanda açıq, gözlənilən cavab private_data-da.
export function jobQuestions(list,fail){
 if(list==null)return {pub:[],priv:[]};
 if(!Array.isArray(list)||list.length>8)fail('Ən çox 8 ön seçim sualı əlavə et.');
 const pub=[],priv=[];
 list.forEach((x,i)=>{
  const n=i+1,text=clip(x?.text,240),type=['yesno','choice','text'].includes(x?.type)?x.type:'yesno';
  if(text.length<5)fail(`${n}-ci sualın mətni çox qısadır.`);
  const options=type==='choice'?(Array.isArray(x.options)?x.options:[]).map(o=>clip(String(o),80)).filter(Boolean).slice(0,6):[];
  if(type==='choice'&&options.length<2)fail(`${n}-ci sual üçün ən az 2 variant yaz.`);
  const knockout=type!=='text'&&x.knockout===true;let expected=null;
  if(knockout){expected=type==='yesno'?(x.expected==='no'?'no':'yes'):Number(x.expected);if(type==='choice'&&!(Number.isInteger(expected)&&expected>=0&&expected<options.length))fail(`${n}-ci sualın eleyici cavabını seç.`)}
  pub.push({id:'q'+n,text,type,options});priv.push({id:'q'+n,knockout,expected});
 });
 return {pub,priv};
}

// Müraciət cavablarını yoxlayır; eleyici suala uyğun olmayan cavab müraciəti "ön seçimdən keçmədi" kimi işarələyir.
export function screen(questions,rules,given,fail){
 const g=given&&typeof given==='object'?given:{};let knockout=false;
 const answers=(questions||[]).map(q=>{
  const raw=g[q.id];let value;
  if(q.type==='yesno'){if(!['yes','no'].includes(raw))fail('Bütün ön seçim suallarını cavablandır.');value=raw}
  else if(q.type==='choice'){value=Number(raw);if(!Number.isInteger(value)||value<0||value>=q.options.length)fail('Bütün ön seçim suallarını cavablandır.')}
  else{value=clip(raw,1000);if(value.length<2)fail('Bütün ön seçim suallarını cavablandır.')}
  const rule=(rules||[]).find(r=>r.id===q.id),passed=!rule?.knockout||rule.expected===value;
  if(!passed)knockout=true;
  return {id:q.id,text:q.text,type:q.type,value,label:q.type==='yesno'?(value==='yes'?'Bəli':'Xeyr'):q.type==='choice'?q.options[value]:value,knockout:!!rule?.knockout,passed};
 });
 return {answers,knockout};
}

// Elanın bacarıqları ilə profil + Arzu Kompası bacarıqlarının üst-üstə düşməsi.
export function matchScore(jobSkills,skills){
 const want=skillList(jobSkills).map(low);if(!want.length)return null;
 const have=skillList(skills).map(low);
 const hit=want.filter(s=>have.some(h=>h===s||(h.length>3&&s.length>3&&(h.includes(s)||s.includes(h))))).length;
 return Math.round(hit/want.length*100);
}

const csvCell=v=>{let s=String(v??'');if(/^[=+\-@\t\r]/.test(s))s="'"+s;return /[",\n;]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s};

export async function companyRole(c,orgId){
 if(!c.user||!orgId)return null;
 const org=await c.one("SELECT owner_id FROM content WHERE id=? AND kind='organization'",orgId);if(!org)return null;
 if(c.user.role==='admin'||org.owner_id===c.user.id)return 'owner';
 return (await c.one("SELECT role FROM memberships WHERE user_id=? AND organization_id=? AND status='active'",c.user.id,orgId))?.role||null;
}
async function need(c,orgId,roles){const role=await companyRole(c,orgId);if(!roles.includes(role))c.fail(role?'Bu əməliyyat üçün rolun kifayət etmir.':'Bu şirkəti idarə edə bilməzsən.',403);return role}
const orgOf=async(c,id)=>{const o=await c.one("SELECT * FROM content WHERE id=? AND kind='organization'",id);if(!o)c.fail('Şirkət tapılmadı.',404);return o};
const jobOf=async(c,id)=>{const j=await c.one("SELECT * FROM content WHERE id=? AND kind='opportunity'",id);if(!j||!j.organization_id)c.fail('Elan tapılmadı.',404);return j};
const futureDate=(c,v)=>{const d=clip(v,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(d)||!Number.isFinite(new Date(d).getTime())||new Date(d+'T23:59:59+04:00').getTime()<c.now())c.fail('Son müraciət tarixi gələcəkdə olmalıdır.');return d};
const jobLimit=c=>Number(c.env.BURA_FREE_JOB_LIMIT)||5;

export async function adminQueue(c){
 const orgs=await c.all("SELECT * FROM content WHERE kind='organization' AND status!='archived' AND json_extract(private_data,'$.voen') IS NOT NULL AND COALESCE(json_extract(body,'$.verified'),0)=0 ORDER BY updated_at DESC");
 return {
  companies:orgs.map(o=>({...c.publicContent(o),voen:c.parse(o.private_data).voen,legalName:c.parse(o.private_data).legalName})),
  claims:(await c.all("SELECT m.user_id,m.organization_id,m.created_at,u.name,u.email,o.title,o.private_data FROM memberships m JOIN users u ON u.id=m.user_id JOIN content o ON o.id=m.organization_id WHERE m.status='pending'")).map(({private_data,...r})=>({...r,claim:c.parse(private_data).claims?.[r.user_id]||{}}))
 };
}

export async function companyRoutes(c){
 const {path,method,user}=c;
 if(!path.startsWith('/api/compan')&&!path.startsWith('/api/jobs')&&!path.startsWith('/api/applications'))return null;

 if(path==='/api/company'&&method==='GET'){
  c.auth();
  const orgs=await c.all("SELECT * FROM content WHERE kind='organization' AND status!='archived' AND (owner_id=? OR id IN (SELECT organization_id FROM memberships WHERE user_id=? AND status='active')) ORDER BY created_at",user.id,user.id);
  const companies=[];
  for(const o of orgs){
   const role=await companyRole(c,o.id),priv=c.parse(o.private_data);
   const jobs=(await c.all("SELECT c.*,(SELECT count(*) FROM applications a WHERE a.item_id=c.id AND a.status!='withdrawn') applications,(SELECT count(*) FROM applications a WHERE a.item_id=c.id AND a.status='submitted') fresh,COALESCE((SELECT v.count FROM content_views v WHERE v.item_id=c.id),0) views FROM content c WHERE c.kind='opportunity' AND c.organization_id=? AND c.status!='archived' ORDER BY c.updated_at DESC",o.id))
    .map(j=>({...c.publicContent(j),applications:j.applications,fresh:j.fresh,views:j.views,screening:EDITORS.includes(role)?c.parse(j.private_data).screening||[]:undefined}));
   const members=await c.all("SELECT m.user_id,m.role,m.status,u.name,u.email FROM memberships m JOIN users u ON u.id=m.user_id WHERE m.organization_id=? AND m.status='active' ORDER BY m.created_at",o.id);
   if(o.owner_id&&!members.some(m=>m.user_id===o.owner_id)){const u=await c.one('SELECT id,name,email FROM users WHERE id=?',o.owner_id);if(u)members.unshift({user_id:u.id,role:'owner',status:'active',name:u.name,email:u.email})}
   companies.push({company:{...c.publicContent(o),...(role==='owner'?{voen:priv.voen||'',legalName:priv.legalName||''}:{})},role,
    stats:{followers:(await c.one("SELECT count(*) n FROM interactions WHERE item_id=? AND kind='follow'",o.id)).n,live:jobs.filter(j=>j.status==='published').length,active:jobs.filter(j=>['published','pending'].includes(j.status)).length,
     applications:jobs.reduce((s,j)=>s+j.applications,0),fresh:jobs.reduce((s,j)=>s+j.fresh,0),views:jobs.reduce((s,j)=>s+j.views,0)},
    jobs,members:members.map(m=>role==='viewer'?{...m,email:undefined}:m),
    recent:await c.all("SELECT a.id,a.item_id,a.status,a.knockout,a.match_score,a.created_at,u.name,j.title FROM applications a JOIN content j ON j.id=a.item_id JOIN users u ON u.id=a.user_id WHERE j.organization_id=? AND a.status!='withdrawn' ORDER BY a.created_at DESC LIMIT 6",o.id),
    children:await c.all("SELECT id,title FROM content WHERE kind='organization' AND status='published' AND json_extract(body,'$.parentId')=?",o.id)});
  }
  return c.json({companies,limit:jobLimit(c),
   claimable:(await c.all("SELECT id,title,body FROM content WHERE kind='organization' AND status='published' AND owner_id IS NULL AND json_extract(body,'$.unclaimed')=1 AND COALESCE(json_extract(body,'$.type'),'company')='company' ORDER BY title")).map(o=>({id:o.id,title:o.title,sector:c.parse(o.body).sector||''})),
   claims:await c.all("SELECT m.organization_id,m.created_at,o.title FROM memberships m JOIN content o ON o.id=m.organization_id WHERE m.user_id=? AND m.status='pending'",user.id),
   options:{jobTypes:JOB_TYPES,workModes:WORK_MODES,sizes:SIZES,stages:STAGES}});
 }

 if(path==='/api/companies'&&method==='POST'){
  c.auth();await c.rate('company:'+user.id,20);const d=await c.read();
  const old=d.id?await orgOf(c,d.id):null;if(old)await need(c,old.id,['owner']);
  const voen=String(d.voen||'').replace(/\D/g,'');if(!/^\d{10}$/.test(voen))c.fail('VÖEN 10 rəqəmdən ibarət olmalıdır.');
  let website='';if(d.website){website=c.str(d.website,4,200);if(!/^https?:\/\/[^\s/]+\.[^\s]+$/i.test(website))c.fail('Veb saytı https:// ilə başlayan tam ünvanla yaz.')}
  let parentId=null;if(d.parentId){if(d.parentId===old?.id)c.fail('Şirkət özünün ana şirkəti ola bilməz.');await orgOf(c,d.parentId);await need(c,d.parentId,['owner']);parentId=d.parentId}
  const ob=old?c.parse(old.body):{},op=old?c.parse(old.private_data):{};
  const body={...ob,type:'company',sector:c.str(d.sector||'Digər',2,60),city:c.str(d.city||'Bakı',2,60),sizeRange:SIZES.includes(d.sizeRange)?d.sizeRange:SIZES[0],website,
   description:c.str(d.about,30,5000),parentId,unclaimed:false,verified:ob.verified===true&&op.voen===voen};
  const priv={...op,voen,legalName:c.str(d.legalName||d.name,2,160)};
  const oid=old?.id||c.id(),status=old?old.status:user.role==='admin'?'published':'pending';
  await c.db.batch([
   c.q('INSERT INTO content (id,kind,title,owner_id,status,body,private_data,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,body=excluded.body,private_data=excluded.private_data,updated_at=excluded.updated_at',oid,'organization',c.str(d.name,2,120),old?.owner_id||user.id,status,JSON.stringify(body),JSON.stringify(priv),c.now(),c.now()),
   c.q("INSERT OR IGNORE INTO memberships (user_id,organization_id,role,status,created_at) VALUES (?,?,'owner','active',?)",old?.owner_id||user.id,oid,c.now())]);
  return c.json({id:oid,status,verified:body.verified});
 }

 const co=path.match(/^\/api\/companies\/([^/]+)\/(claim|members|verify|claims)$/);
 if(co&&method==='POST'){
  c.auth();const [,oid,action]=co,org=await orgOf(c,oid),d=await c.read(),body=c.parse(org.body),priv=c.parse(org.private_data);
  if(action==='claim'){
   await c.rate('claim:'+user.id,5);
   if(org.owner_id||!body.unclaimed)c.fail('Bu profilin artıq sahibi var.',409);
   const voen=String(d.voen||'').replace(/\D/g,'');if(!/^\d{10}$/.test(voen))c.fail('VÖEN 10 rəqəmdən ibarət olmalıdır.');
   priv.claims={...(priv.claims||{}),[user.id]:{voen,title:c.str(d.title,2,100),at:c.now()}};
   const admins=await c.all("SELECT id FROM users WHERE role='admin'");
   await c.db.batch([c.q("INSERT INTO memberships (user_id,organization_id,role,status,created_at) VALUES (?,?,'owner','pending',?) ON CONFLICT(user_id,organization_id) DO UPDATE SET status='pending',role='owner'",user.id,oid,c.now()),
    c.q('UPDATE content SET private_data=? WHERE id=?',JSON.stringify(priv),oid),...admins.map(a=>c.notify(a.id,org.title+' profili üçün sahiblik müraciəti var.','#/manage'))]);
   return c.json({status:'pending'});
  }
  if(action==='members'){
   await need(c,oid,['owner']);
   if(d.remove){
    const target=c.str(d.userId,1,80);if(target===org.owner_id)c.fail('Şirkət sahibini komandadan çıxarmaq olmaz.');
    await c.q('DELETE FROM memberships WHERE user_id=? AND organization_id=?',target,oid).run();return c.json({ok:true});
   }
   const email=c.str(d.email,5,254).toLowerCase(),role=ROLES.includes(d.role)?d.role:'recruiter';
   const u=await c.one('SELECT id,name FROM users WHERE email=?',email);if(!u)c.fail('Bu e-poçt ilə BURA hesabı tapılmadı. Komanda üzvü əvvəlcə qeydiyyatdan keçməlidir.',404);
   if(u.id===org.owner_id)c.fail('Bu istifadəçi artıq şirkət sahibidir.',409);
   await c.db.batch([c.q("INSERT INTO memberships (user_id,organization_id,role,status,created_at) VALUES (?,?,?,'active',?) ON CONFLICT(user_id,organization_id) DO UPDATE SET role=excluded.role,status='active'",u.id,oid,role,c.now()),
    c.notify(u.id,org.title+' komandasına əlavə olundun.','#/company')]);
   return c.json({ok:true,name:u.name});
  }
  c.admin();
  if(action==='verify'){
   const ok=d.verified===true;body.verified=ok;
   await c.db.batch([c.q('UPDATE content SET body=?,status=?,updated_at=? WHERE id=?',JSON.stringify(body),ok?'published':org.status,c.now(),oid),
    ...(ok?[c.q("UPDATE content SET status='published',updated_at=? WHERE kind='opportunity' AND organization_id=? AND status='pending'",c.now(),oid)]:[]),
    c.q('INSERT INTO audit (id,user_id,action,item_id,created_at) VALUES (?,?,?,?,?)',c.id(),user.id,ok?'company:verify':'company:unverify',oid,c.now()),
    ...(org.owner_id?[c.notify(org.owner_id,ok?org.title+' təsdiqləndi. Elanlar artıq dərhal yayımlanır.':org.title+' təsdiqi geri alındı.','#/company')]:[])]);
   return c.json({ok:true});
  }
  if(action==='claims'){
   const target=c.str(d.userId,1,80),claim=priv.claims?.[target];
   if(!await c.one("SELECT 1 FROM memberships WHERE user_id=? AND organization_id=? AND status='pending'",target,oid))c.fail('Sahiblik müraciəti tapılmadı.',404);
   if(d.approve===true){
    if(org.owner_id)c.fail('Bu profilin artıq sahibi var.',409);
    Object.assign(body,{unclaimed:false,description:body.description?.startsWith('Kataloq profili')?'':body.description});priv.voen=claim?.voen;delete priv.claims?.[target];
    await c.db.batch([c.q("UPDATE memberships SET status='active' WHERE user_id=? AND organization_id=?",target,oid),
     c.q('UPDATE content SET owner_id=?,body=?,private_data=?,updated_at=? WHERE id=?',target,JSON.stringify(body),JSON.stringify(priv),c.now(),oid),
     c.notify(target,org.title+' profili artıq sənin idarənlədir.','#/company')]);
   }else{
    delete priv.claims?.[target];
    await c.db.batch([c.q('DELETE FROM memberships WHERE user_id=? AND organization_id=?',target,oid),c.q('UPDATE content SET private_data=? WHERE id=?',JSON.stringify(priv),oid),
     c.notify(target,org.title+' üçün sahiblik müraciəti təsdiqlənmədi.','#/company')]);
   }
   return c.json({ok:true});
  }
 }

 if(path==='/api/jobs'&&method==='POST'){
  c.auth();await c.rate('job:'+user.id,60);const d=await c.read();
  const old=d.id?await jobOf(c,d.id):null,orgId=old?.organization_id||d.organization_id;if(!orgId)c.fail('Şirkət seç.');
  const org=await orgOf(c,orgId);await need(c,orgId,EDITORS);
  const draft=d.intent==='draft',ob=old?c.parse(old.body):{},op=old?c.parse(old.private_data):{};
  if(draft&&['published','pending'].includes(old?.status))c.fail('Aktiv elanı qaralamaya çevirmək olmaz. Dəyişikliyi yadda saxla və ya elanı bağla.',409);
  const {pub,priv}=jobQuestions(d.questions,c.fail);
  if(old){const used=(await c.one('SELECT count(*) n FROM applications WHERE item_id=?',old.id)).n;if(used&&JSON.stringify(pub)!==JSON.stringify(ob.questions||[]))c.fail('Müraciət gəldikdən sonra ön seçim sualları dəyişdirilə bilməz.',409)}
  const body={...ob,category:JOB_TYPES.includes(d.category)?d.category:JOB_TYPES[0],format:WORK_MODES.includes(d.format)?d.format:WORK_MODES[0],
   city:c.str(d.city||'Bakı',2,60),salary:c.str(d.salary||'',0,60),skills:skillList(d.skills).slice(0,12),
   description:c.str(d.description||'',draft?0:30,5000),requirements:c.str(d.requirements||'',0,3000),questions:pub,
   deadline:draft&&!d.deadline?'':futureDate(c,d.deadline)};
  let status='draft';
  if(!draft){
   status=user.role==='admin'||c.parse(org.body).verified===true?'published':'pending';
   if(!['published','pending'].includes(old?.status)){
    const active=(await c.one("SELECT count(*) n FROM content WHERE kind='opportunity' AND organization_id=? AND status IN ('published','pending') AND id!=?",orgId,old?.id||'')).n;
    if(active>=jobLimit(c))c.fail(`Pulsuz planda eyni vaxtda ən çox ${jobLimit(c)} aktiv elan ola bilər. Köhnə elanı bağla.`,402);
   }else if(old.status==='published')status='published';
  }
  const jid=old?.id||c.id();
  await c.q('INSERT INTO content (id,kind,title,organization_id,owner_id,status,body,private_data,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,body=excluded.body,private_data=excluded.private_data,status=excluded.status,updated_at=excluded.updated_at',
   jid,'opportunity',c.str(d.title,3,160),orgId,old?.owner_id||user.id,status,JSON.stringify(body),JSON.stringify({...op,screening:priv}),c.now(),c.now()).run();
  return c.json({id:jid,status});
 }

 const jm=path.match(/^\/api\/jobs\/([^/]+)\/(status|applications|export)$/);
 if(jm){
  c.auth();const [,jid,action]=jm,job=await jobOf(c,jid);
  if(action==='status'&&method==='POST'){
   await need(c,job.organization_id,EDITORS);const d=await c.read();
   if(d.status==='closed'){if(!['published','pending'].includes(job.status))c.fail('Yalnız aktiv elan bağlana bilər.',409)}
   else if(d.status==='open'){
    if(job.status!=='closed')c.fail('Yalnız bağlanmış elan yenidən açıla bilər.',409);
    futureDate(c,c.parse(job.body).deadline);
    const active=(await c.one("SELECT count(*) n FROM content WHERE kind='opportunity' AND organization_id=? AND status IN ('published','pending')",job.organization_id)).n;
    if(active>=jobLimit(c))c.fail(`Pulsuz planda eyni vaxtda ən çox ${jobLimit(c)} aktiv elan ola bilər.`,402);
   }else c.fail('Status düzgün deyil.');
   const org=await orgOf(c,job.organization_id),next=d.status==='closed'?'closed':user.role==='admin'||c.parse(org.body).verified===true?'published':'pending';
   await c.q('UPDATE content SET status=?,updated_at=? WHERE id=?',next,c.now(),jid).run();return c.json({status:next});
  }
  if(method!=='GET')c.fail('Əməliyyat tapılmadı.',404);
  const role=await need(c,job.organization_id,ROLES);
  const rows=(await c.all('SELECT a.id,a.user_id,a.status,a.note,a.profile,a.answers,a.knockout,a.rating,a.match_score,a.created_at,a.updated_at,u.name,u.email FROM applications a JOIN users u ON u.id=a.user_id WHERE a.item_id=? ORDER BY a.created_at DESC',jid))
   .map(r=>({...r,profile:c.parse(r.profile),answers:JSON.parse(r.answers||'[]')}));
  if(action==='applications')return c.json({job:{...c.publicContent(job),screening:EDITORS.includes(role)?c.parse(job.private_data).screening||[]:undefined},role,applications:rows,stages:STAGES});
  const qs=c.parse(job.body).questions||[];
  const head=['Ad','E-poçt','Status','Müraciət tarixi','Universitet','İxtisas','Şəhər','Bacarıqlar','Uyğunluq %','Ön seçim','Qiymət','Arzu Kompası yolu','Qeyd',...qs.map(q=>q.text)];
  const lines=rows.map(r=>{const p=r.profile.profile||{};return [r.name,r.email,STAGE_LABELS[r.status]||r.status,new Date(r.created_at).toISOString().slice(0,10),p.university,p.specialty,p.city,p.skills,r.match_score??'',r.knockout?'Keçmədi':'Keçdi',r.rating??'',r.profile.compass?.path||'',r.note,...qs.map(q=>r.answers.find(a=>a.id===q.id)?.label??'')]});
  const csv='﻿'+[head,...lines].map(l=>l.map(csvCell).join(',')).join('\r\n');
  return new Response(csv,{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':`attachment; filename="muracietler-${jid.slice(0,8)}.csv"`,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
 }

 if(path==='/api/applications/bulk'&&method==='POST'){
  c.auth();const d=await c.read();if(!STAGES.includes(d.status))c.fail('Status düzgün deyil.');
  const ids=Array.isArray(d.ids)?[...new Set(d.ids.map(String))].slice(0,500):[];if(!ids.length)c.fail('Ən az bir müraciət seç.');
  const rows=await c.all(`SELECT a.id,a.user_id,a.status,j.organization_id,j.title FROM applications a JOIN content j ON j.id=a.item_id WHERE a.id IN (${ids.map(()=>'?').join(',')})`,...ids);
  if(rows.length!==ids.length)c.fail('Müraciət tapılmadı.',404);
  for(const org of new Set(rows.map(r=>r.organization_id)))await need(c,org,EDITORS);
  const moved=rows.filter(r=>r.status!=='withdrawn'&&r.status!==d.status);
  if(moved.length)await c.db.batch(moved.flatMap(r=>[c.q('UPDATE applications SET status=?,updated_at=? WHERE id=?',d.status,c.now(),r.id),
   c.q('INSERT INTO application_events (id,application_id,actor_id,type,body,created_at) VALUES (?,?,?,?,?,?)',c.id(),r.id,user.id,'status',JSON.stringify({from:r.status,to:d.status}),c.now()),
   c.notify(r.user_id,`${r.title}: müraciətinin statusu — ${STAGE_LABELS[d.status]}.`,'#/profile')]));
  return c.json({updated:moved.length});
 }

 const am=path.match(/^\/api\/applications\/([^/]+)$/);
 if(am){
  c.auth();const a=await c.one('SELECT a.*,j.organization_id,j.title FROM applications a JOIN content j ON j.id=a.item_id WHERE a.id=?',am[1]);if(!a)c.fail('Müraciət tapılmadı.',404);
  if(method==='GET'){
   await need(c,a.organization_id,ROLES);
   const events=await c.all('SELECT e.id,e.type,e.body,e.created_at,u.name actor FROM application_events e LEFT JOIN users u ON u.id=e.actor_id WHERE e.application_id=? ORDER BY e.created_at',a.id);
   const u=await c.one('SELECT name,email FROM users WHERE id=?',a.user_id);
   return c.json({application:{...a,private_data:undefined,...u,profile:c.parse(a.profile),answers:JSON.parse(a.answers||'[]')},events:events.map(e=>({...e,body:c.parse(e.body)}))});
  }
  if(method!=='POST')c.fail('Əməliyyat tapılmadı.',404);
  await need(c,a.organization_id,EDITORS);const d=await c.read(),stmts=[];
  const event=(type,body)=>c.q('INSERT INTO application_events (id,application_id,actor_id,type,body,created_at) VALUES (?,?,?,?,?,?)',c.id(),a.id,user.id,type,JSON.stringify(body),c.now());
  if(d.status!==undefined&&d.status!==a.status){
   if(a.status==='withdrawn')c.fail('Müraciət geri götürülüb.',409);if(!STAGES.includes(d.status))c.fail('Status düzgün deyil.');
   stmts.push(c.q('UPDATE applications SET status=?,updated_at=? WHERE id=?',d.status,c.now(),a.id),event('status',{from:a.status,to:d.status}),c.notify(a.user_id,`${a.title}: müraciətinin statusu — ${STAGE_LABELS[d.status]}.`,'#/profile'));
  }
  if(d.rating!==undefined){const r=Number(d.rating);if(!Number.isInteger(r)||r<1||r>5)c.fail('1–5 arası qiymət seç.');stmts.push(c.q('UPDATE applications SET rating=? WHERE id=?',r,a.id),event('rating',{rating:r}))}
  if(d.note!==undefined)stmts.push(event('note',{text:c.str(d.note,2,2000)}));
  if(!stmts.length)c.fail('Dəyişiklik yoxdur.');
  await c.db.batch(stmts);return c.json({ok:true});
 }
 return null;
}
