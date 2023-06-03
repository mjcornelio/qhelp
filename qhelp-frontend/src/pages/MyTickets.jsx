import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { useValue } from "../../context/ContextProvider";

// API Config URL
import { CONFIG } from "../../config/config";
import {
  MdRefresh,
  MdSearch,
  MdCheck,
  MdKeyboardArrowDown,
  MdOutlineCalendarMonth,
  MdKeyboardArrowRight,
  MdKeyboardArrowLeft,
} from "react-icons/md";

function MyTickets() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [count, setCount] = useState(0);
  const [pageLoading, setPageLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const {
    state: { currentUser },
  } = useValue();
  const navigate = useNavigate();

  const fetchOpenTickets = async () => {
    setPageLoading(true);
    fetch(
      CONFIG.API_URL + `/api/mytickets/${currentUser.name}?offset=${offset}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    )
      .then(async function (response) {
        const res = await response.json();
        if (res.success) {
          setTickets(res.tickets);
          setCount(res.count);
          setPageLoading(false);
        } else {
        }
      })
      .catch(function (error) {
        console.log(error);
        setPageLoading(false);
      });
  };
  const handleRefresh = () => {
    setOffset(0);
    fetchOpenTickets();
  };

  useEffect(() => {
    fetchOpenTickets();
  }, [offset]);

  const handleSearch = (e) => {
    e.preventDefault();
    const search = {
      data: e.target.search.value,
    };
    setPageLoading(true);
    const fetchSearchTickets = async () => {
      fetch(CONFIG.API_URL + `/api/search/mytickets/${currentUser.name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(search),
      })
        .then(async function (response) {
          const res = await response.json();
          if (res.success) {
            setTickets(res.tickets);
            setCount(res.count);
            setPageLoading(false);
          } else {
            setPageLoading(false);
          }
        })
        .catch(function (error) {
          console.log(error);
          setPageLoading(false);
        });
    };
    fetchSearchTickets();
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <>
        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/*  Site header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="col-span-full  bg-white shadow-lg rounded-sm border border-slate-200">
                <header className="px-5 py-4 border-b border-slate-100 flex justify-between">
                  <h2 className="font-semibold text-slate-800">All Tickets</h2>
                  <p className="text-sm text-slate-600">
                    As of {new Date().getMonth() + 1}/{new Date().getDate()}/
                    {new Date().getFullYear()}
                  </p>
                </header>
                <div className="p-3 ">
                  <div className="mb-2 font-normal text-sm text-center flex justify-center items-center">
                    <button
                      onClick={() => setOffset(offset - 10)}
                      title="Prev"
                      className={`${offset === 0 ? "hidden" : "block"}`}
                    >
                      <MdKeyboardArrowLeft className="text-xl mr-2 hover:bg-slate-200 rounded-lg" />
                    </button>
                    Showing {offset + 10} of {count && count} results
                    <button
                      onClick={() => setOffset(offset + 10)}
                      title="Next"
                      className={`${offset > count ? "hidden" : "block"}`}
                    >
                      <MdKeyboardArrowRight className="text-xl ml-2 hover:bg-slate-200 rounded-lg" />
                    </button>
                  </div>
                  <div className="flex justify-between relative px-10">
                    <div>
                      <span className="absolute ml-1 text-slate-400">
                        <MdSearch className="absolute  left-2 text-3xl text-3xl top-1.5 left-9.5 pointer-events-none" />
                      </span>
                      <form
                        autoComplete="off"
                        noValidate
                        onSubmit={handleSearch}
                      >
                        <input
                          title="Search"
                          type="search"
                          id="search"
                          className={`block bg-none p-4 py-2 pl-10 mb-2 text-slate-500 text-sm border-2 border-sky-100 rounded-lg  focus:ring-sky-500 focus:border-sky-500 hover:ring-sky-500 hover:border-sky-500 placeholder:text-slate-400 w-10 hover:w-60 focus:w-60 transition-all`}
                          placeholder="Search"
                          required
                        />
                      </form>
                    </div>
                    <div className="flex items-center">
                      <MdRefresh
                        className="cursor-pointer z-10 text-3xl text-slate-400 hover:animate-spin hover:text-slate-300"
                        title="Refresh"
                        onClick={handleRefresh}
                      />
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    {pageLoading ? (
                      <div className="w-full flex justify-center items-center h-96">
                        <div className="w-full flex justify-center items-center h-96">
                          <div className="inline-block animate-bounce  rounded-full  w-3 h-3 bg-indigo-500 mx-2"></div>
                          <div
                            className="inline-block animate-bounce  rounded-full w-3 h-3 bg-indigo-500 mx-2"
                            style={{ animationDuration: "500ms" }}
                          ></div>
                          <div
                            className="inline-block animate-bounce rounded-full  w-3 h-3 bg-indigo-500 mx-2"
                            style={{ animationDuration: "800ms" }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <table className="table-fixed w-full">
                        {tickets.length == 0 ? (
                          <tbody className="text-sm font-medium divide-y divide-slate-100">
                            <tr>
                              <td className="p-5">
                                <div className="flex items-center flex flex-col">
                                  <object
                                    data="/illustrations/undraw_searching.svg"
                                    aria-label="illustration"
                                    className="m-0 w-1/6"
                                  />
                                  <p className="text-slate-800 mt-5">
                                    No Existing Tickets
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        ) : (
                          <>
                            {/* Table header */}
                            <thead className="text-xs uppercase text-slate-400 bg-slate-50 rounded-sm">
                              <tr>
                                <th className="p-2">
                                  <div className="font-semibold text-left">
                                    Ticket No.
                                  </div>
                                </th>
                                <th className="p-2">
                                  <div className="font-semibold text-left">
                                    User
                                  </div>
                                </th>
                                <th className="p-2">
                                  <div className="font-semibold text-left">
                                    Description
                                  </div>
                                </th>
                                <th className="p-2">
                                  <div className="font-semibold text-left">
                                    Agent
                                  </div>
                                </th>
                                <th className="p-2">
                                  <div className="font-semibold text-left">
                                    State
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            {/* Table body */}
                            <tbody className="text-sm font-medium divide-y divide-slate-100">
                              {/* Rows */}
                              {tickets.map((ticket) => (
                                <tr
                                  key={ticket.id}
                                  onClick={() =>
                                    navigate(`/ticket/${ticket.id}`)
                                  }
                                  className="cursor-pointer hover:bg-gray-200"
                                >
                                  <td className="p-2">
                                    <div className="text-left uppercase font-bold text-md pl-3">
                                      #{ticket.id}
                                    </div>
                                  </td>
                                  <td className="p-2">
                                    <div className="flex items-center">
                                      <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 mr-2">
                                        <span className="font-medium text-gray-600 dark:text-gray-300 uppercase">
                                          {ticket.user[0]}
                                          {ticket.user.split(" ").length > 2 &&
                                            ticket.user.split(" ")[1][0]}
                                        </span>
                                      </div>
                                      <div className="text-slate-800">
                                        {ticket.user}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-2">
                                    <div className="text-left uppercase font-bold text-lg">
                                      {ticket.subject}
                                    </div>
                                    <pre className="text-left truncate">
                                      {ticket.description}
                                    </pre>
                                  </td>
                                  <td className="p-2 flex items-center">
                                    <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 mr-2">
                                      <span className="font-medium text-gray-600 dark:text-gray-300 uppercase">
                                        {ticket.agent[0]}
                                        {ticket.agent.split(" ").length > 2 &&
                                          ticket.agent.split(" ")[1][0]}
                                      </span>
                                    </div>
                                    <div className="text-left">
                                      {ticket.agent}
                                    </div>
                                  </td>
                                  <td className="p-2">
                                    <div className="text-left capitalize inline">
                                      <span
                                        className={`text-slate-100 text-xs font-medium mr-2 px-3 py-2 rounded flex items-center justify-center w-20 text-center ${
                                          ticket.state === "closed"
                                            ? "bg-yellow-600"
                                            : "bg-yellow-700"
                                        }`}
                                      >
                                        {ticket.state === "closed" ? (
                                          <>
                                            <MdCheck className="text-lg mr-2" />{" "}
                                            {ticket.state}
                                          </>
                                        ) : (
                                          ticket.state
                                        )}
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </>
                        )}
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    </div>
  );
}

export default MyTickets;
