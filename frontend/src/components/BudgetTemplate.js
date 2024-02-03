import React, { useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const toastObjectParameter = {
    position: "top-center",
    autoClose: 3000, // Set the auto-close time in milliseconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };
  

const BudgetTemplate = ({ budget,userDetails,setUserDetails }) => {

    const navigate = useNavigate();
    
    const handleViewBudget = ()=>{
        const id=budget._id;
        navigate(`/budget/${id}`)
    }

    const handleDeleteBudget = async()=>{
        const id = budget._id;
        const obj={token:localStorage.getItem('token')}
        const response = await fetch(`${process.env.REACT_APP_Server_URL}budget/deleteBudofUser/${id}`,{
            method:"DELETE",
            headers: {
                "Content-Type": "application/json",
              },
            credentials:"include",
            body:JSON.stringify(obj)
        })
        const result = await response.json();

        if(result.success){
            toast.success(result.message, toastObjectParameter);
            setUserDetails((prevUserDetails) => ({
                ...prevUserDetails,
                budgets: prevUserDetails.budgets.filter((budget)=>budget._id!=id),
            }));
        }
        else{
            toast.error(result.message,toastObjectParameter)
        }
    }


  return (
    <div className="bg-gray-800 p-6 rounded-md shadow-md">
      <p className="text-2xl font-semibold mb-2 text-white">{budget.category}</p>
      <p className="text-gray-400 mb-4">
        Amount Allocated: {budget.amountAllocated}
      </p>
      {/* Placeholder image, replace with actual images */}
      <div className="flex space-x-4">
        <button onClick={handleViewBudget} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
          View Budget
        </button>
        <button onClick={handleDeleteBudget} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300">
          Delete Budget
        </button>
      </div>
    </div>
  );
};

export default BudgetTemplate;
