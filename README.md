# Inventrix

A full-stack **Enterprise Inventory Management System** built with React, Node.js, Express, and MySQL. Features JWT authentication, real-time stock tracking, ACID-compliant transactions, light/dark theme, and multi-select batch deletion.

---

## 🔑 Test Credentials

| Field | Value |
|-------|-------|
| Username | `staff` |
| Password | `staff123` |

> Or toggle to **Register** on the login page to create a new account.

---

## ✨ Features

- **Dashboard** — Real-time metrics: total products, inventory valuation (₹), low stock alerts, warehouse & supplier counts
- **Products** — Full CRUD with warehouse autocomplete, stock valuation preview, and low stock indicators
- **Suppliers & Warehouses** — Full CRUD with search filtering
- **Purchase Orders** — Restock inventory; automatically increments product stock (ACID transaction)
- **Sales Orders** — Process sales; automatically decrements stock with over-sell protection
- **Multi-Select Deletion** — Select and batch delete multiple records across all tables
- **Light / Dark Theme** — Toggle between themes, persisted in localStorage (Light by default)
- **JWT Authentication** — Secure session-based access; all API routes are protected

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS v4, Lucide React |
| Backend | Node.js, Express.js, Prisma ORM |
| Database | MySQL 8, ACID Transactions, Row-Level Locking |
| Auth | JWT, bcryptjs |

---

## 📁 Project Structure

```
Inventrix/
├── backend/
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── config/prisma.js
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── index.css
│   └── index.html
├── sample-data/inventory.sql
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MySQL 8+

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Set Up the Database

Open your MySQL client and run:
```sql
source sample-data/inventory.sql;
```

Then generate the Prisma client:
```bash
cd backend
npx prisma generate
```

### 3. Configure Environment

In the `backend` folder, copy `.env.example` to `.env` and fill in your MySQL credentials:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=inventory_db
DATABASE_URL="mysql://root:your_password@localhost:3306/inventory_db"
JWT_SECRET=your_secret_key
```

### 4. Run Locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Endpoints

All routes are prefixed with `/api`.

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/products` | List all products |
| `POST` | `/products` | Add product |
| `PUT` | `/products/:id` | Update product |
| `DELETE` | `/products/:id` | Delete product |
| `GET` | `/suppliers` | List all suppliers |
| `POST` | `/suppliers` | Add supplier |
| `PUT` | `/suppliers/:id` | Update supplier |
| `DELETE` | `/suppliers/:id` | Delete supplier |
| `GET` | `/warehouses` | List all warehouses |
| `POST` | `/warehouses` | Add warehouse |
| `PUT` | `/warehouses/:id` | Update warehouse |
| `DELETE` | `/warehouses/:id` | Delete warehouse |
| `GET` | `/purchase-orders` | List purchase orders |
| `POST` | `/purchase-orders` | Create PO (increments stock) |
| `PUT` | `/purchase-orders/:id` | Update PO |
| `DELETE` | `/purchase-orders/:id` | Delete PO |
| `GET` | `/sales-orders` | List sales orders |
| `POST` | `/sales-orders` | Create SO (decrements stock) |
| `PUT` | `/sales-orders/:id` | Update SO |
| `DELETE` | `/sales-orders/:id` | Delete SO |
