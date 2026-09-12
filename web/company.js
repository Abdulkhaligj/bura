// İşəgötürən məkanı: şirkət profili, elan sihirbazı, ATS lövhəsi və komanda.
// app.js-in köməkçiləri init() ilə ötürülür; bu modul yalnız şirkət paneli açılanda yüklənir.
let x;
const S = { data: null, current: null, wizard: null, ats: null, filter: { q: '', knockout: 'all', university: '', sort: 'new' }, selected: new Set() };
const ROLE = { owner: 'Sahib', recruiter: 'İşə qəbul mütəxəssisi', viewer: 'Müşahidəçi' };
const JOB_STATUS = { draft: 'Qaralama', pending: 'Yoxlamada', published: 'Yayımda', closed: 'Bağlanıb', archived: 'Arxivdə' };
const STAGE = { submitted: 'Yeni', reviewing: 'Baxılır', interview: 'Müsahibə', offer: 'Təklif', accepted: 'Qəbul', rejected: 'Rədd' };
const QTYPE = { yesno: 'Bəli / Xeyr', choice: 'Variantlı', text: 'Açıq cavab' };
const EVENT = { submitted: 'Müraciət göndərildi', status: 'Status dəyişdi', note: 'Qeyd', rating: 'Qiymət' };
const TEMPLATES = [
  { text: 'Bakıda ofisə gələ bilərsən?', type: 'yesno', knockout: true, expected: 'yes' },
  { text: 'Həftədə neçə saat ayıra bilərsən?', type: 'choice', options: ['10 saatdan az', '10–20 saat', '20 saatdan çox'], knockout: false },
  { text: 'İngilis dili səviyyən necədir?', type: 'choice', options: ['Başlanğıc', 'Orta', 'Yüksək'], knockout: false },
  { text: 'Bu rol üçün niyə uyğun olduğunu bir-iki cümlə ilə yaz.', type: 'text' }
];

export function init(ctx) { x = ctx; }

const cur = () => S.data?.companies.find(c => c.company.id === S.current);
const editor = () => ['owner', 'recruiter'].includes(cur()?.role);
const opt = (list, value, labels) => list.map(v => `<option value="${x.esc(v)}" ${v === value ? 'selected' : ''}>${x.esc(labels ? labels[v] : v)}</option>`).join('');
const select = (name, title, list, value, labels, extra = '') => `<label>${title}<select name="${name}" ${extra}>${opt(list, value, labels)}</select></label>`;
const tag = (text, cls = '') => `<span class="tag ${cls}">${x.esc(text)}</span>`;
const jobTag = s => tag(JOB_STATUS[s] || s, s === 'published' ? 'green' : s === 'draft' || s === 'closed' ? '' : 'sample');

async function load() {
  S.data = await x.api('/company');
  if (!S.data.companies.some(c => c.company.id === S.current)) S.current = S.data.companies[0]?.company.id || null;
  return S.data;
}
function paint(html) { x.$('#main').innerHTML = html; x.refreshIcons(); }

export async function page(path) {
  const [, sub, id] = path.split('/');
  await load();
  if (sub === 'create') return companyForm(null);
  if (!S.data.companies.length) return startPage();
  if (sub === 'new' || sub === 'edit') return wizardEntry(id);
  if (sub === 'ats') { await loadAts(id); return atsPage(); }
  return tabs(sub || 'overview');
}

/* ── başlanğıc: şirkət yarat və ya kataloqdakı profili iddia et ── */
function startPage() {
  const d = S.data;
  return x.header('İşəgötürən məkanı.', 'Şirkət profilini yarat, elan ver, müraciətləri mərhələlərlə idarə et.') +
    `<div class="grid two"><article class="card"><div class="course-cover">${x.ico('building-2')}<span>↗</span></div><h2>Yeni şirkət profili</h2><p class="subtle">VÖEN ilə qeydiyyat. Admin təsdiqindən sonra elanların dərhal yayımlanır.</p><a class="btn" href="#/company/create">Profil yarat ${x.ico('arrow-right')}</a></article>
    <article class="card"><h2>Şirkətin kataloqda var?</h2><p class="subtle">Profilə sahiblik müraciəti göndər. VÖEN yoxlanıldıqdan sonra idarəetmə sənə keçir.</p>
    ${d.claimable.length ? `<form data-form="co-claim">${select('organization_id', 'Şirkət', d.claimable.map(c => c.id), '', Object.fromEntries(d.claimable.map(c => [c.id, c.title])))}${x.field('voen', 'VÖEN (10 rəqəm)', '', 'text', true)}${x.field('title', 'Şirkətdə vəzifən', '', 'text', true)}<button class="btn light" type="submit">Sahiblik müraciəti göndər</button><div class="form-message" role="status"></div></form>` : '<p class="subtle">Hazırda iddia ediləcək kataloq profili yoxdur.</p>'}
    ${d.claims.length ? `<div class="notice">Gözləyən müraciətlərin: ${d.claims.map(c => x.esc(c.title)).join(', ')}</div>` : ''}</article></div>`;
}

