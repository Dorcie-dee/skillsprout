
import { model, Schema } from "mongoose";
// import { normalize } from "normalize-mongoose";

const authSchema = new Schema({
  fullname: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  profilePicture: { type: String, default: "" },
  role: { type: String, enum: ["student", "tutor", "admin"], default: "student" },
  badges: { type: [String], default: [] }, //eco hero, quiz star
  progress: { type: Map, of: Number, default: {}}, 
// preferences: {type: String, enum: ['nature', 'art', 'language', 3]}},
  // parentLinkedId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // If child
  // googleId: { type: String } //for oauth
}, {timestamps: true });



// authSchema.plugin(normalize);

const blacklistSchema = new Schema({});
blacklistSchema.index({ createdAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24
  }
)

export const UserModel = model('User', authSchema);
export const BlacklistModel = model('Blacklist', blacklistSchema);