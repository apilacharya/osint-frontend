# OSINT Intelligence Console — Frontend

This frontend is the React client for an OSINT prototype that accepts a company/person name, fetches aggregated intelligence from backend adapters, and presents categorized findings with history and report workflows.

The UI is built for practical analyst usage: fast search loop, clear source attribution, and predictable error feedback through standardized API error codes.

---

## 1. Project Overview

The goal of this frontend is to provide a clean and professional interface for:

1. Entering an entity target (company or individual).
2. Running multi-source OSINT retrieval through backend APIs.
3. Viewing categorized findings with source URL + timestamp metadata.
4. Accessing saved search history and report artifacts.
5. Triggering report generation/export (Markdown/PDF, handled by backend).

Persistence, adapter orchestration, entity resolution, and scoring are backend responsibilities.  
This client focuses on UX quality, data presentation, request/response validation, and state management.

---

## 2. Assessment Requirement Alignment

### Phase I: Data Acquisition (Multi-Vector Search)

The frontend initiates OSINT searches and renders results grouped into:

- **Social/Public footprint**
- **Technical infrastructure**
- **Contextual/Regulatory**

Category names and adapters are provided by backend metadata and displayed in the **Sources** panel.

### Phase II: Analysis & Disambiguation

Entity resolution, validation, and scoring are backend operations.  
The frontend consumes normalized findings and displays:

- confidence values
- risk severity (when provided)
- source provenance and retrieval timestamps

### Phase III: UI & Reporting

Implemented UI surfaces:

- Search input screen (entity + context fields)
- Categorized results dashboard
- Finding detail modal
- Search history page (authenticated users)
- Reports page (authenticated users)
- Report export actions (Markdown/PDF)

---

## 3. Tech Stack

- **React 19 + TypeScript**
- **Vite + pnpm**
- **Tailwind CSS**
- **TanStack Query** for server state
- **Zustand** for local UI state
- **React Hook Form + Zod** for form validation
- **Axios + Zod** for API envelope/response parsing
- **Sonner** for toast feedback
- **Ant Design Pagination/Spin** for list UX

---

## 4. Architecture Notes

### Frontend responsibilities

- Form state and UX transitions for search
- URL query-param driven search flow (`q`, `entityType`, `aliases`, `location`, `industry`)
- Rendering categorized findings and detail views
- List filtering/pagination for history and reports
- Consistent user-facing error toasts from backend error envelope

### Backend responsibilities (consumed by this client)

- Adapter execution and aggregation
- Entity resolution and false-positive filtering
- Confidence/risk scoring
- Database persistence
- Report generation

### Directory layout (frontend)

```txt
frontend/src/
  app/                 # App shell, providers, routing
  pages/               # Search, history, reports pages
  features/            # Search/results/findings/reports/auth feature UIs
  components/          # Shared UI components
  hooks/               # React Query hooks
  schemas/             # Zod request/response schemas
  store/               # Zustand UI store
  lib/                 # API client, errors, utils
  types/               # Shared TypeScript types
  styles/              # Design tokens/styles
```

---

## 5. API Contract Expectations

This frontend expects the backend to return a standard envelope:

### Success

```json
{
  "success": true,
  "data": {},
  "meta": {},
  "error": null
}
```

### Error

```json
{
  "success": false,
  "data": null,
  "meta": {},
  "error": {
    "code": 1001,
    "type": "VALIDATION_ERROR",
    "message": "Readable message",
    "details": {}
  }
}
```

Known numeric code mapping used in UI toast logic:

- `1001` Validation error
- `1002` Invalid/missing query parameters
- `1003` Entity resolution failed
- `1004` Adapter upstream error
- `1005` Rate limit exceeded
- `1006` Resource not found
- `1007` Report generation failed
- `1099` Internal server error

---

## 6. Setup

### Prerequisites

- Node.js 20+
- pnpm 10+
- Running backend API

### Environment

Create `.env` in `frontend/`:

```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

### Install and run

```bash
pnpm install
pnpm dev
```

App default URL: `http://localhost:5173`

---

## 7. Scripts

- `pnpm dev` — start Vite dev server
- `pnpm lint` — run ESLint
- `pnpm build` — type-check and production build
- `pnpm preview` — preview production build locally

---

## 8. User Flows

### Search flow

1. Fill target and optional context.
2. Submit form (URL query params are updated).
3. Query is executed and results are rendered by category.
4. Clicking a finding opens detailed metadata.

### History flow (authenticated)

1. View previous search runs.
2. Click a record to return to homepage with URL params restored.
3. Search form auto-hydrates from URL and reruns accordingly.

### Report flow (authenticated)

1. Create report from a search run.
2. View report records in Reports page.
3. Download generated markdown/pdf artifact.

---

## 9. UI/UX and State Handling

- Loading/empty/error states are explicitly handled in search/history/reports.
- Pagination is enabled for long lists to keep dashboard/list screens clean.
- Query cancellation/reset is applied when navigating away from homepage flows.
- Form and URL are synchronized to support reproducibility and shareable state.

---

## 10. Deliverables Checklist (Frontend Scope)

- [x] Setup and run instructions
- [x] Environment variable documentation
- [x] Architecture and folder structure explanation
- [x] API envelope expectations and error code mapping
- [x] Search/history/report UI behavior summary
- [ ] Hosted frontend URL (add after deployment)
- [ ] Sample generated report link/file reference (add after generation)

---

## 11. Deployment Notes

The frontend is deployment-ready for Vercel/Netlify/static hosting.  
Ensure `VITE_API_BASE_URL` points to the deployed backend API and CORS allowlist includes the frontend origin.
