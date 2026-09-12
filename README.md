# BURA

Azərbaycan gəncləri üçün inkişaf və imkanlar platforması. MIT lisenziyalı tətbiq kodu; Youthall, Glassdoor və digər platformaların məxfi mənbə kodu deyil.

## İşləyən axınlar

- Arzu Kompası qeydiyyatın bir hissəsidir: 3 qısa cavab, iş/bacarıq/maraq seçimi, kimlik cümləsi, peşə bürcü və 4 həftəlik plan → "Profilimi yarat". Səyahəti keçmədən qeydiyyatdan keçən istifadəçi ilk girişdə profilini kompasla qurmağa yönləndirilir.
- İnsan mərkəzli profil: kimlik cümləsi, bacarıq və maraqlar, seçilmiş yol və uyğunluq, işarələnən 4 həftəlik plan, digər yollar, LinkedIn başlığı və müsahibə sualları, profil gücü göstəricisi. "Kompası yenilə" səyahəti profil məlumatları ilə doldurulmuş açır; nəticə profilin boş sahələrini doldurur, bacarıqları birləşdirir, istifadəçinin yazdığını əvəz etmir.
- Davamlı hesab/profil, saxlanan imkanlar, təşkilatları izləmə.
- İmkan axtarışı, kateqoriya filtri, müraciət, şəxsi status tarixçəsi, geri götürmə.
- Təşkilat profili, elan və tədbir yaratma; idarəçi tərəfindən yayımlama/arxivləşdirmə.
- İşəgötürən paneli (`#/company`): VÖEN ilə şirkət profili, admin təsdiqi, kataloq profilinə sahiblik müraciəti, holdinq (ana şirkət) bağlantısı, komanda rolları (sahib · işə qəbul mütəxəssisi · müşahidəçi), KPI və başlanğıc addımları.
- Elan sihirbazı: əsas məlumat → detallar (bacarıqlar, maaş) → ön seçim sualları (bəli/xeyr, variantlı, açıq; eleyici cavab gizli saxlanır) → önizləmə. Qaralama saxlanır; təsdiqlənmiş şirkətin elanı dərhal, digərləri admin yoxlamasından sonra yayımlanır. Pulsuz planda eyni vaxtda `BURA_FREE_JOB_LIMIT` (standart 5) aktiv elan; bağlama/yenidən açma, baxış sayı.
- Müraciət və ATS: razılıq, ön seçim cavabları və eleyici qiymətləndirmə, profil + Arzu Kompası snapshot-u, bacarıq uyğunluğu faizi. Mərhələ lövhəsi (Yeni → Baxılır → Müsahibə → Təklif → Qəbul / Rədd), axtarış və filtrlər, qiymət, komanda qeydləri, denetim izi (`application_events`), toplu köçürmə, CSV ixracı, namizədə bildiriş.
- Təşkilat sahibinə məxsus müraciətlər və iştirakçı siyahısı; status yeniləməsi və istifadəçi bildirişi.
- Tutum nəzarəti ilə tədbir qeydiyyatı, bilet, ləğvetmə.
- Dərslər, serverdə yoxlanan suallar, irəliləyiş, PDF tamamlama sertifikatı.
- CV redaktəsi, şəxsi hesabda saxlama və Azərbaycan hərfləri ilə PDF.
- Müsahibə sualları və saxlanan məşqlər; optional server-side OpenAI adapteri.
- Anonim ictimai rəy proyeksiyası, maaş paylaşımı və məcburi moderasiya.
- Kreditlə çəkilən orta bal və Pomodoro.
- 390/768/desktop ölçüləri üçün responsive görünüş.

## Hazır olmayan xarici xidmətlər

3 və 5 AZN planları konseptdir: checkout, ödəniş webhook-u, entitlement sistemi və real tərəfdaş kuponları aktiv deyil. AI açarı olmadıqda təhlil bağlıdır; saxta nəticə göstərilmir. Video/robot müsahibə, real mentor rezervasiyası, şirkət inteqrasiyaları, bütün karyera mərkəzlərinin təsdiqli kataloqu, oyunlar və mükafatlar hələ daxil deyil. Cari buraxılış işlək pilotdur, tam kommersiya buraxılışı deyil.

Şirkət kataloqu tərəfdaşlıq iddiası daşımır. Test elanları yalnız BURA Sınaq Studiyası altındadır. İstifadəçi məlumatları brauzer yaddaşında deyil, server bazasındadır.

## Quruluş

