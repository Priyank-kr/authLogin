import React from 'react'
import { assets } from '../assets/assets'
import Button from './Button'

function Header() {
  return (
    <div className='flex flex-col items-center space-y-3'>
      <img src={assets.header_img} alt='header' className='w-64 h-64 md:w-48 md:h-48 rounded-full mb-6' />
      <h1 className='flex items-center text-3xl'>Hey Developer <img src={assets.hand_wave} alt='wave' className='w-8 aspect-square' /></h1>
      <h2 className='text-blue-950 text-5xl font-semibold leading-10'>Welcome to our app</h2>
      <p className='text-center mt-2 text-md '>Let's start a quick tour and we will have you up and <br /> running in not ime!</p>
      <Button>Get Started</Button>
    </div>
  )
}

export default Header
