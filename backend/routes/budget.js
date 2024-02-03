const express = require('express')
const {auth} = require("../middleware/auth")
const router = express.Router();


const {getAllBudgets,addBudget, addExpense, getAllExpenses,deleteBudget,deleteExpense} = require("../Controller/budget");

router.get("/allBudofUser",auth,getAllBudgets); // responses a user with his budgets
router.get("/allExpofBud/:id",auth,getAllExpenses); // responses a budget with its expenses
router.post("/addBudget",auth,addBudget)
router.post("/addExpense/:id",auth,addExpense)
router.delete("/deleteBudofUser/:id",auth,deleteBudget)
router.delete("/deleteExpofBud",auth,deleteExpense)



module.exports = router;