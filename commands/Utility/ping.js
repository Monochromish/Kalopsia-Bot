/* eslint-disable no-undef */
module.exports = {
	name : "ping",
	description: "PONG",
	aliases : ["ping", "pong", "uptime"],
	ussage : null,
	hidden : false,
	canDisabled : true,
	admin : false,
	owner : false,
	nsfw : false,
	run: async(client,message, args) => {
		const dt = new Date(message.createdTimestamp);
		message.channel.send(`🏓 Pong \`${new Date() - dt}ms\`| ws : \`${client.ws.ping}ms\` Bot Made By Monochrmish`).then(msg=>msg.delete({timeout:5000}));
	}
}