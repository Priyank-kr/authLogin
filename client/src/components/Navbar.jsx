import React from "react";
import { assets } from "../assets/assets";
import Button from "./Button";
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import { useContext} from 'react'
import axios from "axios";
import { toast } from "react-toastify";

function Navbar() {

  const navigate = useNavigate()
  const {userData, backendUrl, setUserData, setIsLoggedIn} = useContext(AppContent)
  
  const logout = async () =>{

    try{
      axios.defaults.withCredentials = true
      const {data} = await axios.post(backendUrl + '/logout')

      data.success && setIsLoggedIn(false)
      data.success && setUserData(false)
      navigate('/')
    }catch(error){
      toast.error(error.message)
    }
  }

  const verifyEmail = async () =>{

    try{
      axios.defaults.withCredentials = true
      const {data} = await axios.post(backendUrl + '/send-verify-otp')
      if(data.success){
        navigate('/email-verify')
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }

    }catch(error){
      toast.error(error.message)
    }
  }

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
      {userData ? (<div className="w-10 h-10 rounded-full bg-black text-white text-md text-center flex justify-center items-center  relative group">{userData.name[0].toUpperCase()}
        <div className="absolute py-2 hidden group-hover:block -top-2 left-10 z-10">
          <ul className="list-none m-0 w-30 text-md">
            {!userData.isAccountVerified &&  <li onClick={verifyEmail} className="py-3 bg-gradient-to-r from-indigo-400 to-indigo-800 text-white cursor-pointer">Verify Email</li>}
           
            <li onClick={logout} className="py-3  bg-gradient-to-r from-indigo-400 to-indigo-800 text-white cursor-pointer pr-10">Logout</li>
          </ul>
        </div>
      </div>) :
      <Button login={login}>
        Login <img src={assets.arrow_icon} />
      </Button>
}
    </div>
  );
}

export default Navbar;
