const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "envanter",
  description: "Kullanıcının veya etiketlenen kullanıcının sahip olduğu çakı ve silahları gösterir.",
  type: 1,

  options: [
    {
      name: "kullanıcı",
      description: "Çakı ve silahlarını görmek istediğiniz kullanıcıyı etiketleyin (isteğe bağlı)",
      type: 6, // 6 -> USER
      required: false,
    },
  ],

  run: async (client, interaction) => {
    let userId;
    let userSilahlar;

    const userParam = interaction.options.getUser("kullanıcı");
    if (userParam) {
      userId = userParam.id;
      userSilahlar = await db.get(`products_${userId}`);
    } else {
      userId = interaction.user.id;
      userSilahlar = await db.get(`products_${userId}`);
    }

    if (!userSilahlar || Object.keys(userSilahlar).length === 0) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Henüz hiç çakı veya silahınız yok.");

      return interaction.reply({ embeds: [embed] });
    }

    const silahlar = {
      "çakı": "🔪 Çakı",
      "luger": "🔫 Luger",
      "arcus": "🔫 Arcus",
      "plr16": "🔫 PLR-16",

      // Diğer silahları buraya ekleyin
    };

    const filteredSilahlar = Object.entries(userSilahlar).filter(
      ([silahAdı, miktar]) => miktar > 0 && ["çakı", "luger", "arcus", "plr16"].includes(silahAdı)
    );

    if (filteredSilahlar.length === 0) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Henüz hiç çakı veya silahınız yok.");

      return interaction.reply({ embeds: [embed] });
    }

    let kullanıcı = interaction.options.getUser('kullanıcı');
    if (!kullanıcı) kullanıcı = interaction.user;

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setDescription(`**${kullanıcı}** *'ın Sahip Olduğu Çakı ve Silahlar*\n\n` +
        filteredSilahlar
          .map(([silahAdı, miktar]) => `**${silahlar[silahAdı]}**: *${miktar}* adet`)
          .join("\n")
      );

    await interaction.reply({ embeds: [embed] });
  },
};
