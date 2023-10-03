const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "silahdevret",
  description: "Belirli bir silahı başka bir kullanıcıya devreder.",
  type: 1,

  options: [
    {
      name: "kullanıcı",
      description: "Silahı devredeceğiniz kullanıcıyı seçin",
      type: 6, // 6 -> User
      required: true,
    },
    {
      name: "silah",
      description: "Devredilecek silahı seçin",
      type: 3, // 3 -> String
      required: true,
      choices: [
        { name: "🔪 Çakı", value: "çakı" },
        { name: "🔫 Luger", value: "luger" },
        { name: "🔫 Arcus", value: "arcus" },
        { name: "🔫 PLR-16", value: "plr16" },
        // Diğer silahları buraya ekleyin
      ],
    },
  ],

  run: async (client, interaction) => {
    const userId = interaction.user.id;
    const targetUserId = interaction.options.getUser("kullanıcı").id;
    const weaponName = interaction.options.getString("silah");

    // Kullanıcının sahip olduğu silahları alalım
    const userWeapons = await db.get(`products_${userId}`) || {};

    // Kullanıcının silahları devralacak kişinin sahip olduğu silahlara ekleyelim
    const targetUserWeapons = await db.get(`products_${targetUserId}`) || {};

    // Seçilen silahı doğrulayalım
    if (!userWeapons[weaponName] || userWeapons[weaponName] < 1) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Silah devretmek istediğiniz ürüne sahip değilsiniz.");

      return interaction.reply({ embeds: [embed] });
    }

    // Silahı devreden kullanıcının silah sayısını azaltalım
    await db.sub(`products_${userId}.${weaponName}`, 1);

    // Silahı devralan kullanıcının silah sayısını arttıralım
    await db.add(`products_${targetUserId}.${weaponName}`, 1);

    // Devir işlemi başarılı mesajını gönderelim
    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setDescription(`*Silah başarıyla devredildi!*`);

    interaction.reply({ embeds: [embed] });
  },
};
