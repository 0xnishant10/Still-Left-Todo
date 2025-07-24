// require("dotenv").config();
// const express = require("express");
// const jwt = require("jsonwebtoken");
// const { MongoClient } = require("mongodb");
// const bodyparser = require("body-parser");
// const cors = require("cors");

// const app = express();
// const port = 3000;
// const JWT_SECRET = process.env.JWT_SECRET;
// console.log("JWT_SECRET:", JWT_SECRET);

// app.use(cors());
// app.use(bodyparser.json());
// app.use(express.static("public"));

// const uri = process.env.MONGO_URI;
// const client = new MongoClient(uri);
// const dbName = process.env.DB_NAME;

// app.post("/submit", async (req, res) => {
//   const { fullName, dob, password } = req.body;

//   try {
//     await client.connect();
//     const db = client.db(dbName);
//     const users = db.collection("users");

//     await users.insertOne({ fullName, dob, password });
//     res.status(200).send("Data Saved to MongoDB");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error saving data");
//   }
// });

// app.post("/login", async (req, res) => {
//   const { fullName, password } = req.body;

//   try {
//     await client.connect();
//     const db = client.db(dbName);
//     const users = db.collection("users");

//     const user = await users.findOne({ fullName, password });

//     if (!user) {
//       return res.status(401).send("Invalid credentials");
//     }

//     const token = jwt.sign({ fullName: user.fullName }, JWT_SECRET, {
//       expiresIn: "5d",
//     });

//     res.status(200).json({ token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// app.get("/protected", (req, res) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).send("Missing token");
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     res.status(200).send(`Hello, ${decoded.fullName}, You are authenticated!`);
//   } catch (err) {
//     return res.status(403).send("Invalid or expired token");
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb"); // <-- ObjectId added
const cors = require("cors");

const app = express();
const port = 3000;

const JWT_SECRET = process.env.JWT_SECRET;
const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

// ---------- middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ---------- mongo (single connect) ----------
const client = new MongoClient(uri);
let db, usersCol, tasksCol;

(async function init() {
  await client.connect();
  db = client.db(dbName);
  usersCol = db.collection("users");
  tasksCol = db.collection("tasks");
  console.log("✅ Connected to MongoDB");
})().catch((err) => {
  console.error("Mongo init error:", err);
  process.exit(1);
});

// ---------- auth middleware ----------
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).send("Missing token");

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid or expired token");
    req.user = user; // { fullName }
    next();
  });
}

// ---------- routes ----------

// register
app.post("/submit", async (req, res) => {
  const { fullName, dob, password } = req.body;
  try {
    await usersCol.insertOne({ fullName, dob, password });
    res.status(200).send("Data Saved to MongoDB");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving data");
  }
});

// login -> returns JWT
app.post("/login", async (req, res) => {
  const { fullName, password } = req.body;
  try {
    const user = await usersCol.findOne({ fullName, password });
    if (!user) return res.status(401).send("Invalid credentials");

    const token = jwt.sign({ fullName: user.fullName }, JWT_SECRET, {
      expiresIn: "5d",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// protected -> now returns JSON
// app.get("/protected", authenticateToken, (req, res) => {
//   res.status(200).json({ fullName: req.user.fullName });
// });
app.get("/protected", authenticateToken, (req, res) => {
  res.status(200).json({ fullName: req.user.fullName });
});
/* ----------------- TASKS CRUD ----------------- */

// GET all tasks for this user
app.get("/tasks", authenticateToken, async (req, res) => {
  try {
    const tasks = await tasksCol.find({ user: req.user.fullName }).toArray();
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting tasks" });
  }
});

// POST create task
app.post("/tasks", authenticateToken, async (req, res) => {
  const { task } = req.body;
  try {
    const doc = {
      task,
      completed: false,
      user: req.user.fullName,
      createdAt: new Date(),
    };
    const { insertedId } = await tasksCol.insertOne(doc);
    res.status(201).json({ insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating task" });
  }
});

// PATCH edit task text
app.patch("/tasks/:id", authenticateToken, async (req, res) => {
  const { task } = req.body;
  try {
    await tasksCol.updateOne(
      { _id: new ObjectId(req.params.id), user: req.user.fullName },
      { $set: { task } }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error editing task" });
  }
});

// PATCH toggle complete
app.patch("/tasks/:id/complete", authenticateToken, async (req, res) => {
  const { completed } = req.body;
  try {
    await tasksCol.updateOne(
      { _id: new ObjectId(req.params.id), user: req.user.fullName },
      { $set: { completed: !!completed } }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating task" });
  }
});

// DELETE task
app.delete("/tasks/:id", authenticateToken, async (req, res) => {
  try {
    await tasksCol.deleteOne({
      _id: new ObjectId(req.params.id),
      user: req.user.fullName,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting task" });
  }
});

// ---------- start ----------
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
