const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  expenseName: {
    type: String,
    required: true,
    unique:true,
  },
  expenseAmount: {
    type: Number,
    required: true,
  },
});

const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique:true,
  },
  amountAllocated: {
    type: Number,
    required: true,
  },
  expenses: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:"expense"
  }],
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  password: {
    type: String,
    required: true,
  },
  budgets:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"budget"
  }]
});

const User = mongoose.model('User', userSchema);
const Budget = mongoose.model('budget', BudgetSchema);
const Expense = mongoose.model('expense', expenseSchema);

module.exports = {User,Budget,Expense};
