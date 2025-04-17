require("dotenv").config();
const express = require("express");
const connectDB = require("./database.js");
const passport = require("passport");
const cors = require("cors");

const jwtStrategy = require("./passport/jwtStrategy");
const authRouter = require("./routes/auth");
const dogRouter = require("./routes/dogs");
const userRouter = require("./routes/users");
const questionRouter = require("./routes/questions");
const answerRouter = require("./routes/answers");

const { handleAuthError } = require("./middlewares/errorHandler");

const app = express();
connectDB();

app.use(
  cors({
    origin: [process.env.FRONT_ORIGIN, "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
jwtStrategy();

// 라우터 연결
app.use("/", authRouter);
app.use("/dogs", dogRouter);
app.use("/users/me", userRouter);
app.use("/questions", questionRouter);
app.use("/answers", answerRouter);

app.use(handleAuthError);

app.listen(process.env.PORT, () => {
  console.log(`${process.env.PORT} 포트에서 서버 실행 중`);
});
