

// const mongoose = require("mongoose");

// const ReactionSchema = new mongoose.Schema({
//   userId: { type: String, required: true },
//   reason: { type: String, required: true },
// });

// const CommentSchema = new mongoose.Schema({
//   userId: { type: String, required: true },
//   text: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const PostSchema = new mongoose.Schema(
//   {
//     userId: { type: String, required: true },
//     desc: { type: String, max: 600 },
//     img: { type: String },
//     likes: { type: [ReactionSchema], default: [] },
//     warnings: { type: [ReactionSchema], default: [] },
//     comments: { type: [CommentSchema], default: [] },
//   },
  
//   { timestamps: true }
// );

// module.exports = mongoose.model("Post", PostSchema);

const mongoose = require("mongoose");

const ReactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  reason: { type: String, required: true },
});

const CommentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    desc: { type: String, max: 600 },
    img: { type: String },
    allowedAge: {
      type: String,
      enum: ["12-14", "14-16", "16 above"],
      default: "16 above",
    },
    
    likes: { type: [ReactionSchema], default: [] },
    warnings: { type: [ReactionSchema], default: [] },
    comments: { type: [CommentSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
