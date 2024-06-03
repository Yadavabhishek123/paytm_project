const express = require("express");
const rootRouter = require("./routes/index");
const cors = require("cors")

const app = express();
app.use(cors()); // using cors middleware

app.use("/api/v1", rootRouter);
