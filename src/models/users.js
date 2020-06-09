

import mongoose from 'mongoose';
/**
 * User Mongoose Schema
 */
const userSchema = new mongoose.Schema({
    firstname: { type: String },
    lastname: { type: String },
  username: { type: String, unique: true, required: true },
  password: { type: String },
  role:{type:String,default:'User'}
});

const User = new mongoose.model('User', userSchema);

export default User;
