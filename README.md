
# 🚀 Placio OS - Enterprise SaaS Platform

Welcome to **Placio OS**, a modern SaaS (Software as a Service) operating system designed for business management, specialist scheduling, and AI-driven growth.

## ✨ SaaS Core Features

- **Multi-Tenant Architecture**: Complete data isolation between companies via the `companyId` security layer.
- **RBAC (Role-Based Access Control)**: Granular permissions for Admins, Specialists, and Clients.
- **AI Strategic Insights**: Real-time business recommendations powered by Google Gemini.
- **Financial Intelligence**: Ledger systems with tenant-specific reporting.

## 🏗️ Folder Structure (MVC Design)

- `components/`: Pure UI components and Layout management.
- `server/controllers/`: Business logic and multi-tenant data scoping.
- `server/routes/`: API endpoint definitions and role authorization.
- `services/`: External API bridges (Gemini AI, Auth Transport).
- `database/`: SQL schemas and enterprise data models.

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Local Environment
```bash
npm start
```
*Wait for the system to initialize.*

## 🔐 Credentials for Testing

| Persona | Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **Platform Admin** | `admin@placio.com` | `123` | Full control |
| **Merchant Owner** | `fahad@client.com` | `123` | Tenant Hub |
| **Specialist** | `ahmed@placio.com` | `123` | Schedule Only |

---
**Crafted for Scale by the Placio Engineering Team.**
