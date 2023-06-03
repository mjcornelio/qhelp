import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Knowledgebase() {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  return (
    <NavLink
      to={"/knowledgebase"}
      className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200 cursor-pointer items-center hover:shadow-none p-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex items-center flex-col my-auto cursor-pointer relative z-0"
        onClick={() => navigate("/create-ticket")}
      >
        <object
          data="/illustrations/undraw_knowledgebase.svg"
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
          Knowledgebase
        </p>
      </div>
    </NavLink>
  );
}

export default Knowledgebase;
