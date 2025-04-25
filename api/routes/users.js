// const router = require("express").Router();
// const User = require("../models/User");
// const Post = require("../models/Post");
// const multer = require("multer");
// const path = require("path");
// const bcrypt = require("bcrypt");

// // Multer storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => {
//     const fileName = req.body.userId + "-" + Date.now() + path.extname(file.originalname);
//     cb(null, fileName);
//   },
// });
// const upload = multer({ storage });

// // Upload profile picture
// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const filePath = `http://localhost:8800/images/${req.file.filename}`;
//     res.status(200).json({ fullUrl: filePath });
//   } catch (err) {
//     res.status(500).json({ message: "Upload failed", error: err.message });
//   }
// });
// router.put("/:id/like", async (req, res) => {
//   const { userId, reason } = req.body;
//   if (req.params.id === userId)
//     return res.status(403).json({ message: "You can't like yourself!" });

//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found." });

//     const alreadyLiked = user.likes.find(like => like.userId === userId);
//     if (alreadyLiked) {
//       await user.updateOne({ $pull: { likes: { userId } } });
//       return res.status(200).json({ message: "Like removed." });
//     } else {
//       await user.updateOne({ $push: { likes: { userId, reason } } });
//       return res.status(200).json({ message: "User liked with reason!" });
//     }
//   } catch (err) {
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // Warn or Unwarn a user
// router.put("/:id/warn", async (req, res) => {
//   if (req.params.id === req.body.userId)
//     return res.status(403).json({ message: "You can't warn yourself!" });

//   try {
//     const user = await User.findById(req.params.id);
//     const userId = req.body.userId;
//     const reason = req.body.reason;

//     if (!user || !userId || !reason) return res.status(400).json({ message: "Missing data." });

//     const existingWarn = user.warnings.find(w => w.userId === userId);

//     if (existingWarn) {
//       // Unwarn
//       await user.updateOne({ $pull: { warnings: { userId } } });
//       const updated = await User.findById(req.params.id);
//       return res.status(200).json({
//         message: "User unwarned!",
//         warnCount: updated.warnings.length,
//         warnings: updated.warnings
//       });
//     } else {
//       // Warn with reason
//       await user.updateOne({ $push: { warnings: { userId, reason } } });
//       const updated = await User.findById(req.params.id);
//       return res.status(200).json({
//         message: "User warned!",
//         warnCount: updated.warnings.length,
//         warnings: updated.warnings
//       });
//     }
//   } catch (err) {
//     res.status(500).json({ message: "Error warning/unwarning user", error: err.message });
//   }
// });



// // User update
// router.put("/:id", async (req, res) => {
//   if (req.body.userId === req.params.id || req.body.isAdmin) {
//     if (req.body.password) {
//       try {
//         const salt = await bcrypt.genSalt(10);
//         req.body.password = await bcrypt.hash(req.body.password, salt);
//       } catch (err) {
//         return res.status(500).json({ message: "Password hashing failed", error: err.message });
//       }
//     }
//     try {
//       const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
//       const { password, updatedAt, ...rest } = updatedUser._doc;
//       res.status(200).json(rest);
//     } catch (err) {
//       res.status(500).json({ message: "User update failed", error: err.message });
//     }
//   } else {
//     res.status(403).json({ message: "Unauthorized!" });
//   }
// });

// // Delete user
// router.delete("/:id", async (req, res) => {
//   try {
//     if (req.body.userId === req.params.id || req.body.isAdmin) {
//       const user = await User.findByIdAndDelete(req.params.id);
//       res.status(200).json({ message: "User deleted", user });
//     } else {
//       res.status(403).json({ message: "Unauthorized!" });
//     }
//   } catch (err) {
//     res.status(500).json({ message: "User deletion failed", error: err.message });
//   }
// });

// // Get user info
// router.get("/", async (req, res) => {
//   const { userId, username } = req.query;
//   try {
//     const user = userId ? await User.findById(userId) : await User.findOne({ username });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const { password, updatedAt, ...rest } = user._doc;
//     res.status(200).json(rest);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching user", error: err.message });
//   }
// });

// // Get friends
// router.get("/friends/:userId", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     const friends = await Promise.all(user.followings.map(id => User.findById(id)));

//     const result = friends.map(f => ({
//       _id: f._id,
//       username: f.username,
//       profilePicture: f.profilePicture,
//       isOnline: f.isOnline,
//     }));
//     res.status(200).json(result);
//   } catch (err) {
//     res.status(500).json({ message: "Error getting friends", error: err.message });
//   }
// });

// // Follow
// router.put("/:id/follow", async (req, res) => {
//   if (req.body.userId !== req.params.id) {
//     try {
//       const user = await User.findById(req.params.id);
//       const currentUser = await User.findById(req.body.userId);
//       if (!user.followers.includes(req.body.userId)) {
//         await user.updateOne({ $push: { followers: req.body.userId } });
//         await currentUser.updateOne({ $push: { followings: req.params.id } });
//         res.status(200).json({ message: "Followed" });
//       } else {
//         res.status(403).json({ message: "Already following" });
//       }
//     } catch (err) {
//       res.status(500).json({ message: "Follow error", error: err.message });
//     }
//   } else {
//     res.status(403).json({ message: "Cannot follow yourself" });
//   }
// });

