const { model, Schema } = require('mongoose');
module.exports = model(
  'Goods',
  new Schema({
    GoodsID: Number,
    Src: String,
    Title: String,
    Size: [String],
    Price: Number,
    IsSoldout: Boolean,
  })
);
