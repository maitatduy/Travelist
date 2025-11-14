const express = require("express");
const path = require("path");

require("dotenv").config();
const database = require("./config/database.config");

const app = express();
const port = 3000;

// Kết nối database
database.connect();

// Thiết lập views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Thiết lập thư mục public
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Website đang chạy ở cổng: ${port}`);
});
