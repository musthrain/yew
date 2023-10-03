const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "twitterbiyografi",
  description: "Twitter biyografinizi düzenler.",
  type: 1,

  options: [
    {
      name: "biyografi",
      description: "Yeni Twitter biyografinizi belirtin.",
      type: 3, // 3 -> STRING
      required: true,
    },
  ],

  run: async (client, interaction) => {
    const userId = interaction.user.id;
    const biyografi = interaction.options.getString("biyografi");
    const ad = await db.get(`twitterad_${userId}`);

    // Check if the user has a Twitter profile
   if (!ad) {
      return interaction.reply("Henüz bir Twitter profiliniz yok.");
    }


    // Update the biography in the database
    db.set(`twitterbiyografi_${userId}`, biyografi);

    await interaction.reply(`Twitter biyografiniz başarıyla güncellendi:\n${biyografi}`);
  },
};
