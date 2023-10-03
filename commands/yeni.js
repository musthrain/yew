const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "yeni",
  description: "Bakiyeye 10.000€ ekler (sadece bir kez kullanılabilir)",
  type: 1,

  run: async (client, interaction) => {
    const userId = interaction.user.id;
    const balance = await db.get(`money_${userId}`);

    if (balance) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Bu komut daha önce kullanılmış.");

      return interaction.reply({ embeds: [embed] });
    }

    await db.add(`money_${userId}`, 10000);

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setDescription("Bakiyenize 10.000€ eklenmiştir.");

    interaction.reply({ embeds: [embed] });
  },
};
