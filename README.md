# Orbrin API

A scalable REST API for **Orbrin**, a project management platform designed to help organizations manage teams, projects, sprints, tasks, collaboration, and subscriptions.

Built with **Node.js, Express, TypeScript, PostgreSQL, and Prisma** with a modular backend architecture.

---

## 🚀 Features

- 🔐 Authentication & authorization
- 🏢 Organization management
- 👥 Team and member management
- 📁 Project management
- 🏃 Sprint management
- ✅ Task management
- 💬 Comments and collaboration
- 🔔 Notifications
- 📊 Activity tracking
- 🛡️ Role-based access control
- 💳 Stripe subscription integration
- ⚡ Redis-based rate limiting
- ✅ Request validation with Zod
- 🚨 Centralized error handling
- 📄 Pagination, filtering, and sorting

---

## 🛠️ Tech Stack

| Technology    | Purpose                          |
|---------------|----------------------------------|
| Node.js       | Runtime                          |
| Express.js    | REST API framework               |
| TypeScript    | Type safety                      |
| PostgreSQL    | Primary database                 |
| Prisma        | ORM                              |
| Redis         | Rate limiting & caching          |
| Stripe        | Subscription & payment handling  |
| Zod           | Request validation               |
| Biome         | Formatting & linting             |

---

## 📂 Project Structure

```text
src/
├── modules/
│   ├── auth/
│   ├── organization/
│   ├── team/
│   ├── project/
│   ├── sprint/
│   ├── task/
│   ├── comment/
│   ├── notification/
│   └── activity/
│
├── middlewares/
├── services/
├── utils/
├── lib/
├── routes/
└── app.ts
```

The project follows a modular architecture, keeping business logic, controllers, validation, routes, and related functionality organized by feature.

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd orbrin-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file and configure the required database, Redis, authentication, and Stripe credentials.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Start the development server

```bash
npm run dev
```

---

## 📚 API Documentation

The complete API documentation includes available endpoints, request parameters, request bodies, authentication requirements, and response examples.

**Postman Documentation:**  
[https://documenter.getpostman.com/view/53393171/2sBYB1P93m](https://documenter.getpostman.com/view/53393171/2sBYB1P93m?utm_source=chatgpt.com)

---

## 🔒 Authentication

The API uses authentication and role-based authorization to protect organization resources and restrict access based on user permissions.

Protected endpoints require a valid authenticated session.

---

## 🧪 API Testing

The API can be tested using Postman.

The complete Postman collection and endpoint documentation are available here:  
[Orbrin API Documentation](https://documenter.getpostman.com/view/53393171/2sBYB1P93m?utm_source=chatgpt.com)

---

## 📌 Main Modules

- **Authentication** — Registration, login, email verification, and authentication flows  
- **Organizations** — Organization creation and management  
- **Teams** — Team creation, members, and team management  
- **Projects** — Project lifecycle and project resources  
- **Sprints** — Sprint planning and management  
- **Tasks** — Task creation, assignment, status, and priority management  
- **Comments** — Project and task collaboration  
- **Notifications** — User notifications  
- **Activity** — Organization activity tracking  
- **Subscriptions** — Stripe-powered subscription management  

---

## 👨‍💻 Author

**Newton**  
GitHub: [https://github.com/Newton2n](https://github.com/Newton2n)  
LinkedIn: [https://www.linkedin.com/in/newton2n/](https://www.linkedin.com/in/newton2n/)  
Portfolio: [https://newtondev.vercel.app](https://newtondev.vercel.app)

---

## 📄 License

This project is developed for learning and portfolio purposes.
