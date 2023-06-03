const User = require("../models/User");

const login = async (req, res) => {
  try {
    const users = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (users === null) {
      return res
        .status(400)
        .json({ success: false, msg: "Incorrect Username" });
    } else {
      if (req.body.password === users.password) {
        return res.status(200).json({
          success: true,
          user: users,
        });
      } else {
        return res
          .status(400)
          .json({ success: false, msg: "Incorrect Password" });
      }
    }
  } catch (error) {
    res.json({ success: false, msg: "Something Went Wrong" });
  }
};

module.exports = { login };
