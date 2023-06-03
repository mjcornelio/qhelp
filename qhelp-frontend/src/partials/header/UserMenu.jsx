import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useValue } from "../../../context/ContextProvider";

function UserMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });
  const {
    state: { currentUser },
    dispatch,
  } = useValue();

  const handleLogout = () => {
    dispatch({ type: "UPDATE_USER", payload: "" });
    localStorage.setItem("user", null);
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-green-100 rounded-full dark:bg-yellow-600 mr-2 ring-2 ring-gray-300">
          <span className="font-medium text-gray-600 dark:text-gray-300">
            {currentUser.name[0]}
            {currentUser.name.split(" ").length > 1 &&
              currentUser.name.split(" ")[1][0]}
          </span>
        </div>
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm font-medium group-hover:text-slate-800">
            {currentUser.name}
          </span>
          <svg
            className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>
      {dropdownOpen && (
        <div
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
          className="origin-top-right z-10 absolute top-full right-0 min-w-44 bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200">
            <div className="font-medium text-slate-800 capitalize">
              {currentUser.name}
            </div>
            <div className="text-xs text-slate-500 italic capitalize">
              {currentUser.user_role}
            </div>
          </div>
          <ul>
            <li>
              <Link
                className="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3"
                to="/"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Settings
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3"
                to="/auth/login"
                onClick={handleLogout}
              >
                Sign Out
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
