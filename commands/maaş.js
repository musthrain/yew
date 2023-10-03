const { EmbedBuilder, Permissions } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const allowedRoles = ["1133907683582423060", "1133914706738937876", "1134161042663034930"];

module.exports = {
  name: "maaş",
  description: "Etiketlenen role maaş ödemesi yapar",
  type: 1,
  options: [
    {
      name: "rol",
      description: "Maaş ödemesi yapılacak rolü etiketleyin",
      type: 8, // Rol tipi
      required: true,
    },
    {
      name: "miktar",
      description: "Ödeme miktarını belirtin",
      type: 4, // Integer tipi
      required: true,
    },
  ],

  run: async (client, interaction) => {
    const role = interaction.options.getRole("rol");
    const miktar = interaction.options.getInteger("miktar");
    const memberRoles = interaction.member.roles.cache;
    const hasAllowedRole = memberRoles.some(role => allowedRoles.includes(role.id));
    if (!hasAllowedRole) {
      return interaction.reply('Bu komutu kullanma yetkiniz bulunmuyor.');
    }

    const membersWithRole = role.members;

    if (membersWithRole.size === 0) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription(`Etiketlenen role sahip hiçbir üye bulunamadı.`);

      return interaction.reply({ embeds: [embed] });
    }

    membersWithRole.forEach((member) => {
      const memberId = member.id;
      const currentBalance = db.get(`money_${memberId}`) || 0;

      db.add(`money_${memberId}`, miktar);
    });

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setDescription(`${role} rolündeki üyelere ${miktar} para ödemesi yapıldı.`);

    interaction.reply({ embeds: [embed] });
  },
};
