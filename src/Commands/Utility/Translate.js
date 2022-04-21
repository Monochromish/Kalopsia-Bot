const { MessageEmbed } = require('discord.js');
const translate = require('@iamtraction/google-translate');
module.exports = {
  name: 'translate',
  description: 'Translate text.',
  options: [
    {
      name: 'input',
      description: 'Provide text.',
      type: 'STRING',
      required: true
    },
    {
      name: 'inputlanguage',
      type: 'STRING',
      description: 'Select input language. Default: Auto-Detect',
      required: false,
      choices: [
        {
          name: 'Auto-Detect',
          value: 'auto'
        },
        {
          name: 'English',
          value: 'en'
        },
        {
          name: 'Mandarin Chinese',
          value: 'zh-cn'
        },
        {
          name: 'Spanish',
          value: 'es'
        },
        {
          name: 'Hindi',
          value: 'hi'
        },
        {
          name: 'Arabic',
          value: 'ar'
        },
        {
          name: 'Malay',
          value: 'ms'
        },
        {
          name: 'Russian',
          value: 'ru'
        },
        {
          name: 'Bengali',
          value: 'bn'
        },
        {
          name: 'Portuguese',
          value: 'pt'
        },
        {
          name: 'French',
          value: 'fr'
        },
        {
          name: 'Hausa',
          value: 'ha'
        },
        {
          name: 'Punjabi',
          value: 'pa'
        },
        {
          name: 'German',
          value: 'de'
        },
        {
          name: 'Japanese',
          value: 'ja'
        },
        {
          name: 'Persian',
          value: 'fa'
        },
        {
          name: 'Swahili',
          value: 'sw'
        },
        {
          name: 'Vietnamese',
          value: 'vi'
        },
        {
          name: 'Telugu',
          value: 'te'
        },
        {
          name: 'Italian',
          value: 'it'
        },
        {
          name: 'Javanese',
          value: 'jw'
        },
        {
          name: 'Chinese Traditional',
          value: 'zh-tw'
        },
        {
          name: 'Korean',
          value: 'ko'
        },
        {
          name: 'Tamil',
          value: 'ta'
        },
        {
          name: 'Marathi',
          value: 'mr'
        }
      ]
    },
    {
      name: 'outputlanguage',
      type: 'STRING',
      description: 'Select output language. Default: English',
      required: false,
      choices: [
        {
          name: 'English',
          value: 'en'
        },
        {
          name: 'Mandarin Chinese',
          value: 'zh-cn'
        },
        {
          name: 'Spanish',
          value: 'es'
        },
        {
          name: 'Hindi',
          value: 'hi'
        },
        {
          name: 'Arabic',
          value: 'ar'
        },
        {
          name: 'Malay',
          value: 'ms'
        },
        {
          name: 'Russian',
          value: 'ru'
        },
        {
          name: 'Bengali',
          value: 'bn'
        },
        {
          name: 'Portuguese',
          value: 'pt'
        },
        {
          name: 'French',
          value: 'fr'
        },
        {
          name: 'Hausa',
          value: 'ha'
        },
        {
          name: 'Punjabi',
          value: 'pa'
        },
        {
          name: 'German',
          value: 'de'
        },
        {
          name: 'Japanese',
          value: 'ja'
        },
        {
          name: 'Persian',
          value: 'fa'
        },
        {
          name: 'Swahili',
          value: 'sw'
        },
        {
          name: 'Vietnamese',
          value: 'vi'
        },
        {
          name: 'Telugu',
          value: 'te'
        },
        {
          name: 'Italian',
          value: 'it'
        },
        {
          name: 'Javanese',
          value: 'jw'
        },
        {
          name: 'Chinese Traditional',
          value: 'zh-tw'
        },
        {
          name: 'Korean',
          value: 'ko'
        },
        {
          name: 'Tamil',
          value: 'ta'
        },
        {
          name: 'Marathi',
          value: 'mr'
        },
        {
          name: 'Urdu',
          value: 'ur'
        }
      ]
    }
  ],
  category: 'Utility',
  async run({ interaction, bot }) {
    const input = interaction.options.getString('input');
    const translateFrom = interaction.options.get('inputlanguage')?.value || 'auto';
    const translateTo = interaction.options.get('outputlanguage')?.value || 'en';

    translate(input, { from: translateFrom, to: translateTo }).then(res => {
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('BLURPLE')
            .addField(`Translated from:`, input)
            .addField(`Translated to`, res.text)
            .setFooter({ text: `${translateFrom} ➜ ${translateTo}` })
        ]
      });
    });
  }
};
