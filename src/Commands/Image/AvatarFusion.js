const request = require('node-superfetch');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  name: 'avatarfusion',
  description: 'Fuse two avatars.',
  options: [
    {
      name: 'base',
      description: 'Mention someone for base profile.',
      required: true,
      type: 'USER'
    },
    {
      name: 'overlay',
      description: 'Mention someone for overlay profile.',
      required: false,
      type: 'USER'
    },
    {
      name: 'type',
      type: 'STRING',
      description: 'Avatar type',
      required: false,
      choices: [
        {
          name: 'Server Avatar',
          value: 'server_avatar'
        },
        {
          name: 'Global Avatar',
          value: 'global_avatar'
        }
      ]
    }
  ],
  category: 'Image',
  async run({ interaction, bot }) {
    const base = interaction.options.getUser('base');
    const overlay = interaction.options.getUser('overlay') || interaction.user;

    const baseURL =
      !interaction.options.get('type') || interaction.options.get('type')?.value === 'server_avatar'
        ? base.displayAvatarURL({ format: 'png', size: 512 })
        : base.avatarURL({ format: 'png', size: 512 });
    const overlayURL =
      !interaction.options.get('type') || interaction.options.get('type')?.value === 'server_avatar'
        ? overlay.displayAvatarURL({ format: 'png', size: 512 })
        : overlay.avatarURL({ format: 'png', size: 512 });

    const baseAvatarData = await request.get(baseURL);
    const baseAvatar = await loadImage(baseAvatarData.body);
    const overlayAvatarData = await request.get(overlayURL);
    const overlayAvatar = await loadImage(overlayAvatarData.body);
    const canvas = createCanvas(baseAvatar.width, baseAvatar.height);
    const ctx = canvas.getContext('2d');
    ctx.globalAlpha = 0.5;
    ctx.drawImage(baseAvatar, 0, 0);
    ctx.drawImage(overlayAvatar, 0, 0, baseAvatar.width, baseAvatar.height);
    return interaction.reply({
      files: [{ attachment: canvas.toBuffer(), name: 'avatar-fusion.png' }]
    });
  }
};
