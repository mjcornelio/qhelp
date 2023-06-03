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

function Tickets() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showRootFilter, setShowRootFilter] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const {
    state: { currentUser },
  } = useValue();
  const navigate = useNavigate();

  const fetchOpenTickets = async () => {
    setPageLoading(true);
    fetch(CONFIG.API_URL + `/api/tickets?offset=${offset}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    })
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
      fetch(CONFIG.API_URL + "/api/tickets/search", {
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
  const handleDateFilter = (e) => {
    e.preventDefault();
    setOffset(0);
    const search = {
      from: e.target.from.value,
      to: e.target.to.value,
    };
    setPageLoading(true);
    const fetchSearchTickets = async () => {
      fetch(CONFIG.API_URL + `/api/tickets/date-filter?offset=${offset}`, {
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
            setShowDateFilter(false);
            setPageLoading(false);
          } else {
            setShowDateFilter(false);
            setTimeout(() => {}, 5000);
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
  const handleRootFilter = (e) => {
    e.preventDefault();
    setTickets(tickets.filter((ticket) => ticket.root === e.target.title));
    setShowRootFilter(false);
  };
  return (
    <div className="flex h-screen overflow-hidden">
      {currentUser.user_role === "admin" ||
      currentUser.user_role === "agent" ? (
        <>
          {/* Sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* Content area */}
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/*  Site header */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <main>
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                <div className="col-span-full  bg-white shadow-lg rounded-sm border border-slate-200">
                  <header className="px-5 py-4 border-b border-slate-100 flex justify-between">
                    <h2 className="font-semibold text-slate-800">
                      All Tickets
                    </h2>
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
                        <div className="relative">
                          <button
                            type="button"
                            className="text-sm flex items-center mr-8 border-2 border-sky-00 text-slate-400 focus:ring-sky-500 focus:border-sky-500 hover:ring-sky-500 hover:border-sky-500 hover:text-slate-800 rounded-lg px-2 "
                            id="menu-button"
                            aria-expanded="true"
                            aria-haspopup="true"
                            onClick={() => setShowRootFilter(!showRootFilter)}
                            title="Root Filter"
                          >
                            Root
                            <MdKeyboardArrowDown
                              className="text-2xl ml-10"
                              aria-hidden="true"
                            />
                          </button>
                          {showRootFilter && (
                            <div
                              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="menu-button"
                              tabIndex="-1"
                            >
                              <div className="py-1 px-3 py-4" role="none">
                                <button
                                  type="submit"
                                  className="text-xs w-full mt-2  text-slate-700 rounded-sm hover:text-slate-600 transition-all"
                                  title="Bizbox"
                                  onClick={handleRootFilter}
                                >
                                  Bizbox
                                </button>
                                <button
                                  type="submit"
                                  className="text-xs w-full mt-2  text-slate-700 rounded-sm hover:text-slate-600 transition-all"
                                  title="Printer"
                                  onClick={handleRootFilter}
                                >
                                  Printer
                                </button>
                                <button
                                  type="submit"
                                  className="text-xs w-full mt-2  text-slate-700 rounded-sm hover:text-slate-600 transition-all"
                                  title="Network"
                                  onClick={handleRootFilter}
                                >
                                  Network
                                </button>
                                <button
                                  type="submit"
                                  className="text-xs w-full mt-2  text-slate-700 rounded-sm hover:text-slate-600 transition-all"
                                  title="Hardware"
                                  onClick={handleRootFilter}
                                >
                                  Hardware
                                </button>
                                <button
                                  type="submit"
                                  className="text-xs w-full mt-2 text-slate-700 rounded-sm hover:text-slate-600 transition-all"
                                  title="Software"
                                  onClick={handleRootFilter}
                                >
                                  Software
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="relative">
                          <button
                            type="button"
                            className="text-sm flex items-center mr-8 border-2 border-sky-00 text-slate-400 focus:ring-sky-500 focus:border-sky-500 hover:ring-sky-500 hover:border-sky-500 hover:text-slate-800 rounded-lg px-2 "
                            id="menu-button"
                            aria-expanded="true"
                            aria-haspopup="true"
                            onClick={() => setShowDateFilter(!showDateFilter)}
                            title="Date Filter"
                          >
                            Date
                            <MdKeyboardArrowDown
                              className="text-2xl ml-10"
                              aria-hidden="true"
                            />
                          </button>
                          {showDateFilter && (
                            <div
                              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="menu-button"
                              tabIndex="-1"
                            >
                              <div className="py-1 px-3 py-4" role="none">
                                <form onSubmit={handleDateFilter}>
                                  <div>
                                    <label
                                      htmlFor="from"
                                      className="text-xs text-slate-600"
                                    >
                                      From:
                                    </label>
                                    <div className="relative">
                                      <Flatpickr
                                        className="form-input pl-9 text-slate-500 hover:text-slate-800 font-medium text-xs focus:border-slate-300 w-full mb-2"
                                        id="from"
                                      />
                                      <MdOutlineCalendarMonth className="absolute top-2 left-2 text-xl pointer-events-none" />
                                    </div>
                                  </div>
                                  <div className="relative">
                                    <label
                                      htmlFor="to"
                                      className="text-xs text-slate-600"
                                    >
                                      To:
                                    </label>
                                    <div className="relative">
                                      <Flatpickr
                                        className="form-input pl-9 text-slate-500 hover:text-slate-800 font-medium text-xs focus:border-slate-300 w-full mb-2"
                                        id="to"
                                      />
                                      <MdOutlineCalendarMonth className="absolute top-2 left-2 text-xl pointer-events-none" />
                                    </div>
                                  </div>

                                  <button
                                    type="submit"
                                    className="text-xs w-full mt-2 bg-indigo-600 py-2 text-slate-100 rounded-sm hover:bg-indigo-400 hover:text-slate-200 transition-all"
                                    title="Search"
                                  >
                                    Search
                                  </button>
                                </form>
                              </div>
                            </div>
                          )}
                        </div>

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
                                      <div className="text-left uppercase font-bold text-md">
                                        #{ticket.id}
                                      </div>
                                    </td>
                                    <td className="p-2">
                                      <div className="flex items-center">
                                        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 mr-2">
                                          <span className="font-medium text-gray-600 dark:text-gray-300 uppercase">
                                            {ticket.user[0]}
                                            {ticket.user.split(" ").length >
                                              2 && ticket.user.split(" ")[1][0]}
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
      ) : (
        <div className="flex items-center justify-center w-full">
          <div className="flex items-center flex-col ">
            <object
              data="/illustrations/undraw_access_denied_.svg"
              aria-label="illustration"
              className="m-0 w-1/2"
            />
            <p className="text-red-500 mt-5 font-bold text-3xl">
              Access Denied!
            </p>
            <p className="text-red-400  font-normal text-xl">
              You don't have permission to access this section
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tickets;
