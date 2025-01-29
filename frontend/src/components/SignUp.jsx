import React, { useState } from "react";
import { useNavigate } from "react-router";
import { LoginBg } from "../ui";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    userName: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup Form Data:", formData);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/api/v1/auth/register`,
        formData
      );
      console.log(res);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
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
            Sign Up
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70"
                onChange={handleChange}
                value={formData.firstName}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70"
                onChange={handleChange}
                value={formData.lastName}
                required
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70"
              onChange={handleChange}
              value={formData.email}
              required
            />
            <input
              type="text"
              name="userName"
              placeholder="userName"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70"
              onChange={handleChange}
              value={formData.userName}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70"
              onChange={handleChange}
              value={formData.password}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70"
              onChange={handleChange}
              value={formData.phone}
              required
            />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-white/20 hover:bg-white/30 text-white rounded-lg transition duration-200 font-semibold"
            >
              Sign Up
            </button>
          </form>

          {/* New Login Section */}
          <div className="mt-6 text-center">
            <p className="text-white text-sm">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-white underline hover:text-white/80 font-medium transition duration-200"
              >
                Login Here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
