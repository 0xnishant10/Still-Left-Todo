const express = require("express");
const { MongoClient } = require("mongodb");
const bodyparser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

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

    if (user) {
      res.status(200).send("Login successful");
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
