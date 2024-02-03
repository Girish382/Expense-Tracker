import React, { useRef, useState } from "react";
import Header from "./Header";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import image from "../Images/dollar.jpg"; 
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useNavigate } from "react-router-dom";

const toastObjectParameter = {
  position: "top-center",
  autoClose: 3000, // Set the auto-close time in milliseconds
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const Signup = ({isAuthenticated,setIsAuthenticated}) => {

  const navigate = useNavigate();


  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null); 

  const [isSignUp, setisSignUp] = useState(true);

  const handletoggleForm = () => {
    setisSignUp(!isSignUp);
  };

  const handleSignButton = async () => {
    let user = {};
    if (isSignUp) {
      user = {
        name: name.current.value,
        email: email.current.value,
        password: password.current.value,
      };

      try {
        const response = await fetch(`${process.env.REACT_APP_Server_URL}user/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        const userData = await response.json();
        if (userData.success) {
          toast.success(userData.message, toastObjectParameter);
        } else {
          toast.error(userData.message, toastObjectParameter);
        }

        name.current.value = "";
        email.current.value = "";
        password.current.value = "";
        setisSignUp(!isSignUp);
      } catch (error) {
        console.log(error);
        toast.error(error.message, toastObjectParameter);
      }
    } else {
      user = { email: email.current.value, password: password.current.value };
      try {
        const response = await fetch(`${process.env.REACT_APP_Server_URL}user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
        const userData = await response.json();

        console.log(userData);
        // setCookie("token", userData.token, {path:'/'});
        Cookies.set("token", userData.token, { expires: 7 });
        setIsAuthenticated(userData.token)
        //local storage
        localStorage.setItem('token',userData.token)

        email.current.value = "";
        password.current.value = "";
        if (userData.success) {
          toast.success(userData.message, toastObjectParameter);
        } else {
          toast.error(userData.message, toastObjectParameter);
        }
        navigate("/user");
      } catch (error) {
        console.log(error);
        toast.error(error.message, {
          position: "top-center",
          autoClose: 3000, // Set the auto-close time in milliseconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  
  if(isAuthenticated){
    return <Navigate to={'/user'}/>
   }
  return (
    <div className="flex-col min-h-screen relative">
     
    <div className="flex flex-col md:flex-row justify-center items-center px-4 mt-8 md:mt-16 lg:mt-20 ">
      <form className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 shadow-2xl p-6 bg-gray-800 text-white rounded-lg space-y-4">
        <p className="text-center text-2xl font-bold">
          {isSignUp ? "Sign Up" : "Sign In"}
        </p>
        {isSignUp && (
          <div className="w-full p-2">
            <input
              ref={name}
              className="w-full p-2 rounded-lg outline-none bg-gray-600 text-white"
              type="text"
              placeholder="Enter Your Name"
            />
          </div>
        )}
        <div className="w-full p-2">
          <input
            ref={email}
            className="w-full p-2 rounded-lg outline-none bg-gray-600 text-white"
            type="email"
            placeholder="abc@gmail.com"
          />
        </div>
        <div className="w-full p-2">
          <input
            ref={password}
            className="w-full p-2 rounded-lg outline-none bg-gray-600 text-white"
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="w-full">
          <input
            onClick={handleSignButton}
            type="button"
            className="w-full py-2 px-4 bg-[#32f29c] rounded-lg text-black font-bold text-xl cursor-pointer hover:scale-95"
            value={isSignUp ? "Sign Up" : "Sign In"}
          />
        </div>
        <p className="p-2 text-center cursor-pointer" onClick={handletoggleForm}>
          {!isSignUp ? "New to PennyTrack? Sign Up" : "Already Registered? Sign In"}
        </p>
      </form>
    </div>
  </div>
  
  
  );
};

export default Signup;
