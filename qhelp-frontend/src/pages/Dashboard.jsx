import React, { useState } from "react";
import { useValue } from "../../context/ContextProvider";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import WelcomeBanner from "../partials/dashboard/WelcomeBanner";
import DashboardCard07 from "../partials/dashboard/DashboardCard07";
import DashboardCards from "../partials/dashboard/DashboardCards";

function Dashboard() {
  const {
    state: { currentUser },
  } = useValue();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden w-screen">
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
                {/* Welcome banner */}
                <WelcomeBanner />

                {/* Cards */}
                <div className="grid grid-cols-12 gap-6">
                  {/* Ticket Table */}
                  <DashboardCard07 />
                </div>
              </div>
            </main>
          </div>
        </>
      ) : (
        <div
          className="flex h-screen overflow-hidden mx-auto w-screen"
          style={{ maxWidth: "2000px " }}
        >
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden ">
            {/*  Site header */}
            <Header />

            <main>
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                {/* Welcome banner */}
                <WelcomeBanner />

                {/* Cards */}
                <div className="grid grid-cols-12 gap-6">
                  {/* Table (Top Channels) */}
                  <DashboardCards
                    to="/create-ticket"
                    title="Create New Ticket"
                    icon="/illustrations/undraw_create_ticket.svg"
                  />
                  {/* Table (Top Channels) */}
                  <DashboardCards
                    to="/mytickets"
                    title="View My Tickets"
                    icon="/illustrations/undraw_mytickets.svg"
                  />
                  {/* Table (Top Channels) */}
                  <DashboardCards
                    to="/knowledgebase"
                    title="Knowledgebase"
                    icon="/illustrations/undraw_knowledgebase.svg"
                  />
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
