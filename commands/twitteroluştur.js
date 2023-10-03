const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "twitteroluştur",
  description: "Twitter profil oluşturur.",
  type: 1,

  options: [
    {
      name: "ad",
      description: "Twitter profilinizde görünecek adı belirtin.",
      type: 3, // 3 -> STRING
      required: true,
    },
    {
      name: "biyografi",
      description: "Twitter profilinizde görünecek biyografiyi belirtin.",
      type: 3, // 3 -> STRING
      required: false,
    },
  ],

  run: async (client, interaction) => {
    const ad = interaction.options.getString("ad");
    const biyografi = interaction.options.getString("biyografi");
    const telefonRolId = "1134197058388111460"; // Telefon rolünün ID'sini buraya girin.

    // Telefon rolü olmayan kullanıcıları engelleme
    if (!interaction.member.roles.cache.has(telefonRolId)) {
      return interaction.reply({
        content: "Twitter hesabı açabilmek için Telefon sahibi olmalısınız.",
        ephemeral: true, // Sadece gönderen kişiye görünmesi için ephemeral kullanıyoruz.
      });
    }

    // Check if the ad contains the "@" symbol
    if (ad.includes("@")) {
      return interaction.reply({
        content: "'@' işareti kullanmayınız.",
        ephemeral: true,
      });
    }

    // Check if a Twitter profile with the given ad already exists
    

    // Profil oluşturma işlemleri burada gerçekleştirilir.
    // Bu örnekte sadece veritabanına kaydediyorum.
    db.set(`twitterad_${interaction.user.id}`, ad);
    if (biyografi) {
      db.set(`twitterbiyografi_${interaction.user.id}`, biyografi);
    }
    db.set(`takipedilensayısı_${interaction.user.id}`, 0);
    db.set(`takipçisayısı_${interaction.user.id}`, 0);

    const replyMessage = biyografi
      ? `**@${ad}** adlı Twitter profiliniz oluşturuldu!\nBiyografi: ${biyografi}`
      : `**@${ad}** adlı Twitter profiliniz oluşturuldu!`;

    await interaction.reply(replyMessage);
  },
};
