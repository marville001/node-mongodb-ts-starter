
// // module.exports = router;
// const router = require("express").Router();
// const mongoose = require("mongoose");
// const User = require("../models/User");
// const Post = require("../models/Post");
// const multer = require("multer");
// const path = require("path");

// // Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => {
//     const fileName = req.body.userId + "-" + Date.now() + path.extname(file.originalname);
//     cb(null, fileName);
//   },
// });
// const upload = multer({ storage });

// // Upload Profile Picture
// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const filePath = `http://localhost:8800/images/${req.file.filename}`;
//     res.status(200).json({ fullUrl: filePath });
//   } catch (err) {
//     res.status(500).json({ message: "Upload failed", error: err.message });
//   }
// });

// // Create a Post
// router.post("/", async (req, res) => {
//   const newPost = new Post(req.body);
//   try {
//     const savedPost = await newPost.save();
//     res.status(200).json(savedPost);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // Update a Post
// router.put("/:id", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (post.userId === req.body.userId) {
//       await post.updateOne({ $set: req.body });
//       res.status(200).json("The post has been updated");
//     } else {
//       res.status(403).json("You can update only your post");
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // Delete a Post
// router.delete("/:id", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json("Post not found");
//     if (post.userId !== req.body.userId) {
//       return res.status(403).json("You can delete only your own post");
//     }
//     await Post.findByIdAndDelete(req.params.id);
//     res.status(200).json("Post has been deleted");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // Like a Post (Toggle Like)
// router.put("/:id/like", async (req, res) => {
//   try {
//     // Validate input
//     if (!req.body.userId) return res.status(400).json({ message: "UserId is required" });
//     if (!req.body.reason || typeof req.body.reason !== 'string' || !req.body.reason.trim()) {
//       return res.status(400).json({ message: "A valid like reason is required" });
//     }

//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     // Handle legacy data: if the first element is a string, convert the entire array.
//     if (post.likes.length > 0 && typeof post.likes[0] === "string") {
//       post.likes = post.likes.map(l => ({ userId: l, reason: "Unknown" }));
//       await post.save();
//     }

//     // Look for an existing like for this user
//     const existingLike = post.likes.find(like => like.userId === req.body.userId);
//     if (!existingLike) {
//       // Add the new like object
//       await post.updateOne({ $push: { likes: { userId: req.body.userId, reason: req.body.reason } } });
//       return res.status(200).json({ message: "Post has been liked" });
//     } else {
//       // Remove the like object for this user
//       await post.updateOne({ $pull: { likes: { userId: req.body.userId } } });
//       return res.status(200).json({ message: "Post has been disliked" });
//     }
//   } catch (err) {
//     console.error("Error in like route:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ------------------ Warn a Post (Toggle Warning) ------------------
// router.put("/:id/warn", async (req, res) => {
//   try {
//     if (!req.body.userId) return res.status(400).json({ message: "UserId is required" });
//     if (!req.body.reason || typeof req.body.reason !== "string" || !req.body.reason.trim()) {
//       return res.status(400).json({ message: "A valid warning reason is required" });
//     }

//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     // Prevent the post owner from warning their own post
//     if (req.body.userId === post.userId) {
//       return res.status(403).json({ message: "You cannot warn your own post!" });
//     }

//     // If legacy warnings stored as strings exist, convert them on the fly
//     if (post.warnings.length > 0 && typeof post.warnings[0] === "string") {
//       post.warnings = post.warnings.map(w => ({ userId: w, reason: "Unknown" }));
//       await post.save();
//     }

//     const existingWarning = post.warnings.find(w => w.userId === req.body.userId);
//     if (!existingWarning) {
//       await post.updateOne({ $push: { warnings: { userId: req.body.userId, reason: req.body.reason } } });
//       return res.status(200).json({ message: "Post has been warned" });
//     } else {
//       await post.updateOne({ $pull: { warnings: { userId: req.body.userId } } });
//       return res.status(200).json({ message: "Post warning removed" });
//     }
//   } catch (err) {
//     console.error("Error in warn route:", err);
//     res.status(500).json({ error: err.message });
//   }
// });


// // Get Comments for a Post
// router.get("/:id/comments", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json("Post not found");
//     res.status(200).json(post.comments);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching comments", error: err.message });
//   }
// });

// // Add a Comment to a Post 
// router.post("/:id/comment", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json("Post not found");
//     const newComment = {
//       userId: req.body.userId,
//       text: req.body.text,
//       createdAt: new Date(),
//     };
//     await post.updateOne({ $push: { comments: newComment } });
//     const updatedPost = await Post.findById(req.params.id);
//     res.status(200).json({ message: "Comment added", comments: updatedPost.comments });
//   } catch (err) {
//     res.status(500).json({ message: "Error adding comment", error: err.message });
//   }
// });

// // Delete a Comment from a Post
// router.delete("/:id/comment/:commentId", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json("Post not found");
//     await post.updateOne({ $pull: { comments: { _id: req.params.commentId } } });
//     const updatedPost = await Post.findById(req.params.id);
//     res.status(200).json({ message: "Comment deleted", comments: updatedPost.comments });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting comment", error: err.message });
//   }
// });

