import React from "react";

function Button({ children }) {
  return (
    <button className="flex justify-center p-2 gap-2 px-6 rounded-full text-md text-gray-800 border border-gray-400 hover:bg-gray-300 cursor-pointer transition-all duration-200">
      {children}
    </button>
  );
}

export default Button;
