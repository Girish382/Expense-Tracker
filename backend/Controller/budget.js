const { User, Budget, Expense } = require("../Models/User");

const getAllExpenses = async (req, res) => {
  try {
    const Budget_id = req.params.id;
    const allExpenses = await Budget.findById({ _id: Budget_id }).populate(
      "expenses"
    );
    res.status(200).send({
      message: "Expenses of budget fetched successfully",
      data: allExpenses,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllBudgets = async (req, res) => {
  try {
    const { id } = req.user;
    const allBudgets = await User.findById({ _id: id }).populate("budgets");
    res.status(200).send({
      message: "Budgets of user fetched successfully",
      data: allBudgets,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const addBudget = async (req, res) => {
  const { category, amountAllocated } = req.body;
  if(!category || ! amountAllocated){
    return res.status(400).json({
      success: false,
      message: "Category and amount Required",
    });
  }
  const { id } = req.user;

  // check if Budget already exist in the user's budget list
  const existingBudgets = await Budget.find({ category });
  const user = await User.findOne({ _id: id });
  let a = false;
  for (let i = 0; i < existingBudgets.length; i++) {
    if (user.budgets.includes(existingBudgets[i]._id)) {
      a = true;
      break;
    }
  }
  if (a) {
    return res.status(400).json({
      success: false,
      message: "Budget Already Exists",
    });
  }

  const budget = await Budget.create({
    category: category,
    amountAllocated: amountAllocated,
  });

  await User.findByIdAndUpdate({ _id: id }, { $push: { budgets: budget._id } });

  res.status(200).send({
    success: true,
    message: "Budget Created Successfully",
    data: budget,
  });
};

const addExpense = async (req, res) => {
  const Budget_id = req.params.id;
  const { expenseName, expenseAmount } = req.body;

  // check if Expense already exist in the Budget's expense list
  const existingExpenses = await Expense.find({ expenseName });
  const budget = await Budget.findOne({ _id: Budget_id });
  let a = false;
  for (let i = 0; i < existingExpenses.length; i++) {
    if (budget.expenses.includes(existingExpenses[i]._id)) {
      a = true;
      break;
    }
  }
  if (a) {
    return res.status(400).json({
      success: false,
      message: "Expense Already Exists",
    });
  }

  const expense = await Expense.create({ expenseName, expenseAmount });

  await Budget.findByIdAndUpdate(
    { _id: Budget_id },
    { $push: { expenses: expense._id } }
  );

  res.status(200).send({
    success: true,
    message: "Expense Created Successfully",
    data: expense,
  });
};

const deleteBudget = async (req, res) => {
  try {
    const Budgetid = req.params.id;
    const Userid = req.user.id;

    await User.findByIdAndUpdate(
      { _id: Userid },
      { $pull: { budgets: Budgetid } },
      { new: true, runValidators: true }
    );

    const budgettobeDeleted = await Budget.findOne({ _id: Budgetid });
    budgettobeDeleted.expenses.forEach(async (expense) => {
      await Expense.deleteOne({ _id: expense });
    });

    await Budget.deleteOne({ _id: Budgetid });

    res.status(200).json({
      success: true,
      message: "Deleted Budget Successfully",
    });
  } catch (error) {
    console.log(error.message);
  }
};

const deleteExpense = async (req, res) => {
  try {
    const Budget_id  = req.query.Budget_id;
    const expenseid = req.query.expenseid;

    await Budget.findByIdAndUpdate(
      { _id: Budget_id },
      { $pull: { expenses: expenseid } },
      { new: true, runValidators: true }
    );

    await Expense.deleteOne({ _id: expenseid });

    res.status(200).json({
        success:true,
        message:"Expense Deleted Succesfully"
    })
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getAllBudgets,
  getAllExpenses,
  addBudget,
  addExpense,
  deleteBudget,
  deleteExpense,
};

// router.get('/hi', async(req,res)=>{
//     const edetail = await Expense.create({expenseAmount:12,expenseName:"jds"});
//     const budgetDetials= await Budget.create({category:"hi",amountAllocated:50000,expenses:[edetail._id]});
//     const userDetails = await User.findOneAndUpdate({name:"girish"},{$push:{budgets : budgetDetials._id}},{new:true}).populate("budgets");
//     return res.status(200).json({
//         data : userDetails
//     })
// })
