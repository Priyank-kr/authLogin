import React, { useState } from 'react'
import { assets } from '../assets/assets'

function Login() {
    const [state, setState] = useState('Sign Up')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleFormSubmit = (e) =>{
        e.preventDefault();
    }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img src={assets.logo} alt='logo' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      <div className='bg-slate-800 p-10 rounded-lg shadow-lg w-full sm:w-96 text-sm text-indigo-300'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create account' : 'Login'}</h2>
        <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>

        <form onSubmit={handleFormSubmit}>
        {state === 'Sign Up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                <img src={assets.person_icon} alt='person' />
                <input type='text' placeholder='Full Name' name='name' value={name} onChange={(e) => setName(e.target.value)} required className='p-1 px-3 outline-none bg-transparent text-white placeholder:text-white placeholder:opacity-40'/>
            </div>
        )}

            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                <img src={assets.mail_icon} alt='person' />
                <input type='email' placeholder='Email id' name='email' value={email} onChange={(e) => setEmail(e.target.value)} required className='p-1 px-3 outline-none bg-transparent text-white placeholder:text-white placeholder:opacity-40'/>
            </div>

            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                <img src={assets.lock_icon} alt='person' />
                <input type='password' placeholder='Password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} required className='p-1 px-3 outline-none bg-transparent text-white placeholder:text-white placeholder:opacity-40'/>
            </div>

        {state === 'Login' &&
            <p className='mb-4 text-sm  text-indigo-300 hover:text-indigo-400 transition-all duration-200 cursor-pointer'>Forgot password?</p>
        }
            <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900'>{state}</button>
        </form>

    {state === 'Sign Up' ? (
        <p className='mt-4 text-center text-gray-400'>Already have an account?{' '}
            <span className='text-indigo-400 cursor-pointer border-b-2 border-indigo-400 pb-0.25' onClick={() => setState('Login')}>Login here</span>
        </p>
    ):(

        <p className='mt-4 text-center text-gray-400'>Don't have an account?{' '}
            <span className='text-indigo-400 cursor-pointer border-b-2 border-indigo-400 pb-0.25' onClick={() => setState('Sign Up')}>Sign Up</span>
        </p>
    )}
      </div>
    </div>
  )
}

export default Login
