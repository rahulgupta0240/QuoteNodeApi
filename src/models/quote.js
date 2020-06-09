import mongoose from 'mongoose';

/**
 * Quotes Mongoose schema
 *   createdBy is referencing to User will need object id of User
 */
const quoteSchema = new mongoose.Schema({
    author: { type: String },
    quote: { type: String },
    likes: { type: Number },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'},
},{
    timestamps:true
});

const Quote = new mongoose.model('Quote', quoteSchema);

export default Quote;
