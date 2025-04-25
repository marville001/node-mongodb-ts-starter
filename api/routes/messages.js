const router = require("express").Router();
const Message = require("../models/Message");

// Add a new message
router.post("/", async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    console.error(" Message Save Error:", err);
    res.status(500).json({ error: "Failed to save message." });
  }
});

// Get messages of a conversation
router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId }).lean();
    res.status(200).json(messages);
  } catch (err) {
    console.error(" Fetch Messages Error:", err);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});

// Delete a message
router.delete("/:id", async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    await message.deleteOne();
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error(" Delete Message Error:", err);
    res.status(500).json({ error: "Failed to delete message." });
  }
});

module.exports = router;
