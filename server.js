const express = require("express");
const multer = require("multer");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const route = require("./Database/router");
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};



app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/mecw", route);


app.get("/mecw", (req, res) => {
  res.send("Ministry of Environment, Climate And Weather Backend");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
