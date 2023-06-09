import mongoose from "mongoose";
import { IKata } from "../interfaces/IKata.interface";

export const kataEntity = () => {
  const kataSchema = new mongoose.Schema<IKata>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: String, required: true },
    intents: { type: Number, required: true },
    stars: {
      average: { type: Number, required: false },
      users: { type: [], required: true },
    },
    creator: { type: String, required: true },
    solution: { type: String, required: true },
    participants: { type: [], required: true },
  });

  return mongoose.models.Katas || mongoose.model<IKata>("Katas", kataSchema);
};
