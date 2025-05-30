# 🎛️ Admin Panel – Child Donation Trust System

This is the **Admin Panel** for a full-stack donation platform built for a **Child Donation Trust**. It offers powerful management features for the **Owner** and **Trustees** to control and monitor all aspects of the donation process.

🧠 **Role-Based Access Control** ensures that different users (Owner, Trustee, Donor) have specific permissions based on their role.

🔗 **Frontend Donor Website**: (https://nasarna-helping-hand-donation-trust.vercel.app/auth/login)

---

## 🔐 Admin Login Credentials (For Testing)

> **Email:** `anilthakor7007@gmail.com`  
> **Password:** `Anil$$123`  

---

## 🧩 Key Features

### 🔑 Authentication & RBAC

- Secure login & logout
- Role-based access control
- Roles:
  - **Owner**: Full access, manages causes, goals, trustees, and donation tracking
  - **Trustee**: Can manage donor records and donation logs
  - **Donor** (accesses only the public site)

### 📌 Cause & Goal Management

- Create and manage **donation causes**
- Set fundraising **goals** and track progress
- View total donations per cause

### 🤝 Donor & Donation Management

- View and edit donor details
- View donation transactions (amount, method, date, cause)
- Manual entry for offline donations

### 🛡️ Secure & Reliable

- Protected routes using role checks
- Sanitized user input
- Backend validation & error handling

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Routing & State**: React Router, Redux Toolkit
- **Backend**: Node.js, Express.js
- **Auth**: JWT (JSON Web Tokens) 
- **Database**: MongoDB
- **Hosting**: Vercel / Render

---

## 🚀 Getting Started

### Prerequisites

- Node.js v14+
- npm or yarn
- MongoDB URI or other DB connection
- Backend API ready and running

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/child-trust-admin-panel.git
cd client
