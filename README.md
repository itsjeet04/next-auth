# 🔐 next-auth

A full-stack authentication system built **from scratch** with Next.js 14 App Router — no NextAuth, no Clerk, no magic. Just clean code you can read, understand, and own.

**Live Demo:** [next-auth-theta-navy.vercel.app](https://next-auth-theta-navy.vercel.app)  
**GitHub:** [github.com/itsjeet04/next-auth](https://github.com/itsjeet04/next-auth)

---

## ✨ Features

- ✅ Custom JWT authentication with **Access Token + Refresh Token** pattern
- ✅ **Email verification** via Mailtrap — real verification link sent to inbox
- ✅ Password hashing with **bcrypt**
- ✅ **httpOnly cookie** based sessions — XSS safe
- ✅ Protected routes via **Next.js Edge Middleware** (runs on Vercel's Mumbai edge server)
- ✅ MongoDB + Mongoose for data persistence
- ✅ Full TypeScript

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Auth | JSON Web Tokens (jsonwebtoken) |
| Password | bcryptjs |
| Email | Nodemailer + Mailtrap |
| Deployment | Vercel |

---

## 🏗 Project Structure

```
nextauth/
├── app/
│   ├── api/
│   │   └── users/
│   │       ├── login/route.ts          → POST: validates credentials, issues tokens
│   │       ├── logout/route.ts         → GET: clears cookies
│   │       ├── signup/route.ts         → POST: creates user, sends verify email
│   │       ├── me/route.ts             → GET: returns current user from token
│   │       └── verifyemail/route.ts    → POST: validates verify token, marks user verified
│   ├── login/page.tsx                  → Login UI
│   ├── signup/page.tsx                 → Signup UI
│   ├── profile/page.tsx                → Protected user profile
│   ├── profile/[id]/page.tsx           → Public profile by ID
│   └── verifyemail/page.tsx            → Email verification UI
├── models/
│   └── user.model.ts                   → Mongoose schema
├── dbconfig/
│   └── dbconfig.ts                     → MongoDB connection
├── helper/
│   └── getDataFromToken.ts             → JWT decoder utility
├── middleware.ts                       → Edge route protection
└── next.config.ts                      → serverExternalPackages fix
```

---

## 🔑 How Authentication Works

### Two Token Strategy

This project uses two types of tokens for different purposes:

#### 1. Access Token
- **What it is:** Short-lived JWT stored as an `httpOnly` cookie named `token`
- **What it contains:** `{ id: user._id }` — the MongoDB user ID
- **Expiry:** 1 day
- **Used for:** Authenticating every protected API request
- **Where it's checked:** Edge Middleware (runs on Vercel's Mumbai CDN node before any Node.js code)

```
Login → jwt.sign({ id: user._id }, TOKEN_SECRET, { expiresIn: "1d" })
      → response.cookies.set("token", accessToken, { httpOnly: true })
```

#### 2. Verify Token (Email Verification Token)
- **What it is:** A random hex token stored in MongoDB alongside an expiry date
- **What it contains:** Random string (not a JWT) — no sensitive data
- **Expiry:** 1 hour from signup
- **Used for:** One-time email verification only — proves the user owns the email address
- **Where it's checked:** `/api/users/verifyemail` API route

```
Signup → crypto.randomBytes(32).toString("hex")
       → user.verifyToken = token
       → user.verifyTokenExpiry = Date.now() + 3600000
       → Mailtrap sends email with link: /verifyemail?token=<hex>
```

> **Why two different tokens?**  
> The access token (JWT) is for ongoing authentication — it's self-contained and can be verified without a DB lookup.  
> The verify token is intentionally NOT a JWT — it must be checked against the DB so it can be invalidated after one use. Once the user verifies, `verifyToken` is deleted from the DB and can never be reused.

---

## 📧 Email Verification Flow

Email is sent via **Nodemailer** using **Mailtrap** as the SMTP provider (safe for testing — emails go to your Mailtrap inbox, not real addresses).

```
1. User signs up at /signup
        │
        ▼
2. POST /api/users/signup
   - hashes password with bcrypt
   - generates random verifyToken
   - saves user to MongoDB with isVerified: false
   - calls sendEmail() with the token
        │
        ▼
3. Nodemailer sends email via Mailtrap SMTP:
   Subject: "Verify your email"
   Body: Click to verify:
         https://yourdomain.com/verifyemail?token=<hex_token>
        │
        ▼
4. User clicks the link in Mailtrap inbox
   → browser hits /verifyemail?token=abc123
        │
        ▼
5. verifyemail/page.tsx reads token from URL:
   window.location.search.split("=")[1]
   → POST /api/users/verifyemail { token }
        │
        ▼
6. API route:
   User.findOne({
     verifyToken: token,
     verifyTokenExpiry: { $gt: Date.now() }  ← token not expired?
   })
   user.isVerified = true
   user.verifyToken = undefined              ← invalidate token
   user.verifyTokenExpiry = undefined
   user.save()
        │
        ▼
7. User redirected to /login
```

---

## 🌐 Runtime Architecture (Vercel)

One of the key learnings from this project — your app runs in **two different environments**:

```
Every Request
      │
      ▼
┌─────────────────────────────┐
│   Edge Runtime (Mumbai)     │  ← middleware.ts runs here FIRST
│   ~5ms from India           │     reads "token" cookie
│   No Node.js APIs           │     no token? → redirect /login
└──────────────┬──────────────┘
               │ (if token exists)
               ▼
┌─────────────────────────────┐
│   Node.js Runtime (US)      │  ← API routes run here
│   AWS Lambda (via Vercel)   │     jwt.verify decodes token
│   Full Node.js available    │     mongoose queries MongoDB
└─────────────────────────────┘
```

> **The bug this caused:** Next.js accidentally bundled `mongoose` into the Edge Runtime. Mongoose uses `__dirname` internally — which doesn't exist at the edge — causing `MIDDLEWARE_INVOCATION_FAILED` on every request.  
> **The fix:** `serverExternalPackages: ["mongoose", "jsonwebtoken"]` in `next.config.ts`

---

## 🗄️ User Schema

```typescript
{
  username: String,
  email: { type: String, unique: true },
  password: String,            // bcrypt hashed — never stored raw
  isVerified: Boolean,         // false until email verified
  isAdmin: Boolean,

  // email verification
  verifyToken: String,
  verifyTokenExpiry: Date,

  // password reset (future use)
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
}
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/itsjeet04/next-auth.git
cd next-auth/nextauth
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the `nextauth/` directory:

```env
# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nextauth

# JWT
TOKEN_SECRET=your_super_secret_key_here

# App URL
DOMAIN=http://localhost:3000

# Mailtrap SMTP (get from mailtrap.io)
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password
```

### 3. Set up Mailtrap

1. Go to [mailtrap.io](https://mailtrap.io) and create a free account
2. Open your inbox → SMTP Settings
3. Copy the `Host`, `Port`, `Username`, and `Password` into `.env.local`
4. All verification emails will appear in your Mailtrap inbox safely — no real emails sent

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📡 API Routes

| Method | Route | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/users/signup` | ❌ | Create account, send verify email |
| `POST` | `/api/users/login` | ❌ | Validate credentials, set token cookie |
| `GET` | `/api/users/logout` | ❌ | Clear token cookie |
| `GET` | `/api/users/me` | ✅ | Get current user from token |
| `POST` | `/api/users/verifyemail` | ❌ | Verify email with token from link |

---

## 🔒 Route Protection

The `middleware.ts` runs on **Vercel's Edge Runtime** before any page loads:

```typescript
// Public routes — no auth needed
const isPublicPath =
  path === "/login" ||
  path === "/signup" ||
  path === "/verifyemail" ||
  path === "/" ||
  path.startsWith("/api");

// Everything else requires the token cookie
if (!isPublicPath && !token) {
  return NextResponse.redirect(new URL("/login", request.url));
}
```

---

## 🏃 Build Output

```bash
npm run build

Route (app)
○ /                        → SSG (static, served from CDN)
○ /login                   → SSG shell + CSR hydration
○ /signup                  → SSG shell + CSR hydration
○ /verifyemail             → SSG shell + CSR hydration
ƒ /api/users/login         → SSR (dynamic, Node.js Lambda)
ƒ /api/users/me            → SSR (dynamic, Node.js Lambda)
ƒ /profile/[id]            → SSR (dynamic route)
ƒ Middleware               → Edge Runtime
```

---

## 🧠 Key Learnings

Building this taught concepts no tutorial covers:

- **Edge vs Node.js Runtime** — two different environments, different capabilities, different geographic locations
- **`serverExternalPackages`** — how Next.js bundling works and why Node-only packages break at the edge
- **JWT security** — why storing raw `_id` in a cookie is unsafe, and how signing prevents tampering
- **httpOnly cookies vs localStorage** — why cookies are safer for auth tokens
- **SSG + CSR together** — `"use client"` doesn't skip server pre-rendering, it just enables React features
- **One-time tokens** — why verify tokens shouldn't be JWTs (they need to be invalidatable)

---

## 👤 Author

**Sirjanjeet Singh**  
6th Semester B.Tech IT — BPIT, Delhi  

[![GitHub](https://img.shields.io/badge/GitHub-itsjeet04-black?logo=github)](https://github.com/itsjeet04)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-sirjanjeetsingh2004-blue?logo=linkedin)](https://linkedin.com/in/sirjanjeetsingh2004)
[![LeetCode](https://img.shields.io/badge/LeetCode-wakeupsirjan-orange?logo=leetcode)](https://leetcode.com/wakeupsirjan)

---

## 📄 License

MIT — use it, learn from it, break it.
