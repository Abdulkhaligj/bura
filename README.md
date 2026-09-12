# BURA

Azərbaycan gəncləri üçün inkişaf və imkanlar platforması. MIT lisenziyalı tətbiq kodu; Youthall, Glassdoor və digər platformaların məxfi mənbə kodu deyil.

## İşləyən axınlar

- Davamlı hesab/profil, saxlanan imkanlar, təşkilatları izləmə.
- İmkan axtarışı, kateqoriya filtri, müraciət, şəxsi status tarixçəsi, geri götürmə.
- Təşkilat profili, elan və tədbir yaratma; idarəçi tərəfindən yayımlama/arxivləşdirmə.
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