// // Unfollow
// router.put("/:id/unfollow", async (req, res) => {
//   if (req.body.userId !== req.params.id) {
//     try {
//       const user = await User.findById(req.params.id);
//       const currentUser = await User.findById(req.body.userId);
//       if (user.followers.includes(req.body.userId)) {
//         await user.updateOne({ $pull: { followers: req.body.userId } });
//         await currentUser.updateOne({ $pull: { followings: req.params.id } });
//         res.status(200).json({ message: "Unfollowed" });
//       } else {
//         res.status(403).json({ message: "Not following this user" });
//       }
//     } catch (err) {
//       res.status(500).json({ message: "Unfollow error", error: err.message });
//     }
//   } else {
//     res.status(403).json({ message: "Cannot unfollow yourself" });
//   }
// });

// // Get online friends
// router.get("/online-friends/:userId", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     const onlineFriends = await User.find({
//       _id: { $in: user.followings },
//       isOnline: true,
//     });
//     res.status(200).json(onlineFriends);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching online friends", error: err.message });
//   }
// });

// // 🔍 Search users by username (partial match)
// router.get("/search", async (req, res) => {
//   const { query } = req.query;
//   if (!query || query.length < 1) {
//     return res.status(400).json({ message: "Missing or invalid query." });
//   }

//   try {
//     const users = await User.find({
//       username: { $regex: query, $options: "i" }, // case-insensitive match
//     }).select("_id username profilePicture");

//     res.status(200).json(users);
//   } catch (err) {
//     console.error("Search users error:", err);
//     res.status(500).json({ message: "Server error during search." });
//   }
// });



// module.exports = router;


const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Conversation = require("../models/Conversation");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const fileName = req.body.userId + "-" + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});
const upload = multer({ storage });

// Upload profile picture
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = `http://localhost:8800/images/${req.file.filename}`;
    res.status(200).json({ fullUrl: filePath });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

router.put("/:id/like", async (req, res) => {
  const { userId, reason } = req.body;
  if (req.params.id === userId)
    return res.status(403).json({ message: "You can't like yourself!" });

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const alreadyLiked = user.likes.find(like => like.userId === userId);
    if (alreadyLiked) {
      await user.updateOne({ $pull: { likes: { userId } } });
      return res.status(200).json({ message: "Like removed." });
    } else {
      await user.updateOne({ $push: { likes: { userId, reason } } });
      return res.status(200).json({ message: "User liked with reason!" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Warn or Unwarn a user
router.put("/:id/warn", async (req, res) => {
  if (req.params.id === req.body.userId)
    return res.status(403).json({ message: "You can't warn yourself!" });

  try {
    const user = await User.findById(req.params.id);
    const userId = req.body.userId;
    const reason = req.body.reason;

    if (!user || !userId || !reason) return res.status(400).json({ message: "Missing data." });

    const existingWarn = user.warnings.find(w => w.userId === userId);

    if (existingWarn) {
      await user.updateOne({ $pull: { warnings: { userId } } });
      const updated = await User.findById(req.params.id);
      return res.status(200).json({
        message: "User unwarned!",
        warnCount: updated.warnings.length,
        warnings: updated.warnings
      });
    } else {
      await user.updateOne({ $push: { warnings: { userId, reason } } });
      const updated = await User.findById(req.params.id);
      return res.status(200).json({
        message: "User warned!",
        warnCount: updated.warnings.length,
        warnings: updated.warnings
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Error warning/unwarning user", error: err.message });
  }
});

// User update
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json({ message: "Password hashing failed", error: err.message });
      }
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      const { password, updatedAt, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } catch (err) {
      res.status(500).json({ message: "User update failed", error: err.message });
    }
  } else {
    res.status(403).json({ message: "Unauthorized!" });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "User deleted", user });
    } else {
      res.status(403).json({ message: "Unauthorized!" });
    }
  } catch (err) {
    res.status(500).json({ message: "User deletion failed", error: err.message });
  }
});

// Get user info
router.get("/", async (req, res) => {
  const { userId, username } = req.query;
  try {
    const user = userId ? await User.findById(userId) : await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { password, updatedAt, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
});

// Get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(user.followings.map(id => User.findById(id)));

    const result = friends.map(f => ({
      _id: f._id,
      username: f.username,
      profilePicture: f.profilePicture,
      isOnline: f.isOnline,
    }));
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Error getting friends", error: err.message });
  }
});

// Follow
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });

        // Auto-create conversation if it doesn't exist
        const existingConversation = await Conversation.findOne({
          members: { $all: [req.body.userId, req.params.id] },
        });
        if (!existingConversation) {
          const newConversation = new Conversation({ members: [req.body.userId, req.params.id] });
          await newConversation.save();
        }

        res.status(200).json({ message: "Followed and conversation created if new" });
      } else {
        res.status(403).json({ message: "Already following" });
      }
    } catch (err) {
      res.status(500).json({ message: "Follow error", error: err.message });
    }
  } else {
    res.status(403).json({ message: "Cannot follow yourself" });
  }
});

// Unfollow
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json({ message: "Unfollowed" });
      } else {
        res.status(403).json({ message: "Not following this user" });
      }
    } catch (err) {
      res.status(500).json({ message: "Unfollow error", error: err.message });
    }
  } else {
    res.status(403).json({ message: "Cannot unfollow yourself" });
  }
});

// Get online friends
router.get("/online-friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const onlineFriends = await User.find({
      _id: { $in: user.followings },
      isOnline: true,
    });
    res.status(200).json(onlineFriends);
  } catch (err) {
    res.status(500).json({ message: "Error fetching online friends", error: err.message });
  }
});

// 🔍 Search users by username (partial match)
router.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query || query.length < 1) {
    return res.status(400).json({ message: "Missing or invalid query." });
  }

  try {
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("_id username profilePicture");

    res.status(200).json(users);
  } catch (err) {
    console.error("Search users error:", err);
    res.status(500).json({ message: "Server error during search." });
  }
});

module.exports = router;
