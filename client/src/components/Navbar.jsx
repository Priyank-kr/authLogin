import React from "react";
import { assets } from "../assets/assets";
import Button from "./Button";
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  const login = ()=>{
    navigate('/login')
  }

  return (
    <div className="flex flex-row justify-between">
      <img
        src={assets.logo}
        alt="logo"
        className="w-32 md:w-28 cursor-pointer"
      />
      <Button login={login}>
        Login <img src={assets.arrow_icon} />
      </Button>
    </div>
  );
}

export default Navbar;
