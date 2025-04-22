import { model, Schema, Types } from "mongoose";
import normalize from 'normalize-mongoose';

const gameSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
  xp: { type: Number, default: 0 }, // Experience points
  level: { type: Number, default: 1 }, // Current level
  badges: [
    {
      name: String,
      description: String,
      iconUrl: String,
      earnedAt: { type: Date, default: Date.now }
    }
  ],
  streak: {
    count: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null }
  },
  achievements: [
    {
      title: String,
      description: String,
      unlockedAt: { type: Date, default: Date.now }
    }
  ],
  unlockedLessons: [{ type: Types.ObjectId, ref: 'Course' }]
}, { timestamps: true });




gameSchema.plugin(normalize);

export const GameModel = model('Gamification', gameSchema);

