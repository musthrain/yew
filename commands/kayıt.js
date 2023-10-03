const { EmbedBuilder } = require("discord.js");
const allowedRoles = ["1133907683582423060", "1133914706738937876", "1134161042663034930", "1133902834853748766","1135476887041351813",];

module.exports = {
  name: "kayıt",
  description: "Kullanıcının rol seçimini yapmasına ve isim soyisim belirlemesine izin veren kayıt komutu.",
  type: 1,

options: [
    {
      name: "kullanıcı",
      description: "Kayıt işlemlerini yapılacak kullanıcıyı etiketleyin",
      type: 6, // 6 -> User
      required: true,
    },
    {
      name: "isimsoyisim",
      description: "İsim ve soyisim belirleyin",
      type: 3, // 3 -> String
      required: true,
    },
    {
      name: "cinsiyet",
      description: "Cinsiyet seçiniz",
      type: 3, // 3 -> String
      required: true,
      choices: [
        { name: "Erkek", value: "1133944334622916648" }, // Buradaki değerlere uygun rol ID'lerini ekleyin
        { name: "Kadın", value: "1133944401522081863" }, // Buradaki değerlere uygun rol ID'lerini ekleyin
      ],
    },
    {
      name: "yaş",
      description: "Yaş seçiniz",
      type: 3, // 3 -> String
      required: true,
      choices: [
        { name: "0-17", value: "1133945268912521266" }, // Buradaki değerlere uygun rol ID'lerini ekleyin
        { name: "18-45", value: "1133945338542182401" }, // Buradaki değerlere uygun rol ID'lerini ekleyin
        { name: "45+", value: "1133945459103240292" }, // Buradaki değerlere uygun rol ID'lerini ekleyin
      ],
    },
    {
      name: "din",
      description: "Din seçiniz",
      type: 3, // 3 -> String
      required: true,
      choices: [
        { name: "Müslüman", value: "1133944849234665572" }, // Buradaki değerlere uygun rol ID'lerini ekleyin
        { name: "Hristiyan", value: "1133944879320420402" }, // Buradaki değerlere uygun rol ID'lerini ekleyin
        { name: "Musevi", value: "1133944904591089674" }, // Buradaki değerlere uygun rol ID'lerini ekleyin
        { name: "Ateist/Diğer", value: "1133944928523792384" }, // Buradaki değerlere uygun rol ID'lerini ekleyin
      ],
    },
    {
      name: "yönelim",
      description: "Yönelim seçiniz",
      type: 3, // 3 -> String
      required: true,
      choices: [
        { name: "Heteroseksüel", value: "1134886760120324167" }, // Buradaki değerlere uygun rol ID'lerini ekleyin
        { name: "Homoseksüel", value: "1134886826134474783" }, // Buradaki değerlere uygun rol ID'lerini ekleyin
        { name: "Biseksüel", value: "1134886896653324289" }, // Buradaki değerlere uygun rol ID'lerini ekleyin
        { name: "Aseksüel/Diğer", value: "1134886977477558432" }, // Buradaki değerlere uygun rol ID'lerini ekleyin
      ],
    },
  ],

  run: async (client, interaction) => {
    const memberRoles = interaction.member.roles.cache;
    const hasAllowedRole = memberRoles.some(role => allowedRoles.includes(role.id));

    if (!hasAllowedRole) {
      return interaction.reply('Yetkili değilsin.');
    }

    const user = interaction.options.getUser("kullanıcı");
    const guildMember = await interaction.guild.members.fetch(user);

    const isimSoyisim = interaction.options.getString("isimsoyisim");
    const cinsiyetValue = interaction.options.getString("cinsiyet");
    const dinValue = interaction.options.getString("din");
    const yaşValue = interaction.options.getString("yaş");
    const yönelimValue = interaction.options.getString("yönelim");

    try {
      // Kullanıcının rollerini güncelle
      await guildMember.roles.add(cinsiyetValue);
      await guildMember.roles.add(dinValue);
      await guildMember.roles.add(yaşValue);
      await guildMember.roles.add(yönelimValue);

      // Kullanıcının isim soyisimini sunucuda değiştir
      await guildMember.setNickname(isimSoyisim);

      // Role IDs to add/remove
      const roleToRemove = "1133900839417823263";
      const roleToAdd = "1133901102111281295";

      // Check if the user already has the role to be removed before removing
      if (guildMember.roles.cache.has(roleToRemove)) {
        await guildMember.roles.remove(roleToRemove);
      }

      // Add the role to be added
      await guildMember.roles.add(roleToAdd);

      // Delay the message sending for 2 seconds (2000 milliseconds)
      setTimeout(async () => {
        const embed = new EmbedBuilder()
          .setColor("#6b0000")
          .setTitle("Kayıt İşlemi Tamamlandı")
          .setDescription(`${user} başarıyla kaydedildi.`);

        await interaction.reply({ embeds: [embed] });
      }, 2000); // Change the delay time as needed

    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Hata")
        .setDescription("Kayıt işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.");

      await interaction.reply({ embeds: [errorEmbed] });
    }
  },
};
