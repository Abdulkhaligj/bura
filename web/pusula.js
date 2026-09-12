// Arzu Kompası — BURA-ya girişdən əvvəlki karyera səyahəti.
// Shadow DOM içində işləyir: öz stili, öz səsi, öz vəziyyəti. AI çağırışları /api/pusula ilə serverə gedir.
import css from './pusula.css?inline';

const MARKUP = `
<div class="page">
<div class="aurora" aria-hidden="true"><span class="a1"></span><span class="a2"></span><span class="a3"></span></div>

<header class="topbar"><div class="topbarInner">
  <span class="brand">
    <span class="bura" aria-label="BURA">bura<i></i></span>
    <span class="sep" aria-hidden="true"></span>
    <svg width="22" height="22" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <circle cx="13" cy="13" r="11.2" stroke="currentColor" stroke-opacity=".22" stroke-width="1.3"/>
      <path d="M13 5.4 15.1 11l5.5 2-5.5 2L13 20.6 10.9 15l-5.5-2 5.5-2z" fill="currentColor" opacity=".9"/>
      <circle cx="20.2" cy="6.4" r="1.5" fill="currentColor" opacity=".5"/>
    </svg>
    <b>Arzu Kompası</b>
  </span>
  <nav class="thread" id="thread" aria-label="İrəliləyiş"></nav>
  <button type="button" class="iconbtn" id="soundBtn" aria-pressed="true" title="Səsi aç / bağla">
    <span class="eq" aria-hidden="true"><i></i><i></i><i></i></span><span id="soundLbl">Səs</span>
  </button>
</div></header>

<div class="wrap">
<main id="stage">

<section class="step is-active" id="s-welcome" aria-labelledby="w-h">
  <div class="hero">
    <div>
      <h1 id="w-h">Üç söz yaz, <span class="serif-i">qalanını</span> toxunaraq seç.</h1>
      <p class="sub" id="w-sub">Nə olmaq istədiyini bilməyinə ehtiyac yoxdur.</p>
      <div class="row">
        <button type="button" class="btn" id="startBtn">Başla</button>
        <span class="meta" id="w-meta">3 sual · 2 dəqiqə</span>
      </div>
      <p class="have"><button type="button" class="linkbtn" id="haveAccount">Hesabım var — daxil ol</button><button type="button" class="linkbtn" id="later" hidden>Sonra</button></p>
    </div>
    <div class="orb"><canvas id="orbCanvas" role="img" aria-label="Bacarıq bürcü"></canvas></div>
  </div>
</section>

<section class="step ask" id="s-ask" aria-labelledby="ask-q">
  <div class="answered" id="answered"></div>
  <p class="ask-q" id="ask-q">&nbsp;</p>
  <div class="bigfield">
    <span class="ghosttext" id="ghost" aria-hidden="true"></span>
    <label class="sr" for="bigInput">Cavabın</label>
    <input type="text" id="bigInput" autocomplete="off" autocapitalize="off" spellcheck="false">
  </div>
  <p class="counter" id="counter">&nbsp;</p>
  <div class="row">
    <button type="button" class="btn" id="askNext">Davam</button>
    <button type="button" class="btn ghost small" id="askSkip">Keç</button>
  </div>
</section>

<section class="step" id="s-tasks" aria-labelledby="t-h">
  <div class="answered" id="answered2"></div>
  <div class="pickHead">
    <span class="lbl" id="t-h">Hansılarını etmisən?</span>
    <span class="n"><b id="tCount">0</b> seçili</span>
  </div>
  <div class="tools">
    <button type="button" class="btn ghost tiny" id="tRegen">✦ Yenidən yarat</button>
    <button type="button" class="btn ghost tiny" id="tAll">Hamısı</button>
  </div>
  <div class="cards" id="taskZone"></div>
  <div class="nav">
    <button type="button" class="btn" id="toSkills">Davam</button>
    <button type="button" class="btn ghost small" data-goto="s-ask">Geri</button>
  </div>
</section>

<section class="step" id="s-skills" aria-labelledby="sk-h">
  <div class="answered" id="answered3"></div>
  <div class="pickHead">
    <span class="lbl" id="sk-h">Ən az 3 bacarıq seç</span>
    <span class="n"><b id="sCount">0</b> seçili</span>
  </div>
  <div class="tools">
    <button type="button" class="btn ghost tiny" id="sRegen">✦ Başqaları</button>
    <button type="button" class="btn ghost tiny" id="sAll">Hamısı</button>
  </div>
  <div class="chips gap" id="skillZone"></div>
  <div class="pickHead"><span class="lbl">Nəyi sevirsən?</span></div>
  <div class="chips" id="interestZone"></div>
  <div class="nav">
    <button type="button" class="btn" id="toIdentity">Davam</button>
    <button type="button" class="btn ghost small" data-goto="s-tasks">Geri</button>
  </div>
</section>

<section class="step" id="s-identity" aria-labelledby="id-h">
  <h2 class="sr" id="id-h">Kimlik cümlən</h2>
  <div class="ws">
    <div id="wsCols"></div>
    <div>
      <div class="statement">
        <div class="stTop">
          <span class="tag">✦ Kimlik cümlən</span>
          <span class="badge">qaralama</span>
        </div>
        <p class="quote thinking" id="stmt" aria-live="polite">Yazıram…</p>
        <div class="stFoot">
          <button type="button" class="chip" data-tone="balansli" aria-pressed="true">Balanslı</button>
          <button type="button" class="chip" data-tone="semimi" aria-pressed="false">Səmimi</button>
          <button type="button" class="chip" data-tone="resmi" aria-pressed="false">Rəsmi</button>
          <button type="button" class="chip" data-tone="qisa" aria-pressed="false">Qısa</button>
          <button type="button" class="btn ghost tiny push" id="copyStmt">Kopyala</button>
        </div>
      </div>
      <div class="nav">
        <button type="button" class="btn" id="toPaths">Yolları kəşf et</button>
        <button type="button" class="btn ghost small" data-goto="s-skills">Geri</button>
      </div>
    </div>
  </div>
</section>

<section class="step" id="s-paths" aria-labelledby="p-h">
  <div class="pickHead">
    <span class="lbl" id="p-h">Mərkəzdə sənsən. Bir peşəyə toxun.</span>
  </div>
  <div class="tools" id="factorRow">
    <button type="button" class="chip" data-factor="skills" aria-pressed="true">Bacarıqlar</button>
    <button type="button" class="chip" data-factor="interests" aria-pressed="true">Maraq</button>
    <button type="button" class="chip" data-factor="experience" aria-pressed="true">Təcrübə</button>
    <button type="button" class="chip" data-factor="education" aria-pressed="false">Təhsil</button>
    <button type="button" class="btn ghost tiny" id="reRun">✦ Yenidən</button>
  </div>
  <div class="sky">
    <canvas id="skyCanvas" role="img" aria-label="Peşə bürcü"></canvas>
    <span class="skyHint" id="skyHint">Bir peşəyə toxun</span>
  </div>
  <div class="pathList" id="pathList" role="group" aria-label="Peşələr"></div>
  <div class="detail" id="pathDetail"></div>
  <div class="nav">
    <button type="button" class="btn" id="toNext">İlk addım</button>
    <button type="button" class="btn ghost small" data-goto="s-identity">Geri</button>
  </div>
</section>

<section class="step" id="s-next" aria-labelledby="n-h">
  <div class="pickHead"><span class="lbl" id="n-h">Bu həftə nə edirsən?</span></div>
  <div id="nextZone"></div>
  <div class="finish" id="finish" hidden>
    <div>
      <span class="finishTag" id="finishTag">Son addım</span>
      <h2 id="finishH">Profilini yarat.</h2>
    </div>
    <div class="row">
      <button type="button" class="btn" id="finishSave">Profilimi yarat</button>
      <button type="button" class="btn ghost" id="finishLogin">Hesabım var</button>
      <button type="button" class="btn ghost" id="finishGo">Sonra</button>
    </div>
  </div>
  <div class="nav">
    <button type="button" class="btn ghost small" data-goto="s-paths">Yollara qayıt</button>
    <button type="button" class="btn ghost small" id="restart">Yenidən başla</button>
  </div>
</section>

</main>
</div>
<footer class="foot">Təkliflər süni intellekt tərəfindən yaradılır — qəti məsləhət deyil, başlanğıc nöqtəsidir.</footer>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
</div>`;