function companyForm(entry) {
  const c = entry?.company, b = c?.body || {}, owned = (S.data?.companies || []).filter(e => e.role === 'owner' && e.company.id !== c?.id);
  return (entry ? '' : `<a class="textlink" href="#/company">← Geri</a>`) +
    (entry ? '' : x.header('Şirkət profili yarat.', 'Namizədlər bu profili görəcək. VÖEN və hüquqi ad yalnız təsdiq üçündür, açıq göstərilmir.')) +
    `<section class="card formbox"><form data-form="co-company" data-id="${c?.id || ''}"><div class="field-grid">
    ${x.field('name', 'Brend adı', c?.title || '', 'text', true)}${x.field('legalName', 'Hüquqi ad (məs. “... MMC”)', c?.legalName || '', 'text', true)}
    ${x.field('voen', 'VÖEN (10 rəqəm)', c?.voen || '', 'text', true)}${x.field('sector', 'Sahə', b.sector || '', 'text', true)}
    ${select('sizeRange', 'Əməkdaş sayı', S.data?.options.sizes || ['1–10'], b.sizeRange)}${x.field('city', 'Şəhər', b.city || 'Bakı', 'text', true)}
    ${x.field('website', 'Veb sayt (istəyə bağlı)', b.website || '', 'url')}
    ${owned.length ? `<label>Ana şirkət (holdinq)<select name="parentId"><option value="">Yoxdur</option>${owned.map(o => `<option value="${o.company.id}" ${b.parentId === o.company.id ? 'selected' : ''}>${x.esc(o.company.title)}</option>`).join('')}</select></label>` : ''}
    ${x.area('about', 'Şirkət haqqında (ən az 30 simvol)', b.description || '', true)}</div>
    <button class="btn" type="submit">${c ? 'Dəyişiklikləri saxla' : 'Profili yarat'}</button><div class="form-message" role="status"></div></form></section>`;
}

