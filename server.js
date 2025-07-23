require("dotenv").config();
const express = require("express");
const connectDB = require("./database.js");
const passport = require("passport");
const cors = require("cors");
const https = require("https");
const fs = require("fs");

const jwtStrategy = require("./passport/jwtStrategy");
const authRouter = require("./routes/auth");
const dogRouter = require("./routes/dogs");
const userRouter = require("./routes/users");
const questionRouter = require("./routes/questions");
const answerRouter = require("./routes/answers");
const photoRouter = require("./routes/photos");

const { handleAuthError } = require("./middlewares/errorHandler");

const app = express();
connectDB();

// require("./batch/dailyEmailJob");

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
app.use("/photos", photoRouter);

app.use(handleAuthError);

const credentials = {
  key: fs.readFileSync(process.env.HTTPS_KEY_PATH),
  cert: fs.readFileSync(process.env.HTTPS_CERT_PATH),
};

https.createServer(credentials, app).listen(process.env.PORT, () => {
  console.log(`HTTPS 서버가 ${process.env.PORT} 포트에서 실행 중입니다.`);
});
