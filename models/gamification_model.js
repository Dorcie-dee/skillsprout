import { model, Schema } from "mongoose";
import normalize from 'normalize-mongoose';


const gameSchema = new Schema({
  title: {type: String, required: true},
  game_id: {type: String},
  gameUrl: {type: String}
}, {timestamps: true});


gameSchema.plugin(normalize);

export const GameModel = model('Gamification', gameSchema);