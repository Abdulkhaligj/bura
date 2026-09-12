# BURA pilot QA — 2026-09-11

- 10 automated backend scenarios pass (Node 24 SQLite, same prepared SQL and Web Request/Response handler as D1).
- Separate accounts: profile, document and application isolation; unauthorized moderation and organization impersonation rejected.
- Session auth: PBKDF2 password verification, HttpOnly cookie, origin check, CSRF check, logout invalidation.
- Persistence checked across database close/reopen.
- Event capacity 1: second user rejected, cancellation frees place, duplicate RSVP preserves ticket.
- Course answers not exposed in public catalog; wrong answer does not complete; certificate generated only after all lessons and stable across repeated answers.
- Public reviews remain invisible until moderation and omit author identity after approval.
- Desktop browser (~1348 px): rendered home, search SOCAR, correct catalog result.
- 390 px phone / 768 px tablet using actual app in iframe viewports: responsive navigation and content inspected. Phone menu links work; Pomodoro starts.
- Browser GPA: 80×6 + 100×3 = 86.67, 9 credits.
- CV PDF generated and extracted with pdftotext: Azerbaijani characters preserved.

Limitations: no physical device testing; no real third-party payment or AI call (credentials absent); login-protected UI was covered by backend scenarios, not a complete browser account creation journey. Vercel backend is prepared but not deployed or verified. D1 deployment outcome is recorded by the hosting system separately. This is a pilot on the existing public Site, not a completed commercial launch; private account records remain protected.
