import React, { useState } from "react";

function Cards({ name, role, src, title }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="relative flex items-center flex-col">
      <div
        className="mb-2 overflow-hidden  shadow-lg  h-60 w-60 rounded-full hover:rounded-md hover:transition-all "
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {src ? (
          <img
            src={src}
            alt="Image"
            className="object-cover object-center w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center text-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-slate-100">
            <p className=" font-bold text-3xl ">{title}</p>
          </div>
        )}
      </div>

      <div
        className={`flex flex-col items-center justify-center -translate-y-10 opacity-0 transition-all ${
          isHovered && "translate-y-1 opacity-100"
        }`}
      >
        <div className="font-bold text-indigo-500 md:text-lg">{name}</div>
        <p className="mb-3 text-sm text-gray-500 md:text-base md:mb-4">
          {role}
        </p>
      </div>
    </div>
  );
}

export default Cards;
