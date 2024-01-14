const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");

const { PORT = 3001 } = process.env;
const app = express();

const { login, createUser } = require("./controllers/users");

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  () => {
    console.log("connected to DB");
  },
  (e) => console.log("DB error", e),
);

const routes = require("./routes");

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "657a86c5da8cc73dc614834f",
  };
  next();
});
app.use(helmet());
app.disable("x-powered-by");

app.post("/signin", login);
app.post("/signup", createUser);

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);

  console.log("This is working");
});
