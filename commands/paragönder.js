const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const numeral = require("numeral");

module.exports = {
  name: "paragönder",
  description: "Belirtilen bir kullanıcıya para gönderir",
  type: 1,

  options: [
    {
      name: "kullanıcı",
      description: "Parayı göndereceğiniz kullanıcıyı seçin",
      type: 6,
      required: true
    },
    {
      name: "miktar",
      description: "Gönderilecek miktarı belirleyin",
      type: 10, // Number tipi
      required: true
    }
  ],

  run: async (client, interaction) => {
    const gönderen = interaction.user;
    const alıcı = interaction.options.getUser("kullanıcı");
    const miktar = interaction.options.getNumber("miktar");

    if (miktar <= 0) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Geçersiz miktar. Lütfen pozitif bir miktar girin.");
      return interaction.reply({ embeds: [embed] });
    }

    if (gönderen.id === alıcı.id) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Kendinize para gönderemezsiniz.");
      return interaction.reply({ embeds: [embed] });
    }

    let gönderenBal = await db.get(`money_${gönderen.id}`) || 0;
    let alıcıBal = await db.get(`money_${alıcı.id}`) || 0;

    if (gönderenBal < miktar) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Yetersiz bakiye. Göndermeye çalıştığınız miktar, bakiyenizden fazla.");
      return interaction.reply({ embeds: [embed] });
    }

    gönderenBal -= miktar;
    alıcıBal += miktar;

    db.set(`money_${gönderen.id}`, gönderenBal);
    db.set(`money_${alıcı.id}`, alıcıBal);

    const formattedMiktar = numeral(miktar).format("0,0");
    const formattedGönderenBal = numeral(gönderenBal).format("0,0");
    const formattedAlıcıBal = numeral(alıcıBal).format("0,0");

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setDescription(`:money_with_wings: Para başarıyla gönderildi!\n\n`
        + `Gönderen: **${gönderen}**\n`
        + `Alıcı: **${alıcı}**\n`
        + `Gönderilen Miktar: **${formattedMiktar}**\n`
        + `Gönderen Bakiye: **${formattedGönderenBal}**\n`
        + `Alıcı Bakiye: **${formattedAlıcıBal}**`);

    interaction.reply({ embeds: [embed] });
  },
};