/* ══ ehtiyat məzmun — AI qoşulmadıqda nümunə kimi göstərilir ══ */
const FB = {
  tasks: [
    "Qrup layihəsində tapşırıqları bölüb son tarixə çatdırdım.",
    "Excel-də məlumat toplayıb sadə hesabat hazırladım.",
    "Tələbə klubunda tədbirin təşkilatına kömək etdim.",
    "Təcrübədə gündəlik qeydləri cədvələ salıb izlədim.",
    "Təqdimat hazırlayıb bir qrupun qarşısında danışdım.",
    "Yeni gələn birinə işi əvvəldən öyrətdim."
  ],
  skills: [
    { name: "Proses təhlili", note: "İşin addımlarını çıxarıb darboğazı tapmaq." },
    { name: "Məlumat oxuma", note: "Cədvəldəki rəqəmdən məna çıxarmaq." },
    { name: "Excel / cədvəl", note: "Pivot, düstur, səliqəli cədvəl qurmaq." },
    { name: "Problem həlli", note: "Qarışıq problemi hissələrə bölmək." },
    { name: "Planlama", note: "İşi zamana və insanlara bölmək." },
    { name: "Təqdimat", note: "Bir fikri auditoriyaya aydın çatdırmaq." },
    { name: "Komanda koordinasiyası", note: "Bir neçə nəfərin işini uzlaşdırmaq." },
    { name: "Hesabat yazma", note: "Nəticəni oxunaqlı hala gətirmək." },
    { name: "Tədqiqat", note: "Mənbə tapıb məlumatı yoxlamaq." },
    { name: "Python əsasları", note: "Kiçik skriptlərlə işi avtomatlaşdırmaq." },
    { name: "Sosial media", note: "Kontent planlayıb nəticəni izləmək." },
    { name: "İngilis dili", note: "İşgüzar yazışma və oxu." }
  ],
  interests: ["nizam qurmaq", "məlumatla işləmək", "texnologiya", "oyun dizaynı", "yazmaq", "logistika", "davamlı inkişaf", "sahibkarlıq", "dizayn", "maliyyə"],
  statement: "Universitetdə oxuyuram; işin harada ləngidiyini görüb onu rəqəmlə göstərməyi sevirəm. Planlama, məlumat oxuma və təqdimatı bir yerdə istifadə edirəm. İndi bunu nəticəsi ölçülən real bir komandada sınamaq istəyirəm.",
  paths: [
    { name: "Əməliyyat analitiki", fit: 86, summary: "Şirkətin gündəlik axınını ölçür və yaxşılaşdırır.",
      why: "Proses təhlili və məlumat oxuma bu rolun tam mərkəzindədir; təcrübəçi kimi başlamaq üçün real qapıdır.",
      match: ["Proses təhlili", "Məlumat oxuma", "Excel / cədvəl"], gaps: ["SQL", "Xərc təhlili"],
      day: ["Gündəlik göstəriciləri izləmək", "Darboğaz təhlili", "Təkmilləşdirmə təklifi"],
      firstStep: "Bir prosesin axın sxemini çək və bir addımını ölç." },
    { name: "Təchizat zənciri mütəxəssisi", fit: 80, summary: "Malın doğru vaxtda doğru yerdə olmasını təmin edir.",
      why: "Planlama və koordinasiya bir yerdədirsə, təchizat zənciri ən sürətli giriş yoludur.",
      match: ["Planlama", "Komanda koordinasiyası", "Məlumat oxuma"], gaps: ["ERP əsasları", "Anbar modelləri"],
      day: ["Tələb proqnozu", "Təchizatçı ilə yazışma", "Stok qərarı"],
      firstStep: "Bir məhsulun xammaldan rəfə qədər yolunu bir səhifəyə çək." },
    { name: "Məlumat analitiki", fit: 76, summary: "Rəqəmin arxasındakı hekayəni tapır, qərarı asanlaşdırır.",
      why: "Excel və məlumat oxuma bazan varsa, SQL öyrənmək yeganə əskik hissədir.",
      match: ["Məlumat oxuma", "Excel / cədvəl", "Hesabat yazma"], gaps: ["SQL", "Qrafik dizaynı"],
      day: ["Məlumatı təmizləmək", "Göstərici paneli qurmaq", "Nəticəni komandaya izah etmək"],
      firstStep: "Üç aylıq xərclərini cədvələ sal, bir suala cavab verən qrafik çək." },
    { name: "Layihə köməkçisi", fit: 72, summary: "İşin hissələrini, insanları və təqvimi bir xətdə saxlayır.",
      why: "Koordinasiya və təqdimat güclüdürsə, sahədən asılı olmayan geniş bir qapıdır.",
      match: ["Komanda koordinasiyası", "Planlama", "Təqdimat"], gaps: ["Jira / Notion", "İclas qeydləri"],
      day: ["Tapşırıq izləmə", "Status xülasəsi", "İlişən işi açmaq"],
      firstStep: "Bir klub tədbirini tapşırıq lövhəsinə köçür və idarə et." },
    { name: "Marketinq analitiki", fit: 67, summary: "Kampaniyanın nə qədər işlədiyini rəqəmlə göstərir.",
      why: "Sosial media marağı ilə məlumat oxumanı birləşdirən, gənclər üçün açıq bir sahədir.",
      match: ["Məlumat oxuma", "Sosial media", "Hesabat yazma"], gaps: ["Google Analytics", "A/B test"],
      day: ["Kampaniya nəticələri", "Auditoriya təhlili", "Həftəlik hesabat"],
      firstStep: "Sevdiyin bir brendin son 10 paylaşımını müqayisə cədvəlinə sal." },
    { name: "Biznes analitiki", fit: 63, summary: "Biznes ehtiyacını komandanın başa düşəcəyi tələbə çevirir.",
      why: "Problem həlli və təqdimat bir yerdədirsə, texnologiya ilə biznes arasında körpü ola bilərsən.",
      match: ["Problem həlli", "Təqdimat", "Proses təhlili"], gaps: ["Tələb sənədləşməsi", "BPMN əsasları"],
      day: ["Maraqlı tərəflərlə görüş", "Proses sxemi", "Tələb sənədi"],
      firstStep: "Tanıdığın bir kiçik biznesin sifariş prosesini yazıb iki problemini tap." },
    { name: "Məhsul meneceri köməkçisi", fit: 58, summary: "Məhsulun nə üçün və kim üçün qurulduğunu izləyir.",
      why: "Bir az cəsarətli seçimdir, amma tədqiqat və koordinasiya bu yolun əsasını qurur.",
      match: ["Tədqiqat", "Komanda koordinasiyası", "Problem həlli"], gaps: ["İstifadəçi müsahibəsi", "Prioritetləşdirmə"],
      day: ["İstifadəçi rəyi toplamaq", "Tapşırıq sıralamaq", "Komanda ilə sinxron"],
      firstStep: "İstifadə etdiyin bir tətbiqin 3 problemini yaz və birinə həll eskizi çək." }
  ],
  kit: {
    headline: "Tələbə — prosesləri ölçür, darboğazı tapır, nəticəni rəqəmlə göstərir.",
    cover: "Bir işin harada ilişdiyini tapmaq məndə maraqdan çox vərdişə çevrilib: layihədə də, klubda da əvvəl axını çəkib sonra ölçmüşəm. Bu sahədə işləmək istəməyimin səbəbi budur.",
    plan: [
      { week: "1-ci həftə", todo: "Bir prosesi başdan-sona çək və bir addımını saniyəölçənlə ölç." },
      { week: "2-ci həftə", todo: "Excel-də pivot və axtarış düsturlarını bitir; öz məlumatınla hesabat çıxar." },
      { week: "3-cü həftə", todo: "Bu sahədə işləyən iki məzuna LinkedIn-də 15 dəqiqəlik söhbət təklif et." },
      { week: "4-cü həftə", todo: "BURA-da üç təcrübə elanına müraciət et; hər birində girişi elana uyğunlaşdır." }
    ],
    questions: [
      "Bu rolda ilk 90 gündə nəyin dəyişməsini gözləyirsiniz?",
      "Komandada bir işin ləngidiyini kim və necə fərq edir?",
      "Buradakı biri gününün çoxunu hansı alətdə keçirir?"
    ]
  }
};

