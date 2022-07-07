const { model, Schema } = require('mongoose');
module.exports = model(
  'Vote',
  new Schema({
    VoteID: Number, //ADMIN
    BluchipList: [String],
    RisingList: [String],
    BluechipWinnerList: [Number],
    RisingWinnerList: [Number],
    StartDate: Date,
    EndDate: Date,
  })
);
