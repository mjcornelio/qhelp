import React, { useEffect, useState } from "react";
import { useValue } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";

import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import { CONFIG } from "../../config/config";
import { MdOutlineArrowBackIos } from "react-icons/md";

function Dashboard() {
  const {
    state: { currentUser },
  } = useValue();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [agents, setAgents] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(CONFIG.API_URL + "/api/agents", {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    })
      .then(async function (response) {
        const res = await response.json();
        if (res.success) {
          setAgents(res.agents);
        } else {
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const ticket = {
      user: currentUser.name,
      from: e.target.name.value,
      subject: e.target.subject.value,
      agent: e.target.agent.value,
      description: e.target.description.value,
      date: new Date(),
      updatedAt: new Date(),
      state: "open",
    };
    fetch(CONFIG.API_URL + "/api/create-ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(ticket),
    })
      .then(async function (response) {
        const res = await response.json();
        if (res.success) {
          setAlert(true);
          setMessage({ success: true, id: res.id, message: res.message });
          setLoading(false);
        } else {
          setAlert(true);
          setMessage({ success: false, message: res.message });
          setLoading(false);
        }
      })
      .catch(function (error) {
        setAlert(true);
        setMessage({
          success: false,
          message: "Something went wrong! Please try again later",
        });
        setLoading(false);
      });
  };
  const handleClick = () => {
    if (message.success) {
      navigate("/");
    } else {
      setAlert(false);
    }
  };
  return (
    <div className="flex h-screen overflow-hidden w-screen">
      {alert && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none transition-all">
            <div
              className="relative w-auto my-6 mx-auto"
              style={{ width: "400px" }}
            >
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}

                <div className="flex items-center flex flex-col pt-5">
                  <object
                    data={`/illustrations/${
                      message.success
                        ? "undraw_ticket_sent.svg"
                        : "undraw_ticket_error.svg"
                    }`}
                    aria-label="illustration"
                    className="m-0 w-1/2 p-5"
                  />
                  <h3
                    className={`${
                      message.success ? "text-indigo-600" : "text-red-500"
                    } font-bold text-xl`}
                  >
                    {message.success ? "Success" : "Error"}
                  </h3>
                  <p className="text-center px-10 mt-2">
                    {message.success
                      ? `Ticket has been sent successfully! Your ticket id is #${message.id} `
                      : message.message}
                  </p>
                </div>
                <div className="flex items-center justify-center p-6  rounded-b">
                  <button
                    className={`text-sky-100  px-4 py-2 rounded-lg 
                        font-semibold text-sm ${
                          message.success ? "bg-indigo-600" : "bg-red-500"
                        } hover:opacity-80  transition-all disabled:opacity-50`}
                    type="button"
                    onClick={handleClick}
                  >
                    {message.success ? "Go Back to Home" : "Try Again"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
      <div
        className="flex h-screen overflow-hidden mx-auto w-screen"
        style={{ maxWidth: "2000px " }}
      >
        {currentUser.user_role === "admin" && (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden  ">
          {/*  Site header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-5xl min-w-2xl mx-auto relative">
              <div
                className="absolute top-8  -left-10 bg-slate-200 text-slate-500 p-4 rounded-3xl cursor-pointer hover:bg-slate-300 hover:text-slate-600"
                title="Back"
                onClick={() => navigate(-1)}
              >
                <MdOutlineArrowBackIos />
              </div>
              <div className="col-span-full  bg-white shadow-lg rounded-sm border border-slate-200">
                <header className="px-5 py-4 border-b border-slate-100 flex justify-between">
                  <h2 className="font-semibold text-slate-800">New Ticket</h2>
                  <p className="text-sm text-slate-600">
                    {new Date().getMonth() + 1}/{new Date().getDate()}/
                    {new Date().getFullYear()}
                  </p>
                </header>
                <div className=" items-center mt-8 lg:px-20 md:p-0">
                  <form autoComplete="off" onSubmit={handleSubmit}>
                    <div className="flex items-center justify-between relative">
                      <label
                        htmlFor="name"
                        className="text-slate-800 font-semibold text-sm"
                      >
                        Name:
                      </label>
                      <input
                        required="required"
                        onInvalid={(F) =>
                          F.target.setCustomValidity("Enter Your Name")
                        }
                        onInput={(F) => F.target.setCustomValidity("")}
                        type="text"
                        id="name"
                        className={`block py-1  w-3/4 text-sm border-2 border-sky-500 rounded-lg focus:ring-sky-500 focus:border-sky-500 resize-none ${
                          clicked && "invalid:border-red-500"
                        }`}
                      ></input>
                    </div>
                    <div className="flex items-center justify-between mt-5">
                      <label
                        htmlFor="subject"
                        className="text-slate-800 font-semibold text-sm"
                      >
                        Subject:
                      </label>
                      <input
                        required
                        type="text"
                        id="subject"
                        className={`block py-1 w-3/4  text-sm border-2 border-sky-500 rounded-lg focus:ring-sky-500 focus:border-sky-500 resize-none ${
                          clicked && "invalid:border-red-500"
                        }`}
                        onInvalid={(F) =>
                          F.target.setCustomValidity("This Field is required")
                        }
                        onInput={(F) => F.target.setCustomValidity("")}
                      ></input>
                    </div>
                    <div className="flex items-center justify-between mt-5">
                      <label
                        htmlFor="agent"
                        className="text-slate-800 font-semibold text-sm"
                      >
                        Agent:
                      </label>
                      <select
                        id="agent"
                        className="block py-1 w-3/4  text-sm border-2 border-sky-500 rounded-lg focus:ring-sky-500 focus:border-sky-500 resize-none "
                      >
                        <option defaultValue></option>
                        {agents.map((agent) => (
                          <option key={agent.id} value={agent.name}>
                            {agent.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-start justify-between mt-5">
                      <label
                        htmlFor="subject"
                        className="text-slate-800 font-semibold text-sm"
                      >
                        Description:
                      </label>
                      <textarea
                        required
                        id="description"
                        rows="10"
                        className={`block py-1 w-3/4  text-sm border-2 border-sky-500 rounded-lg focus:ring-sky-500 focus:border-sky-500 resize-none ${
                          clicked && "invalid:border-red-500"
                        }`}
                        onInvalid={(F) =>
                          F.target.setCustomValidity("This Field is required")
                        }
                        onInput={(F) => F.target.setCustomValidity("")}
                      ></textarea>
                    </div>

                    <div className="mt-2 flex justify-end">
                      <button
                        className={`bg-indigo-500 text-gray-100 px-4 py-2 rounded-lg tracking-wide
                            font-normal text-sm focus:outline-none focus:shadow-outline hover:bg-indigo-600
                            shadow-lg disabled:opacity-50 disabled:hover:bg-indigo-500 mb-10 mt-5`}
                        type="submit"
                        onClick={() => setClicked(true)}
                      >
                        {loading ? (
                          <div
                            className=" h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] "
                            role="status"
                          ></div>
                        ) : (
                          "Send"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