const QS = [
  { key: "rol", q: "👋 Nə oxuyursan və ya nə ilə məşğulsan?", maxW: 5, maxC: 50, opt: false,
    ghosts: ["kompüter elmləri", "neft-qaz mühəndisliyi 3-cü kurs", "biznes idarəetməsi", "yeni məzun", "memarlıq tələbəsi"] },
  { key: "yer", q: "Harada?", maxW: 4, maxC: 40, opt: true,
    ghosts: ["ADA Universiteti", "BDU", "ADNSU", "UNEC", "Bakı Mühəndislik Universiteti"] },
  { key: "ek", q: "Bir də bunu etmisən:", maxW: 5, maxC: 50, opt: true,
    ghosts: ["yay təcrübəsi", "tələbə klubu", "könüllülük", "part-time barista", "freelance dizayn", "Erasmus"] }
];
const TONES = ["balansli", "semimi", "resmi", "qisa"];
const STEPS = ["s-welcome", "s-ask", "s-tasks", "s-skills", "s-identity", "s-paths", "s-next"];

export function mountPusula(host, { api, loggedIn = false, profile = null, onLogin, onFinish, onExit }) {
  const root = host.shadowRoot || host.attachShadow({ mode: "open" });
  root.innerHTML = "<style>" + css + "</style>" + MARKUP;

  const $ = (s, r = root) => r.querySelector(s);
  const $$ = (s, r = root) => Array.from(r.querySelectorAll(s));
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const cssVar = n => getComputedStyle(host).getPropertyValue(n).trim();
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let alive = true;
  const cleanups = [];
  const on = (target, ev, fn, opts) => { target.addEventListener(ev, fn, opts); cleanups.push(() => target.removeEventListener(ev, fn, opts)); };

  function askChip(btn, cb) {
    const i = document.createElement("input");
    i.type = "text"; i.className = "chipInput"; i.maxLength = 44;
    i.placeholder = "yaz + Enter"; i.autocomplete = "off";
    btn.replaceWith(i); i.focus();
    let closed = false;
    const done = commit => {
      if (closed) return; closed = true;
      const v = i.value.trim();
      i.replaceWith(btn);
      if (commit && v) cb(v);
    };
    i.addEventListener("keydown", e => {
      if (e.key === "Enter") { e.preventDefault(); done(true); }
      else if (e.key === "Escape") { e.preventDefault(); done(false); }
      else Sound.key();
    });
    i.addEventListener("blur", () => done(true));
  }
  let toastT;
  function toast(m) {
    const t = $("#toast"); t.textContent = m; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ══ səs — hamısı brauzerdə sintez olunur ════════════════ */
  const Sound = (() => {
    let ctx = null, master = null, wet = null, pad = null, enabled = true, tw = null;
    const PENTA = [523.25, 587.33, 698.46, 783.99, 880, 1046.5];
    function ir(sec, dec) {
      const n = (ctx.sampleRate * sec) | 0, b = ctx.createBuffer(2, n, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = b.getChannelData(c);
        for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, dec);
      }
      return b;
    }
    function boot() {
      if (ctx) return true;
      if (!alive) return false;
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
      try { ctx = new AC(); } catch { return false; }
      master = ctx.createGain(); master.gain.value = enabled ? .9 : 0; master.connect(ctx.destination);
      const v = ctx.createConvolver(); v.buffer = ir(2.6, 2.6);
      wet = ctx.createGain(); wet.gain.value = .3; wet.connect(v); v.connect(master);
      return true;
    }
    function tone({ f = 440, t = "sine", dur = .22, g = .1, at = .008, delay = 0, glide = 0 }) {
      if (!ctx || !enabled) return;
      const t0 = ctx.currentTime + delay, o = ctx.createOscillator(), a = ctx.createGain();
      o.type = t; o.frequency.setValueAtTime(f, t0);
      if (glide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f * glide), t0 + dur);
      a.gain.setValueAtTime(1e-4, t0);
      a.gain.exponentialRampToValueAtTime(g, t0 + at);
      a.gain.exponentialRampToValueAtTime(1e-4, t0 + dur);
      o.connect(a); a.connect(master); a.connect(wet); o.start(t0); o.stop(t0 + dur + .05);
    }
    function noise({ dur = .5, g = .05, from = 260, to = 2600 }) {
      if (!ctx || !enabled) return;
      const t0 = ctx.currentTime, n = (ctx.sampleRate * dur) | 0, b = ctx.createBuffer(1, n, ctx.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * .5;
      const s = ctx.createBufferSource(); s.buffer = b;
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 1.1;
      f.frequency.setValueAtTime(from, t0); f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
      const a = ctx.createGain();
      a.gain.setValueAtTime(1e-4, t0);
      a.gain.exponentialRampToValueAtTime(g, t0 + dur * .3);
      a.gain.exponentialRampToValueAtTime(1e-4, t0 + dur);
      s.connect(f); f.connect(a); a.connect(master); a.connect(wet); s.start(t0); s.stop(t0 + dur + .05);
    }
    function startPad() {
      if (!ctx || pad) return;
      pad = ctx.createGain(); pad.gain.value = 1e-4; pad.connect(master);
      const send = ctx.createGain(); send.gain.value = .5; pad.connect(send); send.connect(wet);
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 620; lp.Q.value = .7; lp.connect(pad);
      [87.31, 130.81, 220, 329.63, 392].forEach((f, i) => [0, 1].forEach(k => {
        const o = ctx.createOscillator(); o.type = i < 2 ? "triangle" : "sine";
        o.frequency.value = f; o.detune.value = (k ? 6 : -6) + i * 1.5;
        const g = ctx.createGain(); g.gain.value = (i < 2 ? .16 : .09) / 2;
        o.connect(g); g.connect(lp); o.start();
      }));
      const l = ctx.createOscillator(), lg = ctx.createGain();
      l.frequency.value = .045; lg.gain.value = 230; l.connect(lg); lg.connect(lp.frequency); l.start();
      const br = ctx.createOscillator(), bg = ctx.createGain();
      br.frequency.value = .075; bg.gain.value = .012; br.connect(bg); bg.connect(pad.gain); br.start();
      pad.gain.exponentialRampToValueAtTime(.032, ctx.currentTime + 6);
      sched();
    }
    function sched() {
      clearTimeout(tw);
      tw = setTimeout(() => {
        if (enabled && pad) tone({ f: PENTA[(Math.random() * PENTA.length) | 0], dur: 2.6, g: .016, at: .05 });
        sched();
      }, 9000 + Math.random() * 11000);
    }
    return {
      wake() { if (boot() && ctx.state === "suspended") ctx.resume(); },
      begin() { if (!boot()) return; if (ctx.state === "suspended") ctx.resume(); startPad(); },
      setOn(v) {
        enabled = v; if (!ctx) { if (v) boot(); return; }
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(v ? .9 : 1e-4, ctx.currentTime + .35);
        if (v && ctx.state === "suspended") ctx.resume();
      },
      stop() { clearTimeout(tw); if (ctx) { ctx.close().catch(() => {}); ctx = null; pad = null; } },
      key() { tone({ f: 1046.5, dur: .05, g: .012, at: .003 }); },
      tap() { tone({ f: 523.25, t: "triangle", dur: .09, g: .05, at: .004 }); },
      yes() { tone({ f: 659.25, dur: .5, g: .075, at: .006 }); tone({ f: 987.77, dur: .4, g: .03, delay: .045 }); },
      no() { tone({ f: 392, dur: .24, g: .045, glide: .86 }); },
      move() {
        noise({ dur: .55, g: .035, from: 320, to: 2200 });
        tone({ f: 587.33, dur: .5, g: .05, delay: .05 }); tone({ f: 880, dur: .6, g: .035, delay: .13 });
      },
      done() { [587.33, 739.99, 880, 1174.66].forEach((f, i) => tone({ f, dur: 1.5, g: .055 - i * .008, at: .01, delay: i * .1 })); },
      hover() { tone({ f: 1174.66, dur: .14, g: .016, at: .004 }); },
      oops() { tone({ f: 174.61, t: "triangle", dur: .42, g: .06, glide: .8 }); }
    };
  })();
  const soundBtn = $("#soundBtn");
  soundBtn.addEventListener("click", () => {
    const n = soundBtn.getAttribute("aria-pressed") !== "true";
    soundBtn.setAttribute("aria-pressed", String(n));
    $("#soundLbl").textContent = n ? "Səs" : "Səssiz";
    Sound.setOn(n); if (n) { Sound.begin(); Sound.tap(); }
  });
  ["pointerdown", "keydown"].forEach(e => on(window, e, () => Sound.wake(), { once: true, passive: true }));

  /* ══ vəziyyət ════════════════════════════════════════════ */
  const S = {
    a: { rol: "", yer: "", ek: "" },
    qi: 0,
    tasks: [], skills: [], interests: [],
    tone: "balansli", statement: "", statementAI: false,
    paths: [], picked: 0,
    factors: { skills: true, interests: true, experience: true, education: false },
    step: "s-welcome",
    sample: { paths: false, kit: false }
  };
  // Profil zənginləşdirmə: mövcud məlumatla başla, hazır cavabları yenidən soruşma.
  const PRE = {
    skills: (profile?.skills || []).map(x => String(x).slice(0, 40)).filter(Boolean),
    interests: (profile?.interests || []).map(x => String(x).slice(0, 34)).filter(Boolean)
  };
  if (profile) S.a = { rol: String(profile.rol || "").slice(0, 50), yer: String(profile.yer || "").slice(0, 40), ek: String(profile.ek || "").slice(0, 50) };
  const thread = $("#thread");
  thread.innerHTML = STEPS.map((id, i) =>
    (i ? '<span class="link" data-i="' + i + '"></span>' : "") + '<span class="node" data-i="' + i + '"></span>').join("");
  function paintThread() {
    const c = STEPS.indexOf(S.step);
    $$(".thread .node").forEach(n => { const i = +n.dataset.i; n.dataset.state = i < c ? "done" : i === c ? "now" : "next"; });
    $$(".thread .link").forEach(l => { l.dataset.state = +l.dataset.i <= c ? "done" : "next"; });
  }
  function go(id, quiet) {
    if (S.step === id) return;
    S.step = id;
    $$(".step").forEach(s => s.classList.toggle("is-active", s.id === id));
    paintThread();
    if (!quiet) Sound.move();
    scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
    if (id === "s-paths") sky.fit();
    if (id === "s-ask") setTimeout(() => alive && $("#bigInput").focus(), 260);
  }
  paintThread();
  if (loggedIn) {
    $("#w-h").innerHTML = 'Profilini <span class="serif-i">kompasla</span> ' + (S.a.rol ? "zənginləşdir." : "qur.");
    $("#w-sub").textContent = S.a.rol ? S.a.rol + (S.a.yer ? " · " + S.a.yer : "") : "Seç, profilin özü dolsun.";
    $("#w-meta").textContent = S.a.rol ? "2 dəqiqə" : "3 sual · 2 dəqiqə";
    $("#haveAccount").hidden = true; $("#later").hidden = false;
    $("#finishLogin").hidden = true;
  }
  $$("[data-goto]").forEach(b => b.addEventListener("click", () => { go(b.dataset.goto); if (b.dataset.goto === "s-ask") loadQ(); }));

  /* ══ AI — BURA serveri üzərindən ═════════════════════════ */
  // 503: açar yoxdur → bu sessiyada daha soruşma, nümunə məzmunla davam et.
  let aiOff = false;
  const pending = {};
  const ERRS = {
    off: "AI qoşulmayıb — nümunə nəticə.",
    rate_limited: "Çox sürətli getdik. Bir az sonra yenidən yoxla.",
    upstream: "AI cavab vermədi — nümunə nəticə."
  };
  const noteHTML = m => '<div class="note"><span class="ic">✦</span><span>' + esc(m) + "</span></div>";
  const skel = n => '<div class="skel">' + "<i></i>".repeat(n) + "</div>";
  const selTasks = () => S.tasks.filter(t => t.sec).map(t => t.t);
  const selSkills = () => S.skills.filter(s => s.sec).map(s => s.name);
  const selInt = () => S.interests.filter(s => s.sec).map(s => s.name);
  async function ask(step, extra = {}) {
    if (aiOff) throw { code: "off" };
    const tag = (pending[step] || 0) + 1; pending[step] = tag;
    try {
      const d = await api("/pusula", "POST", {
        step, answers: S.a, tasks: selTasks(), skills: selSkills(), interests: selInt(), ...extra
      });
      if (pending[step] !== tag || !alive) throw { code: "stale" };
      return d;
    } catch (e) {
      if (e?.code === "stale") throw e;
      if (pending[step] !== tag || !alive) throw { code: "stale" };
      if (e?.status === 503) { aiOff = true; throw { code: "off" }; }
      throw { code: e?.status === 429 ? "rate_limited" : "upstream" };
    }
  }
  const errMsg = e => ERRS[e?.code] || ERRS.upstream;

  /* ══ cavab həbləri ═══════════════════════════════════════ */
  function pills() {
    const out = [];
    QS.forEach((q, i) => { if (S.a[q.key]) out.push({ t: S.a[q.key], edit: i }); });
    if (S.tasks.some(t => t.sec)) out.push({ t: S.tasks.filter(t => t.sec).length + " iş", num: true });
    if (S.skills.some(t => t.sec)) out.push({ t: S.skills.filter(t => t.sec).length + " bacarıq", num: true });
    return out;
  }
  function paintPills() {
    const html = pills().map(p =>
      p.num ? '<span class="apill num">' + esc(p.t) + "</span>"
            : '<span class="apill">' + esc(p.t) + '<button type="button" data-edit="' + p.edit + '" aria-label="Dəyişdir">✕</button></span>'
    ).join("");
    ["#answered", "#answered2", "#answered3"].forEach(id => {
      const el = $(id); if (!el) return;
      el.innerHTML = html;
      $$("[data-edit]", el).forEach(b => b.addEventListener("click", () => {
        S.qi = +b.dataset.edit; Sound.tap(); go("s-ask"); loadQ();
      }));
    });
  }

  /* ══ tək sual ekranı ═════════════════════════════════════ */
  const inp = $("#bigInput"), ghost = $("#ghost"), counter = $("#counter");
  let ghostT = null, ghostI = 0;
  function cycleGhost() {
    clearInterval(ghostT);
    const q = QS[S.qi]; ghostI = 0;
    ghost.textContent = q.ghosts[0];
    ghostT = setInterval(() => {
      if (inp.value) return;
      ghost.classList.add("out");
      setTimeout(() => { ghostI = (ghostI + 1) % q.ghosts.length; ghost.textContent = q.ghosts[ghostI]; ghost.classList.remove("out"); }, 450);
    }, 2600);
  }
  function loadQ() {
    const q = QS[S.qi];
    $("#ask-q").textContent = q.q;
    inp.value = S.a[q.key] || "";
    inp.maxLength = q.maxC;
    $("#askSkip").hidden = !q.opt;
    paintPills(); cycleGhost(); updCount();
    setTimeout(() => alive && inp.focus(), 120);
  }
  function updCount() {
    const q = QS[S.qi], v = inp.value.trim();
    const w = v ? v.split(/\s+/).length : 0;
    ghost.style.opacity = v ? 0 : "";
    counter.innerHTML = "<b>" + w + "</b>/" + q.maxW + " söz · <b>" + inp.value.length + "</b>/" + q.maxC + " simvol";
    counter.classList.toggle("max", w >= q.maxW || inp.value.length >= q.maxC - 2);
    $("#askNext").disabled = !q.opt && !v;
  }
  inp.addEventListener("input", () => {
    const q = QS[S.qi];
    const parts = inp.value.split(/\s+/);
    if (parts.length > q.maxW) inp.value = parts.slice(0, q.maxW).join(" ");
    updCount(); Sound.key();
  });
  inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); nextQ(); } });
  function nextQ(skip) {
    const q = QS[S.qi];
    const v = inp.value.trim();
    if (!q.opt && !v) { Sound.oops(); inp.focus(); return; }
    S.a[q.key] = skip ? "" : v;
    Sound.yes();
    if (S.qi < QS.length - 1) { S.qi++; loadQ(); return; }
    clearInterval(ghostT);
    go("s-tasks"); makeTasks();
  }
  $("#askNext").addEventListener("click", () => nextQ(false));
  $("#askSkip").addEventListener("click", () => nextQ(true));
  $("#startBtn").addEventListener("click", () => {
    Sound.begin(); S.qi = 0;
    if (loggedIn && S.a.rol) { paintPills(); go("s-tasks"); makeTasks(); return; }
    go("s-ask"); loadQ();
  });
  $("#later").addEventListener("click", () => { Sound.tap(); onExit?.(); });
  $("#haveAccount").addEventListener("click", () => { Sound.tap(); onLogin?.("login"); });

  /* ══ 02 — işlər (yazı yox, toxunma var) ══════════════════ */
  async function makeTasks(regen) {
    const zone = $("#taskZone");
    zone.innerHTML = skel(6);
    let data = null, note = "";
    try { data = (await ask("tasks", { regen: !!regen })).tasks; }
    catch (e) { if (e?.code === "stale") return; note = errMsg(e); }
    if (!Array.isArray(data) || !data.length) data = FB.tasks;
    S.tasks = data.slice(0, 8).map(t => ({ t: String(t).slice(0, 140), sec: false }));
    zone.innerHTML = (note ? noteHTML(note) : "") + S.tasks.map((x, i) =>
      '<button type="button" class="pcard" data-i="' + i + '" aria-pressed="false"><span class="tick">✓</span><span>' + esc(x.t) + "</span></button>").join("");
    $$(".pcard", zone).forEach(b => b.addEventListener("click", () => {
      const x = S.tasks[+b.dataset.i]; x.sec = !x.sec;
      b.setAttribute("aria-pressed", String(x.sec)); x.sec ? Sound.yes() : Sound.no(); countT();
    }));
    countT();
  }
  function countT() { $("#tCount").textContent = S.tasks.filter(t => t.sec).length; paintPills(); }
  $("#tRegen").addEventListener("click", () => { Sound.tap(); makeTasks(true); });
  $("#tAll").addEventListener("click", () => {
    const all = S.tasks.every(t => t.sec);
    S.tasks.forEach(t => t.sec = !all);
    $$("#taskZone .pcard").forEach(b => b.setAttribute("aria-pressed", String(!all)));
    all ? Sound.no() : Sound.yes(); countT();
  });
  $("#toSkills").addEventListener("click", () => { go("s-skills"); if (!S.skills.length) makeSkills(); else paintPills(); });

  /* ══ 03 — bacarıqlar + maraqlar ══════════════════════════ */
  function paintSkills(note = "") {
    const sz = $("#skillZone");
    sz.innerHTML = (note ? noteHTML(note) : "") + S.skills.map((s, i) =>
      '<button type="button" class="chip" data-sk="' + i + '" aria-pressed="' + s.sec + '">' + esc(s.name) +
      (s.note ? '<span class="tip">' + esc(s.note) + "</span>" : "") + "</button>").join("") +
      '<button type="button" class="chip dashed" id="skAdd">+ özüm yazım</button>';
    $$("[data-sk]", sz).forEach(b => b.addEventListener("click", () => {
      const s = S.skills[+b.dataset.sk]; s.sec = !s.sec;
      b.setAttribute("aria-pressed", String(s.sec)); s.sec ? Sound.yes() : Sound.no(); countS();
    }));
    $("#skAdd").addEventListener("click", e => askChip(e.currentTarget, v => {
      S.skills.push({ name: v.slice(0, 40), note: "Bunu sən əlavə etdin.", sec: true });
      paintSkills(); Sound.yes();
    }));
    countS();
  }
  async function makeSkills(regen) {
    const sz = $("#skillZone"), iz = $("#interestZone");
    $("#toIdentity").disabled = true;
    sz.innerHTML = '<div class="load"><span class="orbit"></span><span>Bacarıqlar çıxarılır…</span></div>';
    iz.innerHTML = "";
    let d = null, note = "";
    try { d = await ask("skills", { regen: !!regen }); }
    catch (e) { if (e?.code === "stale") return; note = errMsg(e); }
    const bs = Array.isArray(d?.skills) && d.skills.length ? d.skills : FB.skills;
    const is = Array.isArray(d?.interests) && d.interests.length ? d.interests : FB.interests;
    const low = v => v.toLocaleLowerCase("az");
    const mine = PRE.skills.map(n => ({ name: n, note: "Profilindən", sec: true }));
    S.skills = mine.concat(bs.slice(0, 14).map(s => ({ name: String(s.name || s).slice(0, 40), note: String(s.note || ""), sec: false }))
      .filter(s => !mine.some(m => low(m.name) === low(s.name)))).slice(0, 24);
    const myInt = PRE.interests.map(n => ({ name: n, sec: true }));
    S.interests = myInt.concat(is.slice(0, 12).map(s => ({ name: String(s).slice(0, 34), sec: false }))
      .filter(s => !myInt.some(m => low(m.name) === low(s.name)))).slice(0, 18);
    paintSkills(note);
    iz.innerHTML = S.interests.map((s, i) =>
      '<button type="button" class="chip" data-in="' + i + '" aria-pressed="' + s.sec + '">' + esc(s.name) + "</button>").join("");
    $$("[data-in]", iz).forEach(b => b.addEventListener("click", () => {
      const s = S.interests[+b.dataset.in]; s.sec = !s.sec;
      b.setAttribute("aria-pressed", String(s.sec)); s.sec ? Sound.yes() : Sound.no();
    }));
  }
  function countS() {
    const n = selSkills().length;
    $("#sCount").textContent = n;
    $("#toIdentity").disabled = n < 3;
    paintPills();
  }
  $("#sRegen").addEventListener("click", () => { Sound.tap(); makeSkills(true); });
  $("#sAll").addEventListener("click", () => {
    const all = S.skills.every(s => s.sec);
    S.skills.forEach(s => s.sec = !all);
    $$("#skillZone [data-sk]").forEach(b => b.setAttribute("aria-pressed", String(!all)));
    all ? Sound.no() : Sound.yes(); countS();
  });

  /* ══ 04 — kimlik masası ══════════════════════════════════ */
  const GRPS = [
    { e: "🌱", t: "Təcrübə", get() { return [S.a.rol, S.a.ek].filter(Boolean); }, add: "təcrübə" },
    { e: "🎓", t: "Təhsil", get() { return [S.a.yer].filter(Boolean); }, add: "təhsil" },
    { e: "💪", t: "Bacarıqlar", get() { return selSkills(); }, add: "bacarıq" },
    { e: "💜", t: "Maraqlar", get() { return selInt(); }, add: "maraq" }
  ];
  function paintWs() {
    $("#wsCols").innerHTML = GRPS.map((g, gi) =>
      '<div class="grp"><h3><span>' + g.e + "</span>" + g.t + "</h3>" +
      '<div class="chips">' +
        g.get().map((v, i) => '<button type="button" class="chip x" data-rm="' + gi + ":" + i + '" aria-label="' + esc(v) + ' — sil">' + esc(v) + '<i aria-hidden="true">✕</i></button>').join("") +
        '<button type="button" class="chip dashed" data-add="' + gi + '">+ ' + g.add + "</button>" +
      "</div></div>").join("");
    $$("[data-rm]", $("#wsCols")).forEach(b => b.addEventListener("click", () => {
      const [gi, i] = b.dataset.rm.split(":").map(Number);
      const v = GRPS[gi].get()[i];
      if (gi === 0) { if (S.a.rol === v) S.a.rol = ""; else if (S.a.ek === v) S.a.ek = ""; }
      if (gi === 1) S.a.yer = "";
      if (gi === 2) { const s = S.skills.find(x => x.name === v); if (s) s.sec = false; }
      if (gi === 3) { const s = S.interests.find(x => x.name === v); if (s) s.sec = false; }
      Sound.no(); paintWs();
    }));
    $$("[data-add]", $("#wsCols")).forEach(b => b.addEventListener("click", e => {
      const gi = +b.dataset.add;
      askChip(e.currentTarget, v => {
        const t = v.slice(0, 44);
        if (gi === 0) { if (!S.a.rol) S.a.rol = t; else S.a.ek = t; }
        if (gi === 1) S.a.yer = t;
        if (gi === 2) S.skills.push({ name: t, note: "Bunu sən əlavə etdin.", sec: true });
        if (gi === 3) S.interests.push({ name: t, sec: true });
        Sound.yes(); paintWs();
      });
    }));
  }
  async function writeStatement() {
    const el = $("#stmt");
    el.classList.add("thinking"); el.textContent = "Yazıram…";
    let text = "", note = "";
    try { text = (await ask("statement", { tone: S.tone })).statement; }
    catch (e) { if (e?.code === "stale") return; note = errMsg(e); }
    S.statementAI = !!String(text || "").trim();
    S.statement = S.statementAI ? String(text).trim() : FB.statement;
    el.classList.remove("thinking"); el.textContent = S.statement;
    note ? toast(note) : Sound.done();
  }
  $("#toIdentity").addEventListener("click", () => {
    if (selSkills().length < 3) { Sound.oops(); toast("Ən az 3 bacarıq seç"); return; }
    go("s-identity"); paintWs(); writeStatement();
  });
  $$("[data-tone]").forEach(b => b.addEventListener("click", () => {
    $$("[data-tone]").forEach(o => o.setAttribute("aria-pressed", String(o === b)));
    S.tone = TONES.includes(b.dataset.tone) ? b.dataset.tone : "balansli"; Sound.tap(); writeStatement();
  }));
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast("Kopyalandı"); Sound.yes(); }
    catch { toast("Kopyalanmadı"); Sound.oops(); }
  }
  $("#copyStmt").addEventListener("click", () => copy(S.statement || $("#stmt").textContent));

  /* ══ 05 — yollar ═════════════════════════════════════════ */
  function paintPathList() {
    $("#pathList").innerHTML = S.paths.map((p, i) =>
      '<button type="button" class="pathBtn" data-i="' + i + '" aria-pressed="' + (i === S.picked) + '">' +
      esc(p.name) + '<span class="pct">' + p.fit + "%</span></button>").join("");
    $$("#pathList .pathBtn").forEach(b => b.addEventListener("click", () => pick(+b.dataset.i)));
  }
  async function findPaths() {
    const host = $("#pathDetail");
    host.innerHTML = '<div class="load"><span class="orbit"></span><span>Yollar hesablanır…</span></div>';
    $("#pathList").innerHTML = ""; S.paths = []; sky.set([]);
    let d = null, note = "";
    try { d = (await ask("paths", { weights: Object.keys(S.factors).filter(k => S.factors[k]) })).paths; }
    catch (e) { if (e?.code === "stale") return; note = errMsg(e); }
    S.sample.paths = !Array.isArray(d) || !d.length;
    if (S.sample.paths) d = FB.paths;
    S.paths = d.slice(0, 8).map(p => ({
      name: String(p.name || "Peşə").slice(0, 60),
      fit: clamp(parseInt(p.fit, 10) || 60, 30, 99),
      summary: String(p.summary || ""), why: String(p.why || ""),
      match: (Array.isArray(p.match) ? p.match : []).slice(0, 4).map(String),
      gaps: (Array.isArray(p.gaps) ? p.gaps : []).slice(0, 3).map(String),
      day: (Array.isArray(p.day) ? p.day : []).slice(0, 4).map(String),
      firstStep: String(p.firstStep || "")
    })).sort((x, y) => y.fit - x.fit);
    S.picked = 0;
    paintPathList();
    sky.set(S.paths);
    renderDetail(note);
    Sound.done();
  }
  function pick(i) {
    if (i == null || i < 0 || i >= S.paths.length) return;
    S.picked = i;
    $$("#pathList .pathBtn").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.i === i)));
    sky.select(i); renderDetail(); Sound.yes();
  }
  function renderDetail(note) {
    const p = S.paths[S.picked], host = $("#pathDetail");
    if (!p) { host.innerHTML = note ? noteHTML(note) : ""; return; }
    host.innerHTML = (note ? noteHTML(note) : "") +
      '<div class="dHead"><div class="main"><h2>' + esc(p.name) + "</h2>" +
      '<p class="summary">' + esc(p.summary) + "</p></div>" +
      '<div class="score"><span class="num">' + p.fit + '</span><span class="cap">uyğunluq</span></div></div>' +
      '<div class="meter"><i style="width:' + p.fit + '%"></i></div>' +
      '<p class="why">' + esc(p.why) + "</p>" +
      '<div class="cols">' +
        '<div class="panel match"><h4>Səndə var</h4><ul class="tickList">' +
          p.match.map(s => '<li><span class="mk">✓</span><span>' + esc(s) + "</span></li>").join("") + "</ul></div>" +
        '<div class="panel gap"><h4>Əlavə olunacaq</h4><ul class="tickList">' +
          p.gaps.map(s => '<li><span class="mk">+</span><span>' + esc(s) + "</span></li>").join("") + "</ul></div>" +
      "</div>" +
      '<div class="panel"><h4>Bir günü</h4><ul class="dayList">' +
        p.day.map(s => '<li><span class="bul">—</span><span>' + esc(s) + "</span></li>").join("") + "</ul></div>" +
      '<div class="firstStep"><span class="ic">↗</span><p><strong>Bu həftə</strong>' + esc(p.firstStep) + "</p></div>";
    const m = $(".meter i", host);
    if (m && !REDUCED) { m.style.width = "0%"; requestAnimationFrame(() => { m.style.width = p.fit + "%"; }); }
  }
  $("#toPaths").addEventListener("click", () => { go("s-paths"); if (!S.paths.length) findPaths(); });
  $("#reRun").addEventListener("click", () => { Sound.tap(); findPaths(); });
  $$("[data-factor]").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.factor; S.factors[k] = !S.factors[k];
    b.setAttribute("aria-pressed", String(S.factors[k]));
    S.factors[k] ? Sound.yes() : Sound.no();
  }));

  /* ══ 06 — ilk addım dəsti ════════════════════════════════ */
  function kitHTML(k, name) {
    return '<div class="kitGrid">' +
      '<div class="kit"><h4>LinkedIn başlığın</h4><p class="big">' + esc(k.headline) + "</p>" +
        '<button type="button" class="btn ghost tiny copy" data-copy="headline">Kopyala</button></div>' +
      '<div class="kit"><h4>Motivasiya məktubunun girişi</h4><p>' + esc(k.cover) + "</p>" +
        '<button type="button" class="btn ghost tiny copy" data-copy="cover">Kopyala</button></div>' +
      '<div class="kit full"><h4>4 həftə — ' + esc(name) + '</h4><ul class="plan">' +
        k.plan.map(p => '<li><span class="pin"></span><span class="when">' + esc(p.week) + '</span><span class="what">' + esc(p.todo) + "</span></li>").join("") +
      "</ul></div>" +
      '<div class="kit full"><h4>Müsahibədə sən soruş</h4><ul class="dayList">' +
        k.questions.map(s => '<li><span class="bul">?</span><span>' + esc(s) + "</span></li>").join("") + "</ul></div></div>";
  }
  let kit = null;
  async function buildKit() {
    const p = S.paths[S.picked], host = $("#nextZone");
    $("#finish").hidden = true;
    if (!p) { host.innerHTML = noteHTML("Əvvəlcə bir yol seç."); return; }
    $("#n-h").textContent = "“" + p.name + "” üçün ilk addım";
    host.innerHTML = '<div class="load"><span class="orbit"></span><span>Hazırlanır…</span></div>';
    let k = null, note = "";
    try { k = await ask("kit", { statement: S.statement, path: { name: p.name, gaps: p.gaps } }); }
    catch (e) { if (e?.code === "stale") return; note = errMsg(e); }
    S.sample.kit = !k;
    kit = {
      headline: String(k?.headline || FB.kit.headline),
      cover: String(k?.cover || FB.kit.cover),
      plan: (Array.isArray(k?.plan) && k.plan.length ? k.plan : FB.kit.plan).slice(0, 6)
        .map(x => ({ week: String(x.week || ""), todo: String(x.todo || "") })),
      questions: (Array.isArray(k?.questions) && k.questions.length ? k.questions : FB.kit.questions).slice(0, 4).map(String)
    };
    host.innerHTML = (note ? noteHTML(note) : "") + kitHTML(kit, p.name);
    $$(".copy", host).forEach(b => b.addEventListener("click", () => copy(kit[b.dataset.copy])));
    $("#finishTag").textContent = loggedIn ? "Profilin" : "Son addım";
    $("#finishH").textContent = loggedIn ? "Profilinə bağla." : "Profilini yarat.";
    $("#finishSave").textContent = loggedIn ? "Profilimə əlavə et" : "Profilimi yarat";
    $("#finish").hidden = false;
    Sound.done();
  }
  const result = () => ({
    rol: S.a.rol, yer: S.a.yer, ek: S.a.ek,
    tasks: selTasks(), skills: selSkills(), interests: selInt(),
    statement: S.statementAI ? S.statement : "",
    paths: S.paths, picked: S.picked, kit,
    sample: S.sample.paths || S.sample.kit
  });
  $("#toNext").addEventListener("click", () => { go("s-next"); buildKit(); });
  $("#finishSave").addEventListener("click", () => { Sound.yes(); onFinish?.(result(), { save: true }); });
  $("#finishGo").addEventListener("click", () => { Sound.tap(); onFinish?.(result(), { save: false }); });
  $("#finishLogin").addEventListener("click", () => { Sound.tap(); onFinish?.(result(), { save: true, login: true }); });
  $("#restart").addEventListener("click", () => {
    S.a = { rol: "", yer: "", ek: "" }; S.qi = 0;
    S.tasks = []; S.skills = []; S.interests = []; S.paths = []; S.statement = ""; S.statementAI = false; S.picked = 0; kit = null;
    ["#taskZone", "#skillZone", "#interestZone", "#nextZone", "#pathDetail", "#pathList", "#wsCols"].forEach(s => { $(s).innerHTML = ""; });
    $("#finish").hidden = true;
    sky.set([]); paintPills(); go("s-welcome");
  });

  /* ══ peşə bürcü ══════════════════════════════════════════ */
  const FONT = (w, px) => w + " " + px + 'px Inter, "Segoe UI", Helvetica, Arial, sans-serif';
  const sky = (() => {
    const cv = $("#skyCanvas"), ctx = cv.getContext("2d");
    let W = 0, H = 0, nodes = [], sel = 0, hov = -1, t = 0, ready = false;
    const C = {};
    const read = () => {
      C.iris = cssVar("--iris"); C.hi = cssVar("--iris-hi"); C.line = cssVar("--line"); C.glow = cssVar("--glow");
      C.ink2 = cssVar("--ink-2"); C.ink3 = cssVar("--ink-3"); C.card = cssVar("--card"); C.soft = cssVar("--iris-soft"); C.on = cssVar("--on-iris");
    };
    function fit() {
      const w = cv.parentElement.clientWidth || 640;
      W = w; H = w < 560 ? clamp(Math.round(w * 1.3), 420, 600) : clamp(Math.round(w * .66), 340, 500);
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = FONT(600, 13);
      const cap = Math.max(120, W - 40);
      nodes.forEach(n => { n.w = Math.min(ctx.measureText(n.name).width + 40, cap); });
      layout(); read();
    }
    function layout() {
      const cx = W / 2, cy = H / 2, n = nodes.length; if (!n) return;
      nodes.forEach((nd, i) => { nd.ph = i * 1.7; });
      if (W < 560) {
        // Dar ekran: sıralı cərgələr — ən uyğun peşə mərkəzə ən yaxın, sağ-sol növbə ilə.
        const rank = nodes.map((nd, i) => i).sort((a, b) => nodes[b].fit - nodes[a].fit);
        const up = Math.ceil(n / 2), down = n - up, band = 46, top = 28, bottom = H - 50;
        const ys = [];
        for (let k = 0; k < up; k++) ys.push(cy - band - (up > 1 ? k * (cy - band - top) / (up - 1) : 0));
        for (let k = 0; k < down; k++) ys.push(cy + band + (down > 1 ? k * (bottom - cy - band) / (down - 1) : 0));
        const order = [];
        for (let k = 0; k < Math.max(up, down); k++) { if (k < up) order.push(k); if (k < down) order.push(up + k); }
        rank.forEach((ni, r) => {
          const slot = order[r], k = slot < up ? slot : slot - up;
          const nd = nodes[ni], side = (k % 2 === 0) === (slot < up) ? 1 : -1;
          nd.by = ys[slot];
          nd.bx = cx + side * Math.max(0, W / 2 - nd.w / 2 - 12);
        });
        return;
      }
      const rMin = Math.min(W, H) * .27, rMax = Math.min(W * .40, H * .40);
      nodes.forEach((nd, i) => {
        const ang = -Math.PI / 2 + (i / n) * Math.PI * 2 + .34;
        const r = rMin + clamp(1 - (nd.fit - 40) / 60, 0, 1) * (rMax - rMin);
        nd.bx = cx + Math.cos(ang) * r * 1.42; nd.by = cy + Math.sin(ang) * r * 1.02;
      });
      const HH = 34, GX = 16, GY = 14;
      for (let it = 0; it < 160; it++) {
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
          const a = nodes[i], b = nodes[j], dx = b.bx - a.bx, dy = b.by - a.by;
          const nx = (a.w + b.w) / 2 + GX, ny = HH + GY;
          const ox = nx - Math.abs(dx), oy = ny - Math.abs(dy);
          if (ox > 0 && oy > 0) {
            if (oy / ny < ox / nx) { const s = (dy >= 0 ? 1 : -1) * oy * .5; a.by -= s; b.by += s; }
            else { const s = (dx >= 0 ? 1 : -1) * ox * .35; a.bx -= s; b.bx += s; }
          }
        }
        for (const nd of nodes) {
          const dx = nd.bx - cx, dy = nd.by - cy, d = Math.hypot(dx, dy) || 1, need = 50 + nd.w * .34;
          if (d < need) { nd.bx = cx + dx / d * need; nd.by = cy + dy / d * need; }
          nd.bx = clamp(nd.bx, nd.w / 2 + 10, W - nd.w / 2 - 10);
          nd.by = clamp(nd.by, 26, H - 34);
        }
      }
    }
    function rr(x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
    function hit(mx, my) {
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (Math.abs(mx - n.x) < n.w / 2 + 4 && Math.abs(my - n.y) < 17) return i;
      }
      return -1;
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      if (!ready) return;
      const f = REDUCED ? 0 : 1;
      nodes.forEach(n => { n.x = n.bx + Math.sin(t / 90 + n.ph) * 4 * f; n.y = n.by + Math.cos(t / 110 + n.ph) * 3.5 * f; });
      nodes.forEach((n, i) => {
        const hot = i === sel || i === hov;
        const mx = (cx + n.x) / 2, my = (cy + n.y) / 2, bow = (n.x - cx) * .12;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.quadraticCurveTo(mx - bow, my + bow, n.x, n.y);
        ctx.strokeStyle = hot ? C.iris : C.line; ctx.lineWidth = hot ? 2 : 1;
        ctx.globalAlpha = hot ? .9 : .75; ctx.stroke(); ctx.globalAlpha = 1;
        const dots = hot ? 3 : 2;
        for (let k = 1; k <= dots; k++) {
          const u = k / (dots + 1) + (REDUCED ? 0 : Math.sin(t / 120 + i) * .03);
          const px = (1 - u) * (1 - u) * cx + 2 * (1 - u) * u * (mx - bow) + u * u * n.x;
          const py = (1 - u) * (1 - u) * cy + 2 * (1 - u) * u * (my + bow) + u * u * n.y;
          ctx.beginPath(); ctx.arc(px, py, hot ? 2.6 : 1.8, 0, 7);
          ctx.fillStyle = hot ? C.hi : C.line; ctx.fill();
        }
      });
      const pulse = REDUCED ? 0 : Math.sin(t / 70) * 2;
      ctx.beginPath(); ctx.arc(cx, cy, 30 + pulse, 0, 7); ctx.fillStyle = C.soft; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, 21, 0, 7); ctx.fillStyle = C.iris; ctx.fill();
      ctx.fillStyle = C.on; ctx.font = FONT(600, 13);
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("Sən", cx, cy + .5);
      const order = nodes.map((n, i) => i).sort((a, b) => (a === sel) - (b === sel) || (a === hov) - (b === hov));
      order.forEach(i => {
        const n = nodes[i];
        const picked = i === sel, hv = i === hov, w = n.w, h = 32, x = n.x - w / 2, y = n.y - h / 2;
        ctx.save();
        if (picked) { ctx.shadowColor = C.glow; ctx.shadowBlur = 18; ctx.shadowOffsetY = 5; }
        rr(x, y, w, h, 16); ctx.fillStyle = picked ? C.iris : C.card; ctx.fill(); ctx.restore();
        if (!picked) { rr(x, y, w, h, 16); ctx.strokeStyle = hv ? C.iris : C.line; ctx.lineWidth = hv ? 1.6 : 1.2; ctx.stroke(); }
        ctx.fillStyle = picked ? C.on : (hv ? C.iris : C.ink2);
        ctx.font = FONT(600, 13);
        ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(n.name, n.x, n.y + .5);
      });
    }
    (function loop() { if (!alive) return; t++; if (ready && S.step === "s-paths") draw(); requestAnimationFrame(loop); })();
    cv.addEventListener("mousemove", e => {
      const r = cv.getBoundingClientRect(), i = hit(e.clientX - r.left, e.clientY - r.top);
      if (i !== hov) {
        if (i >= 0) Sound.hover(); hov = i; cv.style.cursor = i >= 0 ? "pointer" : "default";
        $("#skyHint").textContent = i >= 0 ? (S.paths[i]?.name ?? "") : "Bir peşəyə toxun";
      }
    });
    cv.addEventListener("mouseleave", () => { hov = -1; $("#skyHint").textContent = "Bir peşəyə toxun"; });
    cv.addEventListener("click", e => {
      const r = cv.getBoundingClientRect(), i = hit(e.clientX - r.left, e.clientY - r.top);
      if (i >= 0) pick(i);
    });
    on(window, "resize", () => { fit(); draw(); });
    const mq = matchMedia("(prefers-color-scheme: dark)");
    on(mq, "change", () => { read(); draw(); });
    fit();
    return {
      fit() { fit(); draw(); },
      set(list) {
        nodes = list.map(p => ({ name: p.name, fit: p.fit, bx: 0, by: 0, x: 0, y: 0, ph: 0, w: 0 }));
        sel = 0; hov = -1; ready = nodes.length > 0; fit(); draw();
      },
      select(i) { sel = i; }
    };
  })();

  /* ══ açılış küresi ═══════════════════════════════════════ */
  (() => {
    const cv = $("#orbCanvas"); if (!cv) return;
    const ctx = cv.getContext("2d");
    let W = 0, H = 0, t = 0;
    const pts = [];
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2, r = .28 + (i % 4) * .055 + Math.random() * .05;
      pts.push({ a, r, sp: .00022 + Math.random() * .0004, sz: 1.4 + Math.random() * 2.4 });
    }
    function fit() {
      const w = cv.parentElement.clientWidth || 340;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = w; H = w; cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2, R = Math.min(W, H);
      const iris = cssVar("--iris"), line = cssVar("--line"), amber = cssVar("--amber"), soft = cssVar("--iris-soft");
      const pos = pts.map(p => {
        const a = p.a + (REDUCED ? 0 : t * p.sp * 60);
        return { x: cx + Math.cos(a) * p.r * R, y: cy + Math.sin(a) * p.r * R * .9, sz: p.sz };
      });
      ctx.strokeStyle = line; ctx.lineWidth = 1;
      for (let i = 0; i < pos.length; i++) for (let j = i + 1; j < pos.length; j++) {
        const d = Math.hypot(pos[i].x - pos[j].x, pos[i].y - pos[j].y);
        if (d < R * .18) {
          ctx.globalAlpha = (1 - d / (R * .18)) * .7;
          ctx.beginPath(); ctx.moveTo(pos[i].x, pos[i].y); ctx.lineTo(pos[j].x, pos[j].y); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(cx, cy, R * .115, 0, 7); ctx.fillStyle = soft; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, R * .072, 0, 7); ctx.fillStyle = iris; ctx.fill();
      pos.forEach((p, i) => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, 7);
        ctx.fillStyle = i % 7 === 0 ? amber : iris; ctx.globalAlpha = i % 7 === 0 ? .85 : .55; ctx.fill();
      });
      ctx.globalAlpha = 1;
    }
    on(window, "resize", () => { fit(); draw(); });
    fit();
    (function loop() { if (!alive) return; t++; if (S.step === "s-welcome") draw(); requestAnimationFrame(loop); })();
  })();

  return {
    destroy() {
      alive = false;
      clearInterval(ghostT); clearTimeout(toastT);
      Sound.stop();
      cleanups.forEach(fn => fn());
    }
  };
}
