import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Expense from "./Expense";
import { toast } from "react-toastify";


const toastObjectParameter = {
    position: "top-center",
    autoClose: 3000, // Set the auto-close time in milliseconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

const Budget = () => {
  const { id } = useParams();
  const [budgetDetails, setbudgetDetails] = useState(null);

  const expenseName = useRef(null);
  const expenseAmount = useRef(null);

  const handleCreateExpense = async () => {
    const expense = {
        expenseName: expenseName.current.value,
        expenseAmount: expenseAmount.current.value,
        token:localStorage.getItem('token'),
    };
  
      const response = await fetch(`${process.env.REACT_APP_Server_URL}budget/addExpense/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify(expense),
        credentials: "include",
      });
  
      const result = await response.json();
      console.log(result);
  
      if (result.success) {
        toast.success(result.message, toastObjectParameter);
  
        // Update the state with the new array of budgets
        setbudgetDetails((prevUserDetails) => ({
          ...prevUserDetails,
          expenses: [...prevUserDetails.expenses, result.data],
        }));
      } else {
        toast.error(result.message, toastObjectParameter);
      }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_Server_URL}budget/allExpofBud/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        const result = await response.json();

        if (isMounted) {
          setbudgetDetails(result.data);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return budgetDetails == null ? (
    ""
  ) : (
    <div className="">
   
      <div className="container mx-auto mt-8 px-4 sm:px-8 pb-4">
        {/* Welcome message and Create Budget form */}
        <div className="bg-white p-6 rounded-md shadow-md dark:bg-gray-800">
          <p className="text-2xl font-semibold mb-4 dark:text-white">
            <span className="dark:text-green-700 font-bold text-4xl ">
              {budgetDetails.category}
            </span>
          </p>
          <div className="flex justify-between p-2">
            <p className="text-xl font-semibold mb-4 dark:text-white">
              Amount Allocated: <span className="text-lg text-red-500"><span className="text-green-500">$</span>{budgetDetails.amountAllocated}</span>
            </p>
            <p className="text-xl font-semibold mb-4 dark:text-white">
              Amount Remaining: <span className="text-lg text-red-500"><span className="text-green-500">$</span>{budgetDetails.amountAllocated - budgetDetails.expenses.reduce((acc,expense)=>acc+expense.expenseAmount,0)}</span>
            </p>
            <p className="text-xl font-semibold mb-4 dark:text-white">
              Expenses: <span className="text-lg text-red-500"><span className="text-green-500">$</span>{budgetDetails.expenses.reduce((acc,expense)=>acc+expense.expenseAmount,0)}</span>
            </p>
          </div>
          <hr className="-mt-2 mb-3" />
          <p className="text-2xl font-semibold mb-1 dark:text-white ">
            Create Expense
          </p>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <form className="flex-1">
              <div className="flex flex-col">
                <label
                  htmlFor="category"
                  className="mb-1 text-gray-700 dark:text-gray-300"
                >
                  Expense Type
                </label>
                <input
                  ref={expenseName}
                  type="text"
                  id="category"
                  className="border p-2 rounded-md focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter expense"
                />
              </div>
              <div className="flex flex-col mt-4">
                <label
                  htmlFor="amount"
                  className="mb-1 text-gray-700 dark:text-gray-300"
                >
                  Expense Amount
                </label>
                <input
                  ref={expenseAmount}
                  type="number"
                  id="amount"
                  className="border p-2 rounded-md focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter amount"
                />
              </div>
              <button
                onClick={handleCreateExpense}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Create
              </button>
            </form>
          </div>
        </div>
        <p className="text-2xl font-bold underline dark:text-black mt-4 -mb-5 bg-gray-500 rounded-lg p-2">
          {budgetDetails.expenses.length==0?"No Expenses found ==> Create Expense":"Expenses"}
        </p>
        {/* Displaying all Budgets */}
        <div className="mt-8 space-y-4">
          {budgetDetails.expenses.map((expense) => (
            <Expense
              key={expense._id}
              expense={expense}
              budgetDetails={budgetDetails}
              setbudgetDetails={setbudgetDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Budget;
