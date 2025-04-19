import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import bookRouter from "./routes/book.routes.js";
import borrowRouter from "./routes/borrow.routes.js";
const app = express();

//database connection
await connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal Server Error");
  next();
});
app.use(cookieParser("book-library-system"));
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/v1/users", userRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