// // Get Timeline Posts
// router.get("/timeline/all", async (req, res) => {
//   try {
//     const userId = req.query.userId;
//     if (!userId) return res.status(400).json("User ID is required");
//     if (!mongoose.Types.ObjectId.isValid(userId))
//       return res.status(400).json("Invalid user ID");
//     const currentUser = await User.findById(userId);
//     if (!currentUser) return res.status(404).json("User not found");
//     const userPosts = await Post.find({ userId: currentUser._id });
//     const friendPosts = await Promise.all(
//       currentUser.followings.map((friendId) => Post.find({ userId: friendId }))
//     );
//     res.status(200).json(userPosts.concat(...friendPosts));
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // Get Posts from a User's Profile
// router.get("/profile/:username", async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.params.username });
//     if (!user) return res.status(404).json("User not found");
//     const posts = await Post.find({ userId: user._id });
//     res.status(200).json(posts);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// //Get a Specific Post (Catch-all, placed last) 
// router.get("/:id", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     res.status(200).json(post);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// module.exports = router;



// module.exports = router;
const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");
const multer = require("multer");
const path = require("path");

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const fileName = req.body.userId + "-" + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});
const upload = multer({ storage });

// Upload Profile Picture
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = `http://localhost:8800/images/${req.file.filename}`;
    res.status(200).json({ fullUrl: filePath });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

// Create a Post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a Post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("The post has been updated");
    } else {
      res.status(403).json("You can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a Post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found");
    if (post.userId !== req.body.userId) {
      return res.status(403).json("You can delete only your own post");
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json("Post has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Like a Post (Toggle Like)
router.put("/:id/like", async (req, res) => {
  try {
    // Validate input
    if (!req.body.userId) return res.status(400).json({ message: "UserId is required" });
    if (!req.body.reason || typeof req.body.reason !== 'string' || !req.body.reason.trim()) {
      return res.status(400).json({ message: "A valid like reason is required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Handle legacy data: if the first element is a string, convert the entire array.
    if (post.likes.length > 0 && typeof post.likes[0] === "string") {
      post.likes = post.likes.map(l => ({ userId: l, reason: "Unknown" }));
      await post.save();
    }

    // Look for an existing like for this user
    const existingLike = post.likes.find(like => like.userId === req.body.userId);
    if (!existingLike) {
      // Add the new like object
      await post.updateOne({ $push: { likes: { userId: req.body.userId, reason: req.body.reason } } });
      return res.status(200).json({ message: "Post has been liked" });
    } else {
      // Remove the like object for this user
      await post.updateOne({ $pull: { likes: { userId: req.body.userId } } });
      return res.status(200).json({ message: "Post has been disliked" });
    }
  } catch (err) {
    console.error("Error in like route:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------ Warn a Post (Toggle Warning) ------------------
router.put("/:id/warn", async (req, res) => {
  try {
    if (!req.body.userId) return res.status(400).json({ message: "UserId is required" });
    if (!req.body.reason || typeof req.body.reason !== "string" || !req.body.reason.trim()) {
      return res.status(400).json({ message: "A valid warning reason is required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Prevent the post owner from warning their own post
    if (req.body.userId === post.userId) {
      return res.status(403).json({ message: "You cannot warn your own post!" });
    }

    // If legacy warnings stored as strings exist, convert them on the fly
    if (post.warnings.length > 0 && typeof post.warnings[0] === "string") {
      post.warnings = post.warnings.map(w => ({ userId: w, reason: "Unknown" }));
      await post.save();
    }

    const existingWarning = post.warnings.find(w => w.userId === req.body.userId);
    if (!existingWarning) {
      await post.updateOne({ $push: { warnings: { userId: req.body.userId, reason: req.body.reason } } });
      return res.status(200).json({ message: "Post has been warned" });
    } else {
      await post.updateOne({ $pull: { warnings: { userId: req.body.userId } } });
      return res.status(200).json({ message: "Post warning removed" });
    }
  } catch (err) {
    console.error("Error in warn route:", err);
    res.status(500).json({ error: err.message });
  }
});


// Get Comments for a Post
router.get("/:id/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found");
    res.status(200).json(post.comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments", error: err.message });
  }
});

// Add a Comment to a Post
router.post("/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found");

    const newComment = {
      userId: req.body.userId,
      text: req.body.text,
      createdAt: new Date(),
    };

    post.comments.push(newComment); 
    await post.save();              

    res.status(200).json({ message: "Comment added", comments: post.comments });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
});


// Delete a Comment from a Post
router.delete("/:id/comment/:commentId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found");

    post.comments = post.comments.filter(c => c._id.toString() !== req.params.commentId);
    await post.save();

    res.status(200).json({ message: "Comment deleted", comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: "Error deleting comment", error: err.message });
  }
});


// Get Timeline Posts
router.get("/timeline/all", async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json("User ID is required");
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json("Invalid user ID");
    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json("User not found");
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => Post.find({ userId: friendId }))
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Posts from a User's Profile
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json("User not found");
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get a Specific Post (Catch-all, placed last) 
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
