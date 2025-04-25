// const mongoose = require("mongoose");

// const ConversationSchema = new mongoose.Schema(
//   {
//     members: {
//       type: Array,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Conversation", ConversationSchema);

const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);