- `web/`: Vite + vanilla JavaScript/CSS, əlçatan native form və dialoglar.
- `server/handler.mjs`: Web Request/Response API və bütün giriş icazələri.
- `server/company.mjs`, `web/company.js`: işəgötürən paneli, elan sihirbazı və ATS (ayrıca yüklənən chunk). Sxem dəyişikliyi `drizzle/0001_company_ats.sql` — yalnız yeni cədvəl/sütun/indeks əlavə edir; tətbiqdən əvvəl `npm run db:remote` (libSQL) və ya Sites migrations işə düşməlidir.
- `web/pusula.js`, `web/pusula.css`: Arzu Kompası (Shadow DOM, ayrıca yüklənən chunk). `server/pusula.mjs`: onun AI istemləri. Nəticə `documents` cədvəlində `compass:<userId>` sənədi kimi saxlanır (`POST /api/compass`, `POST /api/compass/plan`, `GET /api/me` → `compass`); yeni migration tələb etmir. `/api/pusula` girişsiz işləyir, eyni `OPENAI_API_KEY`/`OPENAI_MODEL` istifadə edir, IP üzrə saatda 40 sorğu ilə məhdudlaşır; açar yoxdursa səyahət "nümunə nəticə" qeydi ilə ehtiyat məzmunla davam edir.
- `db/schema.ts`, `drizzle/`: versiyalı SQLite/D1 sxemi. SQL migration faylları ilk tətbiqdən sonra dəyişdirilməməlidir.
- `server/worker.mjs`: Sites Worker, SIWC tərəfindən verilən şəxsiyyət, D1 `DB` binding.
- `server/dev.mjs`: local Node 24 + SQLite + Vite. Local test hesabları; prod SIWC başlıqlarına etibar etmir.
- `api/index.mjs`: Vercel Node Web Handler adapteri; libSQL bazası tələb edir.

## Lokal inkişaf

```sh
npm ci
npm test
npm run dev
```

Local baza `.local/bura.sqlite` faylındadır, git-ə daxil edilmir. Local qeydiyyat ən az 10 simvol şifrə tələb edir. Local hesabların e-poçt təsdiqi/recovery xidməti yoxdur; açıq kommersiya buraxılışı üçün managed auth inteqrasiyası tələb olunur.

`web/qa.html` yalnız dev serverdə telefon/planşet iframe yoxlaması üçündür, istehsal build-inə daxil edilmir.

## Sites

Mövcud project ID `.openai/hosting.json` daxilində saxlanır. `npm run build` Worker və sxem migrations çıxarır. Runtime `BURA_OWNER_EMAIL` yalnız layihə sahibinin təsdiqli e-poçtuna təyin olunur. SIWC mənbə başlıqları yalnız Sites dispatcher daxilində etibarlıdır. Vercel/local adapter bunlara etibar etmir. Mövcud giriş siyasəti public-dir: kataloq açıqdır, şəxsi API-lər SIWC hesabı tələb edir. Yalnız layihə sahibi admin rolunu alır.

## Vercel

Adapter hazırlanıb, yeni backend Vercel-də yerləşdirilməyib. BURA üçün ayrıca libSQL bazası və düzgün Vercel layihə bağlantısı lazımdır. Başqa tətbiqin Supabase bazası istifadə edilmir.

1. Node 24 və `npm ci`.
2. Ayrı boş libSQL/Turso bazasını təmin et; `LIBSQL_URL`, `LIBSQL_AUTH_TOKEN` əlavə et.
3. `npm run db:remote` ilə schema migrations tətbiq et (əvvəl backup və hədəfi yoxla).
4. `vercel.json` `build/client` frontend-i və `/api` Node adapterini istifadə edir.
5. Public launch-dan əvvəl managed auth/email verification/password recovery qoşulmalıdır; private pilot üçün mövcud access protection saxlanmalıdır.

Vercel function forması rəsmi sənədlərə uyğundur: https://vercel.com/docs/functions/runtimes/node-js

## Test

`npm test`: hesab ayrılığı, origin/CSRF, IDOR, təkrar müraciət, tədbir tutumu/ləğv, server-side quiz, anonim rəy moderasiyası, sənəd sahibliyi, təşkilat icazəsi, şifrə sessiyası və restart persistence yoxlanır. Browser QA qeydləri `QA.md` daxilindədir.

PDF şrifti: DejaVu Sans; lisenziya `web/public/fonts/LICENSE.txt`. `pdf-lib`, `fontkit`, `lucide`, `vite`, `esbuild`, `drizzle`, `@libsql/client` öz lisenziyalarına tabedir.