/* ── panel və tablar ── */
function tabs(tab) {
  const e = cur(), c = e.company, b = c.body;
  const nav = [['overview', 'Ümumi baxış'], ['jobs', 'Elanlar'], ['team', 'Komanda'], ...(e.role === 'owner' ? [['profile', 'Şirkət profili']] : [])];
  const head = `<div class="co-head"><div class="org-row">${x.logo(c)}<div><p class="orgname">${x.esc(ROLE[e.role])}</p><h1>${x.esc(c.title)}</h1><div class="pillrow">${b.verified ? tag('✓ Təsdiqlənmiş şirkət', 'green') : tag(c.status === 'published' ? 'VÖEN təsdiqi gözlənilir' : 'Profil yoxlamadadır', 'sample')}${tag(b.sector || 'Şirkət')}${b.sizeRange ? tag(b.sizeRange + ' əməkdaş') : ''}</div></div></div>
    <div class="actions">${S.data.companies.length > 1 ? `<label class="co-switch">Şirkət<select data-co-filter="company">${S.data.companies.map(o => `<option value="${o.company.id}" ${o.company.id === c.id ? 'selected' : ''}>${x.esc(o.company.title)}</option>`).join('')}</select></label>` : ''}${editor() ? `<a class="btn" href="#/company/new">${x.ico('plus')} Yeni elan</a>` : ''}</div></div>
    <nav class="co-tabs" aria-label="Şirkət paneli">${nav.map(([k, t]) => `<a href="#/company/${k}" class="${k === tab ? 'active' : ''}" ${k === tab ? 'aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
    ${!b.verified ? `<div class="notice warning">${c.status === 'published' ? 'Şirkət profili açıqdır, amma VÖEN hələ təsdiqlənməyib: elanlar admin yoxlamasından sonra yayımlanır.' : 'Şirkət profili admin yoxlamasındadır. Elan hazırlaya bilərsən; təsdiqdən sonra yayımlanacaq.'}</div>` : ''}`;
  const body = tab === 'jobs' ? jobsTab() : tab === 'team' ? teamTab() : tab === 'profile' && e.role === 'owner' ? companyForm(e) : overviewTab();
  return head + body;
}

function overviewTab() {
  const e = cur(), s = e.stats, b = e.company.body;
  const steps = [
    [!!(b.description && b.website), 'Şirkət profilini tamamla', '#/company/profile'],
    [!!b.verified, 'VÖEN təsdiqi', '#/company/profile'],
    [e.jobs.some(j => j.status === 'published'), 'İlk elanı yayımla', '#/company/new'],
    [e.members.length > 1, 'Komandaya üzv əlavə et', '#/company/team'],
    [e.recent.some(r => r.status !== 'submitted'), 'İlk müraciətə cavab ver', '#/company/jobs']
  ];
  const done = steps.filter(x => x[0]).length;
  return `<div class="stat-grid"><div class="stat"><strong>${s.followers}</strong><span>İzləyici</span></div><div class="stat"><strong>${s.active}/${S.data.limit}</strong><span>Aktiv elan · pulsuz plan</span></div><div class="stat"><strong>${s.applications}</strong><span>Müraciət · ${s.fresh} yeni</span></div><div class="stat"><strong>${s.views}</strong><span>Elan baxışı</span></div></div>
  <div class="grid two"><article class="card"><p class="orgname">Başlanğıc addımları</p><h2>${done}/${steps.length} tamamlandı</h2><div class="progress"><i style="width:${done / steps.length * 100}%"></i></div>
  <div class="stack">${steps.map(([ok, t, href]) => `<a class="co-check ${ok ? 'done' : ''}" href="${href}">${x.ico(ok ? 'check' : 'chevron-right')}<span>${t}</span></a>`).join('')}</div></article>
  <article class="card"><p class="orgname">Son müraciətlər</p>${e.recent.length ? e.recent.map(r => `<a class="row co-recent" href="#/company/ats/${r.item_id}"><div><h3>${x.esc(r.name)}</h3><p class="subtle">${x.esc(r.title)} · ${x.azDate(r.created_at)}</p></div><div class="pillrow">${tag(STAGE[r.status] || r.status)}${r.knockout ? tag('Ön seçim ✕', 'sample') : ''}${r.match_score != null ? tag(r.match_score + '% uyğun', 'green') : ''}</div></a>`).join('') : '<p class="subtle">Müraciətlər gəldikcə burada görünəcək.</p>'}</article></div>`;
}

function jobsTab() {
  const e = cur(), drafts = e.jobs.filter(j => j.status === 'draft'), rest = e.jobs.filter(j => j.status !== 'draft');
  const row = j => `<div class="row co-job"><div><h3>${x.esc(j.title)}</h3><p class="subtle">${[j.body.category, j.body.format, j.body.city].filter(Boolean).map(x.esc).join(' · ')}${j.body.deadline ? ' · son tarix ' + x.esc(j.body.deadline) : ''}</p>
    <div class="pillrow">${jobTag(j.status)}${tag(j.applications + ' müraciət')}${j.fresh ? tag(j.fresh + ' yeni', 'green') : ''}${tag(j.views + ' baxış')}${(j.body.questions || []).length ? tag(j.body.questions.length + ' ön seçim sualı') : ''}</div></div>
    <div class="actions">${j.status !== 'draft' ? `<a class="btn light" href="#/company/ats/${j.id}">${x.ico('users')} Namizədlər</a>` : ''}${editor() ? `<a class="btn white" href="#/company/edit/${j.id}">${j.status === 'draft' ? 'Davam et' : 'Redaktə'}</a>` : ''}
    ${editor() && ['published', 'pending'].includes(j.status) ? x.btn('Bağla', 'co-close', `data-id="${j.id}"`, 'white') : ''}${editor() && j.status === 'closed' ? x.btn('Yenidən aç', 'co-open', `data-id="${j.id}"`, 'white') : ''}${j.status === 'published' ? `<a class="textlink" href="#/item/${j.id}">Elana bax ${x.ico('arrow-up-right')}</a>` : ''}</div></div>`;
  return (drafts.length ? `<div class="section-head"><h2>Qaralamalar</h2></div><div class="card stack">${drafts.map(row).join('')}</div>` : '') +
    `<div class="section-head"><h2>Elanlar</h2><p>Pulsuz planda eyni vaxtda ${S.data.limit} aktiv elan.</p></div><div class="card stack">${rest.map(row).join('') || x.empty('Hələ elan yoxdur.', 'İlk elanını 4 addımda hazırla: əsas məlumat, detallar, ön seçim sualları, önizləmə.') + (editor() ? `<a class="btn" href="#/company/new">Yeni elan</a>` : '')}</div>`;
}

function teamTab() {
  const e = cur();
  return `<div class="grid two"><article class="card"><p class="orgname">Komanda</p><div class="stack">${e.members.map(m => `<div class="row"><div><h3>${x.esc(m.name)}</h3><p class="subtle">${x.esc(m.email || '')}</p>${tag(ROLE[m.role] || m.role)}</div>${e.role === 'owner' && m.user_id !== e.company.owner_id && m.role !== 'owner' ? x.btn('Çıxar', 'co-member-remove', `data-id="${m.user_id}"`, 'white') : ''}</div>`).join('')}</div></article>
  <article class="card"><p class="orgname">Rollar</p><p class="subtle"><strong>Sahib</strong> — şirkət profili, komanda və elanlar. <strong>İşə qəbul mütəxəssisi</strong> — elan yaradır, namizədləri mərhələlərdə aparır. <strong>Müşahidəçi</strong> — namizədlərə yalnız baxır.</p>
  ${e.role === 'owner' ? `<form data-form="co-member">${x.field('email', 'BURA hesabının e-poçtu', '', 'email', true)}${select('role', 'Rol', ['recruiter', 'viewer', 'owner'], 'recruiter', ROLE)}<button class="btn" type="submit">Komandaya əlavə et</button><div class="form-message" role="status"></div></form>` : '<p class="subtle">Komanda üzvlərini yalnız şirkət sahibi idarə edir.</p>'}</article></div>`;
}

/* ── elan sihirbazı ── */
const STEPS = ['Əsas məlumat', 'Detallar', 'Ön seçim', 'Önizləmə'];
function wizardEntry(id) {
  const e = cur();
  if (!editor()) return x.empty('Elan yaratmaq üçün rolun kifayət etmir.', 'Şirkət sahibindən “İşə qəbul mütəxəssisi” rolu istə.');
  if (id) {
    const j = e.jobs.find(j => j.id === id); if (!j) return x.empty('Elan tapılmadı.', 'Elanlar siyahısına qayıt.');
    S.wizard = { id: j.id, status: j.status, step: 0, locked: j.applications > 0, title: j.title, category: j.body.category, format: j.body.format, city: j.body.city, deadline: j.body.deadline || '', salary: j.body.salary || '',
      skills: (j.body.skills || []).join(', '), description: j.body.description || '', requirements: j.body.requirements || '',
      questions: (j.body.questions || []).map(q => { const r = (j.screening || []).find(s => s.id === q.id) || {}; return { text: q.text, type: q.type, options: q.options || [], knockout: !!r.knockout, expected: r.expected }; }) };
    return wizardHTML();
  }
  const drafts = e.jobs.filter(j => j.status === 'draft');
  if (drafts.length && !S.freshWizard) return `<a class="textlink" href="#/company/jobs">← Elanlar</a>` + x.header('Yarımçıq qaralaman var.', 'Qaldığın yerdən davam et və ya yeni elan yarat.') +
    `<div class="card stack">${drafts.map(j => `<div class="row"><div><h3>${x.esc(j.title)}</h3><p class="subtle">Son dəyişiklik: ${x.azDate(j.updated_at)}</p></div><a class="btn light" href="#/company/edit/${j.id}">Davam et</a></div>`).join('')}</div><div class="actions">${x.btn('Yeni elan yarat', 'co-wizard-fresh')}</div>`;
  S.freshWizard = false;
  S.wizard = { id: null, status: null, step: 0, locked: false, title: '', category: S.data.options.jobTypes[0], format: S.data.options.workModes[0], city: e.company.body.city || 'Bakı', deadline: '', salary: '', skills: '', description: '', requirements: '', questions: [] };
  return wizardHTML();
}

function questionHTML(q, i, locked) {
  const dis = locked ? 'disabled' : '';
  return `<div class="co-q" data-q="${i}"><div class="co-q-head"><strong>${i + 1}</strong><select name="type" aria-label="Sual növü" ${dis}>${opt(Object.keys(QTYPE), q.type, QTYPE)}</select>${locked ? '' : `<button type="button" class="iconbtn" data-action="co-q-remove" data-i="${i}" aria-label="Sualı sil">${x.ico('trash-2')}</button>`}</div>
    <label>Sual<input name="text" value="${x.esc(q.text)}" maxlength="240" required ${dis}></label>
    ${q.type === 'choice' ? `<label>Variantlar — hər sətirdə biri<textarea name="options" rows="3" ${dis}>${x.esc((q.options || []).join('\n'))}</textarea></label>` : ''}
    ${q.type !== 'text' ? `<label class="choice"><input type="checkbox" name="knockout" ${q.knockout ? 'checked' : ''} ${dis}><span>Eleyici sual — gözlənilməyən cavab “ön seçimdən keçmədi” kimi işarələnir</span></label>
      ${q.knockout ? `<label>Gözlənilən cavab<select name="expected" ${dis}>${q.type === 'yesno' ? opt(['yes', 'no'], q.expected || 'yes', { yes: 'Bəli', no: 'Xeyr' }) : (q.options || []).map((o, k) => `<option value="${k}" ${Number(q.expected) === k ? 'selected' : ''}>${x.esc(o)}</option>`).join('')}</select></label>` : ''}` : ''}</div>`;
}

function wizardHTML() {
  const W = S.wizard, e = cur(), verified = e.company.body.verified, active = ['published', 'pending'].includes(W.status);
  const stepBody = [
    () => `<div class="field-grid">${x.field('title', 'Vəzifənin adı', W.title, 'text', true)}${select('category', 'Elan növü', S.data.options.jobTypes, W.category)}${select('format', 'İş formatı', S.data.options.workModes, W.format)}${x.field('city', 'Şəhər', W.city, 'text', true)}${x.field('deadline', 'Son müraciət tarixi', W.deadline, 'date', true)}${x.field('salary', 'Maaş (istəyə bağlı, məs. 600–900 ₼)', W.salary)}</div>`,
    () => `<div class="field-grid">${x.area('description', 'Vəzifə haqqında — nə edəcək, kiminlə işləyəcək (ən az 30 simvol)', W.description, true)}${x.area('requirements', 'Tələblər', W.requirements)}<label class="wide">Bacarıqlar — vergüllə<input name="skills" value="${x.esc(W.skills)}" placeholder="Excel, Planlama, İngilis dili"></label></div><p class="subtle">Bacarıqlar namizədin profili və Arzu Kompası nəticəsi ilə uyğunluq faizini hesablayır.</p>`,
    () => `${W.locked ? '<div class="notice warning">Bu elana müraciət gəlib: ön seçim sualları dəyişdirilə bilməz.</div>' : `<div class="pillrow">${TEMPLATES.map((t, i) => `<button type="button" class="chip" data-action="co-q-template" data-i="${i}">+ ${x.esc(t.text)}</button>`).join('')}</div>`}
      <div class="stack">${W.questions.map((q, i) => questionHTML(q, i, W.locked)).join('') || '<p class="subtle">Sual məcburi deyil. Əlavə etsən, namizəd müraciət zamanı cavablandıracaq.</p>'}</div>
      ${!W.locked && W.questions.length < 8 ? `<div class="actions">${x.btn(x.ico('plus') + ' Sual əlavə et', 'co-q-add', '', 'light')}</div>` : ''}`,
    () => `<article class="card co-preview"><p class="orgname">${x.esc(e.company.title)}</p><h2>${x.esc(W.title)}</h2><div class="pillrow">${[W.category, W.format, W.city, W.salary].filter(Boolean).map(t => tag(t)).join('')}</div><p>${x.esc(W.description)}</p>${W.requirements ? `<h3>Tələblər</h3><p>${x.esc(W.requirements)}</p>` : ''}${W.skills ? `<div class="pillrow">${W.skills.split(',').map(s => s.trim()).filter(Boolean).map(s => tag(s, 'green')).join('')}</div>` : ''}<div class="notice">Son müraciət: ${x.esc(W.deadline || '—')}</div>
      ${W.questions.length ? `<h3>Ön seçim sualları</h3><ol class="subtle">${W.questions.map(q => `<li>${x.esc(q.text)} <em>(${QTYPE[q.type]}${q.knockout ? ', eleyici' : ''})</em></li>`).join('')}</ol>` : ''}</article>
      <div class="notice">${active ? 'Dəyişikliklər elanda dərhal yenilənəcək.' : verified ? 'Şirkətin təsdiqlənib: elan dərhal yayımlanacaq.' : 'Şirkət hələ təsdiqlənməyib: elan admin yoxlamasından sonra yayımlanacaq.'} Aktiv elan: ${e.stats.active}/${S.data.limit}.</div>`
  ][W.step]();
  return `<a class="textlink" href="#/company/jobs">← Elanlar</a>` + `<div class="page-header"><h1>${W.id ? 'Elanı redaktə et.' : 'Yeni elan.'}</h1></div>` +
    `<ol class="co-steps">${STEPS.map((s, i) => `<li class="${i === W.step ? 'now' : i < W.step ? 'done' : ''}"><button type="button" data-action="co-wizard-step" data-i="${i}" ${i > W.step ? 'disabled' : ''}>${i + 1}. ${s}</button></li>`).join('')}</ol>
    <section class="card formbox"><form id="co-wizard" data-co-change="wizard" novalidate>${stepBody}
    <div class="actions co-wizard-nav">${W.step ? x.btn('Geri', 'co-wizard-back', '', 'white') : ''}${W.step < 3 ? x.btn('İrəli ' + x.ico('arrow-right'), 'co-wizard-next') :
      `${active ? '' : x.btn('Qaralama kimi saxla', 'co-wizard-save', 'data-intent="draft"', 'white')}${x.btn(active ? 'Dəyişiklikləri saxla' : verified ? 'Yayımla' : 'Yoxlamaya göndər', 'co-wizard-save', 'data-intent="publish"')}`}</div>
    <div class="form-message" role="alert"></div></form></section>`;
}

function collect() {
  const W = S.wizard, f = x.$('#co-wizard'); if (!f) return;
  for (const k of ['title', 'category', 'format', 'city', 'deadline', 'salary', 'description', 'requirements', 'skills']) { const el = f.elements[k]; if (el) W[k] = el.value; }
  if (W.locked) return;
  f.querySelectorAll('[data-q]').forEach(el => {
    const q = W.questions[+el.dataset.q], g = n => el.querySelector(`[name="${n}"]`);
    q.type = g('type').value; q.text = g('text').value;
    if (g('options')) q.options = g('options').value.split('\n').map(s => s.trim()).filter(Boolean);
    if (q.type === 'text') { q.knockout = false; q.expected = null; }
    else { q.knockout = !!g('knockout')?.checked; if (g('expected')) q.expected = q.type === 'yesno' ? g('expected').value : Number(g('expected').value); }
    if (q.type === 'choice' && !(q.options || []).length) q.options = ['', ''];
  });
}
function validStep() {
  const f = x.$('#co-wizard'), msg = f.querySelector('.form-message');
  const fields = [...f.querySelectorAll('input[required],textarea[required]')];
  for (const el of fields) if (!el.value.trim()) { el.focus(); msg.innerHTML = `<div class="error">Məcburi sahələri doldur.</div>`; return false; }
  const W = S.wizard;
  if (W.step === 1 && W.description.trim().length < 30) { msg.innerHTML = '<div class="error">Vəzifə haqqında ən az 30 simvol yaz.</div>'; return false; }
  if (W.step === 0 && W.deadline && new Date(W.deadline + 'T23:59:59+04:00') < new Date()) { msg.innerHTML = '<div class="error">Son müraciət tarixi gələcəkdə olmalıdır.</div>'; return false; }
  return true;
}
const payload = intent => {
  const W = S.wizard;
  return { id: W.id || undefined, organization_id: S.current, intent, title: W.title, category: W.category, format: W.format, city: W.city, deadline: W.deadline, salary: W.salary,
    skills: W.skills, description: W.description, requirements: W.requirements,
    questions: W.questions.map(q => ({ text: q.text, type: q.type, options: q.type === 'choice' ? q.options : [], knockout: q.knockout, expected: q.expected })) };
};

/* ── ATS ── */
async function loadAts(jobId) {
  const d = await x.api('/jobs/' + jobId + '/applications');
  if (S.ats?.job.id !== jobId) { S.selected.clear(); S.filter = { q: '', knockout: 'all', university: '', sort: 'new' }; }
  S.ats = d;
}
function visible() {
  const f = S.filter, q = f.q.toLocaleLowerCase('az');
  let rows = S.ats.applications.filter(a => a.status !== 'withdrawn');
  if (q) rows = rows.filter(a => [a.name, a.email, JSON.stringify(a.profile.profile || {}), (a.profile.compass?.skills || []).join(' ')].join(' ').toLocaleLowerCase('az').includes(q));
  if (f.knockout !== 'all') rows = rows.filter(a => !!a.knockout === (f.knockout === 'failed'));
  if (f.university) rows = rows.filter(a => (a.profile.profile?.university || '') === f.university);
  const by = { new: (a, b) => b.created_at - a.created_at, match: (a, b) => (b.match_score ?? -1) - (a.match_score ?? -1), rating: (a, b) => (b.rating || 0) - (a.rating || 0) }[f.sort];
  return rows.sort(by);
}
function candCard(a) {
  const p = a.profile.profile || {}, cp = a.profile.compass;
  return `<article class="co-cand ${a.knockout ? 'ko' : ''}">${editor() ? `<input type="checkbox" data-co-select="${a.id}" aria-label="${x.esc(a.name)} seç" ${S.selected.has(a.id) ? 'checked' : ''}>` : ''}
    <button type="button" class="co-cand-open" data-action="co-cand" data-id="${a.id}"><strong>${x.esc(a.name)}</strong><span>${x.esc([p.university, p.specialty].filter(Boolean).join(' · ') || 'Profil məlumatı azdır')}</span></button>
    <div class="pillrow">${a.match_score != null ? tag(a.match_score + '% uyğun', a.match_score >= 60 ? 'green' : '') : ''}${a.knockout ? tag('Ön seçim ✕', 'sample') : ''}${a.rating ? tag('★ ' + a.rating) : ''}${cp?.path ? tag('🧭 ' + cp.path) : ''}</div></article>`;
}
function atsPage() {
  const { job, applications } = S.ats, rows = visible(), unis = [...new Set(applications.map(a => a.profile.profile?.university).filter(Boolean))].sort();
  const withdrawn = applications.filter(a => a.status === 'withdrawn').length;
  return `<a class="textlink" href="#/company/jobs">← Elanlar</a><div class="co-head"><div><p class="orgname">${x.esc(cur()?.company.title || '')} · ${x.esc(JOB_STATUS[job.status] || job.status)}</p><h1>${x.esc(job.title)}</h1><p class="subtle">${[job.body.category, job.body.format, job.body.city].filter(Boolean).map(x.esc).join(' · ')} · son tarix ${x.esc(job.body.deadline || '—')} · ${applications.length} müraciət</p></div>
    <div class="actions">${x.btn(x.ico('download') + ' CSV', 'co-export', `data-id="${job.id}"`, 'white')}${editor() ? `<a class="btn white" href="#/company/edit/${job.id}">Redaktə</a>` : ''}</div></div>
    <div class="card co-toolbar"><label>Axtar<input data-co-filter="q" value="${x.esc(S.filter.q)}" placeholder="Ad, bacarıq, ixtisas"></label>
      <label>Ön seçim<select data-co-filter="knockout">${opt(['all', 'passed', 'failed'], S.filter.knockout, { all: 'Hamısı', passed: 'Keçənlər', failed: 'Keçməyənlər' })}</select></label>
      <label>Universitet<select data-co-filter="university"><option value="">Hamısı</option>${opt(unis, S.filter.university)}</select></label>
      <label>Sırala<select data-co-filter="sort">${opt(['new', 'match', 'rating'], S.filter.sort, { new: 'Ən yeni', match: 'Uyğunluq', rating: 'Qiymət' })}</select></label></div>
    ${editor() && S.selected.size ? `<div class="co-bulk"><strong>${S.selected.size} seçildi</strong><select id="co-bulk-stage" aria-label="Yeni status">${opt(S.ats.stages, 'reviewing', STAGE)}</select>${x.btn('Köçür', 'co-bulk', '', 'light')}${x.btn('Seçimi təmizlə', 'co-bulk-clear', '', 'white')}</div>` : ''}
    <div class="co-board">${S.ats.stages.map(s => { const col = rows.filter(a => a.status === s); return `<section class="co-col"><h2>${STAGE[s]} <span>${col.length}</span></h2>${col.map(candCard).join('') || '<p class="subtle">—</p>'}</section>`; }).join('')}</div>
    ${withdrawn ? `<p class="subtle">${withdrawn} müraciət namizəd tərəfindən geri götürülüb.</p>` : ''}`;
}
function repaintAts() { const focus = document.activeElement?.dataset?.coFilter, pos = document.activeElement?.selectionStart; paint(atsPage()); if (focus) { const el = x.$(`[data-co-filter="${focus}"]`); el?.focus(); if (pos != null && el?.setSelectionRange) el.setSelectionRange(pos, pos); } }

async function openCandidate(id) {
  const { application: a, events } = await x.api('/applications/' + id), p = a.profile.profile || {}, cp = a.profile.compass;
  const labels = { university: 'Universitet', specialty: 'İxtisas', city: 'Şəhər', skills: 'Bacarıqlar', experience: 'Təcrübə', bio: 'Haqqında', phone: 'Telefon' };
  x.modal(a.name, `<p class="subtle">${x.esc(a.email)} · ${x.esc(a.title)} · ${x.azDate(a.created_at)}</p>
    <div class="pillrow">${tag(STAGE[a.status] || a.status)}${a.match_score != null ? tag(a.match_score + '% uyğunluq', 'green') : ''}${a.knockout ? tag('Ön seçimdən keçmədi', 'sample') : tag('Ön seçimdən keçdi', 'green')}</div>
    ${editor() && a.status !== 'withdrawn' ? `<form data-form="co-status" data-id="${a.id}" class="co-inline">${select('status', 'Mərhələ', S.ats.stages, a.status, STAGE)}<button class="btn" type="submit">Yenilə</button><div class="form-message" role="status"></div></form>
      <div class="co-stars" role="group" aria-label="Qiymət">${[1, 2, 3, 4, 5].map(n => `<button type="button" class="iconbtn ${a.rating >= n ? 'selected' : ''}" data-action="co-rate" data-id="${a.id}" data-v="${n}" aria-label="${n} ulduz" aria-pressed="${a.rating >= n}">★</button>`).join('')}</div>` : ''}
    ${cp ? `<h3>Arzu Kompası</h3>${cp.statement ? `<blockquote class="me-quote">${x.esc(cp.statement)}</blockquote>` : ''}${cp.path ? `<p>Yolu: <strong>${x.esc(cp.path)}</strong>${cp.fit ? ' · ' + cp.fit + '%' : ''}</p>` : ''}<div class="pillrow">${(cp.skills || []).map(s => tag(s)).join('')}${(cp.interests || []).map(s => tag('♡ ' + s, 'me-like')).join('')}</div>` : ''}
    <h3>Profil</h3>${Object.entries(labels).filter(([k]) => p[k]).map(([k, t]) => `<p class="subtle"><strong>${t}:</strong> ${x.esc(p[k])}</p>`).join('') || '<p class="subtle">Profil boşdur.</p>'}
    <h3>Motivasiya</h3><p class="subtle">${x.esc(a.note)}</p>
    ${a.answers.length ? `<h3>Ön seçim cavabları</h3><div class="stack">${a.answers.map(q => `<div class="co-answer"><p><strong>${x.esc(q.text)}</strong></p><p>${x.esc(q.label)} ${q.knockout ? tag(q.passed ? 'uyğun' : 'eleyici ✕', q.passed ? 'green' : 'sample') : ''}</p></div>`).join('')}</div>` : ''}
    <h3>Tarixçə</h3><ol class="co-timeline">${events.map(ev => `<li><strong>${EVENT[ev.type] || ev.type}</strong> · ${x.esc(ev.actor || '')} · ${x.azDate(ev.created_at)}${ev.type === 'status' ? ` — ${STAGE[ev.body.from] || ev.body.from} → ${STAGE[ev.body.to] || ev.body.to}` : ev.type === 'rating' ? ` — ★ ${ev.body.rating}` : ev.type === 'note' ? `<br>${x.esc(ev.body.text)}` : ''}</li>`).join('')}</ol>
    ${editor() ? `<form data-form="co-note" data-id="${a.id}">${x.area('note', 'Komanda üçün qeyd', '', true)}<button class="btn light" type="submit">Qeyd əlavə et</button><div class="form-message" role="status"></div></form>` : ''}`);
}
async function refreshAts(reopen) { await loadAts(S.ats.job.id); repaintAts(); if (reopen) await openCandidate(reopen); }

/* ── hadisələr ── */
export async function action(a, el) {
  const id = el.dataset.id;
  if (a === 'co-wizard-fresh') { S.freshWizard = true; paint(wizardEntry()); return; }
  if (a.startsWith('co-wizard') || a.startsWith('co-q')) {
    collect(); const W = S.wizard;
    if (a === 'co-wizard-next') { if (!validStep()) return; W.step++; }
    if (a === 'co-wizard-back') W.step--;
    if (a === 'co-wizard-step') W.step = Math.min(+el.dataset.i, W.step);
    if (a === 'co-q-add') W.questions.push({ text: '', type: 'yesno', options: [], knockout: false, expected: 'yes' });
    if (a === 'co-q-template') W.questions.push(structuredClone(TEMPLATES[+el.dataset.i]));
    if (a === 'co-q-remove') W.questions.splice(+el.dataset.i, 1);
    W.questions = W.questions.slice(0, 8);
    if (a === 'co-wizard-save') {
      const r = await x.api('/jobs', 'POST', payload(el.dataset.intent));
      x.toast(r.status === 'draft' ? 'Qaralama saxlanıldı.' : r.status === 'published' ? 'Elan yayımdadır.' : 'Elan yoxlamaya göndərildi.');
      S.wizard = null; location.hash = '#/company/jobs'; return;
    }
    paint(wizardHTML()); window.scrollTo({ top: 0 }); return;
  }
  if (a === 'co-close' || a === 'co-open') { const r = await x.api('/jobs/' + id + '/status', 'POST', { status: a === 'co-close' ? 'closed' : 'open' }); x.toast(r.status === 'closed' ? 'Elan bağlandı.' : 'Elan yenidən aktivdir.'); await load(); paint(tabs('jobs')); return; }
  if (a === 'co-member-remove') { await x.api('/companies/' + S.current + '/members', 'POST', { userId: id, remove: true }); x.toast('Komanda üzvü çıxarıldı.'); await load(); paint(tabs('team')); return; }
  if (a === 'co-cand') { await openCandidate(id); return; }
  if (a === 'co-verify') { await x.api('/companies/' + id + '/verify', 'POST', { verified: el.dataset.v === '1' }); x.toast('Şirkət təsdiqləndi.'); await x.render(); return; }
  if (a === 'co-claim-decide') { const ok = el.dataset.v === '1'; await x.api('/companies/' + id + '/claims', 'POST', { userId: el.dataset.user, approve: ok }); x.toast(ok ? 'Sahiblik təsdiqləndi.' : 'Müraciət rədd edildi.'); await x.render(); return; }
  if (a === 'co-rate') { await x.api('/applications/' + id, 'POST', { rating: +el.dataset.v }); await refreshAts(id); return; }
  if (a === 'co-bulk-clear') { S.selected.clear(); repaintAts(); return; }
  if (a === 'co-bulk') { const r = await x.api('/applications/bulk', 'POST', { ids: [...S.selected], status: x.$('#co-bulk-stage').value }); S.selected.clear(); x.toast(r.updated + ' müraciət köçürüldü. Namizədlərə bildiriş getdi.'); await refreshAts(); return; }
  if (a === 'co-export') {
    const r = await fetch('/api/jobs/' + id + '/export'); if (!r.ok) { x.toast('CSV hazırlanmadı.'); return; }
    const url = URL.createObjectURL(await r.blob()), link = Object.assign(document.createElement('a'), { href: url, download: 'muracietler.csv' });
    document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); return;
  }
}

export async function submit(type, f, d, message) {
  if (type === 'co-company') {
    const r = await x.api('/companies', 'POST', { ...d, id: f.dataset.id || undefined });
    S.current = r.id; x.toast(f.dataset.id ? 'Şirkət profili yeniləndi.' : 'Şirkət profili yaradıldı. Admin yoxlamasından sonra təsdiqlənəcək.');
    if (location.hash === '#/company/profile') { await load(); paint(tabs('profile')); } else location.hash = '#/company'; return;
  }
  if (type === 'co-claim') { await x.api('/companies/' + d.organization_id + '/claim', 'POST', d); message.innerHTML = '<div class="notice">Müraciət göndərildi. Admin VÖEN-i yoxladıqdan sonra bildiriş alacaqsan.</div>'; return; }
  if (type === 'co-member') { const r = await x.api('/companies/' + S.current + '/members', 'POST', d); x.toast(r.name + ' komandaya əlavə olundu.'); await load(); paint(tabs('team')); return; }
  if (type === 'co-status') { await x.api('/applications/' + f.dataset.id, 'POST', { status: d.status }); x.toast('Mərhələ yeniləndi, namizədə bildiriş getdi.'); await refreshAts(f.dataset.id); return; }
  if (type === 'co-note') { await x.api('/applications/' + f.dataset.id, 'POST', { note: d.note }); await refreshAts(f.dataset.id); }
}

export function input(e) {
  const t = e.target;
  if (t.dataset.coSelect) { t.checked ? S.selected.add(t.dataset.coSelect) : S.selected.delete(t.dataset.coSelect); repaintAts(); return; }
  const k = t.dataset.coFilter; if (!k) return;
  if (k === 'company') { S.current = t.value; paint(tabs('overview')); history.replaceState(null, '', '#/company'); return; }
  if (e.type === 'input' && k !== 'q') return;
  S.filter[k] = t.value; repaintAts();
}

export function change(e) {
  const t = e.target;
  if (!S.wizard || !t.closest('[data-q]') || !['type', 'knockout', 'options'].includes(t.name)) return;
  collect(); paint(wizardHTML());
}
