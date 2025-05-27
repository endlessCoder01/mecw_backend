const express = require("express");
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

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use("/mecw", route);

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/mecw", (req, res) => {
  res.send("Ministry of Environment, Climate And Wildlife Backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));