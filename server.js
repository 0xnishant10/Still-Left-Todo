require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const { MongoClient } = require("mongodb");
const bodyparser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET:", JWT_SECRET);

app.use(cors());
app.use(bodyparser.json());
app.use(express.static("public"));

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME;

app.post("/submit", async (req, res) => {
  const { fullName, dob, password } = req.body;

  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection("users");

    await users.insertOne({ fullName, dob, password });
    res.status(200).send("Data Saved to MongoDB");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving data");
  }
});

app.post("/login", async (req, res) => {
  const { fullName, password } = req.body;

  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection("users");

    const user = await users.findOne({ fullName, password });

    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign({ fullName: user.fullName }, JWT_SECRET, {
      expiresIn: "5d",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/protected", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Missing token");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).send(`Hello, ${decoded.fullName}. You are authenticated!`);
  } catch (err) {
    return res.status(403).send("Invalid or expired token");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
