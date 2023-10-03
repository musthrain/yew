const { MessageEmbed } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const allowedRoles = ["1133907683582423060", "1133914706738937876", "1134161042663034930", "942493398533816321",];

module.exports = {
  name: "reboot",
  description: "Botu yeniden başlatır.",
  type: 1,

  run: async (client, interaction) => {
    const memberRoles = interaction.member.roles.cache;
    const hasAllowedRole = memberRoles.some(role => allowedRoles.includes(role.id));

    if (!hasAllowedRole) {
      return interaction.reply('Yetkili değilsin.');
    }

    await interaction.reply('Bot yeniden başlatılıyor...');
    console.log('BOT: Bot yeniden başlatılıyor...');
    process.exit(0);
  },
};
