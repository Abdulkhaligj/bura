# BURA Functional Requirements Document

> Youth development and opportunity platform for Azerbaijan

| Field | Value |
|---|---|
| Document type | Functional Requirements Document |
| Version | 1.0 |
| Date | 12 September 2026 |
| Product owner | BURA |
| Status | Baseline for approval |

## Document purpose

This document defines the user roles, core product flows, functional requirements, business rules, data objects, integrations, non-functional requirements, and acceptance criteria for BURA. It provides one baseline for product, UX/UI, frontend, backend, quality assurance, moderation, and partnership teams.

**Core decision:** the first commercial release is not a vacancy board that guarantees employment. BURA is a development platform where young people create profiles, build skills, discover real opportunities, manage applications, and connect with universities, communities, and employers.

> **Accuracy and partnership notice:** company, university, and programme information may be described as official or partnered only after verification. Unclaimed catalogue profiles and test content must be clearly labelled.

## Table of contents

1. [Document governance](#1-document-governance)
2. [Product purpose and scope](#2-product-purpose-and-scope)
3. [User roles and permissions](#3-user-roles-and-permissions)
4. [Core user journeys](#4-core-user-journeys)
5. [Functional requirements](#5-functional-requirements)
6. [Business rules](#6-business-rules)
7. [State models](#7-state-models)
8. [Data model](#8-data-model)
9. [External integrations](#9-external-integrations)
10. [Non-functional requirements](#10-non-functional-requirements)
11. [Analytics and reporting](#11-analytics-and-reporting)
12. [Acceptance and release criteria](#12-acceptance-and-release-criteria)
13. [Phased delivery plan](#13-phased-delivery-plan)
14. [Open decisions](#14-open-decisions)
15. [Glossary](#15-glossary)

## 1. Document governance

| Field | Definition |
|---|---|
| Document owner | BURA Product Lead |
| Primary readers | Product, UX/UI, frontend, backend, QA, moderation, and partnership teams |
| Change control | Preserve the requirement ID when a requirement changes; update its content and document version history |
| Priority model | P0 = mandatory; P1 = first expansion; P2 = later development |
| Completion rule | A requirement is complete only after its acceptance criteria have passed |

## 2. Product purpose and scope

### 2.1 Product objective

BURA shall allow people aged 15–30 in Azerbaijan to manage their development and career journey in one place. A single account shall connect jobs, internships, volunteering, freelance work, events, academy content, student clubs, university career centres, organisation profiles, salary and workplace reviews, CV tools, and interview practice.

### 2.2 Product principles

- BURA must not promise or guarantee employment; it creates access, preparation, and connections.
- The experience must use Azerbaijani market conventions, AZN, Baku time, and local education structures.
- Unverified organisations and universities must not be presented as partners.
- Personal data must be collected only for a necessary purpose and protected through role-based access.
- Mobile is the primary device; desktop and tablet must retain the same core capabilities.
- If payments or AI services are unavailable, the platform must not simulate success or imply that the service is active.

### 2.3 Scope boundaries

| Included | Excluded from the first release |
|---|---|
| Accounts, profiles, search, saves, and follows | Employment guarantees or automated job offers |
| Jobs, internships, volunteering, and freelance listings | Full replacement of an employer's internal HR system |
| Event registration, course progress, CV, and practice tools | Government diploma or official accreditation claims |
| Organisation workspace and moderation | Paid-plan sales before a payment provider is connected |
| Salary and workplace reviews | Employability scoring based on sensitive characteristics |

## 3. User roles and permissions

| Role | Main capabilities | Restrictions |
|---|---|---|
| Guest | Browse public organisations, opportunities, events, courses, and approved reviews | Cannot post, save, apply, or register |
| Youth user | Manage profile, CVs, courses, applications, events, reviews, saves, and follows | Can access only their own private data and history |
| Organisation representative | Manage an organisation profile, listings, events, and applications to owned content | Cannot act for an organisation before verification |
| Moderator | Review content and contributions; reject policy violations | Cannot change system settings or unrelated admin controls |
| Administrator | Manage moderation, organisation ownership, audits, and core settings | Every privileged action must be audited |
| Mentor — P1 | Maintain a verified mentor profile, topics, and availability | Cannot sell sessions before booking and payment integrations exist |

## 4. Core user journeys

| ID | Journey | Expected outcome |
|---|---|---|
| US-01 | First visit | A guest browses public opportunities, signs in, completes a profile, and selects interests |
| US-02 | Opportunity application | A user finds a listing through search and filters, reviews its terms, and applies with a profile snapshot and motivation note |
| US-03 | Application management | An organisation accesses applications to its own listings, changes status, and the candidate receives a notification |
| US-04 | Event | A user registers while capacity is available, receives a ticket, and can cancel the registration |
| US-05 | Learning | A user completes lessons, answers server-validated questions, and receives an internal certificate after full completion |
| US-06 | CV | A user imports profile data, edits and saves a CV, then downloads a PDF that supports Azerbaijani characters |
| US-07 | Review and salary | A user shares workplace experience; it becomes public without the author's identity after moderation |
| US-08 | Organisation onboarding | A representative requests a profile, proves affiliation, and manages listings and events after approval |

## 5. Functional requirements

P0 requirements are mandatory for the first real pilot. P1 covers the first expansion and monetisation layer. P2 is planned after product validation.

### 5.1 Account and secure access

| ID | Priority | Actor | Requirement | Acceptance criteria |
|---|---|---|---|---|
| AUTH-001 | P0 | Guest | Create an account and sign in using email or an approved identity provider | Valid details create a session; invalid credentials return a generic error; passwords are never stored in plain text |
| AUTH-002 | P0 | User | Sign out and revoke the active session | Protected pages and APIs return sign-in or HTTP 401 after sign-out |
| AUTH-003 | P0 | System | Enforce server-side authentication and role checks for private and write operations | Changing an object ID cannot expose or modify another user's profile, CV, or application |
| AUTH-004 | P1 | User | Verify email, recover a password, and sign out on all devices | A single-use expiring link works and existing sessions are revoked |
| AUTH-005 | P1 | System | Rate-limit suspicious sign-ins and high-frequency requests; record them in audit logs | The service returns HTTP 429 after the limit and an administrator can inspect the event |

### 5.2 Profile and personal workspace

| ID | Priority | Actor | Requirement | Acceptance criteria |
|---|---|---|---|---|
| PROF-001 | P0 | User | Edit name, city, university, major, bio, skills, experience, phone number, and interests | Data remains after a new session and required fields are validated |
| PROF-002 | P0 | User | View application, event, course, document, save, and notification history | Only the active account's data is shown; empty and error states are explicit |
| PROF-003 | P1 | User | View profile completeness and a development checklist | Percentage uses genuinely completed fields and identifies the next missing action |
| PROF-004 | P1 | User | Export personal data and request account deletion | Export is machine-readable; deletion follows confirmation and retention rules |

### 5.3 Discovery, search, and recommendations

| ID | Priority | Actor | Requirement | Acceptance criteria |
|---|---|---|---|---|
| DISC-001 | P0 | Everyone | Search opportunities, organisations, events, and courses from one interface | Results match title, organisation, city, and category; an empty query shows all public content |
| DISC-002 | P0 | Everyone | Filter by type, city, format, date, and category | Filters work together, preserve their visible or URL state, and provide a zero-results state |
| DISC-003 | P0 | User | Save an opportunity and follow an organisation | Repeating the action toggles state without losing scroll position or mixing account data |
| DISC-004 | P1 | User | Receive explainable recommendations based on interests, skills, and activity | Every recommendation includes a reason and sensitive data is excluded from matching decisions |
| DISC-005 | P1 | User | Use search filters comfortably on mobile | The filter panel works with touch and keyboard and exposes clear Apply and Clear actions |

### 5.4 Organisation directory and ownership

| ID | Priority | Actor | Requirement | Acceptance criteria |
|---|---|---|---|---|
| ORG-001 | P0 | Everyone | View profiles for companies, universities, schools, clubs, and career centres | Profiles show type, sector, city, description, and verification status |
| ORG-002 | P0 | System | Distinguish unverified directory profiles from verified partnerships | Unclaimed or unverified status is visible and fabricated statistics are not shown |
| ORG-003 | P0 | Representative | Create an organisation profile and submit it for review | The profile is created as pending and is not public before approval |
| ORG-004 | P1 | Representative | Claim organisation ownership using corporate email and documents | Verification history is retained and unauthorised ownership is blocked |
| ORG-005 | P1 | Organisation | Assign owner, editor, and recruiter roles to team members | Each role is restricted to the permission matrix |

### 5.5 Opportunities and applications

| ID | Priority | Actor | Requirement | Acceptance criteria |
|---|---|---|---|---|
| OPP-001 | P0 | Organisation | Create job, internship, volunteering, and freelance listings | Title, organisation, description, requirements, city, format, and deadline are validated; initial status is pending |
| OPP-002 | P0 | Moderator | Publish, reject, and archive a listing | Only published listings are public and every decision is audited |
| APP-001 | P0 | User | Apply using a profile snapshot and a note of at least 20 characters | A user cannot apply twice to the same listing and expired listings reject applications |
| APP-002 | P0 | User | View current application status and withdraw | A withdrawn application is locked and cannot later be accepted by the organisation |
| APP-003 | P0 | Organisation | View and change status only for applications to its own listings | Applications belonging to another organisation are inaccessible and status changes notify the user |
| APP-004 | P1 | Organisation | Manage a candidate pipeline with notes, tags, filters, and stages | Filters are correct, internal notes remain hidden from candidates, and changes are audited |
| APP-005 | P2 | User | Select an interview time through the platform | Only organisation-created slots are selectable and Baku time is clearly displayed |

### 5.6 Events

| ID | Priority | Actor | Requirement | Acceptance criteria |
|---|---|---|---|---|
| EVT-001 | P0 | Organisation | Create an event with date, time, format, venue, and capacity | Past dates are rejected and capacity must be a valid integer greater than zero |
| EVT-002 | P0 | User | Register once while capacity is available and access a ticket | Capacity is checked atomically and only one active ticket exists per account |
| EVT-003 | P0 | User | Cancel an event registration | Capacity is released immediately for another user |
| EVT-004 | P1 | Organisation | Use QR check-in, attendance status, and CSV attendee export | A ticket checks in once and export is limited to the owning organisation |
| EVT-005 | P1 | System | Send in-app and email reminders before an event | One timely notification is sent to consenting users and unsubscribe works |

### 5.7 Academy and certificates

| ID | Priority | Actor | Requirement | Acceptance criteria |
|---|---|---|---|---|
| ACD-001 | P0 | Everyone | Browse a course catalogue with level, duration, lessons, and description | Only published courses are visible and answer keys are absent from public APIs |
| ACD-002 | P0 | User | Complete a lesson and answer its validation question on the server | Incorrect answers do not advance progress; a correct answer completes the lesson once |
| ACD-003 | P0 | User | Continue course progress across devices | Completed lessons and results remain consistent after a new sign-in |
| ACD-004 | P0 | User | Download a uniquely identified PDF certificate after all lessons | The certificate ID is stable, Azerbaijani characters render correctly, and it is not represented as an official diploma |
| ACD-005 | P1 | Author | Manage courses, lessons, quizzes, pass thresholds, and versions | New versions preserve existing learner progress according to an explicit migration rule |

### 5.8 CV and interview tools

| ID | Priority | Actor | Requirement | Acceptance criteria |
|---|---|---|---|---|
| TOOL-001 | P0 | User | Build, edit, and store a CV using profile data | Only allowed fields are stored and the document is inaccessible from another account |
| TOOL-002 | P0 | User | Download a PDF CV that supports Azerbaijani characters | Ə, Ğ, İ, Ö, Ş, Ü, and Ç remain readable and download begins only after a user action |
| TOOL-003 | P0 | User | Practise with STAR interview questions and save answers | Answers persist and the complete manual practice flow works without AI |
| AI-001 | P1 | User | Request AI feedback on an answer after explicit consent | If AI is unavailable, the service returns HTTP 503 with a clear message and no fabricated analysis |
| AI-002 | P1 | System | Assess specificity and STAR structure, suggest improvements, and avoid hiring decisions | No output is based on sensitive characteristics and prompt-injection text cannot override system policy |
| TOOL-004 | P0 | Everyone | Use a credit-weighted 100-point GPA calculator and Pomodoro timer | GPA equals sum of grade × credit divided by total credits; timer supports start, pause, and reset |

### 5.9 Reviews, salaries, and moderation

| ID | Priority | Actor | Requirement | Acceptance criteria |
|---|---|---|---|---|
| REV-001 | P0 | User | Submit a 1–5 rating, role, review text, and optional monthly net salary in AZN | Text has at least 30 characters and salary is validated between 1 and 100,000 AZN |
| REV-002 | P0 | Moderator | Approve or reject a review | Pending reviews are not public and the decision is audited |
| REV-003 | P0 | System | Display an approved review without the author's name or email | Public responses exclude user ID and personal contact information |
| REV-004 | P1 | System | Flag personal data, abuse, and duplicate submissions for moderation | Suspicious content is never auto-published and the moderator sees the reason |
| REV-005 | P1 | Everyone | Display salary medians and sample sizes by role and period | No figure is shown when the segment is below the minimum anonymity threshold |

### 5.10 Notifications, plans, and benefits

| ID | Priority | Actor | Requirement | Acceptance criteria |
|---|---|---|---|---|
| NOT-001 | P0 | User | Receive in-app status notifications and mark them as read | Notifications are visible only to the relevant account and read state persists |
| SUB-001 | P0 | Everyone | View the services and limits of Free, 3 AZN, and 5 AZN plans | An inactive paid plan has a disabled action and is labelled not available for sale |
| SUB-002 | P1 | User | Purchase, renew, and cancel a plan through a payment provider | A plan activates only after a verified webhook and duplicate webhooks do not grant duplicate entitlement |
| SUB-003 | P1 | System | Calculate AI usage limits on the server according to plan | Limits use the active subscription, never a plan value supplied by the client |
| PRIV-001 | P1 | User | Unlock and redeem a verified partner benefit | Validity, conditions, and use limit are visible; the server issues codes according to one-use rules |
| NOT-002 | P1 | User | Select email notification categories | Each category is independently configurable except mandatory security messages |

### 5.11 Administration and audit

| ID | Priority | Actor | Requirement | Acceptance criteria |
|---|---|---|---|---|
| ADM-001 | P0 | Administrator | View queues for pending organisations, listings, courses, and reviews | Queues filter by status, date, and type and are visible only to authorised roles |
| ADM-002 | P0 | Administrator | Publish, reject, and archive content | Actor, timestamp, object, and action are recorded in the audit log |
| ADM-003 | P1 | Administrator | Review reports, hide content, and restrict accounts | A reason is mandatory, an appropriate user notification is created, and restoration is possible |
| ADM-004 | P1 | Administrator | Manage organisation ownership and team roles | Ownership changes require two-step confirmation and audit logging |
| ADM-005 | P1 | Administrator | View core product metrics without exposing personal data | Dashboards are aggregated; individual CV and application text is excluded from analytics |

## 6. Business rules

| ID | Rule |
|---|---|
| BR-001 | A user may submit no more than one application to the same listing |
| BR-002 | The profile is stored as an immutable snapshot at application time; later profile edits do not change an earlier application |
| BR-003 | Expired and archived listings do not accept new applications |
| BR-004 | A representative may manage only an organisation they own or are authorised to access |
| BR-005 | Event registration may never exceed capacity; a cancellation releases a place |
| BR-006 | A course certificate is created only after all mandatory lessons are correctly completed |
| BR-007 | Reviews are not public before moderation; public review payloads contain no author identifier |
| BR-008 | An organisation's presence in the directory does not imply partnership or an active listing |
| BR-009 | Test listings, events, and benefits are clearly labelled and never presented as real services |
| BR-010 | A paid plan activates only after a successful, signed provider event |
| BR-011 | AI practice is advisory and does not make hiring, salary, or legal decisions |
| BR-012 | Dates and times are displayed in Baku time with the time zone indicated |
| BR-013 | Prices are shown in AZN; recurring charges clearly state the billing period |

## 7. State models

### 7.1 Application states

| Current state | Allowed next states | Changed by |
|---|---|---|
| `submitted` | `reviewing`, `interview`, `accepted`, `rejected`, `withdrawn` | Organisation; user for `withdrawn` |
| `reviewing` | `interview`, `accepted`, `rejected`, `withdrawn` | Organisation; user for `withdrawn` |
| `interview` | `accepted`, `rejected`, `withdrawn` | Organisation; user for `withdrawn` |
| `accepted` | `withdrawn` | User |
| `rejected` | Terminal | None |
| `withdrawn` | Terminal | None |

### 7.2 Content states

| State | Meaning | Public |
|---|---|---|
| `draft` | Creator's working copy | No |
| `pending` | Awaiting moderation | No |
| `published` | Approved and active | Yes |
| `rejected` | Rejected with a reason | No |
| `archived` | Closed to new activity | No; history only |

## 8. Data model

| Entity | Core fields | Visibility |
|---|---|---|
| User | id, name, email, role, profile, created_at | Private |
| Session | token_hash, user_id, CSRF, expires_at | Highly confidential |
| Organization | id, type, name, sector, city, description, verification, owner | Public and administrative projections |
| Opportunity | type, organisation, title, description, requirements, format, deadline, status | Public when published |
| Application | user, opportunity, note, profile_snapshot, status, timestamps | Candidate and owning organisation |
| EventRegistration | user, event, status, ticket_id, timestamps | User and owning organisation |
| CourseProgress | user, course, completed_lessons, score, certificate_id | Private |
| Contribution | user, organisation, review/salary body, moderation_status | Author private; approved projection public |
| Document | user, CV/interview body, timestamps | Private |
| Subscription | user, plan, status, expiry, provider IDs | Private financial metadata |
| Audit | actor, action, object, timestamp | Administrators only |

## 9. External integrations

| Integration | Purpose | Requirement | Fallback |
|---|---|---|---|
| Managed authentication or SIWC | User identity | Server accepts identity only from a trusted source | Public catalogue works; private actions request sign-in |
| Email provider | Verification, recovery, reminders | Templates, retry, unsubscribe, and delivery logs | In-app notification |
| OpenAI or compatible AI | Interview and CV feedback | Server-side key, limits, consent, and guarded prompts | Manual practice and saved answers |
| Local payment provider or Merchant of Record | 3 AZN and 5 AZN plans | Checkout, signed webhooks, refunds, and idempotency | Plans shown as unavailable |
| Object storage — P1 | CV attachments and organisation documents | Private bucket, signed URLs, malware and size checks | Text-based CV |
| Analytics | Funnel and usage measurement | Consent, anonymous identifier, and no PII | Server-side aggregate reporting |

## 10. Non-functional requirements

| ID | Area | Requirement and measure |
|---|---|---|
| NFR-001 | Responsive design | No horizontal overflow at 390 px phone, 768 px tablet, or 1280 px desktop; all core functions remain available |
| NFR-002 | Performance | Critical content appears quickly on first load; large PDF libraries load only after the user starts a CV or certificate action |
| NFR-003 | Accessibility | Keyboard navigation, visible focus, form labels, 44 px touch targets, meaningful headings, and dialog focus management |
| NFR-004 | Motion | Transitions use 160–320 ms durations and primarily opacity/transform; `prefers-reduced-motion` is fully respected |
| NFR-005 | Security | Server auth and ownership checks, CSRF/origin validation, rate limits, parameterised SQL, secure cookies, and security headers |
| NFR-006 | Privacy | Public APIs exclude private fields; review authors remain hidden; AI data transfer is explained before consent |
| NFR-007 | Reliability | Unique constraints protect applications and tickets; payment webhooks are idempotent; database failures preserve user input and offer recovery |
| NFR-008 | Localisation | Azerbaijani is the primary language; AZN and Baku time are used; Azerbaijani characters work in UI and PDFs |
| NFR-009 | Browser support | Support the latest two major versions of Chrome, Safari, Edge, and common mobile browsers |
| NFR-010 | Observability | Server errors include request IDs; logs never contain passwords, session tokens, CV text, or application notes |
| NFR-011 | Backup | Production database has daily backups and tested restoration; migrations are immutable and versioned |
| NFR-012 | Open source | Every added library licence is reviewed and required attribution and licence terms are stored in the repository |

## 11. Analytics and reporting

Product analytics are used to evaluate platform value and flow drop-off, never to make individual hiring decisions.

| Metric | Definition | Minimum data |
|---|---|---|
| Active user | Signed in and completed at least one core action in the last 30 days | Hashed user ID, date |
| Profile completeness | Percentage of required profile fields completed | Aggregate percentage |
| Discovery-to-application funnel | Listing view, save, apply, and submit | Content ID, stage, date |
| Event conversion | Detail view to active registration | Event ID, stage |
| Course completion | Certificate recipients among course starters | Course ID, progress status |
| Organisation activity | Number of published listings and events | Organisation ID, aggregate count |
| Moderation SLA | Median time from pending to decision | Content type and timestamps |
| Retention | Accounts returning after 7 and 30 days | Anonymous cohort |

## 12. Acceptance and release criteria

### 12.1 Functional acceptance

- All P0 acceptance criteria pass and no blocking defects remain.
- Data isolation and IDOR tests pass using two separate accounts.
- Duplicate application, deadline, withdrawal, and organisation ownership scenarios pass.
- Event capacity cannot be exceeded, including concurrent registration attempts.
- Course answer keys are absent from the client bundle and public APIs; certificates require full completion.
- Reviews remain private before moderation and expose no author identifier after approval.
- Payment and AI features remain clearly unavailable when their providers or credentials are missing.

### 12.2 UX and device acceptance

- Users can reach search and opportunities immediately from the home page.
- The mobile menu opens and closes with one hand and closes after route selection.
- Navigation, save, and follow actions do not reset scroll position without reason.
- Dialogs trap focus, close with Escape and a visible control, and return focus to the trigger.
- Loading states reduce layout shift; empty and error states provide a next action.
- Animation is minimised when reduced motion is enabled.

### 12.3 Release checklist

| Check | Owner | Exit condition |
|---|---|---|
| P0 functional tests | QA | 100% pass |
| Roles and security | Backend and QA | No critical or high-severity findings |
| Mobile, tablet, desktop | UX/UI and QA | No clipping or overflow in core journeys |
| Content and legal copy | Product and legal | Test and partnership labels are accurate |
| Backup and rollback | DevOps | Restoration and rollback tested |
| Analytics and consent | Product | Events record correctly without PII |

## 13. Phased delivery plan

| Phase | Objective | Included capabilities | Exit criterion |
|---|---|---|---|
| M0 — Working pilot | Validate the concept with real flows | Profile, catalogue, test opportunities, applications, events, courses, CV PDF, review moderation, GPA, Pomodoro | User tests completed and core technical stability reached |
| M1 — Real MVP | Operate with initial universities and employers | Managed auth, verified organisation onboarding, real listings, email, extended filters, QR check-in, analytics | At least three verified organisations and a real end-to-end user flow |
| M2 — Monetisation | Sell 3 AZN and 5 AZN plans | Payments, webhooks, entitlements, AI limits, verified partner benefits | Payment, refund, and reconciliation tests pass |
| M3 — Ecosystem | Grow the campus and development network | Mentor booking, club pages, career-centre workspace, awards, development portfolios | Partner and moderation operations are measurable |

## 14. Open decisions

| ID | Decision required | Recommended direction |
|---|---|---|
| Q-01 | Is BURA the final brand and which domain will be used? | Complete trademark and domain checks before MVP launch |
| Q-02 | What is the minimum user age? | Require parental consent and enhanced privacy below age 15 |
| Q-03 | Which evidence verifies organisation ownership? | Corporate email plus an authorisation document |
| Q-04 | What are the monthly AI limits for the 3 AZN and 5 AZN plans? | Approve after unit-economics and AI-cost modelling |
| Q-05 | Which payment provider and tax model will be used? | Legally assess local merchant and Merchant of Record options |
| Q-06 | What is the minimum anonymous sample for salary reporting? | Start with five, subject to legal and risk review |
| Q-07 | Will mentor sessions be sold within the platform? | Keep outside MVP; add at P2 only after partner and operational models are ready |
| Q-08 | Who verifies the national university and career-centre catalogue? | Import public data, then require organisation claims and moderator verification |

## 15. Glossary

| Term | Definition |
|---|---|
| FRD | Functional Requirements Document defining what the product must do |
| P0 / P1 / P2 | Mandatory, first expansion, and later development priorities |
| SIWC | Sign in with ChatGPT for secure identity and authentication |
| Snapshot | Immutable profile copy captured at application time |
| IDOR | Insecure Direct Object Reference: unauthorised access by changing an object ID |
| CSRF | Cross-Site Request Forgery: an unauthorised write request made through a user's active session |
| Entitlement | Service access granted by an active plan |
| Webhook | A signed provider callback delivering a payment or status event to the server |
| SLA | Measurable service-level target for an operation |
| Unclaimed profile | Directory profile not yet verified by an organisation representative |

## Approval

After product, design, and engineering approve this document as the baseline, backlog items must reference the relevant FRD IDs. Any decision that changes functional scope must increment the document version.

| Role | Name | Date | Signature |
|---|---|---|---|
| Product owner |  |  |  |
| Technical lead |  |  |  |
| UX/UI lead |  |  |  |
| QA lead |  |  |  |
