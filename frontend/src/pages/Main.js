import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { HomeBg } from "../ui";
import { useLocation, useNavigate } from "react-router";

const Main = () => {
  const location = useLocation();
  const { userdata } = location?.state;
  const [isDark, setIsDark] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    console.log(process.env.REACT_APP_BASE_BACKEND_URL);
    if (!userdata) {
      navigate("/login");
    }
  }, []);
  function navigateToCollection() {
    navigate("/carCollection", { state: { userdata: userdata } });
  }
  function navigateToAddCar() {
    navigate("/addCar", { state: { userdata: userdata } });
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <style>
        {`
          .clip-corner {
            clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%, 0 0);
          }
          
          @keyframes gradient-xy {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .animate-gradient-xy {
            animation: gradient-xy 3s ease infinite;
            background-size: 200% 200%;
          }
          
          .bg-image-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            z-index: 0;
          }
          
          .bg-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
          }
        `}
      </style>

      <Navbar
        isDark={isDark}
        toggleTheme={() => setIsDark(!isDark)}
        isLoggedIn={isLoggedIn}
        data={userdata}
      />

      <div className="relative">
        {/* Updated Background Image Container */}
        <div className="bg-image-container">
          <img src={HomeBg} alt="Background" className="opacity-90" />
        </div>

        {/* Content Container */}
        <div className="relative min-h-[calc(100vh-64px)] z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-end space-y-6 md:space-y-0 md:space-x-6">
              <div onClick={navigateToCollection} className="w-full md:w-1/4">
                <Card
                  title="Get Your Collection"
                  description="Lets have quick view to your car collection ."
                  icon={<span className="text-white text-2xl">💬</span>}
                />
              </div>
              <div onClick={navigateToAddCar} className="w-full md:w-1/4">
                <Card
                  title="Add to your collection"
                  description="Drop a new luxi item in your car collection"
                  icon={<span className="text-white text-2xl">🚗</span>}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Main;
