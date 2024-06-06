import express from "express";
import { Account } from "../db";
import authMiddleware from "../middleware"
import mongoose from "mongoose"

const router = express.Router();
const app = express();


// user wants to fetch balance info from account
app.get("/balance",authMiddleware, async(req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    })

    res.json({
        balance: account.balance
    })
})


// user wants to transfer money from one account to another
// app.post("/transfer",authmiddleware, async(req,res) => {
//     const {amount, to} = req.body;
//     const account = await Account.findOne({
//         userId : req.userId
//     })

//     if(account.balance < amount){
//         return res.status(400).json({
//             messege:"Insufficient Balance"
//         })
//     }

//     const toaccount = await Account.findOne({
//         userId:to
//     })

//     if(!toaccount){
//         return res.status(400).json({
//             messege:"Invalid Account"
//         })
//     }

//     await Account.updateOne({
//         userId: req.userId
//     }, {
//         $inc: {
//             balance: -amount
//         }
//     })

//     await Account.updateOne({
//         userId: to
//     }, {
//         $inc: {
//             balance: amount
//         }
//     })

//     res.json({
//         message: "Transfer successful"
//     })

// })

// ----------------------------------------------------------------------------------
// this solution is not appropriate beacause

// What if the database crashes right after the first request (only the balance is decreased for one user, and not for the second user)
// What if the Node.js crashes after the first update?

// It would lead to a database inconsistency. Amount would get debited from the first user, and not credited into the other users account.

// If a failure ever happens, the first txn should rollback.

// This is what is called a transaction in a database. We need to implement a transaction on the next set of endpoints that allow users to transfer INR

//---------------------------------------------------------------------------------




// Good Solution

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
});

module.exports = {
    router
}