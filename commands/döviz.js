const { EmbedBuilder } = require("discord.js");
const numeral = require("numeral");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "döviz",
  description: "Dövizde olan Alış ve Satış fiyatlarını gösterir.",
  type: 1,

  run: async (client, interaction) => {
    const dolaralış = await db.get("dolar_alış") || 0;
    const dolarsatış = await db.get("dolar_satış") || 0;
    const sterlinalış = await db.get("sterlin_alış") || 0;
    const sterlinsatış = await db.get("sterlin_satış") || 0;
    const etheriumalış = await db.get("etherium_alış") || 0;
    const etheriumsatış = await db.get("etherium_satış") || 0;
    const altınalış = await db.get("altın_alış") || 0;
    const altınsatış = await db.get("altın_satış") || 0;

    const formattedDolaralış = numeral(dolaralış).format("0,0.00");
    const formattedDolarsatış = numeral(dolarsatış).format("0,0.00");
    const formattedSterlinalış = numeral(sterlinalış).format("0,0.00");
    const formattedSterlinsatış = numeral(sterlinsatış).format("0,0.00");
    const formattedEtheriumalış = numeral(etheriumalış).format("0,0.00");
    const formattedEtheriumsatış = numeral(etheriumsatış).format("0,0.00");
    const formattedAltınalış = numeral(altınalış).format("0,0.00");
    const formattedAltınsatış = numeral(altınsatış).format("0,0.00");

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setTitle("Döviz Kurları")
      .setDescription(
        `:dollar: **Dolar Alış:** *${formattedDolaralış} €*\n:dollar: **Dolar Satış:** *${formattedDolarsatış} €*` +
        `\n\n:pound: **Sterlin Alış:** *${formattedSterlinalış} €*\n:pound: **Sterlin Satış:** *${formattedSterlinsatış} €*` +
        `\n\n:chart_with_upwards_trend: **Etherium Alış:** *${formattedEtheriumalış} €*\n:chart_with_upwards_trend: **Etherium Satış:** *${formattedEtheriumsatış} €*` +
        `\n\n:yellow_square: **Altın Alış:** *${formattedAltınalış} €*\n:yellow_square: **Altın Satış:** *${formattedAltınsatış} €*`
      );

    interaction.reply({ embeds: [embed] });
  },
};
