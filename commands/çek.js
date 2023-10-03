const { MessageEmbed, EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "çek",
  description: "Bankadan paranızı çekersiniz.",
  type: 1,
  options: [
    {
      name: "miktar",
      description: "Çekilecek para miktarını belirtin",
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

    let bakiye = await db.get(`bank_${kullanıcı.id}`) || 0;

    if (bakiye < miktar) {
      interaction.reply("Bankada bu kadar paranız yok.");
      return;
    }

    await db.add(`money_${kullanıcı.id}`, miktar);
    await db.sub(`bank_${kullanıcı.id}`, miktar);

    const embed = new EmbedBuilder()
      .setColor("#b8860b")
      .setDescription(`**:white_check_mark: ${kullanıcı} Bankadan** *${miktar}* **€ para çektiniz.**`);

    interaction.reply({ embeds: [embed] });
  },
};
