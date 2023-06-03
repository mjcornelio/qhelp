const express = require("express");
const router = express.Router();

//controllers

const {
  getOpenTickets,
  getSingleTicket,
  createReply,
  updateTicket,
  getTodayTickets,
  searchTickets,
  getAgents,
  createTicket,
  getDateFilterTickets,
  getAllUsers,
  addUser,
  deleteUser,
  updateUser,
  getMyOpenTickets,
  searchMyTickets,
  getMonthlyTicket,
  exportcsv,
  exportFilteredcsv,
} = require("../controllers/UserController");

router.get("/open-tickets", getOpenTickets);
router
  .get("/tickets", getTodayTickets)
  .post("/tickets/search", searchTickets)
  .post("/tickets/date-filter", getDateFilterTickets);
router
  .get("/ticket/:id", getSingleTicket)
  .patch("/ticket/update/:id", updateTicket);
router.post("/ticket-reply", createReply);
router.get("/agents", getAgents);
router.post("/create-ticket", createTicket);
router
  .get("/users", getAllUsers)
  .post("/users", addUser)
  .post("/users/delete", deleteUser)
  .put("/users/edit", updateUser);

router.get("/mytickets/:user", getMyOpenTickets);
router.post("/search/mytickets/:user", searchMyTickets);
router.post("/monthly-tickets", getMonthlyTicket);
router.post("/download-monthly-tickets", exportcsv);
router.post("/download-filtered-tickets", exportFilteredcsv);
module.exports = router;
