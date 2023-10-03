const { QuickDB } = require("quick.db");
const db = new QuickDB();
const allowedRoles = ["1133907683582423060", "1133914706738937876", "1134161042663034930"];

module.exports = {
  name: "sıralamasil",
  description: "Tüm kullanıcıların kelime puanlarını siler.",
  type: 1,

  options: [], // Gerekli değil, çünkü komut hiçbir argüman almıyor.

  run: async (client, interaction) => {
      const memberRoles = interaction.member.roles.cache;
    const hasAllowedRole = memberRoles.some(role => allowedRoles.includes(role.id));

    if (!hasAllowedRole) {
      return interaction.reply('Yetkili değilsin.');
    }
	try {
      const allData = await db.all();
      const wordCounts = allData.filter((entry) => entry.id.startsWith("point_"));

      for (const entry of wordCounts) {
        await db.delete(entry.id);
      }

      interaction.reply({ content: "Tüm kullanıcıların kelime puanları başarıyla silindi.", ephemeral: true });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: "Kelime puanlarını silerken bir hata oluştu.", ephemeral: true });
    }
  },
};
