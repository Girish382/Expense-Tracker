import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./components/Signup";
import User from "./components/User";
import Budget from "./components/Budget";
import { useState } from "react";
import Cookies from "js-cookie";
import Header from "./components/Header";
import Protected from "./components/Protected";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(Cookies.get("token"));

  return (
    <>
      <Router>
        <Header
          setIsAuthenticated={setIsAuthenticated}
          isAuthenticated={isAuthenticated}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Signup
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/user"
            element={
              <Protected isAuthenticated={isAuthenticated}>
                <User />
              </Protected>
            }
          />
          <Route
            path="/budget/:id"
            element={
              <Protected isAuthenticated={isAuthenticated}>
                <Budget />
              </Protected>
            }
          />
          <Route path="*" element={<div>Invalid link</div>} />
        </Routes>
        <ToastContainer />
      </Router>
    </>
  );
}

export default App;
