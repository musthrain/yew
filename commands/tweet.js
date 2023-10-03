const { EmbedBuilder, Permissions } = require("discord.js");
const { QuickDB, } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "twitter",
  description: "Twitter'da bir tweet paylaşır.",
  type: 1,

  options: [
    {
      name: "tweet",
      description: "Tweet içeriğini belirtin.",
      type: 3, // 3 -> STRING
      required: true,
    },
  ],

  run: async (client, interaction) => {
    const userId = interaction.user.id;
    const ad = await db.get(`twitterad_${userId}`);
    const biyografi = await db.get(`twitterbiyografi_${userId}`);

    if (!ad) {
      return interaction.reply("Henüz bir Twitter profiliniz yok.");
    }

    const tweet = interaction.options.getString("tweet");
    const tweetContent = `@${ad}: ${tweet}`;

    // Belirli kanala mesaj gönderme
    const kanalId = "1134406577164660786"; // Kanal ID'sini doğruladınız
    const kanal = client.channels.cache.get(kanalId);
    const tik = await db.get(`tik_${userId}`);

  

    const embed = new EmbedBuilder()
      .setColor("#1da1f2")
 .setAuthor({
        name: "Twitter",
        iconURL: "https://admin.itsnicethat.com/images/_fsej_vmVYPAz138de7knz6lEFA=/243516/format-webp%7Cwidth-1440/twitter-x-logo-graphic-design-itsnicethat-01.jpeg",
      })
	  .setTitle(`@${ad} ${tik || " "}`)
      .setDescription(`${tweet}\n\n${biyografi || " "}`)

    kanal.send({ embeds: [embed] });
    await interaction.reply(`Tweet başarıyla paylaşıldı: **${tweetContent}**`);
  },
};
