const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const port = process.env.PORT;
const mongoose = require("mongoose");

const userRouter = require("./routes/user");
const courseRouter = require("./routes/course");
const adminRouter = require("./routes/admin");

console.log(process.env.MONGO_URL);

const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/courses", courseRouter);

async function main() {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB connected"))
    .catch((e) => console.log(e.message));
  app.listen(port);
  console.log("listening on port " + port);
}

main();
