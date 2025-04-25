// const router = require("express").Router();
// const Conversation = require("../models/Conversation");

// // Create a new conversation
// router.post("/", async (req, res) => {
//   try {
//     const newConversation = new Conversation({
//       members: [req.body.senderId, req.body.receiverId],
//     });

//     const savedConversation = await newConversation.save();
//     res.status(200).json(savedConversation);
//   } catch (err) {
//     console.error(" Conversation Creation Error:", err);
//     res.status(500).json({ error: "Failed to create conversation." });
//   }
// });

// // Get conversations of a user
// router.get("/:userId", async (req, res) => {
//   try {
//     const conversation = await Conversation.find({
//       members: { $in: [req.params.userId] },
//     }).lean(); 

//     res.status(200).json(conversation);
//   } catch (err) {
//     console.error(" Fetch Conversations Error:", err);
//     res.status(500).json({ error: "Failed to fetch conversations." });
//   }
// });

// // Get conversation between two users
// router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
//   try {
//     const conversation = await Conversation.findOne({
//       members: { $all: [req.params.firstUserId, req.params.secondUserId] },
//     }).lean(); 
//     res.status(200).json(conversation);
//   } catch (err) {
//     console.error(" Fetch Two-User Conversation Error:", err);
//     res.status(500).json({ error: "Failed to fetch conversation." });
//   }
// });

// module.exports = router; 


const router = require("express").Router();
const Conversation = require("../models/Conversation");

// Create a new conversation manually (if needed)
router.post("/", async (req, res) => {
  try {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });

    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    console.error("Conversation Creation Error:", err);
    res.status(500).json({ error: "Failed to create conversation." });
  }
});

// Get all conversations for a user
router.get("/:userId", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: "Failed to get conversations." });
  }
});

// Get conversation between 2 users
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ error: "Failed to find conversation." });
  }
});

// Delete a conversation by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Conversation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Conversation not found" });
    res.status(200).json({ message: "Conversation deleted", deleted });
  } catch (err) {
    console.error("Delete Conversation Error:", err);
    res.status(500).json({ error: "Failed to delete conversation." });
  }
});

module.exports = router;
