import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import Button from '../components/Button.jsx'
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import {toast} from 'react-toastify'
import { useContext } from 'react';

function VerifyEmail() {
 
  axios.defaults.withCredentials = true
  const {backendUrl, isLoggedIn, userData, getUserData} = useContext(AppContent)
  

  const navigate = useNavigate();
  const inputRefs = React.useRef([])

  const handleInput = (e, index) =>{
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) =>{
    if(e.key === 'Backspace' && e.target.value === '' && index > 0){
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) =>{
    const paste = e.clipboardData.getData('text').split('')
    paste.forEach((char, index) =>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char;
      }
    })
  }

  const handleOtpSubmit = async (e) =>{
    try{
      e.preventDefault();
      const otp = inputRefs.current.map(e => e.value).join('')
      const {data} = await axios.post(backendUrl + '/verify-account', {otp})
      if(data.success){
        toast.success(data.success)
        getUserData()
        navigate('/')
      }else{
        toast.error(data.message)
      }

    }catch(error){
      toast.error(error.message)
    }
  }
   
  useEffect(() =>{
    isLoggedIn && userData && userData.isAccountVerified && navigate('/')
  }, [isLoggedIn, userData])

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
         <img onClick={() => navigate('/')} src={assets.logo} alt='logo' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
         <div className='bg-slate-800 p-10 rounded-lg shadow-lg w-full sm:w-96 text-sm text-indigo-300 '>
           <h2 className='text-3xl font-semibold text-white text-center mb-3'>Verify Your Email</h2>
           <p className='text-center text-sm mb-6'>Enter the 6 digit Otp code receieved in your mail</p>
           <form onSubmit={handleOtpSubmit}>
            <div className='flex justify-between mb-8' onPaste={handlePaste}>
                {Array(6).fill(0).map((_, index)=>(
                   <input type='text' maxLength='1' key={index} required className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-xl' 
                   ref={e => inputRefs.current[index]=e}
                   onInput={(e) =>handleInput(e, index)}
                   onKeyDown={(e) =>handleKeyDown(e, index)}
                   />
                ))}
            </div>
             
              <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer'>Submit</button>
              
           </form>
          </div>
    </div>
  )
}


export default VerifyEmail
