import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Footer from "./partials/Footer";

import "./css/style.css";

// Import pages
import ProtectedRoutes from "../routes/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import SingleTicket from "./pages/SingleTicket";
import Tickets from "./pages/Tickets";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import CreateTicket from "./pages/CreateTicket";
import OurTeam from "./pages/OurTeam";
import MyTickets from "./pages/MyTickets";

function App() {
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/" element={<ProtectedRoutes />}>
          <Route index element={<Dashboard />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/ticket/:id" element={<SingleTicket />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/users" element={<Users />} />
          <Route path="/create-ticket" element={<CreateTicket />} />
          <Route path="/our-team" element={<OurTeam />} />
          <Route path="/mytickets" element={<MyTickets />} />
        </Route>
        <Route exact path="/auth/login" element={<Login />} />
        <Route path="*" element={<>404</>} />
      </Routes>
      {pathname !== "/our-team" && <Footer />}
    </>
  );
}

export default App;
