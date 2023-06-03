import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdCheck,
  MdKeyboardArrowRight,
  MdKeyboardArrowLeft,
} from "react-icons/md";

import { CONFIG } from "../../../config/config";

function DashboardCard07() {
  const [openTickets, setOpenTickets] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpenTickets = async () => {
      setPageLoading(true);
      fetch(CONFIG.API_URL + `/api/open-tickets?offset=${offset}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      })
        .then(async function (response) {
          const res = await response.json();
          if (res.success) {
            setOpenTickets(res.tickets);
            setCount(res.count);
            setPageLoading(false);
          } else {
            setPageLoading(false);
            setTimeout(() => {}, 5000);
          }
        })
        .catch(function (error) {
          console.log(error);
          setPageLoading(false);
        });
    };
    fetchOpenTickets();
    setInterval(() => {
      fetchOpenTickets();
    }, 300000);
  }, [offset]);

  return (
    <div className="col-span-full ">
      <header className="px-5 py-4 border-b border-slate-100 flex justify-between">
        <h2 className="font-semibold text-slate-800">Open Tickets</h2>
        <p className="text-sm text-slate-600">
          As of {new Date().getMonth() + 1}/{new Date().getDate()}/
          {new Date().getFullYear()}
        </p>
      </header>

      <div className="p-3">
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
            <table className="border-separate border-spacing-y-8 w-full">
              {openTickets.length == 0 ? (
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
                  {/* Table body */}
                  <tbody className="text-sm font-medium divide-y divide-slate-100">
                    {/* Rows */}
                    {openTickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                        className="cursor-pointer hover:bg-gray-200 bg-white shadow-lg rounded-sm border border-slate-200 rounded-xl "
                      >
                        <td className="px-10 py-5 mb-10 rounded-2xl ">
                          <div className="text-left uppercase font-bold text-lg ">
                            <span className="text-left uppercase font-bold text-lg text-slate-800">
                              {ticket.subject}
                            </span>
                            <span className="text-left uppercase font-normal text-xs float-right">
                              {ticket.date &&
                                `${new Date(
                                  ticket.date.split("T").join(" ")
                                ).toDateString()} ${new Date(
                                  ticket.date.split("T").join(" ")
                                ).toLocaleTimeString("en-US")}`}
                            </span>
                          </div>

                          <div className=" mt-2">
                            From:
                            <span className="text-slate-800 ml-4">
                              {ticket.user}
                            </span>
                          </div>

                          <p className="text-left  font-normal w-full text-slate-600 sm:w-3/4 py-4">
                            {ticket.description}
                          </p>

                          <div className="text-left capitalize inline flex">
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
                            <span
                              className={`text-indigo-800 border-2 border-indigo-800 text-xs font-medium mr-2 px-3 py-2 rounded flex items-center justify-center w-20 text-center `}
                            >
                              #{ticket.id}
                            </span>
                            <span
                              className={`text-gray-800 border-2 border-gray-800 text-xs font-medium mr-2 px-3 py-2 rounded flex items-center justify-center w-30 text-center `}
                            >
                              {ticket.agent ? ticket.agent : "Pick Up"}
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
  );
}

export default DashboardCard07;
