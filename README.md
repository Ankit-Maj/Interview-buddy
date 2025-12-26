# Interview Buddy — Fullstack Demo (Frontend + Backend)

## 1. Introduction
Interview Buddy is a fullstack demo app for collaborative coding interviews: real‑time video, chat, and an in‑browser code editor with remote execution. This repo is designed to showcase fullstack engineering plus Git & GitHub workflow knowledge.

## 2. Key Features
- Real-time video + chat (Stream) — see [`backend/src/lib/stream.js`](backend/src/lib/stream.js) and [`frontend/src/lib/stream.js`](frontend/src/lib/stream.js)  
- Session lifecycle: create, join, end — controllers: [`createSession`](backend/src/controllers/sessionController.js), [`joinSession`](backend/src/controllers/sessionController.js), [`endSession`](backend/src/controllers/sessionController.js)  
- Code editor + remote execution via Piston — [`frontend/src/components/CodeEditorPanel.jsx`](frontend/src/components/CodeEditorPanel.jsx) and [`executeCode`](frontend/src/lib/piston.js)  
- Authentication via Clerk — middleware: [`protectRoute`](backend/src/middleware/protectRoute.js) and Clerk provider usage in [`frontend/src/main.jsx`](frontend/src/main.jsx)

## 3. Tech Stack
- Frontend: React + Vite, Tailwind/DaisyUI, Monaco Editor, Stream video/chat, Clerk auth  
  - Entry: [`frontend/src/main.jsx`](frontend/src/main.jsx)  
- Backend: Node.js (ESM), Express, MongoDB (Mongoose), Stream server SDK, Inngest functions  
  - Entry: [`backend/src/server.js`](backend/src/server.js)  
- Remote code execution: Piston API (`executeCode` in [`frontend/src/lib/piston.js`](frontend/src/lib/piston.js))

## 4. File structure (high level)
root
- [package.json](package.json)
- backend/
  - [.env](backend/.env)
  - [package.json](backend/package.json)
  - src/
    - [server.js](backend/src/server.js)
    - controllers/
      - [chatController.js](backend/src/controllers/chatController.js)
      - [sessionController.js](backend/src/controllers/sessionController.js)
    - lib/
      - [db.js](backend/src/lib/db.js)
      - [env.js](backend/src/lib/env.js)
      - [inngest.js](backend/src/lib/inngest.js)
      - [stream.js](backend/src/lib/stream.js)
    - middleware/
      - [protectRoute.js](backend/src/middleware/protectRoute.js)
    - models/
      - [Session.js](backend/src/models/Session.js)
      - [User.js](backend/src/models/User.js)
    - routes/
      - [chatRoutes.js](backend/src/routes/chatRoutes.js)
      - [sessionRoute.js](backend/src/routes/sessionRoute.js)
- frontend/
  - [.env](frontend/.env)
  - [vite.config.js](frontend/vite.config.js)
  - [package.json](frontend/package.json)
  - src/
    - [main.jsx](frontend/src/main.jsx)
    - [App.jsx](frontend/src/App.jsx)
    - api/
      - [sessions.js](frontend/src/api/sessions.js)
    - lib/
      - [axios.js](frontend/src/lib/axios.js)
      - [piston.js](frontend/src/lib/piston.js)
      - [stream.js](frontend/src/lib/stream.js)
      - [utils.js](frontend/src/lib/utils.js)
    - data/
      - [problems.js](frontend/src/data/problems.js)
    - hooks/
      - [useSessions.js](frontend/src/hooks/useSessions.js)
      - [useStreamClient.js](frontend/src/hooks/useStreamClient.js)
    - components/
      - [Navbar.jsx](frontend/src/components/Navbar.jsx)
      - [CodeEditorPanel.jsx](frontend/src/components/CodeEditorPanel.jsx)
      - [ProblemDescription.jsx](frontend/src/components/ProblemDescription.jsx)
      - [OutputPanel.jsx](frontend/src/components/OutputPanel.jsx)
      - [ActiveSessions.jsx](frontend/src/components/ActiveSessions.jsx)
      - [RecentSessions.jsx](frontend/src/components/RecentSessions.jsx)
      - [StatsCards.jsx](frontend/src/components/StatsCards.jsx)
      - [VideoCallUI.jsx](frontend/src/components/VideoCallUI.jsx)
      - [CreateSessionModal.jsx](frontend/src/components/CreateSessionModal.jsx)
      - [WelcomeSection.jsx](frontend/src/components/WelcomeSection.jsx)
    - pages/
      - [HomePage.jsx](frontend/src/pages/HomePage.jsx)
      - [DashboardPage.jsx](frontend/src/pages/DashboardPage.jsx)
      - [ProblemsPage.jsx](frontend/src/pages/ProblemsPage.jsx)
      - [ProblemPage.jsx](frontend/src/pages/ProblemPage.jsx)
      - [SessionPage.jsx](frontend/src/pages/SessionPage.jsx)

