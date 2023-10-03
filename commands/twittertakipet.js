const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "twittertakipet",
  description: "Belirli bir Twitter profilini takip eder.",
  type: 1,

  options: [
    {
      name: "kullanıcı",
      description: "Takip edilecek Twitter profilini belirtin.",
      type: 6, // 6 -> USER
      required: true,
    },
  ],

  run: async (client, interaction) => {
    const userId = interaction.user.id;
    const takipciId = interaction.options.getUser("kullanıcı")?.id;
    const takipciAd = await db.get(`twitterad_${takipciId}`);

    if (!takipciAd) {
      return interaction.reply("Belirtilen Twitter kullanıcısı bulunamadı.");
    }

    // Kendi profilini takip etmeyi engelleme
    if (userId === takipciId) {
      return interaction.reply("Kendi profilinizi takip edemezsiniz.");
    }

    // Kullanıcının takip edilen listesini al
    const takipEdilenler = await db.get(`takipedilenler_${userId}`);

    // Eğer kullanıcı zaten takip ediyorsa hata dön
    if (takipEdilenler && takipEdilenler.includes(takipciId)) {
      return interaction.reply("Bu kullanıcıyı zaten takip ediyorsunuz.");
    }

    // Takip edilen kişiye takipçi eklemek
    await db.add(`takipçisayısı_${takipciId}`, 1);

    // Takip edilen sayısını arttırmak
    const takipEdilenSayisi = await db.add(`takipedilensayısı_${userId}`, 1);

    // Takip edilenleri güncelle
    await db.push(`takipedilenler_${userId}`, takipciId);

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setDescription(`**@${takipciAd}** adlı Twitter kullanıcısını takip etmeye başladınız!\n\nŞu anki takip edilen sayınız: ${takipEdilenSayisi}`);

    await interaction.reply({ embeds: [embed] });
  },
};
