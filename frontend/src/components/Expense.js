import React from "react";
import { toast } from "react-toastify"; 
const toastObjectParameter = {
  position: "top-center",
  autoClose: 3000, // Set the auto-close time in milliseconds
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const Expense = ({ expense, budgetDetails, setbudgetDetails }) => {

  const handleDeleteExpense = async () => {
    const id = expense._id;
    const obj={token:localStorage.getItem('token')}
    const response = await fetch(
      `${process.env.REACT_APP_Server_URL}budget/deleteExpofBud/?expenseid=${id}&Budget_id=${budgetDetails._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: "include",
        body:JSON.stringify(obj)
      }
    );
    const result = await response.json();

    if (result.success) {
      toast.success(result.message, toastObjectParameter);
      setbudgetDetails((prevUserDetails) => ({
        ...prevUserDetails,
        expenses: prevUserDetails.expenses.filter(
          (expense) => expense._id != id
        ),
      }));
    } else {
      toast.error(result.message, toastObjectParameter);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-md shadow-md">
      <p className="text-2xl font-semibold mb-2 text-white">
        {expense.expenseName}
      </p>
      <p className="text-gray-400 mb-4">
        Amount Allocated: {expense.expenseAmount}
      </p>
      {/* Placeholder image, replace with actual images */}
      <div className="flex space-x-4">
        <button
          onClick={handleDeleteExpense}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
        >
          Delete Expense
        </button>
      </div>
    </div>
  );
};

export default Expense;
