const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.send({ message: "User not registered", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send({ message: "Incorrect Password", success: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.send({ message: "Login Successful", success: true, user, token });
  } catch (err) {
    console.log("login error :", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// register
exports.signup = async (req, res) => {
  const { name, username, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      username,
      email,
      phone,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: `Successfully registered!`,
      success: true,
      user,
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Route to get user data
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.status(200).json({
      success: true,
      user: user
    });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




