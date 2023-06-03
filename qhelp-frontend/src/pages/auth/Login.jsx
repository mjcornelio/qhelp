import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

import { useValue } from "../../../context/ContextProvider";
import { CONFIG } from "../../../config/config";

function Login() {
  const {
    state: { currentUser },
    dispatch,
  } = useValue();
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState();
  const [pageLoading, setPageLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setPageLoading(true);
    const user = {
      username: e.target.username.value,
      password: e.target.password.value,
    };
    if (user.username.length === 0 || user.password.length === 0) {
      setPageLoading(false);
      setAlert("Fill out all the required fields");
      return setTimeout(() => {
        setAlert("");
      }, 5000);
    } else {
      fetch(CONFIG.API_URL + "/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(user),
      })
        .then(async function (response) {
          const res = await response.json();
          if (res.success) {
            localStorage.setItem("user", JSON.stringify(res.user));
            dispatch({
              type: "UPDATE_USER",
              payload: JSON.parse(localStorage.getItem("user")),
            });
            navigate("/");
          } else {
            setAlert(res.msg);
            setTimeout(() => {
              setAlert("");
            }, 5000);
            setPageLoading(false);
          }
        })
        .catch(function (error) {
          setAlert("Something went wrong");
          setTimeout(() => {
            setAlert("");
          }, 5000);
          setPageLoading(false);
        });
    }
  };
  return (
    <div>
      <div className="lg:flex">
        <div className="lg:w-1/2 xl:max-w-screen-sm">
          <div className="py-5 bg-indigo-100 lg:bg-white flex justify-center lg:justify-start lg:px-12">
            <div className="cursor-pointer flex items-center">
              <div>
                <object
                  data="/illustrations/logo.svg"
                  aria-label="illustration"
                  className={`m-0 w-20  transition-all pointer-events-none `}
                />
              </div>
              <div className="text-2xl text-indigo-800 tracking-wide ml-1 font-semibold">
                QHelp
              </div>
            </div>
          </div>

          <div className="mt-8 px-12 sm:px-24 md:px-48 lg:px-12 lg:mt-8 xl:px-24 xl:max-w-2xl relative">
            <div
              className={`mb-3 inline-flex w-full items-center rounded-lg bg-red-200 py-3 px-6 text-base text-red-800 transition-all ${
                alert ? "opacity-100" : "opacity-0"
              }`}
              role="alert"
            >
              <span className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              {alert}
            </div>

            <h2
              className="text-center text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl
                xl:text-bold"
            >
              Log in
            </h2>

            <div className="mt-5">
              <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <div>
                  <div className="text-sm font-bold text-gray-700 tracking-wide">
                    Username
                  </div>
                  <input
                    className="w-full text-slate-500 text-md py-3 border-2 rounded-lg border-gray-300 hover:outline-none hover:border-indigo-500 focus:outline-none focus:border-indigo-500 px-3"
                    type="text"
                    placeholder="Enter your username"
                    id="username"
                  />
                </div>
                <div className="mt-8 ">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-bold text-gray-700 tracking-wide">
                      Password
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      className="w-full py-3 border-2 rounded-lg border-gray-300 hover:outline-none hover:border-indigo-500 focus:outline-none focus:border-indigo-500 px-3 text-slate-500 text-md"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      id="password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-2xl text-slate-500 absolute inset-y-0 right-4 "
                    >
                      {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </button>
                  </div>
                </div>
                <div className="mt-10">
                  <button
                    className="bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide
                            font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                            shadow-lg"
                    type="submit"
                  >
                    {pageLoading ? (
                      <div
                        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                      ></div>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center bg-indigo-100 flex-1 h-screen">
          <div className="max-w-xl transform duration-200 hover:scale-110 cursor-pointer">
            <object
              data="/illustrations/Login.svg"
              aria-label="illustration"
              className={`m-0 w-full  transition-all pointer-events-none `}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
