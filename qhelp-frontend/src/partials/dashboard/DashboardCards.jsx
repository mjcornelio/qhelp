import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function DashboardCards({ to, title, icon }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  return (
    <NavLink
      to={to}
      className="flex flex-col col-span-full sm:col-span-6 h-60 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200 cursor-pointer items-center hover:shadow-none p-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center flex-col my-auto  relative z-0">
        <object
          data={icon}
          aria-label="illustration"
          className={`m-0 w-1/4  transition-all pointer-events-none ${
            isHovered && "scale-110 rotate-12"
          }`}
        />
        <p
          className={`text-slate-800 mt-5 font-semibold uppercase transition-all ${
            isHovered && "text-xl"
          }`}
        >
          {title}
        </p>
      </div>
    </NavLink>
  );
}

export default DashboardCards;
