import React from "react";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <NavLink
      className="absolute bottom-2 right-10 bg-slate-800 opacity-60 py-2 px-5 text-slate-200 text-sm hover:opacity-100 transition-all rounded-lg"
      title="Meet the Team"
      to={"/our-team"}
    >
      Meet The Team
    </NavLink>
  );
}

export default Footer;
