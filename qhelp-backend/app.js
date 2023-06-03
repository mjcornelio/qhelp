const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(express.json());
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//connect to Database
const connectDB = require("./db/connect");

//router
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/UserRoutes");

app.use("/api/auth", authRouter);
app.use("/api", userRouter);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB.authenticate();
    app.listen(
      port,
      "192.168.1.30",
      console.log("successfully connected to Database")
    );
  } catch (error) {
    console.log(error);
    console.log("Something Went Wrong, Please Try Again Later");
  }
};

start();
