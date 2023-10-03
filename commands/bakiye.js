const { MessageEmbed, EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const numeral = require("numeral");

module.exports = {
  name: "bakiye",
  description: "Bakiyenizi öğrenirsiniz",
  type: 1,

  options: [
    {
      name: 'kullanıcı',
      description: 'Bakiyesini öğrenmek istediğiniz kullanıcıyı seçin',
      type: 6,
      required: false // Kullanıcıyı isteğe bağlı yapın
    }
  ],

  run: async (client, interaction) => {
    let kullanıcı = interaction.options.getUser('kullanıcı');
    if (!kullanıcı) kullanıcı = interaction.user;

    const userId = kullanıcı.id;

    const bal = await db.get(`money_${userId}`) || 0;
    const euro = await db.get(`euro_${userId}`) || 0;
    const dolar = await db.get(`dolar_${userId}`) || 0;
    const sterlin = await db.get(`sterlin_${userId}`) || 0;
    const bank = await db.get(`bank_${userId}`) || 0;
    const etherium = await db.get(`etherium_${userId}`) || 0;
    const altın = await db.get(`altın_${userId}`) || 0;

    const formattedBal = numeral(bal).format("0,0");
    const formattedEuro = numeral(euro).format("0,0.00");
    const formattedDolar = numeral(dolar).format("0,0.00");
    const formattedSterlin = numeral(sterlin).format("0,0.00");
    const formattedBank = numeral(bank).format("0,0");
    const formattedEtherium = numeral(etherium).format("0,0.00");
    const formattedAltın = numeral(altın).format("0,0");

    const embed = new EmbedBuilder()
      .setColor("#6b0000")
      .setThumbnail(kullanıcı.displayAvatarURL())
      .setDescription(`**${kullanıcı}**\n\n`
        + `**👛 𝘾𝙪𝙯𝙙𝙖𝙣**\n`
        + `*${formattedBal}* €\n\n`
        + `**:credit_card: Banka Hesabı**\n`
        + `*${formattedBank}* €\n\n`
        + `**:dollar: Dolar:** *${formattedDolar} $*\n`
        + `**:pound: Sterlin:** *${formattedSterlin} £*\n`
        + `**:diamond_shape_with_a_dot_inside: Etherium:** *${formattedEtherium} ETH*\n`
        + `**:moneybag: Altın:** *${formattedAltın} Altın*`
      );

    interaction.reply({ embeds: [embed] });
  }
};
