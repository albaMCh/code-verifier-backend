import mongoose from 'mongoose';
import { stringify } from 'querystring';

export const userEntity = () => {
  const userSchema = new mongoose.Schema(
    {
      name: String,
      description: String,
      level : Number,
      user: String,
      Data: DataView,
      Valoration: Number,
      Chances: Number

    }
  );
  return mongoose.model('Users', userSchema);
};