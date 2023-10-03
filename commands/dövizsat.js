const { EmbedBuilder } = require("discord.js");
const numeral = require("numeral");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "dövizsat",
  description: "Belirli bir miktar dövizi karşılığında para alırsınız",
  type: 1,

  options: [
    {
      name: "döviz",
      description: "Satmak istediğiniz döviz türünü seçin",
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
      description: "Satmak istediğiniz miktarı belirleyin",
      type: 10, // Number tipi
      required: true,
    },
  ],

  run: async (client, interaction) => {
    const selectedCurrency = interaction.options.getString("döviz");
    const miktar = interaction.options.getNumber("miktar");
    const userId = interaction.user.id;

    if (miktar <= 0) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Geçersiz miktar. Lütfen pozitif bir miktar belirtin.");
      return interaction.reply({ embeds: [embed] });
    }

    const satisKey = `${selectedCurrency}_satış`;
    const satisFiyati = await db.get(satisKey);

    if (!satisFiyati) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Belirtilen döviz türü bulunamadı.");
      return interaction.reply({ embeds: [embed] });
    }

    const toplamTutar = satisFiyati * miktar;

    const dövizVarlık = await db.get(`${selectedCurrency}_${userId}`) || 0;

    if (miktar > dövizVarlık) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Yetersiz döviz varlığı. Belirtilen miktar kadar dövize sahip değilsiniz.");
      return interaction.reply({ embeds: [embed] });
    }

    const yeniDövizVarlık = dövizVarlık - miktar;
    const bal = await db.get(`money_${userId}`) || 0;
    const yeniBal = bal + toplamTutar;

    db.set(`money_${userId}`, yeniBal);
    db.set(`${selectedCurrency}_${userId}`, yeniDövizVarlık);

    const formattedTutar = numeral(toplamTutar).format("0,0.00");
    const formattedMiktar = numeral(miktar).format("0,0.00");
    const formattedYeniBal = numeral(yeniBal).format("0,0.00");
    const formattedYeniDövizVarlık = numeral(yeniDövizVarlık).format("0,0.00");

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setDescription(`:moneybag: **${selectedCurrency.toUpperCase()}** dövizi başarıyla satıldı.\n\n`
        + `Satılan Miktar: *${formattedMiktar}*\n`
        + `Toplam Tutar: *${formattedTutar}*\n`
        + `Kalan Bakiye: *${formattedYeniBal}*\n`
        + `Yeni ${selectedCurrency.toUpperCase()} Varlığı: *${formattedYeniDövizVarlık}*`
      );

    interaction.reply({ embeds: [embed] });
  },
};
