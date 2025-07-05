import React from 'react'

import Navbar from '../components/navbar'
import Header from '../components/Header'
export default function Home() {
  return (
 <div className='min-h-screen flex flex-col bg-gray-50 text-gray-900 bg-[url("bg_img.png")] bg-cover bg-center'>
      <Navbar/>
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-32 mt-9">
     <Header/>
      </main>
 

    </div>
  )
}
