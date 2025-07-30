Certainly! Here’s the improved README.md, formatted in Markdown code for direct use:

```markdown
# 📝 JWT Auth Todo App with MongoDB

A full-stack Todo application that allows users to register, log in, and manage personal tasks securely. The backend leverages **Node.js**, **Express**, **MongoDB**, and **JWT** for robust authentication, while the frontend features a clean UI styled with **Tailwind CSS**.

---

## 🚀 Features

- User Registration & Login
- JWT-based Authentication & Authorization
- Add, Edit, Mark Complete, and Delete Todos
- Private Todos per User
- Persistent Storage with MongoDB
- Minimal, Responsive UI with Tailwind CSS

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js & npm](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/cloud/atlas) (local or Atlas cloud)
- [Git](https://git-scm.com/) (optional, for cloning)

---

## 🧪 Getting Started

### 1. Clone the Repository

git clone https://github.com/0xnishant10/Still-Left-Todo.git
cd Still-Left-Todo
```
Or [download ZIP](https://github.com/0xnishant10/Still-Left-Todo/archive/refs/heads/main.zip) and extract it.

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root with the following contents:

```env
JWT_SECRET=your_jwt_secret_here
MONGO_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net
DB_NAME=your_db_name
```

> 💡 **Tip:** Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a free, cloud-based MongoDB instance.

### 4. Start the Server

```bash
node server.js
```

If successful, you should see:

```
✅ Connected to MongoDB
Server running on http://localhost:3000
```

---

## 💻 Usage

1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. Register a new user account.
3. Manage your todos: add, edit, mark as complete, or delete them.
4. Refresh the page—your todos persist, thanks to MongoDB!

---

## 🧠 Tech Stack

- **Frontend:** HTML, JavaScript, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)

---

## 📦 Useful Commands

| Command           | Description                 |
|-------------------|----------------------------|
| `npm install`     | Install all dependencies   |
| `node server.js`  | Start the backend server   |

---

## 👨‍💻 Author

**Nishant Singh**

Feel free to fork, customize, or contribute! Contributions and suggestions are always welcome.

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).
