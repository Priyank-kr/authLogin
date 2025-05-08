import React from "react";

function Button({ children, login }) {
  return (
    <button onClick={login} 
    className="flex justify-center p-2 gap-2 px-6 rounded-full text-md text-indigo-950 border-b-2 border-gray-400 shadow-inner cursor-pointer bg-gradient-to-r from-indigo-100 to-indigo-100">
      {children}
    </button>
  );
}

export default Button;
