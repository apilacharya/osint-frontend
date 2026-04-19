# OSINT Intelligence Console — Frontend

This frontend is the React client for an OSINT prototype that accepts a company/person name, fetches aggregated intelligence from backend adapters, and presents categorized findings with history and report workflows.

The UI is built for practical analyst usage: fast search loop, clear source attribution, and predictable error feedback through standardized HTTP-style error codes.

## Test Account

Email: test@gmail.com
Password: Test@12345

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
    "code": 400,
    "type": "VALIDATION_ERROR",
    "message": "Readable message",
    "details": {}
  }
}
```

### HTTP-Style Error Code Mapping

- `400` — Validation error or invalid query parameters
- `404` — Resource not found
- `422` — Entity resolution failed (no high-confidence matches)
- `429` — Rate limit exceeded
- `500` — Report generation failed or internal server error
- `502` — Adapter upstream error (external intelligence source unavailable)

Error responses always include:
- `code` (HTTP-style status code: 400, 404, 422, 429, 500, 502)
- `type` (error classification: VALIDATION_ERROR, RESOURCE_NOT_FOUND, etc.)
- `message` (readable user-facing message)
- `details` (optional structured error details for debugging)

Frontend toast messages are automatically mapped from error codes to consistent, user-friendly messages.

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
