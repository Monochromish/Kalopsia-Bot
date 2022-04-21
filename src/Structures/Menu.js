const { MessageButton, MessageActionRow } = require('discord.js');

module.exports = class Menu {
	constructor(bot, interaction, options) {
		this.bot = bot;
		this.interaction = interaction;
		this.options = options;
		this.arrowLeft = new MessageButton().setEmoji('⬅️').setCustomId('left').setStyle('PRIMARY');
		this.arrowRight = new MessageButton().setEmoji('➡️').setCustomId('right').setStyle('PRIMARY');
		this.index = 0;
	}

	setButtonStates() {
		this.arrowLeft.setDisabled(!this.index);
		this.arrowRight.setDisabled(this.index === this.options.pages.length - 1);
	}

	async start() {
		const iconURL =
			this.interaction.guild.iconURL() ||
			'https://tenor.com/view/fucking-die-redditor-stupid-cuck-funny-cat-fumble-leonardo-de-carpio-gif-15197525'; // https://www.youtube.com/watch?v=dQw4w9WgXcQ

		this.setButtonStates();

		const message = await this.interaction.reply({
			embeds: [
				this.options.embed
					.setFooter({
						text: `Page ${this.index + 1} out of ${this.options.pages.length}`,
						iconURL
					})
					.setDescription(this.options.pages[this.index])
			],
			components: [new MessageActionRow().addComponents([this.arrowLeft, this.arrowRight])],
			fetchReply: true
		});

		const collector = message.createMessageComponentCollector({ time: 1000 * 180 });

		collector.on('collect', async i => {
			if (i.user.id !== this.interaction.user.id)
				return await i.reply({ ephemeral: true, content: 'These components are not for you.' });

			if (i.customId === 'left') this.index--;
			else this.index++;

			this.setButtonStates();
			await i.update({
				embeds: [
					this.options.embed
						.setFooter({
							text: `Page ${this.index + 1} out of ${this.options.pages.length}`,
							iconURL
						})
						.setDescription(this.options.pages[this.index])
				],
				components: [new MessageActionRow().addComponents([this.arrowLeft, this.arrowRight])]
			});
		});
		collector.on('end', async () => {
			if (message.editable)
				await message.edit({
					embeds: [this.options.embed.setFooter({ text: 'Menu disabled', iconURL })],
					components: [new MessageActionRow().addComponents([this.arrowLeft, this.arrowRight])]
				});
		});
	}
};
