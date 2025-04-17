
import { model, Schema } from "mongoose";
import normalize from 'normalize-mongoose';

const offlineSchema = new Schema({
  activityId: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  materialsNeeded: { type: String }
}, { timestamps: true });

offlineSchema.plugin(normalize);

export const OfflineModel = model('Offline_activity', offlineSchema)