const { EmojiIdentifierResolvable } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const allowedRoles = ["1133907683582423060", "1133914706738937876", "1134161042663034930"];

module.exports = {
  name: "twitterdoğrula",
  description: "Kullanıcının Twitter hesabını doğrular.",
  type: 1,

  options: [
    {
      name: "kullanıcı",
      description: "Twitter hesabını doğrulamak istediğiniz kullanıcıyı etiketleyin.",
      type: 6, // 6 -> USER
      required: true,
    },
  ],

  run: async (client, interaction) => {
    const userId = interaction.user.id;
    const targetUser = interaction.options.getUser("kullanıcı");
    const memberRoles = interaction.member.roles.cache;
    const hasAllowedRole = memberRoles.some(role => allowedRoles.includes(role.id));
    if (!hasAllowedRole) {
      return interaction.reply('Bu komutu kullanma yetkiniz bulunmuyor.');
    }
    // Check if the target user has a Twitter profile
    if (!db.has(`twitterad_${targetUser.id}`)) {
      return interaction.reply("Belirtilen kullanıcının Twitter profilini bulamadım.");
    }

    // Kayıtlara emojiyi ekle
    const emoji = "<:dogrulanmis:1135416898843050064>";
    db.set(`tik_${targetUser.id}`, emoji);

    await interaction.reply(`${targetUser} adlı kullanıcının Twitter hesabı başarıyla doğrulandı!`);
  },
};
