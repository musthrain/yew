const { MessageEmbed, EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "yatır",
  description: "Bankaya paranızı yatırabilirsiniz",
  type: 1,
  options: [
    {
      name: "miktar",
      description: "Yatırılacak para miktarını belirtin",
      type: 4,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const kullanıcı = interaction.user;
    const miktar = interaction.options.getInteger("miktar");

    if (isNaN(miktar) || miktar <= 0) {
      interaction.reply("Geçerli bir miktar belirtin.");
      return;
    }

    let bakiye = await db.get(`money_${kullanıcı.id}`) || 0;

    if (bakiye < miktar) {
      interaction.reply("Bu kadar paranız yok.");
      return;
    }

    await db.sub(`money_${kullanıcı.id}`, miktar);
    await db.add(`bank_${kullanıcı.id}`, miktar);

    const embed = new EmbedBuilder()
      .setColor("#b8860b")
      .setDescription(`**:white_check_mark: ${kullanıcı} Bankaya** *${miktar}* **€ para yatırdınız.**`);

    interaction.reply({ embeds: [embed] });
  },
};
