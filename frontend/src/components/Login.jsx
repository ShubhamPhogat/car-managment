import React, { useState } from "react";
import { LoginBg } from "../ui";
import axios from "axios";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login Form Data:", formData);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/api/v1/auth/login`,
        formData
      );
      const userdata = res.data;
      console.log(res.data.data.accessToken);
      localStorage.setItem("accessToken", res.data.data.accessToken);
      navigate("/main", { state: { userdata: res.data } });
    } catch (error) {
      console.error("Login error:", error);
      // You might want to add error handling here
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${LoginBg})` }}
      />
      <div className="relative w-full max-w-md p-8 mx-4">
        <div className="backdrop-blur-sm bg-white/30 rounded-lg shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="userName"
                placeholder="userName"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70"
                onChange={handleChange}
                value={formData.userName}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70"
                onChange={handleChange}
                value={formData.password}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-white/20 hover:bg-white/30 text-white rounded-lg transition duration-200 font-semibold"
            >
              Login
            </button>
          </form>

          {/* New Sign Up Section */}
          <div className="mt-6 text-center">
            <p className="text-white text-sm">
              New to the platform?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-white underline hover:text-white/80 font-medium transition duration-200"
              >
                Sign Up Here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
