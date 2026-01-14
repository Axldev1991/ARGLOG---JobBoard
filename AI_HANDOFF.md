# 🧠 AI Context & Handoff Protocol
**Last Updated: Phase 5 Complete (Admin B2B Module)**

This document serves as the **SINGLE SOURCE OF TRUTH** for any AI agent or developer continuing work on this project. Review this before writing a single line of code to ensure consistency, security, and optimization.

---

## 1. 🏗️ Tech Stack & Standards (NON-NEGOTIABLE)

### Core
- **Framework:** Next.js 15 (App Router).
- **ORM:** Prisma (PostgreSQL).
- **Language:** TypeScript (Strict).
- **Styling:** Tailwind CSS + `clsx`/`tailwind-merge` (via `cn()` utility).

### 🔐 Security Rules (CRITICAL)
1.  **Server Actions (Backend):**
    - NEVER trust `FormData` blindly.
    - **MUST** start with `await requireAdminAction()` if the action is administrative (Create/Edit/Delete companies).
    - **MUST** use `await getSession()` for user-facing actions.
2.  **Pages/Routes (Frontend):**
    - **Admin Routes:** MUST be protected by `src/app/admin/layout.tsx` (which calls `protectAdminRoute`).
    - **User Routes:** Check session in `page.tsx` or middleware.
3.  **Database:**
    - Use `onDelete: Cascade` in Prisma Schema for cleanups (User -> Profile, Jobs, Applications). DO NOT delete manually in loops.

### ♻️ Code Reusability & Tools
*Before writing a helper, check if it exists:*

- **Auth:** `src/lib/session.ts` -> `getSession`, `login`, `logout`.
- **Security:** `src/lib/auth-guard.ts` -> `requireAdminAction`, `protectAdminRoute`.
- **DB Connection:** `src/lib/db.ts` -> `prisma` (Singleton).
- **Formatting:** `src/lib/utils.ts` -> `formatDate`, `cn` (class merger), `isProfileComplete`.
- **Emails:** `src/lib/resend.ts` -> `resend` instance.

---

## 2. 🗺️ Current System Status

### ✅ Completed Modules
1.  **Authentication:** Custom JWT-based auth (Cookie `user_session`). Roles: `candidate`, `company`, `admin`, `dev`.
2.  **Job Board:** Public visibility, applying logic, tag filtering.
3.  **Candidate Profile:** CV upload (Cloudinary), profile editing.
4.  **Admin B2B (The "Iron Dome"):**
    - Dashboard at `/admin/dashboard`.
    - Secure CRUD for Companies (Create, Edit, Delete).
    - Automated Credentials Emailing (Resend).
5.  **DevTools:** Floating widget for role impersonation (`src/components/shared/dev-tools-content.tsx`).

### 🚧 Roadmap & Future Tasks (Granular)
*Pick a task from this list to continue development:*

#### Phase 6: Analytics & Insights (Dashboard 2.0)
- [ ] **Admin Charts:** Integrate `recharts` to show "New Companies vs New Candidates" over time.
- [ ] **Job Performance:** Add view counters to `Job` model and display "Views vs Applications" to Companies.
- [ ] **Export Data:** Implement CSV export for Admin (User lists, Job reports).

#### Phase 7: Growth & SEO (Public Visibility)
- [ ] **Metadata:** Implement Dynamic `generateMetadata` for `src/app/jobs/[id]/page.tsx` (Title, Description, OG Images).
- [ ] **Structured Data:** Inject JSON-LD (Schema.org `JobPosting`) for Google Jobs indexing.
- [ ] **Sitemap:** Generate `sitemap.xml` dynamically.

#### Phase 8: Engagement & Notifications
- [ ] **Job Alerts:** Create a subscription model (Email me when tag 'SAP' is posted).
- [ ] **Email Workers:** Set up a cron job (Vercel Cron) to process queued email alerts.

#### Phase 9: Refinement (The "Polish")
- [ ] **Rich Text Editor:** Replace `<textarea>` in Job Form with Tiptap/Quill for bold/bullet points.
- [ ] **Advanced Filters:** Add "Distance from ZipCode" or "Salary Range" slider to Search.


---

## 3. 📂 Key Directory Map
*Don't get lost. Here is where the important stuff lives:*

```
src/
├── actions/
│   ├── admin/           # 🛡️ PROTECTED B2B Actions (create, update, delete company)
│   └── ...              # Public/User actions
├── app/
│   ├── admin/           # 🛡️ PROTECTED Routes (Layout handles security)
│   ├── dashboard/       # 🧠 Smart Dashboard (renders view based on Role)
│   └── ...
├── components/
│   ├── admin/           # Admin-specific UI (forms, tables)
│   ├── shared/          # Reusable UI (Navbar, Cards, DevTools)
│   └── ui/              # Shadcn primitives
└── lib/                 # The Toolbox (DB, Auth, Utils)
```

---

## 4. ⚠️ Optimization & Anti-Patterns
1.  **Hydration Mismatches:** We use `suppressHydrationWarning` in `RootLayout` due to browser extensions. Do not remove it without testing.
2.  **Component Size:** Keep client components small. Extract logic to custom hooks (e.g., `useJobFilter`) if they grow > 200 lines.
3.  **Server vs Client:** Prefer Server Components. Use `"use client"` ONLY for interactivity (forms, buttons).

---
*Use this context to maintain the high engineering standard set in Phases 1-5.*
