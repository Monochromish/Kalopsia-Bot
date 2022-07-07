const { model, Schema } = require('mongoose');
module.exports = model(
  'Profile',
  new Schema({
    GuildID: String,
    UserID: String,
    Wallet: Number,
    Bank: Number,
    lastDaily: Date,
    lastWeekly: Date,
    lastMonthly: Date,
    BluechipChoice: Number,
    RisingChoice: Number,
    LastVote: Number,
  })
);
