const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const accounts = [];
const feedbacks = [];
let keys = ["775772"]; // Default master key

// Home Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve Game Pages
app.get("/:game", (req, res) => {
  const game = req.params.game;

  // Map valid games to their directories
  const validGames = ["Hangman", "Snake", "Pac", "Tet"];
  if (validGames.includes(game)) {
    res.sendFile(path.join(__dirname, "public", game, `${game}.html`));
  } else {
    res.status(404).send("404: Game Not Found");
  }
});

// Dev Mode
app.post("/devmode", (req, res) => {
  const { key } = req.body;
  if (keys.includes(key)) {
    res.json({ message: "Dev Mode Activated!", accounts, feedbacks, keys });
  } else {
    res.status(403).json({ message: "Incorrect Dev Key." });
  }
});

// Add Feedback
app.post("/feedback", (req, res) => {
  const { game, text, user } = req.body;
  feedbacks.push({ game, text, user: user || "Anonymous" });
  res.json({ message: "Feedback submitted!" });
});

// Manage Accounts
app.post("/signup", (req, res) => {
  const { username } = req.body;
  if (accounts.some(acc => acc.username === username)) {
    res.status(400).json({ message: "Username already exists." });
  } else {
    accounts.push({ username });
    res.json({ message: "Account created!" });
  }
});

// Add Key
app.post("/addkey", (req, res) => {
  const { key } = req.body;
  if (!keys.includes(key)) {
    keys.push(key);
    res.json({ message: `Key "${key}" added.` });
  } else {
    res.status(400).json({ message: "Key already exists." });
  }
});

// Remove Key
app.post("/removekey", (req, res) => {
  const { key } = req.body;
  keys = keys.filter(k => k !== key);
  res.json({ message: `Key "${key}" removed.` });
});

// Catch-all route for undefined paths
app.use((req, res) => {
  res.status(404).send("404: Page Not Found");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
