// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       min: 3,
//       max: 20,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       max: 50,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       min: 6,
//     },
//     profilePicture: {
//       type: String,
//       default: "",
//     },
//     coverPicture: {
//       type: String,
//       default: "",
//     },
//     followers: {
//       type: Array,
//       default: [],
//     },
//     followings: {
//       type: Array,
//       default: [],
//     },
//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },
//     isOnline: {
//       type: Boolean,
//       default: false, 
//     },
//     desc: {
//       type: String,
//       max: 50,
//     },
//     city: {
//       type: String,
//       max: 50,
//     },
//     from: {
//       type: String,
//       max: 50,
//     },
//     relationship: {
//       type: Number,
//       enum: [1, 2, 3],
//     },
//     age: { 
//       type: Number, 
//       min: 0,        
//       max: 120,      
//       default: null, 
//     },

//     likes: [
//       {
//         userId: { type: String, required: true },
//         reason: { type: String, required: true }
//       }
//     ],
//     warnings: [
//       {
//         userId: { type: String, required: true },
//         reason: { type: String, required: true }
//       }
//     ]
    
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", UserSchema);

//new 

// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       min: 3,
//       max: 20,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       max: 50,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       min: 6,
//     },
//     profilePicture: {
//       type: String,
//       default: "",
//     },
//     coverPicture: {
//       type: String,
//       default: "",
//     },
//     followers: {
//       type: Array,
//       default: [],
//     },
//     followings: {
//       type: Array,
//       default: [],
//     },
//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },
//     isOnline: {
//       type: Boolean,
//       default: false, 
//     },
//     desc: {
//       type: String,
//       max: 50,
//     },
//     city: {
//       type: String,
//       max: 50,
//     },
//     from: {
//       type: String,
//       max: 50,
//     },
//     relationship: {
//       type: Number,
//       enum: [1, 2, 3],
//     },
//     age: { 
//       type: Number, 
//       required: true,  
//       min: 0,        
//       max: 120,      
//     },
    

//     likes: [
//       {
//         userId: { type: String, required: true },
//         reason: { type: String, required: true }
//       }
//     ],
//     warnings: [
//       {
//         userId: { type: String, required: true },
//         reason: { type: String, required: true }
//       }
//     ]
    
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false, 
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
    age: { 
      type: Number, 
      required: true,   // enforce age provided during registration
      min: 0,        
      max: 120,      
    },

    likes: [
      {
        userId: { type: String, required: true },
        reason: { type: String, required: true }
      }
    ],
    warnings: [
      {
        userId: { type: String, required: true },
        reason: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
