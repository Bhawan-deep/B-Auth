import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { UserContext } from '../contexts/context';

function Header() {
  const { userdata } = useContext(UserContext);

  return (
    <div className="flex flex-col items-center text-center gap-6 px-4 py-12">
      <img
        src={assets.imagebg}
        alt="Header"
        className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain"
      />

      <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-medium text-gray-800">
        Hi {userdata ? userdata.name : "Developer"}!
        <img
          src={assets.hand_wave}
          alt="wave"
          className="h-5 w-5 sm:h-6 sm:w-6"
        />
      </h1>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black">
        Welcome to our App
      </h1>

      <p className="max-w-md sm:max-w-lg text-gray-600 text-sm sm:text-base">
        Welcome aboard! Explore features, build awesome things, and stay productive.
      </p>

      <button className="flex items-center border gap-2 text-black text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-gray-200 transition duration-200">
        Get Started
        <img src={assets.arrow_icon} alt="Arrow" className="w-4 h-4" />
      </button>
    </div>
  );
}

export default Header;

