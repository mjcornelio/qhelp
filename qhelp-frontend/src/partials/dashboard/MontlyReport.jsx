import React, { useState, useEffect } from "react";
import DoughnutChart from "../../../charts/DoughnutChart";
import { tailwindConfig } from "../../utils/Utils";

import { CONFIG } from "../../../config/config";

function MonthlyReport() {
  const [monthlyTicket, setMonthlyTicket] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingFiltered, setLoadingFiltered] = useState(false);

  useEffect(() => {
    const data = {
      year: year,
      month: month,
    };
    const fetchMonthlyTickets = async () => {
      fetch(CONFIG.API_URL + `/api/monthly-tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(data),
      })
        .then(async function (response) {
          const res = await response.json();
          if (res.success) {
            setMonthlyTicket(res.tickets);
          } else {
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    fetchMonthlyTickets();
  }, [year, month]);

  const data = {
    labels: [
      `${monthlyTicket.Bizbox && monthlyTicket.Bizbox} Bizbox`,
      `${monthlyTicket.Printer && monthlyTicket.Printer} Printer`,
      `${monthlyTicket.Network && monthlyTicket.Network} Network`,
      `${monthlyTicket.Software && monthlyTicket.Software} Software`,
      `${monthlyTicket.Others && monthlyTicket.Others} Others`,
      `${
        monthlyTicket.NotYetResolved && monthlyTicket.NotYetResolved
      } Not Yet Resolved`,
    ],
    datasets: [
      {
        label: "Total",
        data: [
          monthlyTicket.Bizbox,
          monthlyTicket.Printer,
          monthlyTicket.Network,
          monthlyTicket.Software,
          monthlyTicket.Others,
          monthlyTicket.NotYetResolved,
        ],
        backgroundColor: [
          tailwindConfig().theme.colors.indigo[500],
          tailwindConfig().theme.colors.blue[400],
          tailwindConfig().theme.colors.sky[600],
          tailwindConfig().theme.colors.emerald[600],
          tailwindConfig().theme.colors.lime[600],
          tailwindConfig().theme.colors.rose[500],
        ],
        hoverBackgroundColor: [
          tailwindConfig().theme.colors.indigo[600],
          tailwindConfig().theme.colors.blue[500],
          tailwindConfig().theme.colors.sky[700],
          tailwindConfig().theme.colors.emerald[700],
          tailwindConfig().theme.colors.lime[600],
          tailwindConfig().theme.colors.rose[600],
        ],
        hoverBorderColor: tailwindConfig().theme.colors.white,
      },
    ],
  };
  const handleDateChange = (e) => {
    const data = e.target.value.split("-");
    console.log(data);
    setYear(data[0]);
    setMonth(data[1]);
  };
  const handleExport = (e) => {
    setLoading(true);
    e.preventDefault();
    const data = {
      year: year,
      month: month,
    };

    const fetchMonthlyTickets = async () => {
      fetch(CONFIG.API_URL + `/api/download-monthly-tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(data),
      })
        .then(async function (response) {
          const res = await response.json();
          if (res.success) {
            setShowDialog(true);
            setDialogMessage(res);
            setLoading(false);
          } else {
            setShowDialog(true);
            setDialogMessage(res);
            setLoading(false);
          }
        })
        .catch(function (error) {
          setShowDialog(true);
          setDialogMessage(res);
          setLoading(false);
        });
    };
    fetchMonthlyTickets();
  };
  const handleFilteredTickets = (e) => {
    e.preventDefault();
    const data = {
      start: {
        year: e.target.start.value.split("-")[0],
        month: e.target.start.value.split("-")[1],
      },
      end: {
        year: e.target.end.value.split("-")[0],
        month: e.target.end.value.split("-")[1],
      },
    };
    const fetchFilteredTickets = async () => {
      setLoadingFiltered(true);
      fetch(CONFIG.API_URL + `/api/download-filtered-tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(data),
      })
        .then(async function (response) {
          const res = await response.json();
          if (res.success) {
            setShowDialog(true);
            setDialogMessage(res);
            setLoadingFiltered(false);
          } else {
            setShowDialog(true);
            setDialogMessage(res);
            setLoadingFiltered(false);
          }
        })
        .catch(function (error) {
          setShowDialog(true);
          setDialogMessage(res);
          setLoadingFiltered(false);
        });
    };
    fetchFilteredTickets();
  };
  return (
    <>
      {showDialog && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none transition-all">
            <div
              className="relative w-auto my-6 mx-auto"
              style={{ width: "400px" }}
            >
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-slate-800 font-bold text-xl">
                    Export CSV
                  </h3>
                  <button onClick={() => setShowDialog(false)}>
                    <span className=" text-slate-800  h-6 w-6 text-2xl block outline-none hover:opacity-50">
                      ×
                    </span>
                  </button>
                </div>
                <div className="flex items-center flex flex-col pt-5">
                  <object
                    data={`/illustrations/${
                      dialogMessage.success
                        ? "undraw_report.svg"
                        : "undraw_ticket_error.svg"
                    }`}
                    aria-label="illustration"
                    className="m-0 w-1/2 p-5"
                  />
                  <h3
                    className={
                      dialogMessage.success ? "text-indigo-600" : "text-red-600"
                    }
                  >
                    {dialogMessage.success ? "Success" : "Error"}
                  </h3>
                  <p className="text-center px-10 mt-2">{dialogMessage.msg}</p>
                </div>
                <div className="flex items-center justify-center p-6  rounded-b"></div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
      <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white shadow-lg rounded-xl border border-slate-200">
        <header className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800 flex items-center justify-between">
            Tickets
            <form className="ml-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="month"
                defaultValue={`${year}-${
                  month.toString().length === 1 ? "0" + month : month
                }`}
                className=" block min-h-[auto] w-full rounded border-2  bg-transparent px-3 py-[0.32rem] leading-[1.6] transition-all duration-200 ease-linear focus:placeholder:opacity-100  motion-reduce:transition-none "
                placeholder={`${year}-${month}`}
                onChange={handleDateChange}
              />
            </form>
          </h2>
        </header>

        {/* Chart built with Chart.js 3 */}
        {/* Change the height attribute to adjust the chart height */}
        <span className="px-10">
          Total tickets{": "}
          {monthlyTicket.Bizbox +
            monthlyTicket.Printer +
            monthlyTicket.Network +
            monthlyTicket.Software +
            monthlyTicket.Others +
            monthlyTicket.NotYetResolved}
        </span>
        <DoughnutChart data={data} />
        <div>
          <button
            className={`my-3 mr-5 float-right text-sky-600 w-fit py-2 px-3 hover:text-sky-400 hover:underline underline-offset-4 transition-all `}
            title="Export"
            onClick={handleExport}
            disabled={loading}
          >
            {loading ? (
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              ></div>
            ) : (
              "Export CSV"
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col col-span-full h-fit sm:col-span-6 xl:col-span-6 bg-white shadow-lg rounded-xl border border-slate-200">
        <header className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800 flex items-center justify-between">
            Filter Tickets
          </h2>
        </header>

        {/* Chart built with Chart.js 3 */}
        {/* Change the height attribute to adjust the chart height */}
        <form
          className="ml-2 p-4 px-2 lg:px-20 "
          onSubmit={handleFilteredTickets}
        >
          <div>
            <label htmlFor="start">From:</label>
            <input
              type="month"
              id="start"
              name="start"
              className=" block min-h-[auto] w-full rounded border-2  bg-transparent px-3 py-[0.32rem] leading-[1.6] transition-all duration-200 ease-linear focus:placeholder:opacity-100  motion-reduce:transition-none my-2"
              placeholder="Start Date"
              required
            />
          </div>
          <div>
            <label htmlFor="end">To:</label>
            <input
              type="month"
              id="end"
              name="end"
              className=" block min-h-[auto] w-full rounded border-2  bg-transparent px-3 py-[0.32rem] leading-[1.6] transition-all duration-200 ease-linear focus:placeholder:opacity-100  motion-reduce:transition-none my-2"
              placeholder="End Date"
              required
            />
          </div>
          <div>
            <button
              className={`my-3  float-right text-sky-600 w-fit py-2 px-3 hover:text-sky-400 hover:underline underline-offset-4 transition-all `}
              title="Export"
              type="submit"
              disabled={loadingFiltered}
            >
              {loadingFiltered ? (
                <div
                  className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                ></div>
              ) : (
                "Export CSV"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default MonthlyReport;
