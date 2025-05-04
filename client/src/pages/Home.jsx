import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

function Home() {
  return (
    <div className='container mx-auto p-4 flex flex-col space-y-40 md:space-y-48 bg-[url("/bg_img.png")] bg-cover bg-center'>
      <Navbar />
      <Header />
    </div>
  )
}

export default Home


