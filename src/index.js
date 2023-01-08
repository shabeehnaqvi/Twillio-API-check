const express = require("express");
const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");

const router = require("./routes/user/user.controller");
const routerTeacher = require("./routes/teacher/user.controller");
const router2 = require("./routes/product/product.controller");
const routerUser = require("./routes/users/user.controller");

const app = express();
app.use(express.json());
// app.use(authHandler);
const cors = require("cors");
app.use(cors());
mongoose
  .connect("mongodb://localhost:27017/database1")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(`Couldn't connected to MongoDB, ${error}`));

app.use("/student", router);
app.use("/teacher", routerTeacher);
app.use("/product", router2);
app.use("/user", routerUser);

app.listen(5000, () => console.log("App is listening at port 5000"));
