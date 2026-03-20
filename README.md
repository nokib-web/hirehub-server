# HireHub - Job Recruitment API

HireHub is a professional job recruitment platform designed to connect jobseekers and employers through a seamless, AI-powered experience.

## Setup
1. **Clone repo**: `git clone <repo-url>`
2. **Install dependencies**: `npm install`
3. **Configure Environment**: Copy `.env.example` to `.env` and fill in the values:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `FRONTEND_URL` (e.g., http://localhost:3000)
4. **Seed Database**: `npm run seed`
5. **Run in Development**: `npm run dev`

## Demo Credentials
- **Jobseeker**: `user@example.com` / `123456`
- **Employer**: `employer@example.com` / `123456`
- **Admin**: `admin@example.com` / `123456`

## API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /register`: Create a new account (Public)
- `POST /login`: Authenticate user (Public)
- `POST /refresh-token`: Refresh access token (Public)
- `POST /logout`: Clear session (Auth)

### 👤 User Module (`/api/users`)
- `GET /`: Get all users with filters (Admin)
- `GET /:id`: View user profile (Auth)
- `PATCH /:id`: Update own profile (Auth: Owner)
- `DELETE /:id`: Deactivate user (Admin)
- `PATCH /:id/role`: Change user role (Admin)

### 💼 Jobs Module (`/api/jobs`)
- `POST /`: Create a new job (Employer/Admin)
- `GET /`: List all jobs with filters & pagination (Public)
- `GET /:id`: View job details (Public)
- `PATCH /:id`: Update job listing (Employer: Owner/Admin)
- `DELETE /:id`: Delete job (Employer: Owner/Admin)

### 📄 Applications (`/api/applications`)
- `POST /`: Submit a job application (Jobseeker)
- `GET /`: View applications (Auth)
- `GET /:id`: View specific application details (Auth)
- `PATCH /:id`: Update application status (Employer/Admin)
- `DELETE /:id`: Withdraw application (Jobseeker/Admin)

### 💬 Reviews (`/api/reviews`)
- `POST /`: Post a company review (Jobseeker)
- `GET /`: List all reviews (Admin)
- `GET /company/:companyId`: List reviews for a specific company (Public)
- `PATCH /:id/verify`: Verify a review (Admin)
- `DELETE /:id`: Remove a review (Owner/Admin)

### 📊 Dashboard (`/api/dashboard`)
- `GET /stats`: High-level counts and metrics (Admin)
- `GET /chart-data`: Aggregated data for visual charts (Admin)

### 🤖 AI Module (`/api/ai`)
- `POST /chat`: Career assistant chat (Public)
- `POST /generate-job-description`: AI-powered JD builder (Public)
- `POST /improve-cover-letter`: Tailor cover letters (Public)
- `POST /resume-tips`: Role-specific resume advice (Public)

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js (TypeScript)
- **Database**: MongoDB (Mongoose)
- **AI**: Google Gemini API
- **Auth**: JWT (jsonwebtoken), bcrypt
- **Security**: Helmet, Express-Rate-Limit, Express-Mongo-Sanitize
- **Validation**: express-validator / Zod
- **Logging**: Morgan

## Deployment
Procfile included for easy deployment to **Render** or **Heroku**.
