const { EmbedBuilder } = require("discord.js");
const numeral = require("numeral");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const allowedRoles = ["1133907683582423060", "1133914706738937876", "1134161042663034930"];

module.exports = {
  name: "dövizayarla",
  description: "Döviz kurlarını ayarlar.",
  type: 1,
  options: [
    {
      name: "döviz",
      description: "Döviz türünü seçin",
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
      name: "alış",
      description: "Alış fiyatını belirleyin",
      type: 3, // String tipi
      required: true,
    },
    {
      name: "satış",
      description: "Satış fiyatını belirleyin",
      type: 3, // String tipi
      required: true,
    },
  ],

  run: async (client, interaction) => {
    const selectedCurrency = interaction.options.getString("döviz");
    const alışFiyati = numeral(interaction.options.getString("alış")).value();
    const satışFiyati = numeral(interaction.options.getString("satış")).value();
    const memberRoles = interaction.member.roles.cache;
    const hasAllowedRole = memberRoles.some(role => allowedRoles.includes(role.id));

    if (!hasAllowedRole) {
      return interaction.reply('Yetkili değilsin.');
    }
    if (isNaN(alışFiyati) || isNaN(satışFiyati) || alışFiyati < 0 || satışFiyati < 0 || alışFiyati < satışFiyati) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Geçersiz fiyat aralığı. Lütfen doğru bir fiyat aralığı belirtin.");
      return interaction.reply({ embeds: [embed] });
    }

    const alışKey = `${selectedCurrency}_alış`;
    const satışKey = `${selectedCurrency}_satış`;

    db.set(alışKey, alışFiyati.toString());
    db.set(satışKey, satışFiyati.toString());

    const formattedalışFiyati = numeral(alışFiyati).format("0,0.00");
    const formattedsatışFiyati = numeral(satışFiyati).format("0,0.00");

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setDescription(`:white_check_mark: **${selectedCurrency.toUpperCase()}** döviz kurları başarıyla ayarlandı.\n\nAlış Fiyatı: *${formattedalışFiyati}*\nSatış Fiyatı: *${formattedsatışFiyati}*`);

    interaction.reply({ embeds: [embed] });
  },
};
