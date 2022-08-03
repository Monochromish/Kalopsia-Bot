const { model, Schema } = require('mongoose');
module.exports = model(
  'Order',
  new Schema({
    GuildID: String,
    UserID: String,
    UserName: String,
    Address: String,
    Phone: String,
    OrderDate: String,
    Size: String,
    MerchNumber: Number,
    Count: Number,
  })
);
