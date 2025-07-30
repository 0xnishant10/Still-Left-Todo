# 📝 JWT Auth Todo App with MongoDB

A full-stack Todo application where users can register, log in, and manage their personal tasks. The backend is built with **Node.js**, **Express**, **MongoDB**, and **JWT** for authentication. The frontend is built using simple **HTML, CSS, Tailwind**, and **JavaScript**.

---

## 🚀 Features

- User Registration & Login
- JWT-based Authentication
- Add, Edit, Mark Complete, and Delete Todos
- Todos are private per user
- MongoDB for persistent storage
- Clean, minimal UI with Tailwind CSS

---

## 📁 Project Structure

project-root/
│
├── public/ # Frontend files served by Express
│ ├── index.html # Landing / register page
│ ├── login.html # Login page
│ ├── todo.html # Todo dashboard after login
│ ├── style.css # Optional: your own styles
│ ├── register.js
│ ├── login.js
│ └── todo.js
│
├── .env # Environment variables
├── server.js # Main backend server file
├── package.json
└── README.md
---

## ⚙️ Prerequisites

Make sure you have the following installed:

- Node.js and npm → https://nodejs.org/
- MongoDB (local or cloud – MongoDB Atlas) → https://www.mongodb.com/cloud/atlas
- Git (optional, for cloning)

---

## 🧪 Setup Instructions

### 1. 📥 Clone this repo

```bash
git clone https://github.com/your-username/jwt-auth-todo-app.git
cd jwt-auth-todo-app
```
Or download the ZIP and extract it.

2. 📦 Install dependencies
```bash
npm install
```
3. 🛠️ Configure environment variables
Create a .env file in the root folder and add:
```bash
JWT_SECRET=your_jwt_secret_here
MONGO_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net
DB_NAME=your_db_name
```
Tip: Use MongoDB Atlas to create a free MongoDB cluster if you don’t have one.

4. ▶️ Run the server
```bash
node server.js
```
If everything is correct, you’ll see:
```bash
✅ Connected to MongoDB
Server running on http://localhost:3000
```

💻 Using the App
1. Open http://localhost:3000 in your browser.
2. Register a new user.
3. You’ll be redirected to the Todo page.
4. Add / edit / complete / delete your tasks.
5. Refresh — your tasks will still be there (MongoDB saves them!).

🧠 Tech Stack
- Frontend: HTML, JavaScript, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)

📦 Useful Commands
```bash
npm install
```
Installs all dependencies
```bash
node server.js
```
Starts the backend server

🧑‍💻 Author
Nishant Singh

Feel free to fork, customize, or contribute!

🛡️ License
This project is licensed under the MIT License.

yaml
Copy
Edit
