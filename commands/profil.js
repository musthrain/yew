const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "twitterprofil",
  description: "Twitter profilinizi görüntüler.",
  type: 1,

  options: [
    {
      name: "kullanıcı",
      description: "Twitter profilini görüntülemek istediğiniz kullanıcıyı seçin.",
      type: 6, // 6 -> USER
      required: false, // Kullanıcıyı isteğe bağlı yapın
    },
  ],

  run: async (client, interaction) => {
    const userId = interaction.options.getUser("kullanıcı")?.id || interaction.user.id;
    const ad = await db.get(`twitterad_${userId}`);
    const biyografi = await db.get(`twitterbiyografi_${userId}`);
    const takipçiSayısı = await db.get(`takipçisayısı_${userId}`);
    const takipçi = await db.get(`takipedilensayısı_${userId}`);
    const tik = await db.get(`tik_${userId}`);

    if (!ad) {
      return interaction.reply("Henüz bir Twitter profiliniz yok.");
    }

    const user = client.users.cache.get(userId);

    const embed = new EmbedBuilder()
      .setColor("#00acee")
      .setAuthor({
        name: "Twitter",
        iconURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/1200px-Logo_of_Twitter.svg.png",
      })
      .setDescription(`**@${ad}** ${tik || " "}\n\n${biyografi || " "}`)
      .addFields(
        { name: "Takipçi Sayısı", value: takipçiSayısı.toString() || "0", inline: true },
        { name: "Takip Edilen Sayısı", value: (takipçi ? takipçi.toString() : "0"), inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
