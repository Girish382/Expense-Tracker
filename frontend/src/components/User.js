import React, { useEffect, useRef, useState } from "react"; 
import { toast } from "react-toastify";
import Header from "./Header";
import BudgetTemplate from "./BudgetTemplate";
import Cookies from "js-cookie";

const toastObjectParameter = {
  position: "top-center",
  autoClose: 3000, // Set the auto-close time in milliseconds
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const User = () => {
  const category = useRef(null);
  const amountAllocated = useRef(null);

  const [userDetails, setUserDetails] = useState(null);

  const handleCreateBudget = async () => {
    const budget = {
      category: category.current.value,
      amountAllocated: amountAllocated.current.value,
      token:localStorage.getItem('token')
    };

    const response = await fetch(`${process.env.REACT_APP_Server_URL}budget/addBudget`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budget),
      credentials: "include",
    });

    const result = await response.json();
    console.log(result);

    if (result.success) {
      toast.success(result.message, toastObjectParameter);

      // Update the state with the new array of budgets
      setUserDetails((prevUserDetails) => ({
        ...prevUserDetails,
        budgets: [...prevUserDetails.budgets, result.data],
      }));
    } else {
      toast.error(result.message, toastObjectParameter);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const obj={token:localStorage.getItem('token')}
      try {
        const response = await fetch(`${process.env.REACT_APP_Server_URL}budget/allBudofUser`, {
          method: "GET",
          credentials: "include",
          body:JSON.stringify(obj)
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        const result = await response.json();

        if (isMounted) {
          setUserDetails(result.data);
        }
      } catch (error) {
        // Handle errors during the API call
        console.error(error.message);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return userDetails == null ? (
    ""
  ) : (
    <div className="">
     
      <div className="container mx-auto mt-8 px-4 sm:px-8 pb-4">
        {/* Welcome message and Create Budget form */}
        <div className="bg-white p-6 rounded-md shadow-md dark:bg-gray-800">
          <p className="text-2xl font-semibold mb-4 dark:text-white">
            Welcome,{" "}
            <span className="dark:text-green-700 font-bold text-6xl ">
              {userDetails.name}
            </span>
          </p>
          <hr className="-mt-2 mb-3" />
          <p className="text-2xl font-semibold mb-1 dark:text-white ">
            Create Budget
          </p>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <form className="flex-1">
              <div className="flex flex-col">
                <label
                  htmlFor="category"
                  className="mb-1 text-gray-700 dark:text-gray-300"
                >
                  Category
                </label>
                <input
                  ref={category}
                  type="text"
                  id="category"
                  className="border p-2 rounded-md focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter category"
                />
              </div>
              <div className="flex flex-col mt-4">
                <label
                  htmlFor="amount"
                  className="mb-1 text-gray-700 dark:text-gray-300"
                >
                  Amount
                </label>
                <input
                  ref={amountAllocated}
                  type="number"
                  id="amount"
                  className="border p-2 rounded-md focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter amount"
                />
              </div>
              <button
                onClick={handleCreateBudget}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Create
              </button>
            </form>
          </div>
        </div>
        <p className="text-2xl font-bold underline dark:text-black mt-4 -mb-5 bg-gray-500 rounded-lg p-2">
          {userDetails.budgets.length==0?"No Budgets found ==> Create Budgets":"Budgets"}
        </p>
        {/* Displaying all Budgets */}
        <div className="mt-8 space-y-4">
          {userDetails.budgets.map((budget) => (
            <BudgetTemplate
              key={budget._id}
              budget={budget}
              userDetails={userDetails}
              setUserDetails={setUserDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default User;
