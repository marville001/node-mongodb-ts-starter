// const router = require("express").Router();
// const User = require("../models/User");
// const bcrypt = require("bcrypt");

// //  User Registration
// router.post("/register", async (req, res) => {
//     try {
//         // Check if required fields are provided
//         if (!req.body.username || !req.body.email || !req.body.password) {
//             return res.status(400).json({ message: "All fields are required." });
//         }

//         // Check if username or email already exists
//         const existingUser = await User.findOne({ 
//             $or: [{ username: req.body.username }, { email: req.body.email }]
//         });

//         if (existingUser) {
//             return res.status(400).json({ message: "Username or email already exists." });
//         }

//         // Hash password securely
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(req.body.password, salt);

//         // Create new user
//         const newUser = new User({
//             username: req.body.username,
//             email: req.body.email,
//             password: hashedPassword,
//             age: req.body.age,
//         });

//         // Save user to database
//         const user = await newUser.save();
//         res.status(201).json(user);

//     } catch (err) {
//         console.error("Error during registration:", err);
//         res.status(500).json({ message: "Internal Server Error", error: err.message });
//     }
// });

// //  User Login and Mark as Online
// router.post("/login", async (req, res) => {
//   try {
//       if (!req.body.email || !req.body.password) {
//           return res.status(400).json({ message: "Email and password are required." });
//       }

//       const user = await User.findOne({ email: req.body.email });
//       if (!user) return res.status(404).json({ message: "User not found" });

//       const validPassword = await bcrypt.compare(req.body.password, user.password);
//       if (!validPassword) return res.status(400).json({ message: "Invalid password" });

//       //  Update the online status when user logs in
//       await User.findByIdAndUpdate(user._id, { isOnline: true });

//       const { password, ...userData } = user._doc;
//       res.status(200).json(userData);
//   } catch (err) {
//       res.status(500).json({ message: "Error during login", error: err.message });
//   }
// });

// // User Logout and Mark as Offline
// router.post("/logout/:userId", async (req, res) => {
//   try {
//       await User.findByIdAndUpdate(req.params.userId, { isOnline: false });
//       res.status(200).json({ message: "User has logged out successfully" });
//   } catch (err) {
//       res.status(500).json({ message: "Error during logout", error: err.message });
//   }
// });
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// ==================================
// REGISTER USER
// POST /api/auth/register
// ==================================
router.post("/register", async (req, res) => {
  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user object (including the age field)
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      age: req.body.age, // Ensure the frontend sends this as a number
    });

    // Save user to the database
    const savedUser = await newUser.save();

    // Exclude the password from the returned user object
    const { password, ...userWithoutPassword } = savedUser._doc;
    res.status(200).json(userWithoutPassword);
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// ==================================
// LOGIN USER
// POST /api/auth/login
// ==================================
router.post("/login", async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare the provided password with the stored hashed password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Wrong password" });

    // Return user info without the password field
    const { password, ...userWithoutPassword } = user._doc;
    res.status(200).json(userWithoutPassword);
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

module.exports = router;
