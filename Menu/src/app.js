require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true, service: "menu" }));

const PORT = 6001;
app.listen(PORT, () => {
  console.log("Menu service running on port " + PORT);
});
