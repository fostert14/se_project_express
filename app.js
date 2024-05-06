require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const { errors } = require("celebrate");

const { PORT = 3001 } = process.env;
const app = express();

const { login, createUser } = require("./controllers/users");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const errorHandler = require("./middlewares/errors");

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  () => {
    console.log("connected to DB");
  },
  (e) => console.log("DB error", e),
);

const routes = require("./routes");
const {
  validateUserInfoCreation,
  validateUserLogin,
} = require("./middlewares/validation");

app.use(express.json());
app.use(helmet());
app.use(cors());
app.disable("x-powered-by");

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post("/signin", validateUserLogin, login);
app.post("/signup", validateUserInfoCreation, createUser);

app.use(requestLogger);
app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
