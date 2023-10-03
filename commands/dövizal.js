const { MessageEmbed, EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const numeral = require("numeral");

module.exports = {
  name: "dövizal",
  description: "Belirli bir miktar para karşılığında döviz alırsınız",
  type: 1,

  options: [
    {
      name: "doviz",
      description: "Almak istediğiniz döviz türünü seçin",
      type: 3, // String tipi
      required: true,
      choices: [
        {
          name: "Dolar",
          value: "dolar",
        },
        {
          name: "Sterlin",
          value: "sterlin",
        },
        {
          name: "Etherium",
          value: "etherium",
        },
        {
          name: "Altın",
          value: "altın",
        },
      ],
    },
    {
      name: "miktar",
      description: "Almak istediğiniz miktarı belirleyin",
      type: 10, // Number tipi
      required: true,
    },
  ],

  run: async (client, interaction) => {
    const selectedCurrency = interaction.options.getString("doviz");
    const miktar = interaction.options.getNumber("miktar");
    const userId = interaction.user.id;

    if (miktar <= 0) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Geçersiz miktar. Lütfen pozitif bir miktar belirtin.");
      return interaction.reply({ embeds: [embed] });
    }

    const alisKey = `${selectedCurrency}_alış`;
    const alisFiyati = await db.get(alisKey);

    if (!alisFiyati) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Belirtilen döviz türü bulunamadı.");
      return interaction.reply({ embeds: [embed] });
    }

    const toplamTutar = alisFiyati * miktar;

    const bal = await db.get(`money_${userId}`) || 0;

    if (toplamTutar > bal) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Yetersiz bakiye. Belirtilen miktar kadar paraya sahip değilsiniz.");
      return interaction.reply({ embeds: [embed] });
    }

    const yeniBal = bal - toplamTutar;
    const dövizVarlık = await db.get(`${selectedCurrency}_${userId}`) || 0;
    const yeniDövizVarlık = dövizVarlık + miktar;

    db.set(`money_${userId}`, yeniBal);
    db.set(`${selectedCurrency}_${userId}`, yeniDövizVarlık);

    const formattedTutar = numeral(toplamTutar).format("0,0.00");
    const formattedMiktar = numeral(miktar).format("0,0.00");
    const formattedYeniBal = numeral(yeniBal).format("0,0.00");
    const formattedYeniDövizVarlık = numeral(yeniDövizVarlık).format("0,0.00");

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setDescription(`:white_check_mark: **${selectedCurrency.toUpperCase()}** döviz alımı gerçekleştirildi.\n\n`
        + `Alınan Miktar: *${formattedMiktar}*\n`
        + `Toplam Tutar: *${formattedTutar}*\n`
        + `Kalan Bakiye: *${formattedYeniBal}*\n`
        + `Yeni ${selectedCurrency.toUpperCase()} Varlığı: *${formattedYeniDövizVarlık}*`
      );

    interaction.reply({ embeds: [embed] });
  },
};
