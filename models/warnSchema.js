const mongoose = require('mongoose');

const warnSchema = new mongoose.Schema({
    guildID: String,
    memberID: String,
    warnings: Array,
    moderator: Array,
    date: Array  
})

module.exports = mongoose.model('WarnSchema', warnSchema)