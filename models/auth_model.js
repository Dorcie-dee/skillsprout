import { model, Schema } from "mongoose";
// import { normalize } from "normalize-mongoose";

const authSchema = new Schema({
  fullname: { type: String, required: true, unique: true },
  age: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  role: { type: String, enum: ["child", "parent", "tutor"], default: "child" },
  // googleId: { type: String } //for oauth
  // parentLinkedId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // If child
  // badges: [{ type: String }],
  // progress: [{ lessonId: String, completed: Boolean }],
}, { timestamps: true });



// authSchema.plugin(normalize);

const blacklistSchema = new Schema({});
blacklistSchema.index({ createdAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24
  }
)

export const UserModel = model('User', authSchema);
export const BlacklistModel = model('Blacklist', blacklistSchema);