import express from 'express';
const userRouter = require("./user");
const AccountRouter = require("./accounts");

const router = express.Router;

router.use("/user", userRouter);
router.use("./account", AccountRouter);

module.exports = router ;