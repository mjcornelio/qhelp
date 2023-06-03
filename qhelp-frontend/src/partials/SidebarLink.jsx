import React from "react";
import { NavLink } from "react-router-dom";

function SidebarLink({ to, title, pathname, icons }) {
  return (
    <NavLink
      end
      to={to}
      className={`block text-slate-200 truncate transition duration-150 hover:bg-slate-700 px-3 py-3 ${
        pathname === to
          ? " bg-slate-700 hover:text-slate-200 "
          : "hover:text-white bg-none"
      } `}
    >
      <div className="flex items-center">
        <i
          className={`fill-current text-2xl ${
            pathname.includes({ title }) ? "text-indigo-500" : "text-slate-300"
          }`}
        >
          {icons}
        </i>

        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 capitalize">
          {title}
        </span>
      </div>
    </NavLink>
  );
}

export default SidebarLink;
