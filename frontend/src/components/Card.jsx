import React from "react";

const Card = ({ title, description, icon }) => {
  return (
    <div className="relative w-full group transform transition-all duration-300 hover:scale-110 hover:z-10">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>

      {/* Main card content */}
      <div className="relative backdrop-blur-sm bg-black/30 p-6 rounded-lg clip-corner transition-all duration-300 group-hover:shadow-2xl">
        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-300">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <button className="flex items-center text-white hover:text-gray-300 transition-colors text-sm tracking-wider">
            <span className="mr-2">EXPLORE MORE</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
