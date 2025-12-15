require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true, service: "menu" }));

const PORT = 6001;
app.get("/menu", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Pizza Margherita",
      price: 9.5
    },
    {
      id: 2,
      name: "Goveja juha",
      price: 4.2
    }
  ]);
});
app.listen(PORT, () => {
  console.log("Menu service running on port " + PORT);
});