## 5. Architecture overview
- Client (React) ↔ API server (Express) using cookie‑based auth (Clerk) — see [`frontend/src/lib/axios.js`](frontend/src/lib/axios.js) and [`backend/src/middleware/protectRoute.js`](backend/src/middleware/protectRoute.js).  
- Persistent data in MongoDB via Mongoose models: [`User`](backend/src/models/User.js) and [`Session`](backend/src/models/Session.js).  
- Stream: server uses `stream-chat` and `@stream-io/node-sdk` to create chat channels and video calls ([`backend/src/lib/stream.js`](backend/src/lib/stream.js)). Frontend initializes video client using [`frontend/src/lib/stream.js`](frontend/src/lib/stream.js).  
- Inngest functions handle Clerk user webhooks to sync users: [`backend/src/lib/inngest.js`](backend/src/lib/inngest.js).

## 6. Backend: important routes & controllers
- Session routes: [`backend/src/routes/sessionRoute.js`](backend/src/routes/sessionRoute.js) → controllers in [`backend/src/controllers/sessionController.js`](backend/src/controllers/sessionController.js). Key functions: [`createSession`](backend/src/controllers/sessionController.js), [`getActiveSessions`](backend/src/controllers/sessionController.js), [`getSessionById`](backend/src/controllers/sessionController.js), [`joinSession`](backend/src/controllers/sessionController.js), [`endSession`](backend/src/controllers/sessionController.js).  
- Chat token route: [`backend/src/routes/chatRoutes.js`](backend/src/routes/chatRoutes.js) → [`getStreamToken`](backend/src/controllers/chatController.js).

## 7. Frontend: key pages & components
- Routing & auth guard: [`frontend/src/App.jsx`](frontend/src/App.jsx) and [`frontend/src/main.jsx`](frontend/src/main.jsx).  
- Problem flow: [`frontend/src/pages/ProblemPage.jsx`](frontend/src/pages/ProblemPage.jsx), problem data: [`frontend/src/data/problems.js`](frontend/src/data/problems.js).  
- Session flow and video UI: [`frontend/src/pages/SessionPage.jsx`](frontend/src/pages/SessionPage.jsx) uses [`useStreamClient`](frontend/src/hooks/useStreamClient.js) and [`VideoCallUI`](frontend/src/components/VideoCallUI.jsx).  
- Code execution: [`executeCode`](frontend/src/lib/piston.js) called by code editor panels: [`frontend/src/components/CodeEditorPanel.jsx`](frontend/src/components/CodeEditorPanel.jsx).

## 8. Environment variables
- Backend env file: [backend/.env](backend/.env) — variables read in [`backend/src/lib/env.js`](backend/src/lib/env.js). Important keys: DB_URL, STREAM_API_KEY, STREAM_API_SECRET, CLIENT_URL, INNGEST_SIGNIN_KEY (note: check naming).  
- Frontend env file: [frontend/.env](frontend/.env) — keys used by Vite: VITE_API_URL, VITE_CLERK_PUBLISHABLE_KEY, VITE_STREAM_API_KEY.

## 9. Run locally (development)
1. Install root deps (optional): repo uses per‑package installs. From project root:
   - Backend: npm ci --prefix backend
   - Frontend: npm ci --prefix frontend --include=dev
