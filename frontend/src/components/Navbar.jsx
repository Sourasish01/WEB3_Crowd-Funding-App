import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import profile from '../assets/profile.svg';
import logo from "../assets/logo.svg";
import { navlinks } from "../constants/index.js";
import menu from "../assets/menu.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">


      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
        <input type="text" placeholder="Search for campaigns" className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none" />
        
        <div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer">
          <img src alt="search" className="w-[15px] h-[15px] object-contain"/>
        </div>
      </div>

      {/* 💻 Desktop Navigation */}
      <div className="hidden sm:flex gap-4">
        <button
          type="button"
          className={`py-3 px-6 rounded-[10px] font-epilogue font-semibold text-[16px] text-white bg-[#1dc071]
          `}//${address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}`

          onClick = {() => navigate("create-campaign")}

          // onClick={() => (address ? navigate("create-campaign") : connect())}
        >
         {/* {address ? "Create Campaign" : "Connect Wallet"} */}
         Create Campaign
        </button>

        <Link to="/profile" className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex items-center justify-center">
          <img src={profile} alt="user" className="w-[60%] h-[60%]" />
        </Link>
      </div>

      {/* 📱 Mobile Navigation */}
<div className="sm:hidden flex items-center justify-between relative w-full">
  <img src={logo} alt="logo" className="w-[40px] h-[40px] bg-[#2c2f32] rounded-lg p-2" />
  <img
    src={menu}
    alt="menu"
    className="w-[34px] h-[34px] cursor-pointer"
    onClick={() => setToggleDrawer(!toggleDrawer)}
  />

  {/* 📂 Toggle Drawer for Mobile */}
  {toggleDrawer && (
    <div className="absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 transition-all duration-700">
      <ul>
        {navlinks.map(({ name, link, imgUrl }) => (
          <li
            key={name}
            className={`flex p-4 cursor-pointer ${
              isActive === name ? "bg-[#3a3a43]" : ""
            }`}
            onClick={() => {
              setIsActive(name);
              setToggleDrawer(false);
              navigate(link);
            }}
          >
            <img
              src={imgUrl}
              alt={name}
              className={`w-[24px] h-[24px] ${
                isActive === name ? "" : "grayscale"
              }`}
            />
            <p
              className={`ml-4 font-semibold text-[14px] ${
                isActive === name ? "text-[#1dc071]" : "text-[#808191]"
              }`}
            >
              {name}
            </p>
          </li>
        ))}
      </ul>

      {/* 🔘 Replaced CustomButton with normal button */}
      <div className="px-4">
        <button
          type="button"
          className={`w-full py-3 px-6 rounded-[10px] font-epilogue font-semibold text-[16px] text-white bg-[#1dc071] 
            `} //${address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}

          // onClick={() => (address ? navigate("create-campaign") : connect())}
        >
          { /*address ? "Create a campaign" : "Connect"*/ }
          Create a campaign
        </button>
      </div>
    </div>
  )}
</div>

      
    </div>  
  )};

export default Navbar