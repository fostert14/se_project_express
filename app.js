require("dotenv").config();

console.log("JWT_SECRET:", process.env.JWT_SECRET);
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

app.use(cors());
app.use(express.json());
app.use(helmet());
app.disable("x-powered-by");

app.use(requestLogger);
app.post("/signin", validateUserLogin, login);
app.post("/signup", validateUserInfoCreation, createUser);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
