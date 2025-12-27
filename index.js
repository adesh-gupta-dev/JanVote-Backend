import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./router/authRouter.js";
import electionRouter from "./router/electionRouter.js";
import candidateRouter from "./router/candidateRouter.js";
import voteRouter from "./router/voteRouter.js";
import adminRouter from "./router/adminRouter.js";
import { handleError } from "./middleware/errorMiddleware.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routers
app.use("/api/auth", authRouter);
app.use("/api/elections", electionRouter);
app.use("/api/candidates", candidateRouter);
app.use("/api/votes", voteRouter);
app.use("/api/admin", adminRouter);

// DB + error handler
connectDB();
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
