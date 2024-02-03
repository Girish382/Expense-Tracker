import React from "react";
import image from "../Images/unnamed.webp";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Header = ({ setIsAuthenticated, isAuthenticated }) => {
  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    toast.info("Logged out");
    setIsAuthenticated(null);
  };

  return (
    <div className="w-full bg-black shadow-2xl p-4 md:p-2">
      <div className="flex justify-between items-center">
        <Link to={"/user"}>
          <div className="flex items-center cursor-pointer">
            <img className="w-12 md:w-14 px-1" src={image} alt="logo" />
            <p className="text-xl md:text-3xl font-medium text-white ml-2 md:ml-4">
              PennyTrack
            </p>
          </div>
        </Link>
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="text-white focus:outline-none hover:scale-95 ease-in"
          >
            <FaUserCircle className="w-28 h-10" />
            <span className="text-sm">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
