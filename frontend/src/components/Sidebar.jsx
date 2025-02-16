import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/logo.svg";
import { navlinks } from "../constants/index.js";



const Icon = ({ imgUrl, name, isActive, onClick }) => (
  <div 
    className={`w-12 h-12 rounded-lg flex justify-center items-center 
      ${isActive === name ? "bg-[#2c2f32]" : ""} cursor-pointer`} 
    onClick={onClick}
  >
    <img src={imgUrl} alt={name} className={`w-1/2 h-1/2 ${isActive !== name ? "grayscale" : ""}`} />
  </div>
);


const Sidebar = () => {
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center sticky top-5 h-[93vh]">
      {/* Logo */}
      <Link to="/">
        <Icon imgUrl={logo} name="logo" />
      </Link>

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col items-center bg-[#1c1c24] rounded-2xl w-20 py-4 mt-12">
        {navlinks.map(({ name, imgUrl, link }) => (
          <Icon
            key={name}   // whenever you render a list of components dynamically using .map(), each element needs a unique key to help React efficiently update the UI.
            imgUrl={imgUrl}
            name={name}
            isActive={active}
            onClick={() => {
              setActive(name);
              navigate(link);
            }}
          />
        ))}
      </div>

    </div>
  );
};

export default Sidebar;
