const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");


const conversationRoute = require("./routes/conversations"); 
const messageRoute = require("./routes/messages");

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();

const app = express();

// Ensure 'public/images' folder exists
const uploadDirectory = path.join(__dirname, "public", "images");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB Connection Error:", err));

//  Middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(helmet());
app.use(morgan("common"));
app.use(express.json());

//  Properly Serve Images with CORP Headers
app.use("/images", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); // Fix NotSameOrigin Error
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all domains
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Expires", "0");
  res.setHeader("Pragma", "no-cache");
  next();
}, express.static(path.join(__dirname, "public", "images")));

//  Multer Storage for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max File Size: 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

//  File Upload Route
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    console.log(" File uploaded:", req.file.filename);

    return res.status(200).json({
      fileName: req.file.filename,
      filePath: `/images/${req.file.filename}`,
      fullUrl: `http://localhost:8800/images/${req.file.filename}?t=${Date.now()}`
    });
  } catch (err) {
    console.error(" File Upload Error:", err);
    return res.status(500).json({ error: "Something went wrong while uploading the file." });
  }
});

//  Register API Routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute); 
app.use("/api/messages", messageRoute);

//  Start the Server
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(` Backend Server is running on port ${PORT}`);
});


// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const cors = require("cors");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");


// const conversationRoute = require("./routes/conversations"); 
// const messageRoute = require("./routes/messages");

// const userRoute = require("./routes/users");
// const authRoute = require("./routes/auth");
// const postRoute = require("./routes/posts");

// dotenv.config();

// const app = express();

// // Ensure 'public/images' folder exists
// const uploadDirectory = path.join(__dirname, "public", "images");
// if (!fs.existsSync(uploadDirectory)) {
//   fs.mkdirSync(uploadDirectory, { recursive: true });
// }

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => console.log(" Connected to MongoDB"))
//   .catch((err) => console.error(" MongoDB Connection Error:", err));

// //  Middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:3000", 
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// }));



// app.use(helmet());
// app.use(morgan("common"));
// app.use(express.json());

// //  Properly Serve Images with CORP Headers
// app.use("/images", (req, res, next) => {
//   res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); // Fix NotSameOrigin Error
//   res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all domains
//   res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//   res.setHeader("Expires", "0");
//   res.setHeader("Pragma", "no-cache");
//   next();
// }, express.static(path.join(__dirname, "public", "images")));

// //  Multer Storage for File Uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Max File Size: 5MB
//   fileFilter: (req, file, cb) => {
//     if (!file.mimetype.startsWith("image/")) {
//       return cb(new Error("Only image files are allowed!"), false);
//     }
//     cb(null, true);
//   },
// });

// //  File Upload Route
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded." });
//     }

//     console.log(" File uploaded:", req.file.filename);

//     return res.status(200).json({
//       fileName: req.file.filename,
//       filePath: `/images/${req.file.filename}`,
//       fullUrl: `http://localhost:8800/images/${req.file.filename}?t=${Date.now()}`
//     });
//   } catch (err) {
//     console.error(" File Upload Error:", err);
//     return res.status(500).json({ error: "Something went wrong while uploading the file." });
//   }
// });

// //  Register API Routes
// app.use("/api/users", userRoute);
// app.use("/api/auth", authRoute);
// app.use("/api/posts", postRoute);
// app.use("/api/conversations", conversationRoute); 
// app.use("/api/messages", messageRoute);
// // Default root route for Render health check or basic response
// app.get("/", (req, res) => {
//   res.send(" Chat Together Backend is running on Render ");
// });

// // Start the Server
// const PORT = process.env.PORT || 8800; 
// app.listen(PORT, () => {
//   console.log(`Backend Server is running on port ${PORT}`);
// });




