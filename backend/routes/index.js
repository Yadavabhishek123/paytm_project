import express from 'express';
import userRouter from "./user.js" ;
import AccountRouter from "./accounts.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("./account", AccountRouter);

export default router ;