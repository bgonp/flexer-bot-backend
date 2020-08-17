const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const connection = require("./database/connection");
connection();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));

app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});
