const { MessageEmbed, EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const allowedRoles = ["1133907683582423060", "1133914706738937876", "1134161042663034930"];

module.exports = {
  name: "paraekle",
  description: "Belirli bir kullanıcının bakiyesine para ekler",
  type: 1,
  options: [
    {
      name: "kullanıcı",
      description: "Para eklemek istediğiniz kullanıcıyı etiketleyin",
      type: 6,
      required: true,
    },
    {
      name: "miktar",
      description: "Eklenecek para miktarını belirtin",
      type: 4,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const kullanıcı = interaction.options.getUser("kullanıcı");
    const miktar = interaction.options.getInteger("miktar");
    const memberRoles = interaction.member.roles.cache;
    const hasAllowedRole = memberRoles.some(role => allowedRoles.includes(role.id));
    if (!hasAllowedRole) {
      return interaction.reply('Bu komutu kullanma yetkiniz bulunmuyor.');
    }
    if (!kullanıcı || isNaN(miktar) || miktar <= 0) {
      interaction.reply("Geçerli bir kullanıcı etiketleyin ve geçerli bir miktar belirtin.");
      return;
    }

    let bakiye = await db.get(`money_${kullanıcı.id}`) || 0;

    await db.add(`money_${kullanıcı.id}`, miktar);
    let bakiye2 = await db.get(`money_${kullanıcı.id}`) || 0;

    const embed = new EmbedBuilder()
      .setColor("#b8860b")
      .setDescription(`:white_check_mark: ${kullanıcı} kullanıcısının bakiyesine **${miktar} €** eklendi.\n\nYeni Bakiye: **${bakiye2} €**`);

    interaction.reply({ embeds: [embed] });
  },
};