2. Start backend (dev): npm run dev --prefix backend (uses nodemon)
3. Start frontend (dev): npm run dev --prefix frontend
4. API health: GET [backend/src/server.js] /health → [http://localhost:<PORT>/health]  

Scripts references: [package.json](package.json), [backend/package.json](backend/package.json), [frontend/package.json](frontend/package.json).

## 10. API summary (quick)
- POST /api/sessions — create session → handled by [`createSession`](backend/src/controllers/sessionController.js)  
- GET /api/sessions/active — list active → [`getActiveSessions`](backend/src/controllers/sessionController.js)  
- GET /api/sessions/my-recent — recent completed → [`getMyRecentSessions`](backend/src/controllers/sessionController.js)  
- GET /api/sessions/:id — session details → [`getSessionById`](backend/src/controllers/sessionController.js)  
- POST /api/sessions/:id/join — join session → [`joinSession`](backend/src/controllers/sessionController.js)  
- POST /api/sessions/:id/end — end session → [`endSession`](backend/src/controllers/sessionController.js)  
- GET /api/chat/token — get Stream token → [`getStreamToken`](backend/src/controllers/chatController.js)

(Frontend clients use [`frontend/src/api/sessions.js`](frontend/src/api/sessions.js).)

## 11. Git & GitHub — purpose & recommended workflow
This repo is intended to showcase version control skills. Recommended Git/GitHub workflow:
- Feature branches: feature/<short‑desc> (e.g., feature/video-call-auth)
- Commit messages: Conventional Commits style (type(scope): short summary)
- PRs: small, single‑purpose PRs; link associated issue; include screenshots or recordings for UI changes
- CI: add GitHub Actions for lint, build, test on PRs
- Code review checklist: run app locally, run lint, verify env vars not leaked
- Release: use tags (vMAJOR.MINOR.PATCH) and changelog entries
- Protect main branch: require PR reviews + passing CI

Include a clear .gitignore (already present at root and frontend): [/.gitignore](.gitignore), [frontend/.gitignore](frontend/.gitignore).

## 12. Testing & debugging
- Use browser devtools and Node logs (server prints DB connection and errors in [`backend/src/lib/db.js`](backend/src/lib/db.js) and controllers).  
- React fast refresh via Vite (dev server): [`frontend/vite.config.js`](frontend/vite.config.js) and [`frontend/package.json`](frontend/package.json).  
- To debug server start errors, inspect env in [`backend/src/lib/env.js`](backend/src/lib/env.js) and confirm `.env` values.

## 13. Deployment notes
- Backend serves frontend static files when NODE_ENV === "production" in [`backend/src/server.js`](backend/src/server.js). Build frontend first: `npm run build --prefix frontend` (see root [package.json](package.json) build script).  
- Ensure secrets (STREAM keys, CLERK keys, DB_URL) are set in production environment — never commit .env to repo.

## 14. Contributing
- Fork → branch → PR. Add tests for critical logic where possible. Keep PRs focused. Use code owners / reviewers for backend and frontend separately.

## 15. Useful files to open
- Project root: [package.json](package.json)  
- Backend entry: [backend/src/server.js](backend/src/server.js)  
- Session controller: [backend/src/controllers/sessionController.js](backend/src/controllers/sessionController.js) — key session logic [`createSession`](backend/src/controllers/sessionController.js) / [`joinSession`](backend/src/controllers/sessionController.js) / [`endSession`](backend/src/controllers/sessionController.js)  
- Frontend entry: [frontend/src/main.jsx](frontend/src/main.jsx)  
- Frontend app: [frontend/src/App.jsx](frontend/src/App.jsx)  
- Code execution helper: [frontend/src/lib/piston.js](frontend/src/lib/piston.js) — [`executeCode`](frontend/src/lib/piston.js)  
- Problem data: [frontend/src/data/problems.js](frontend/src/data/problems.js)  
- Stream client init: [frontend/src/lib/stream.js](frontend/src/lib/stream.js) — [`initializeStreamClient`](frontend/src/lib/stream.js)

---

If you want, I can:
- Add a GitHub Actions CI workflow (lint/build) template.
- Draft a CONTRIBUTING.md with a sample PR checklist.
- Create a production deployment checklist (Heroku/Vercel/Azure).// filepath: README.md
# Interview Buddy — Fullstack Demo (Frontend + Backend)

## 1. Introduction
Interview Buddy is a fullstack demo app for collaborative coding interviews: real‑time video, chat, and an in‑browser code editor with remote execution. This repo is designed to showcase fullstack engineering plus Git & GitHub workflow knowledge.

## 2. Key Features
- Real‑time video + chat (Stream) — see [`backend/src/lib/stream.js`](backend/src/lib/stream.js) and [`frontend/src/lib/stream.js`](frontend/src/lib/stream.js)  
- Session lifecycle: create, join, end — controllers: [`createSession`](backend/src/controllers/sessionController.js), [`joinSession`](backend/src/controllers/sessionController.js), [`endSession`](backend/src/controllers/sessionController.js)  
- Code editor + remote execution via Piston — [`frontend/src/components/CodeEditorPanel.jsx`](frontend/src/components/CodeEditorPanel.jsx) and [`executeCode`](frontend/src/lib/piston.js)  
- Authentication via Clerk — middleware: [`protectRoute`](backend/src/middleware/protectRoute.js) and Clerk provider usage in [`frontend/src/main.jsx`](frontend/src/main.jsx)

## 3. Tech Stack
- Frontend: React + Vite, Tailwind/DaisyUI, Monaco Editor, Stream video/chat, Clerk auth  
  - Entry: [`frontend/src/main.jsx`](frontend/src/main.jsx)  
- Backend: Node.js (ESM), Express, MongoDB (Mongoose), Stream server SDK, Inngest functions  
  - Entry: [`backend/src/server.js`](backend/src/server.js)  
- Remote code execution: Piston API (`executeCode` in [`frontend/src/lib/piston.js`](frontend/src/lib/piston.js))

## 4. File structure (high level)
root
- [package.json](package.json)
- backend/
  - [.env](backend/.env)
  - [package.json](backend/package.json)
  - src/
    - [server.js](backend/src/server.js)
    - controllers/
      - [chatController.js](backend/src/controllers/chatController.js)
      - [sessionController.js](backend/src/controllers/sessionController.js)
    - lib/
      - [db.js](backend/src/lib/db.js)
      - [env.js](backend/src/lib/env.js)
      - [inngest.js](backend/src/lib/inngest.js)
      - [stream.js](backend/src/lib/stream.js)
    - middleware/
      - [protectRoute.js](backend/src/middleware/protectRoute.js)
    - models/
      - [Session.js](backend/src/models/Session.js)
      - [User.js](backend/src/models/User.js)
    - routes/
      - [chatRoutes.js](backend/src/routes/chatRoutes.js)
      - [sessionRoute.js](backend/src/routes/sessionRoute.js)
- frontend/
  - [.env](frontend/.env)
  - [vite.config.js](frontend/vite.config.js)
  - [package.json](frontend/package.json)
  - src/
    - [main.jsx](frontend/src/main.jsx)
    - [App.jsx](frontend/src/App.jsx)
    - api/
      - [sessions.js](frontend/src/api/sessions.js)
    - lib/
      - [axios.js](frontend/src/lib/axios.js)
      - [piston.js](frontend/src/lib/piston.js)
      - [stream.js](frontend/src/lib/stream.js)
      - [utils.js](frontend/src/lib/utils.js)
    - data/
      - [problems.js](frontend/src/data/problems.js)
    - hooks/
      - [useSessions.js](frontend/src/hooks/useSessions.js)
      - [useStreamClient.js](frontend/src/hooks/useStreamClient.js)
    - components/
      - [Navbar.jsx](frontend/src/components/Navbar.jsx)
      - [CodeEditorPanel.jsx](frontend/src/components/CodeEditorPanel.jsx)
      - [ProblemDescription.jsx](frontend/src/components/ProblemDescription.jsx)
      - [OutputPanel.jsx](frontend/src/components/OutputPanel.jsx)
      - [ActiveSessions.jsx](frontend/src/components/ActiveSessions.jsx)
      - [RecentSessions.jsx](frontend/src/components/RecentSessions.jsx)
      - [StatsCards.jsx](frontend/src/components/StatsCards.jsx)
      - [VideoCallUI.jsx](frontend/src/components/VideoCallUI.jsx)
      - [CreateSessionModal.jsx](frontend/src/components/CreateSessionModal.jsx)
      - [WelcomeSection.jsx](frontend/src/components/WelcomeSection.jsx)
    - pages/
      - [HomePage.jsx](frontend/src/pages/HomePage.jsx)
      - [DashboardPage.jsx](frontend/src/pages/DashboardPage.jsx)
      - [ProblemsPage.jsx](frontend/src/pages/ProblemsPage.jsx)
      - [ProblemPage.jsx](frontend/src/pages/ProblemPage.jsx)
      - [SessionPage.jsx](frontend/src/pages/SessionPage.jsx)

## 5. Architecture overview
- Client (React) ↔ API server (Express) using cookie‑based auth (Clerk) — see [`frontend/src/lib/axios.js`](frontend/src/lib/axios.js) and [`backend/src/middleware/protectRoute.js`](backend/src/middleware/protectRoute.js).  
- Persistent data in MongoDB via Mongoose models: [`User`](backend/src/models/User.js) and [`Session`](backend/src/models/Session.js).  
- Stream: server uses `stream-chat` and `@stream-io/node-sdk` to create chat channels and video calls ([`backend/src/lib/stream.js`](backend/src/lib/stream.js)). Frontend initializes video client using [`frontend/src/lib/stream.js`](frontend/src/lib/stream.js).  
- Inngest functions handle Clerk user webhooks to sync users: [`backend/src/lib/inngest.js`](backend/src/lib/inngest.js).

## 6. Backend: important routes & controllers
- Session routes: [`backend/src/routes/sessionRoute.js`](backend/src/routes/sessionRoute.js) → controllers in [`backend/src/controllers/sessionController.js`](backend/src/controllers/sessionController.js). Key functions: [`createSession`](backend/src/controllers/sessionController.js), [`getActiveSessions`](backend/src/controllers/sessionController.js), [`getSessionById`](backend/src/controllers/sessionController.js), [`joinSession`](backend/src/controllers/sessionController.js), [`endSession`](backend/src/controllers/sessionController.js).  
- Chat token route: [`backend/src/routes/chatRoutes.js`](backend/src/routes/chatRoutes.js) → [`getStreamToken`](backend/src/controllers/chatController.js).

## 7. Frontend: key pages & components
- Routing & auth guard: [`frontend/src/App.jsx`](frontend/src/App.jsx) and [`frontend/src/main.jsx`](frontend/src/main.jsx).  
- Problem flow: [`frontend/src/pages/ProblemPage.jsx`](frontend/src/pages/ProblemPage.jsx), problem data: [`frontend/src/data/problems.js`](frontend/src/data/problems.js).  
- Session flow and video UI: [`frontend/src/pages/SessionPage.jsx`](frontend/src/pages/SessionPage.jsx) uses [`useStreamClient`](frontend/src/hooks/useStreamClient.js) and [`VideoCallUI`](frontend/src/components/VideoCallUI.jsx).  
- Code execution: [`executeCode`](frontend/src/lib/piston.js) called by code editor panels: [`frontend/src/components/CodeEditorPanel.jsx`](frontend/src/components/CodeEditorPanel.jsx).

## 8. Environment variables
- Backend env file: [backend/.env](backend/.env) — variables read in [`backend/src/lib/env.js`](backend/src/lib/env.js). Important keys: DB_URL, STREAM_API_KEY, STREAM_API_SECRET, CLIENT_URL, INNGEST_SIGNIN_KEY (note: check naming).  
- Frontend env file: [frontend/.env](frontend/.env) — keys used by Vite: VITE_API_URL, VITE_CLERK_PUBLISHABLE_KEY, VITE_STREAM_API_KEY.

## 9. Run locally (development)
1. Install root deps (optional): repo uses per‑package installs. From project root:
   - Backend: npm ci --prefix backend
   - Frontend: npm ci --prefix frontend --include=dev
2. Start backend (dev): npm run dev --prefix backend (uses nodemon)
3. Start frontend (dev): npm run dev --prefix frontend
4. API health: GET [backend/src/server.js] /health → [http://localhost:<PORT>/health]  

Scripts references: [package.json](package.json), [backend/package.json](backend/package.json), [frontend/package.json](frontend/package.json).

## 10. API summary (quick)
- POST /api/sessions — create session → handled by [`createSession`](backend/src/controllers/sessionController.js)  
- GET /api/sessions/active — list active → [`getActiveSessions`](backend/src/controllers/sessionController.js)  
- GET /api/sessions/my-recent — recent completed → [`getMyRecentSessions`](backend/src/controllers/sessionController.js)  
- GET /api/sessions/:id — session details → [`getSessionById`](backend/src/controllers/sessionController.js)  
- POST /api/sessions/:id/join — join session → [`joinSession`](backend/src/controllers/sessionController.js)  
- POST /api/sessions/:id/end — end session → [`endSession`](backend/src/controllers/sessionController.js)  
- GET /api/chat/token — get Stream token → [`getStreamToken`](backend/src/controllers/chatController.js)

(Frontend clients use [`frontend/src/api/sessions.js`](frontend/src/api/sessions.js).)

## 11. Git & GitHub — purpose & recommended workflow
This repo is intended to showcase version control skills. Recommended Git/GitHub workflow:
- Feature branches: feature/<short‑desc> (e.g., feature/video-call-auth)
- Commit messages: Conventional Commits style (type(scope): short summary)
- PRs: small, single‑purpose PRs; link associated issue; include screenshots or recordings for UI changes
- CI: add GitHub Actions for lint, build, test on PRs
- Code review checklist: run app locally, run lint, verify env vars not leaked
- Release: use tags (vMAJOR.MINOR.PATCH) and changelog entries
- Protect main branch: require PR reviews + passing CI

Include a clear .gitignore (already present at root and frontend): [/.gitignore](.gitignore), [frontend/.gitignore](frontend/.gitignore).

## 12. Testing & debugging
- Use browser devtools and Node logs (server prints DB connection and errors in [`backend/src/lib/db.js`](backend/src/lib/db.js) and controllers).  
- React fast refresh via Vite (dev server): [`frontend/vite.config.js`](frontend/vite.config.js) and [`frontend/package.json`](frontend/package.json).  
- To debug server start errors, inspect env in [`backend/src/lib/env.js`](backend/src/lib/env.js) and confirm `.env` values.

## 13. Deployment notes
- Backend serves frontend static files when NODE_ENV === "production" in [`backend/src/server.js`](backend/src/server.js). Build frontend first: `npm run build --prefix frontend` (see root [package.json](package.json) build script).  
- Ensure secrets (STREAM keys, CLERK keys, DB_URL) are set in production environment — never commit .env to repo.

## 14. Contributing
- Fork → branch → PR. Add tests for critical logic where possible. Keep PRs focused. Use code owners / reviewers for backend and frontend separately.

## 15. Useful files to open
- Project root: [package.json](package.json)  
- Backend entry: [backend/src/server.js](backend/src/server.js)  
- Session controller: [backend/src/controllers/sessionController.js](backend/src/controllers/sessionController.js) — key session logic [`createSession`](backend/src/controllers/sessionController.js) / [`joinSession`](backend/src/controllers/sessionController.js) / [`endSession`](backend/src/controllers/sessionController.js)  
- Frontend entry: [frontend/src/main.jsx](frontend/src/main.jsx)  
- Frontend app: [frontend/src/App.jsx](frontend/src/App.jsx)  
- Code execution helper: [frontend/src/lib/piston.js](frontend/src/lib/piston.js) — [`executeCode`](frontend/src/lib/piston.js)  
- Problem data: [frontend/src/data/problems.js](frontend/src/data/problems.js)  
- Stream client init: [frontend/src/lib/stream.js](frontend/src/lib/stream.js) — [`initializeStreamClient`](frontend/src/lib/stream.js)

---

## 16. Platform screenshots

