# Express E-Commerce API 🚀

A high-performance E-Commerce Backend REST API built with Node.js, Express, and TypeScript. 
This project strictly follows **NestJS architectural patterns** (Modules, Controllers, Services) to provide a scalable, maintainable, and enterprise-grade structure without the overhead of the NestJS framework itself.

## 🌟 Key Features

- **Robust Architecture**: Modular structure mimicking NestJS for clear separation of concerns.
- **Relational Database**: PostgreSQL powered by **TypeORM** for robust data modeling.
- **Data Integrity**: Full Database Transactions (`QueryRunner`) for checkout processes to prevent race conditions and ensure stock consistency.
- **Background Jobs**: Powered by **BullMQ & Redis** to handle non-blocking tasks like sending confirmation emails and auto-canceling unpaid orders after 15 minutes.
- **Authentication & Authorization**: Secure JWT-based authentication with Role-based Access Control (Admin vs Customer).
- **API Documentation**: Interactive **Swagger UI** available out of the box for testing and tracking APIs.
- **Payment Gateway Integration**: Built-in **VNPay** Sandbox integration with secure HMAC-SHA512 IPN signature verification.
- **Enterprise Ops**: Structured daily-rotating logging with **Winston**, global standardized API responses via Interceptors, and robust Health Check endpoints.

## 🛠️ Tech Stack

- **Framework**: Express.js (Node.js) & TypeScript
- **Database**: PostgreSQL & TypeORM
- **Queue/Cache**: Redis & BullMQ
- **Security**: JWT, bcrypt, Helmet, CORS
- **Logging**: Winston (Daily Rotate File)
- **Validation**: class-validator & class-transformer

---

## 🚀 Getting Started

Follow these step-by-step instructions to set up the project on your local machine.

### 1. Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker & Docker Compose](https://www.docker.com/) (For running PostgreSQL and Redis locally)
- Git

### 2. Installation

Clone the repository and install all required Node.js dependencies:

```bash
git clone <your-repo-url>
cd express-commerce-api
npm install
```

### 3. Environment Setup

The project requires environment variables to connect to the database, Redis, and VNPay. Copy the provided template to create your `.env` file:

```bash
# On Windows (Command Prompt)
copy .env.example .env

# On Mac/Linux/Git Bash
cp .env.example .env
```
*Note: The default `.env.example` values are already configured to work seamlessly with the local Docker setup. You don't need to change anything to run it locally!*

### 4. Start Infrastructure (Database & Redis)

We use Docker to quickly spin up the database and cache. Run the following command in the root of the project:

```bash
docker-compose up -d
```
*This will start PostgreSQL on port 5432 and Redis on port 6379 in the background.*

### 5. Seed the Database

To test the APIs, you need some initial data. Run the seeder to automatically create Categories, Products, and Users:

```bash
npm run seed
```

**Test Accounts created by the seeder:**
- **Admin:** `admin@test.com` | Password: `password123`
- **Customer:** `customer@test.com` | Password: `password123`

### 6. Run the Application

Start the development server with hot-reload enabled:

```bash
npm run dev
```

If everything is configured correctly, you will see:
```text
📦 Database connected successfully!
🚀 Server is running on http://localhost:3000
🩺 Health check: http://localhost:3000/health
```

You can verify the system health by visiting: [http://localhost:3000/health](http://localhost:3000/health)

---

## 📁 Folder Structure

```text
src/
├── config/           # Database and Redis configurations
├── core/             # Core mechanisms (Exceptions, Interceptors, Middlewares, Logger)
├── jobs/             # BullMQ Workers (Background tasks & delays)
├── modules/          # Feature Modules (Auth, Cart, Category, Order, Product, Health, Upload)
│   ├── [module]/
│   │   ├── dtos/             # Data Transfer Objects (Validation rules)
│   │   ├── entities/         # TypeORM Entities (DB Models)
│   │   ├── [module].routes.ts
│   │   ├── [module].controller.ts
│   │   └── [module].service.ts
├── seed.ts           # Database seeding script
├── app.ts            # Express application setup
└── server.ts         # Entry point (Bootstrap)
```

## 📜 Available Scripts

- `npm run dev`: Starts the application in development mode using `tsx`.
- `npm run build`: Compiles TypeScript files into JavaScript inside the `dist` folder.
- `npm run start`: Runs the compiled JavaScript application (for production).
- `npm run seed`: Clears the database and injects fresh test data.
- `npm run lint`: Runs ESLint to check for code issues.
- `npm run format`: Runs Prettier to auto-format the codebase.
