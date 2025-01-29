import React from "react";
import { Sun, Moon, LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";
const Navbar = ({
  isDark,
  toggleTheme,
  isLoggedIn,
  username = "user",
  data,
}) => {
  const navigat = useNavigate();
  const navigateTologin = () => {
    navigat("/login");
  };

  const doLogOut = async () => {
    const token = localStorage.getItem("accessToken");
    console.log(token);
    await axios.post(
      `${process.env.REACT_APP_BASE_BACKEND_URL}/api/v1/auth/logout`,
      {}, // empty body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    localStorage.removeItem("accessToken");
    navigateTologin();
  };

  return (
    <nav className="sticky top-0 backdrop-blur-sm bg-black/30 border-b border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-white text-lg font-medium">
              Hello,{data?.data?.validateUser?.userName}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-white" />
              )}
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white">
              {data ? (
                <>
                  <div onClick={doLogOut}>
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </div>
                </>
              ) : (
                <>
                  <div onClick={navigateTologin}>
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </div>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
