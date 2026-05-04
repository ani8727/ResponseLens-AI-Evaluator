# 🚀 ResponseLens – AI Prompt Evaluation Platform

ResponseLens is a full-stack AI-powered platform that allows users to submit prompts and receive intelligent responses using AI models. It also tracks prompt status, manages user access, and provides a structured evaluation workflow.

---

## 🌐 Live Demo

> 🔗 Frontend: *[Add after deployment]*
> 🔗 Backend API: *[Add after deployment]*

---

## 📌 Features

### 👤 Authentication & Security

* JWT-based authentication
* Role-based access control (User / Admin)
* Secure API communication with protected routes

### 🧠 AI Integration

* Integrated with Gemini API for AI-generated responses
* Handles:

  * ✅ Success responses
  * ⚠️ Failures
  * ⏳ Pending states

### 📊 Prompt Management

* Create, update, delete prompts
* Track prompt status:

  * `PENDING`
  * `COMPLETED`
  * `FAILED`
* Store AI responses and error messages

### 📄 Pagination & Filtering

* Paginated API for prompts
* User-specific and admin-wide access

### ⚡ Frontend UX

* Clean UI with React + Vite
* Loading states, error handling, empty states
* Toast notifications for actions

---

## 🏗️ Tech Stack

### 🔹 Frontend

* React (Vite)
* Axios
* Custom Hooks
* Tailwind CSS (or your UI system)

### 🔹 Backend

* Spring Boot
* Spring Security (JWT)
* Spring Data JPA
* PostgreSQL

### 🔹 AI Service

* Gemini API (Google Generative AI)

---

## 📂 Project Structure

```
ResponseLens/
│
├── backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   └── config/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── api/
│
└── README.md
```

---

## ⚙️ Environment Configuration

### 🔐 Backend (`application.yml`)

Uses environment variables:

```
DB_URL=
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET=
GEMINI_API_KEY=
```

### 🌐 Frontend (`.env`)

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

> ⚠️ Sensitive data is not committed. Use `.env` and `application-local.yml`.

---

## ▶️ Run Locally

### 🔹 Backend

```
cd backend
mvn clean install
mvn spring-boot:run
```

Runs on: `http://localhost:8080`

---

### 🔹 Frontend

```
cd frontend
npm install
npm run dev
```

Runs on: `http://localhost:5173`

---

## 📡 API Endpoints (Sample)

| Method | Endpoint               | Description                 |
| ------ | ---------------------- | --------------------------- |
| POST   | `/api/v1/prompts`      | Create prompt               |
| GET    | `/api/v1/prompts`      | Get all prompts (paginated) |
| GET    | `/api/v1/prompts/{id}` | Get prompt by ID            |
| PUT    | `/api/v1/prompts/{id}` | Update prompt               |
| DELETE | `/api/v1/prompts/{id}` | Delete prompt               |

---

## 🧪 Example Request

```
POST /api/v1/prompts
```

```json
{
  "promptText": "Explain AI in simple terms",
  "category": "GENERAL"
}
```

---

## 🧠 How It Works

1. User submits a prompt
2. Backend saves it as `PENDING`
3. Gemini API processes the request
4. Status updates:

   * `COMPLETED` → AI response stored
   * `FAILED` → Error stored
5. Frontend displays result dynamically

---

## 🔐 Security Notes

* JWT authentication is required for protected routes
* Tokens stored in localStorage (can be upgraded to HttpOnly cookies)
* Sensitive configs are hidden using environment variables

---

## 🚀 Deployment (To Be Updated)

| Service  | Link                      |
| -------- | ------------------------- |
| Frontend | *Add Vercel/Netlify URL*  |
| Backend  | *Add Render/Railway URL*  |
| Database | PostgreSQL (Neon / Cloud) |

---

## 📈 Future Improvements

* Refresh token mechanism
* Prompt history analytics
* Admin dashboard
* Real-time streaming responses
* Rate limiting & API usage tracking

---

## 👨‍💻 Author

**Aniket Gupta**
Final-year Software Engineering Student

* Strong in DSA, Backend Development & System Design
* Built scalable full-stack applications

---

## ⭐ Why This Project?

This project demonstrates:

* Full-stack development skills
* Secure API design
* AI integration in real-world applications
* Clean architecture & production-ready practices

---

## 📬 Feedback

If you're an evaluator or recruiter, feel free to share feedback or suggestions!

---
