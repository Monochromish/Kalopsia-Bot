const { model, Schema } = require('mongoose');
module.exports = model(
	'Warnings',
	new Schema({
		GuildID: String,
		UserID: String,
		WarnID: String,
		Reason: String,
		Moderator: String
	})
);
