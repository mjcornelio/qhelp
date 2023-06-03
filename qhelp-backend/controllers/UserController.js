const Tickets = require("../models/Tickets");
const Reply = require("../models/Reply");
const User = require("../models/User");
const sequelize = require("../db/connect");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const path = require("path");
const currentDirectoryPath = path.resolve(__dirname, "..");

const createTicket = async (req, res) => {
  try {
    const { user, from, subject, agent, description, date, updatedAt, state } =
      req.body;
    const ticket = await Tickets.create({
      user: user,
      from: from,
      subject: subject,
      agent: agent,
      description: description,
      date: date,
      updatedAt: updatedAt,
      state: state,
    });
    res.status(201).json({
      success: true,
      msg: "Ticket Successfully Submitted",
      id: ticket.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Something Went Wrong! Please try again later",
    });
  }
};
const getTodayTickets = async (req, res) => {
  try {
    const { offset } = req.query;
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const tickets = await Tickets.findAll({
      where: {
        date: {
          [Op.gte]: startOfDay,
          [Op.lt]: endOfDay,
        },
      },
      limit: 10,
      offset: parseInt(offset),
    });
    const count = await Tickets.count({
      where: {
        date: {
          [Op.gte]: startOfDay,
          [Op.lt]: endOfDay,
        },
      },
    });
    if (tickets === null) {
      return res.status(400).json({ success: true, msg: "No Existing Ticket" });
    } else {
      return res.status(200).json({
        success: true,
        tickets: tickets,
        count: count,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something Went Wrong" });
  }
};
const getMyOpenTickets = async (req, res) => {
  try {
    const { user } = req.params;
    const { offset } = req.query;

    const tickets = await Tickets.findAll({
      where: {
        user: user,
        state: "open",
      },
      order: [[sequelize.literal("id"), "DESC"]],
      limit: 10,
      offset: parseInt(offset),
    });
    const count = await Tickets.count({
      where: {
        user: user,
        state: "open",
      },
    });
    if (tickets === null) {
      return res.status(400).json({ success: true, msg: "No Existing Ticket" });
    } else {
      return res.status(200).json({
        success: true,
        tickets: tickets,
        count: count,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something Went Wrong" });
  }
};
const getDateFilterTickets = async (req, res) => {
  try {
    const { offset } = req.query;
    let { from, to } = req.body;

    from = from.split("-");
    to = to.split("-");

    const startOfDay = new Date(from[0], from[1] - 1, from[2]);
    const endOfDay = new Date(to[0], to[1], to[2]);

    const tickets = await Tickets.findAll({
      where: {
        date: {
          [Op.gte]: startOfDay,
          [Op.lt]: endOfDay,
        },
      },
      limit: 10,
      offset: parseInt(offset),
    });
    const count = await Tickets.count({
      where: {
        date: {
          [Op.gte]: startOfDay,
          [Op.lt]: endOfDay,
        },
      },
    });
    if (tickets === null) {
      return res.status(400).json({ success: true, msg: "No Existing Ticket" });
    } else {
      return res.status(200).json({
        success: true,
        tickets: tickets,
        count: count,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something Went Wrong" });
  }
};

const getOpenTickets = async (req, res) => {
  try {
    const { offset } = req.query;
    const tickets = await Tickets.findAll({
      where: {
        state: "open",
      },
      order: [[sequelize.literal("id"), "DESC"]],
      limit: 10,
      offset: parseInt(offset),
    });
    const count = await Tickets.count({
      where: {
        state: "open",
      },
    });
    if (tickets === null) {
      return res
        .status(400)
        .json({ success: true, msg: "No Existing Open Ticket" });
    } else {
      return res.status(200).json({
        success: true,
        tickets: tickets,
        count: count,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something Went Wrong" });
  }
};
const getSingleTicket = async (req, res) => {
  try {
    const ticket = await Tickets.findOne({
      where: {
        id: req.params.id,
      },
    });
    const replies = await Reply.findAll({ where: { reply_to: req.params.id } });
    if (ticket === null) {
      return res.status(400).json({ success: true, msg: "No Existing Ticket" });
    } else {
      return res.status(200).json({
        success: true,
        ticket: ticket,
        replies: await replies,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something Went Wrong" });
  }
};
const getMonthlyTicket = async (req, res) => {
  try {
    const { month, year } = req.body;
    const firstDay = new Date(parseInt(year), parseInt(month) - 1, 1);
    const lastDay = new Date(parseInt(year), parseInt(month), 1);
    const tickets = await Tickets.findAll({
      where: {
        date: {
          [Op.gte]: firstDay,
          [Op.lt]: lastDay,
        },
      },
    });
    const Bizbox = tickets.filter((ticket) => ticket.root === "Bizbox").length;
    const Printer = tickets.filter(
      (ticket) => ticket.root === "Printer"
    ).length;
    const Network = tickets.filter(
      (ticket) => ticket.root === "Network"
    ).length;
    const Software = tickets.filter(
      (ticket) => ticket.root === "Software"
    ).length;
    const Others = tickets.filter(
      (ticket) =>
        ticket.root !== "Bizbox" &&
        ticket.root !== "Network" &&
        ticket.root !== "Software" &&
        ticket.root !== "Printer" &&
        ticket.root !== null
    ).length;
    const NotYetResolved = tickets.filter(
      (ticket) => ticket.root === null
    ).length;

    if (tickets === null) {
      return res
        .status(400)
        .json({ success: true, msg: "No Existing Open Ticket" });
    } else {
      return res.status(200).json({
        success: true,
        tickets: { Bizbox, Printer, Network, Software, Others, NotYetResolved },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Something Went Wrong" });
  }
};

const createReply = async (req, res) => {
  try {
    const { agent, message, date, reply_to } = req.body;
    await Reply.create({
      agent: agent,
      message: message,
      date: date,
      reply_to: reply_to,
    });
    res
      .status(201)
      .json({ success: true, msg: "Reply Successfully Submitted" });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something Went Wrong" });
  }
};
const updateTicket = async (req, res) => {
  try {
    const { state, root, duration, updatedAt } = req.body;
    await Tickets.update(
      {
        state: state,
        root: root,
        duration: duration,
        updatedAt: updatedAt,
      },
      { where: { id: req.params.id } }
    );
    console.log(root, state);
    res.status(200).json({ success: true, msg: "Ticket Successfully Closed" });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something Went Wrong" });
  }
};
const searchTickets = async (req, res) => {
  try {
    const search = req.body.data;
    if (search === "") {
      return res.status(400).json({
        success: true,
        msg: "Search input must filled",
        tickets: [],
      });
    }
    const tickets = await Tickets.findAll({
      where: {
        [Op.or]: [
          { id: { [Op.like]: `%${search}%` } },
          { user: { [Op.like]: `%${search}%` } },
          { from: { [Op.like]: `%${search}%` } },
          { subject: { [Op.like]: `%${search}%` } },
          { agent: { [Op.like]: `%${search}%` } },
          { root: { [Op.like]: `%${search}%` } },
          { state: { [Op.like]: `%${search}%` } },
        ],
      },
    });
    if (tickets === null) {
      return res.status(400).json({ success: true, msg: "No Existing Ticket" });
    } else {
      return res.status(200).json({
        success: true,
        tickets: tickets,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Something Went Wrong" });
  }
};
const searchMyTickets = async (req, res) => {
  try {
    const search = req.body.data;
    const { user } = req.params;
    console.log(user);
    if (search === "") {
      return res.status(400).json({
        success: true,
        msg: "Search input must filled",
        tickets: [],
      });
    }
    const tickets = await Tickets.findAll({
      where: {
        user: user,
        [Op.or]: [
          { id: { [Op.like]: `%${search}%` } },
          { from: { [Op.like]: `%${search}%` } },
          { subject: { [Op.like]: `%${search}%` } },
          { agent: { [Op.like]: `%${search}%` } },
          { root: { [Op.like]: `%${search}%` } },
          { state: { [Op.like]: `%${search}%` } },
        ],
      },
      limit: 10,
    });
    if (tickets === null) {
      return res.status(400).json({ success: true, msg: "No Existing Ticket" });
    } else {
      return res.status(200).json({
        success: true,
        tickets: tickets,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Something Went Wrong" });
  }
};
const getAgents = async (req, res) => {
  try {
    const [results, metadata] = await sequelize.query(
      "SELECT `id`, `name`, `user_role` FROM `users` WHERE `user_role` = 'agent' OR `user_role` = 'admin';"
    );
    const agents = results;

    if (agents === null) {
      return res.status(400).json({ success: true, msg: "No Existing Agents" });
    } else {
      return res.status(200).json({
        success: true,
        agents: agents,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Something Went Wrong" });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({});

    if (users === null) {
      return res.status(400).json({ success: true, msg: "No Existing Users" });
    } else {
      return res.status(200).json({
        success: true,
        users: users,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Something Went Wrong" });
  }
};
const addUser = async (req, res) => {
  try {
    const { name, user_role, username, password } = req.body;
    await User.create({
      name: name,
      user_role: user_role,
      username: username,
      password: password,
    });
    res.status(201).json({ success: true, msg: "User Successfully Added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Something Went Wrong" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    await User.destroy({
      where: {
        id: id,
      },
    });
    res.status(201).json({ success: true, msg: "User Successfully Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Something Went Wrong" });
  }
};
const updateUser = async (req, res) => {
  try {
    const { id, name, username, user_role, password } = req.body;
    await User.update(
      { name, username, user_role, password },
      {
        where: {
          id: id,
        },
      }
    );
    res.status(201).json({ success: true, msg: "User Successfully Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Something Went Wrong" });
  }
};
const exportcsv = async (req, res) => {
  try {
    const { month, year } = req.body;
    const firstDay = new Date(parseInt(year), parseInt(month) - 1, 1);
    const lastDay = new Date(parseInt(year), parseInt(month), 1);
    const tickets = await Tickets.findAll({
      where: {
        date: {
          [Op.gte]: firstDay,
          [Op.lt]: lastDay,
        },
      },
    });
    if (tickets === null) {
      return res
        .status(400)
        .json({ success: true, msg: "No Existing Open Ticket" });
    } else {
      const headers = [
        { id: "id", title: "Ticket ID" },
        { id: "user", title: "User" },
        { id: "from", title: "Ticket By" },
        { id: "subject", title: "Subject" },
        { id: "agent", title: "Agent" },
        { id: "date", title: "CreatedAt" },
        { id: "updatedAt", title: "UpdatedAt" },
        { id: "duration", title: "Duration" },
        { id: "state", title: "State" },
        { id: "root", title: "Root" },
      ];
      // Create a new CSV writer instance
      const csvWriter = createCsvWriter({
        path: `exports/${month}-${year}.csv`,
        header: headers,
      });
      // Write the data to the CSV file
      csvWriter
        .writeRecords(
          tickets.map((record) => {
            return {
              id: record.id,
              user: record.user,
              from: record.from,
              subject: record.subject,
              agent: record.agent,
              date: record.date.toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
              }), // format date to YYYY-MM-DD
              updatedAt: record.updatedAt.toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
              }), // format date to YYYY-MM-DD
              duration: record.duration,
              state: record.state,
              root: record.root,
            };
          })
        )
        .then(() => {
          // Read the CSV file and send it to the client
          fs.readFile(`exports/${month}-${year}.csv`, (error, tickets) => {
            if (error) {
              console.log(error);
              res.status(500).json({
                success: false,
                msg: `Error Creating CSV`,
              });
            } else {
              res.status(200).json({
                success: true,
                msg: `Excel File Successfully Generated! The location of the file is ${currentDirectoryPath}\\exports\\${month}-${year}.csv`,
              });
            }
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            success: false,
            msg: `Error Creating CSV`,
          });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Something Went Wrong" });
  }
};
const exportFilteredcsv = async (req, res) => {
  try {
    const { start, end } = req.body;
    const firstDay = new Date(
      parseInt(start.year),
      parseInt(start.month) - 1,
      1
    );
    const lastDay = new Date(parseInt(end.year), parseInt(end.month), 1);
    const tickets = await Tickets.findAll({
      where: {
        date: {
          [Op.gte]: firstDay,
          [Op.lt]: lastDay,
        },
      },
    });
    if (tickets === null) {
      return res
        .status(400)
        .json({ success: true, msg: "No Existing Open Ticket" });
    } else {
      const headers = [
        { id: "id", title: "Ticket ID" },
        { id: "user", title: "User" },
        { id: "from", title: "Ticket By" },
        { id: "subject", title: "Subject" },
        { id: "agent", title: "Agent" },
        { id: "date", title: "CreatedAt" },
        { id: "updatedAt", title: "UpdatedAt" },
        { id: "duration", title: "Duration" },
        { id: "state", title: "State" },
        { id: "root", title: "Root" },
      ];
      // Create a new CSV writer instance
      const csvWriter = createCsvWriter({
        path: `exports/${start.month}.${start.year}-${end.month}.${end.year}.csv`,
        header: headers,
      });
      // Write the data to the CSV file
      csvWriter
        .writeRecords(
          tickets.map((record) => {
            return {
              id: record.id,
              user: record.user,
              from: record.from,
              subject: record.subject,
              agent: record.agent,
              date: record.date.toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
              }), // format date to YYYY-MM-DD
              updatedAt: record.updatedAt.toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
              }), // format date to YYYY-MM-DD
              duration: record.duration,
              state: record.state,
              root: record.root,
            };
          })
        )
        .then(() => {
          // Read the CSV file and send it to the client
          fs.readFile(
            `exports/${start.month}.${start.year}-${end.month}.${end.year}.csv`,
            (error, tickets) => {
              if (error) {
                console.log(error);
                res.status(500).json({
                  success: false,
                  msg: `Error Creating CSV`,
                });
              } else {
                res.status(200).json({
                  success: true,
                  msg: `Excel File Successfully Generated! The location of the file is ${currentDirectoryPath}\\exports\\${start.month}.${start.year}-${end.month}.${end.year}.csv`,
                });
              }
            }
          );
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            success: false,
            msg: `Error Creating CSV`,
          });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Something Went Wrong" });
  }
};
module.exports = {
  getTodayTickets,
  createTicket,
  getDateFilterTickets,
  getOpenTickets,
  getSingleTicket,
  createReply,
  updateTicket,
  searchTickets,
  getAgents,
  getAllUsers,
  addUser,
  deleteUser,
  updateUser,
  getMyOpenTickets,
  searchMyTickets,
  getMonthlyTicket,
  exportcsv,
  exportFilteredcsv,
};
