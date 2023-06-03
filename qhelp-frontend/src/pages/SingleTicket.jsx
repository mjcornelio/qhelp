import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { CONFIG } from "../../config/config";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { useValue } from "../../context/ContextProvider";
import { MdCheck } from "react-icons/md";

function SingleTicket() {
  const { id } = useParams();
  const [ticket, setTicket] = useState({});
  const [notes, setNotes] = useState(Array);
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("");
  const [alert, setAlert] = useState("");
  const {
    state: { currentUser },
  } = useValue();
  useEffect(() => {
    const fetchOpenTickets = async () => {
      fetch(CONFIG.API_URL + `/api/ticket/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      })
        .then(async function (response) {
          const res = await response.json();
          if (res.success) {
            const rep = res.replies;
            setNotes(rep);
            setTicket(res.ticket);
            setMessage("");
          } else {
            setTimeout(() => {}, 5000);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    fetchOpenTickets();
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const handleReply = (e) => {
    setMessage(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const reply = {
      agent: currentUser.name,
      reply_to: ticket.id,
      message: message,
      date: new Date(),
    };

    fetch(CONFIG.API_URL + "/api/ticket-reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(reply),
    })
      .then(async function (response) {
        const res = await response.json();
        if (res.success) {
          setAlert(res.msg);
          e.target.message.value = "";
          window.location.reload();
        } else {
          setAlert(res.msg);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleClosed = (e) => {
    e.preventDefault();
    const currDate = new Date();
    const timeDiff = Math.abs(currDate - new Date(ticket.date));
    console.log(timeDiff);
    const updateTicket = {
      state: "closed",
      root: category,
      duration: `${Math.floor(timeDiff / (1000 * 60 * 60))}:${Math.floor(
        (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
      )}:${Math.floor((timeDiff % (1000 * 60)) / 1000)}`,
      updatedAt: currDate,
    };

    fetch(CONFIG.API_URL + `/api/ticket/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(updateTicket),
    })
      .then(async function (response) {
        const res = await response.json();
        if (res.success) {
          setAlert(res.msg);
          window.location.reload();
        } else {
          setAlert(res.msg);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    setShowModal(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {currentUser.user_role == "admin" || currentUser.user_role == "agent" ? (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      ) : null}
      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          {showModal && (
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
                <div
                  className="relative w-auto my-6 mx-auto"
                  style={{ width: "400px" }}
                >
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                      <h3 className="text-slate-800 font-bold text-xl">
                        Closing a Ticket
                      </h3>
                      <button
                        onClick={() => {
                          setShowModal(false);
                          setCategory("");
                        }}
                      >
                        <span className=" text-slate-800  h-6 w-6 text-2xl block outline-none hover:opacity-50">
                          ×
                        </span>
                      </button>
                    </div>
                    {/*body*/}
                    <div className="relative p-6 flex-auto ">
                      <form
                        onSubmit={handleClosed}
                        noValidate
                        autoComplete="off"
                      >
                        <label
                          htmlFor="category"
                          className="text-slate-800 font-semibold text-sm "
                        >
                          Problem Category:
                        </label>
                        <select
                          className=" lg:px-5 md:p-2 w-full text-sm border-2 border-sky-500 rounded-lg focus:ring-sky-500 focus:border-sky-500 resize-none mt-2 block"
                          id="category"
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option defaultValue></option>
                          <option value="Bizbox">Bizbox</option>
                          <option value="Printer">Printer</option>
                          <option value="Network">Network</option>
                          <option value="Hardware">Hardware</option>
                          <option value="Software">Software</option>
                        </select>
                      </form>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                      <button
                        className="text-red-900 px-4 py-2 rounded-lg 
                        font-semibold text-sm hover:text-red-400 transition-all mr-2"
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          setCategory("");
                        }}
                      >
                        Close
                      </button>
                      <button
                        className="text-sky-100  px-4 py-2 rounded-lg 
                        font-semibold text-sm bg-indigo-600 hover:opacity-80  transition-all disabled:opacity-50"
                        type="button"
                        onClick={handleClosed}
                        disabled={category ? false : true}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          )}
          {console.log(ticket)}
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {!ticket ? (
              <div className="flex items-center flex flex-col ">
                <object
                  data="/illustrations/undraw_not_found.svg"
                  aria-label="illustration"
                  className="m-5  w-1/6"
                />
                <p className="text-slate-800 mt-5">Ticket Not Found</p>
              </div>
            ) : (
              <div className="col-span-full  bg-white shadow-lg rounded-sm border border-slate-200">
                <header className="px-5 py-4 border-b border-slate-100 flex justify-between">
                  <p className="text-sm text-slate-600">
                    {ticket.date &&
                      `${new Date(
                        ticket.date.split("T").join(" ")
                      ).toDateString()} ${new Date(
                        ticket.date.split("T").join(" ")
                      ).toLocaleTimeString("en-US")}`}
                  </p>
                  {currentUser.user_role === "admin" ||
                  currentUser.user_role === "agent"
                    ? ticket.state !== "closed" && (
                        <button
                          className={`text-sky-900 px-4 py-2 rounded-lg 
                            font-normal text-sm hover:bg-sky-900 hover:text-sky-100 border-2 border-sky-900 transition-all`}
                          type="button"
                          onClick={() => setShowModal(!showModal)}
                        >
                          Set As Closed
                        </button>
                      )
                    : null}
                </header>
                <div className="p-10 px-20">
                  {/*Ticket*/}
                  <div className="overflow-x-auto">
                    <div className="flex items-center">
                      <div
                        className={`relative inline-flex items-center justify-center w-10 h-10 overflow-hidden   rounded-full  mr-2 ${
                          ticket.user === currentUser.name
                            ? "bg-yellow-600"
                            : "bg-gray-800"
                        } ring-2 ring-gray-300`}
                      >
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          {ticket.user && ticket.user.split("")[0]}
                        </span>
                      </div>
                      <div className="text-slate-800">{ticket.user}</div>
                    </div>
                    <div className=" items-center mt-5 lg:px-20 md:p-0">
                      <h1 className="text-slate-800 font-bold text-xl  uppercase">
                        <span className="text-slate-800 font-normal text-sm mr-3 ">
                          Ticket No:
                        </span>
                        #{ticket.id}
                      </h1>
                      <span className="text-slate-800 font-normal text-sm mr-3 ">
                        Subject:
                      </span>
                      <h1 className="text-slate-800 font-bold text-xl inline uppercase">
                        {ticket.subject}
                      </h1>
                      <h2 className="text-slate-800 font-normal text-sm mt-3">
                        From:
                        <div className="text-left capitalize inline ml-5 ">
                          <span className="text-gray-s00 font-medium text-md mr-2 px-3 py-2 rounded ">
                            {ticket.from}
                          </span>
                        </div>
                      </h2>
                      <h2 className="text-slate-800 font-normal text-sm mt-3 flex items-center">
                        State:
                        <div className="text-left capitalize inline ml-7 ">
                          <span
                            className={`text-slate-100 text-xs font-medium mr-2 px-3 py-2 rounded flex items-center inline ${
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
                      </h2>
                      <h2 className="text-slate-800 font-normal text-sm mt-3">
                        Duration:
                        <div className="text-left capitalize inline ml-5 ">
                          <span className="text-gray-s00 font-medium text-md mr-2 px-3 py-2 rounded ">
                            {ticket.duration ? ticket.duration : ""}
                          </span>
                        </div>
                      </h2>
                      <h2 className="text-slate-800 font-normal text-sm mt-3">
                        Agent:
                        <div className="text-left capitalize inline ml-4 ">
                          <span className=" text-gray-s00 font-medium text-md mr-2 px-3 py-2 rounded ">
                            {ticket.agent}
                          </span>
                        </div>
                      </h2>
                      <h2 className="text-slate-800 font-normal text-sm mt-3">
                        Description:
                      </h2>
                      <div className="w-full items-center mt-3 p-10 lg:py-5 lg:px-5 md:p-2 text-slate-800 font-normal text-sm border-2 border-sky-500 rounded-lg">
                        <pre className="w-full">{ticket.description}</pre>
                      </div>
                    </div>
                  </div>
                  {/*Replies*/}
                  <div>
                    <p className="mt-10 bg-slate-300 w-20 rounded-t-md text-center ext-slate-800 text-sm">
                      Replies
                    </p>
                  </div>
                  <hr className="h-px bg-gray-300 border-0"></hr>
                  {notes.length > 0 ? (
                    <div className="overflow-x-auto">
                      {notes.map((note) => (
                        <div key={note.id}>
                          {note.agent === currentUser.name ? (
                            <div className="flex items-center justify-end mt-10 w-full">
                              <p className="text-slate-800 mr-5 text-xs relative right-0">
                                {new Date(
                                  note.date.split("T").join(" ")
                                ).toDateString()}{" "}
                                {new Date(
                                  note.date.split("T").join(" ")
                                ).toLocaleTimeString("en-US")}
                              </p>
                              <p className="text-slate-800 ">{note.agent}</p>
                              <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-green-100 rounded-full dark:bg-yellow-600 ml-2 ring-2 ring-gray-300">
                                <span className="font-medium text-gray-600 dark:text-gray-300">
                                  {note.agent[0]}
                                  {note.agent.split(" ").length > 1 &&
                                    note.agent.split(" ")[1][0]}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center mt-10 w-full">
                              <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-green-100 rounded-full dark:bg-blue-600 mr-2 ring-2 ring-gray-300">
                                <span className="font-medium text-gray-600 dark:text-gray-300">
                                  {note.agent[0]}
                                  {note.agent.split(" ").length > 1 &&
                                    note.agent.split(" ")[1][0]}
                                </span>
                              </div>
                              <p className="text-slate-800">{note.agent}</p>
                              <p className="text-slate-800 ml-5 text-xs relative right-0">
                                {new Date(
                                  note.date.split("T").join(" ")
                                ).toDateString()}{" "}
                                {new Date(
                                  note.date.split("T").join(" ")
                                ).toLocaleTimeString("en-US")}
                              </p>
                            </div>
                          )}

                          <div className=" items-center mt-5 lg:px-20 md:p-0">
                            <div
                              className={`items-center mt-3 p-10 lg:py-5 lg:px-5 md:p-2 text-slate-800 font-normal text-sm ${
                                note.agent === currentUser.name
                                  ? "border-2 border-sky-500 text-right"
                                  : "border-2 border-emerald-500"
                              } rounded-lg`}
                            >
                              <pre>{note.message}</pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center flex flex-col pt-10">
                      <object
                        data="/illustrations/undraw_note_list.svg"
                        aria-label="illustration"
                        className="m-0 w-1/6 p-5"
                      />
                      <p className="text-slate-800 mt-5">No Replies Yet!</p>
                    </div>
                  )}

                  {/*Write Reply*/}
                  <hr className="h-px my-8 bg-gray-300 border-0 "></hr>
                  <div className="overflow-x-auto mt-10">
                    <div className="flex items-center">
                      <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-green-100 rounded-full dark:bg-yellow-600 mr-2 ring-2 ring-gray-300">
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          {currentUser.name[0]}
                          {currentUser.name.split(" ").length > 1 &&
                            currentUser.name.split(" ")[1][0]}
                        </span>
                      </div>
                      <div className="text-slate-800">{currentUser.name}</div>
                    </div>
                    <div className=" items-center mt-3 lg:px-20 md:p-0">
                      <form
                        onSubmit={handleSubmit}
                        noValidate
                        autoComplete="off"
                      >
                        <label
                          htmlFor="message"
                          className="text-slate-800 font-semibold text-sm "
                        >
                          Your Reply:
                        </label>
                        <textarea
                          id="message"
                          rows="10"
                          className="block lg:py-5 lg:px-5 md:p-2 w-full text-sm border-2 border-sky-500 rounded-lg focus:ring-sky-500 focus:border-sky-500 resize-none mt-2"
                          placeholder="Write your reply here..."
                          onChange={handleReply}
                        ></textarea>
                        <div className="mt-2 flex justify-end">
                          <button
                            className={`bg-indigo-500 text-gray-100 px-4 py-2 rounded-lg tracking-wide
                            font-normal text-sm focus:outline-none focus:shadow-outline hover:bg-indigo-600
                            shadow-lg disabled:opacity-50 disabled:hover:bg-indigo-500`}
                            type="submit"
                            disabled={message ? false : true}
                          >
                            Send Reply
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default SingleTicket;
