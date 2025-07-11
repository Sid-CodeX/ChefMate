# Agile Sprint Plans – ChefMate Backend & AI Assistant

This document outlines the sprint goals, timelines, and deliverables for the ChefMate backend and AI-powered cooking assistant.

---

## Sprint 1 – Project Setup

**Duration:** July 4 – July 8, 2025
**Goal:** Complete project scaffolding with backend, database setup, frontend base, and deploy LLM APIs for intelligent features.

### Tasks:

* Set up PostgreSQL on Render
* Create initial schema and tables (`users`, `recipes`, `favorites`, `logs`, etc.)
* Configure Node.js backend with pool-based PostgreSQL connection
* Initialize React frontend (`frontend/`) with Tailwind CSS and routing
* **Build FastAPI microservices for:**
    * Recipe rewrite LLM
    * Cooking chat assistant
    * Smart shopping list generation
* Deploy LLM models to Hugging Face Spaces (via Render backend relay)

### Definition of Done:

* Backend connects to live Render PostgreSQL database
* Frontend renders static layout and dummy data via Axios from Express
* FastAPI services hosted and accessible via REST for:
    * `/rewrite/`, `/chat/`, `/shopping/` endpoints
* Repo has clean structure:
    * `frontend/` (React)
    * `backend/`  (Node.js backend)
    * `docs/`     (Documentation)


---

## Sprint 2 – Core API Development

**Duration:** July 9 – July 13, 2025
**Goal:** Implement core backend APIs, badge logic engine (phase 1), and begin internal documentation.

### Tasks:

* Build full authentication flow (register, login, logout, JWT auth middleware)
* Add favorites system (GET, POST, DELETE favorites)
* Set up initial `/recipes` route and PostgreSQL recipe fetching
* Begin Badge Engine (create `badgeEngine.js`, design logic, create DB model)
* Create API documentation (`auth.md`, `favorites.md`, etc.)
* Create Agile documentation structure under `/docs/agile`

### Definition of Done:

* All routes tested via Postman and return correct responses
* `badgeEngine.js` awards badges based on user activity (login, cook, favorite, etc.)
* Markdown docs added for:
    * Sprint planning
    * User stories
    * Endpoint documentation (auth, favorites)

---

## Sprint 3 – Integration & Testing

**Duration:** July 14 – July 18, 2025
**Goal:** Connect backend APIs to frontend, test full workflows, and enhance badge logic and frontend UI feedback.

### Planned Tasks:

* Integrate auth and favorites APIs with React frontend
* Display badge earned popups/feedback in UI
* Test JWT auth, error handling, edge cases in integration
* Extend badge engine to include time- and streak-based badges
* Create utility functions for cooking logs, weekly meal planning, and challenge tracking
* Add more structured documentation (`badges.md`, `planner.md`, `challenge.md`)

### Definition of Done:

* Frontend allows login, fetches favorites, shows badges
* Badge logic works for login, daily challenge, and cooking logs
* UI shows earned badges on relevant actions
* Project ready for public showcase with documentation and walkthrough

---

## Summary Table

| Sprint       | Duration      | Focus Areas                            | Status       |
| :----------- | :------------ | :------------------------------------- | :----------- |
| Sprint 1     | Jul 4 – Jul 8 | Setup DB, backend, frontend, LLM APIs  | Completed    |
| Sprint 2     | Jul 9 – Jul 13| Core APIs, Badge logic, Docs           | Completed    |
| Sprint 3     | Jul 14 – Jul 18| Integration, Testing, UI Feedback      | In Progress  |

---

