# ResponseLens Frontend

Production-style React frontend for the ResponseLens AI evaluation platform.

## Tech Stack

- React + Vite
- Tailwind CSS (v4 + Vite plugin)
- Axios
- React Router DOM
- Context API (JWT auth state)

## Install and Run

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Environment Variables

Create `.env` in project root:

```bash
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## Project Structure

```text
src/
  api/
    axiosClient.js
  components/
    auth/
      AuthForm.jsx
    common/
      ErrorAlert.jsx
      LoadingSpinner.jsx
    layout/
      AppLayout.jsx
      Navbar.jsx
      Sidebar.jsx
    protected/
      ProtectedRoute.jsx
  context/
    AuthContext.jsx
    authContextObject.js
  hooks/
    useAuth.js
  pages/
    DashboardPage.jsx
    EvaluationPage.jsx
    LoginPage.jsx
    NotFoundPage.jsx
    PromptHistoryPage.jsx
    SignupPage.jsx
  services/
    authService.js
    evaluationService.js
    promptService.js
  App.jsx
  main.jsx
  index.css
```

## Implemented Features

### 1) Authentication

- Login page (`/login`)
- Signup page (`/signup`)
- JWT token storage in `localStorage`
- Axios request interceptor for automatic `Bearer <token>` header
- Protected routes with redirect
- Logout button in navbar

### 2) Dashboard

- Prompt textarea
- Prompt category dropdown
- Submit prompt action
- Gemini AI response card
- Evaluation score cards (accuracy, relevance, safety, clarity)

### 3) Prompt History

- Fetch prompt history from backend
- Paginated card UI
- Shows prompt text, category, AI response, and created date

### 4) Evaluation Section

- Evaluation form
- Accuracy / Relevance / Safety / Clarity inputs
- Feedback textarea
- Submits to backend evaluation API

## API Integration Layer

### Auth APIs (`src/services/authService.js`)

- `POST /auth/login`
- `POST /auth/signup`
- `GET /auth/me`

### Prompt APIs (`src/services/promptService.js`)

- `POST /prompts`
- `GET /prompts?page={page}&size={size}`

### Evaluation APIs (`src/services/evaluationService.js`)

- `POST /evaluations`

Adjust endpoints only if your Spring Boot controller mappings differ.

## Routing

- Public routes: `/login`, `/signup`
- Protected routes: `/dashboard`, `/history`, `/evaluation`
- Fallback route: `*` -> 404 page
