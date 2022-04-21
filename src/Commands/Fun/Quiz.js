const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fetch = require('node-fetch');
const { shuffleArray } = require('../../Structures/Utils');
const { decode } = require('html-entities');

module.exports = {
  name: 'quiz',
  description: 'Quiz time.',
  category: 'Fun',
  options: [
    {
      name: 'category',
      type: 'STRING',
      description: 'Question Category.',
      required: false,
      choices: [
        {
          name: 'Any Category',
          value: 'any'
        },
        {
          name: 'General Knowledge',
          value: '&category=9'
        },
        {
          name: 'Entertainment: Books',
          value: '&category=10'
        },
        {
          name: 'Entertainment: Films',
          value: '&category=11'
        },
        {
          name: 'Entertainment: Music',
          value: '&category=12'
        },
        {
          name: 'Entertainment: Musicals & Theaters',
          value: '&category=13'
        },
        {
          name: 'Entertainment: Television',
          value: '&category=14'
        },
        {
          name: 'Entertainment: Video Games',
          value: '&category=15'
        },
        {
          name: 'Entertainment: Board Games',
          value: '&category=16'
        },
        {
          name: 'Entertainment: Comics',
          value: '&category=17'
        },
        {
          name: 'Entertainment: Japanese Anime & Manga',
          value: '&category=18'
        },
        {
          name: 'Entertainment: Cartoon & Animations',
          value: '&category=19'
        },
        {
          name: 'Science & Nature',
          value: '&category=20'
        },
        {
          name: 'Science: Computers',
          value: '&category=21'
        },
        {
          name: 'Science: Mathematics',
          value: '&category=22'
        },
        {
          name: 'Science: Gadgets',
          value: '&category=23'
        },
        {
          name: 'Mythology',
          value: '&category=24'
        },
        {
          name: 'Sports',
          value: '&category=25'
        },
        {
          name: 'Geography',
          value: '&category=26'
        },
        {
          name: 'History',
          value: '&category=27'
        },
        {
          name: 'Politics',
          value: '&category=28'
        },
        {
          name: 'Art',
          value: '&category=29'
        },
        {
          name: 'Celebrities',
          value: '&category=30'
        },
        {
          name: 'Animals',
          value: '&category=31'
        },
        {
          name: 'Vehicles',
          value: '&category=32'
        }
      ]
    },
    {
      name: 'difficulty',
      type: 'STRING',
      description: 'Question Difficulty.',
      required: false,
      choices: [
        {
          name: 'Any Difficulty',
          value: 'any'
        },
        {
          name: 'Easy',
          value: '&difficulty=easy'
        },
        {
          name: 'Medium',
          value: '&difficulty=medium'
        },
        {
          name: 'Hard',
          value: '&difficulty=hard'
        }
      ]
    }
  ],
  async run({ interaction, bot }) {
    var category;
    var difficulty;

    if (!interaction.options.get('category') || interaction.options.get('category')?.value === 'any') {
      category = '';
    } else {
      category = interaction.options.get('category')?.value;
    }

    if (!interaction.options.get('difficulty') || interaction.options.get('difficulty')?.value === 'any') {
      difficulty = '';
    } else {
      difficulty = interaction.options.get('difficulty')?.value;
    }

    const fetching = await fetch(`https://opentdb.com/api.php?amount=1&type=multiple${category}${difficulty}`);
    const result = await fetching.json();
    const quiz = result.results[0];
    const question = decode(quiz.question);
    quiz.incorrect_answers.push(quiz.correct_answer);
    shuffleArray(quiz.incorrect_answers);

    const quizMessage = await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(quiz.category)
          .setDescription(question)
          .addField('A', `${decode(quiz.incorrect_answers[0])}`, false)
          .addField('B', `${decode(quiz.incorrect_answers[1])}`, false)
          .addField('C', `${decode(quiz.incorrect_answers[2])}`, false)
          .addField('D', `${decode(quiz.incorrect_answers[3])}`, false)
          .setColor('BLURPLE')
      ],
      components: [
        new MessageActionRow().addComponents([
          new MessageButton().setCustomId(quiz.incorrect_answers[0]).setLabel('A').setStyle('SUCCESS'),
          new MessageButton().setCustomId(quiz.incorrect_answers[1]).setLabel('B').setStyle('SUCCESS'),
          new MessageButton().setCustomId(quiz.incorrect_answers[2]).setLabel('C').setStyle('SUCCESS'),
          new MessageButton().setCustomId(quiz.incorrect_answers[3]).setLabel('D').setStyle('SUCCESS')
        ])
      ],
      fetchReply: true
    });
    const collector = await quizMessage.createMessageComponentCollector({
      filter: fn => fn,
      componentType: 'BUTTON',
      time: 1000 * 15
    });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id)
        return i.reply({
          content: `These buttons are not for you.`,
          ephemeral: true
        });

      if (i.customId === quiz.correct_answer) {
        interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setTitle(quiz.category)
              .setDescription(`${question}\n\nCorrect; the answer is ${quiz.correct_answer}`)
              .setColor('BLURPLE')
          ],
          components: []
        });
      } else {
        interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setTitle(quiz.category)
              .setDescription(`${question}\n\nWrong; the answer is ${quiz.correct_answer}`)
              .setColor('BLURPLE')
          ],
          components: []
        });
      }
    });

    collector.on('end', async i => {
      interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle(quiz.category)
            .setDescription(
              `${question}\n\nTimeout, you didn't pick an option on time; the answer is ${quiz.correct_answer}`
            )
            .setColor('BLURPLE')
        ],
        components: []
      });
    });
  }
};
