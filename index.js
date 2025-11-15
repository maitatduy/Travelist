const express = require("express");
const path = require("path");

require("dotenv").config();
const database = require("./config/database.config");

const app = express();
const port = 3000;

const adminRoutes = require("./routes/admin/index.route");
const variableConfig = require("./config/variable.config");

// Kết nối database
database.connect();

// Thiết lập views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Thiết lập thư mục public
app.use(express.static(path.join(__dirname, "public")));

// Tạo biến toàn cục trong file PUG
app.locals.pathAdmin = variableConfig.pathAdmin;

// Thiết lập đường dẫn
app.use(`/${variableConfig.pathAdmin}`, adminRoutes);

app.listen(port, () => {
  console.log(`Website đang chạy ở cổng: ${port}`);
});
