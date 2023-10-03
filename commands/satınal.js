const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "satınal",
  description: "Belirli bir ürünü satın alır ve rol verir",
  type: 1,

  options: [
    {
      name: "ürün",
      description: "Satın alınacak ürünü seçin",
      type: 3, // 3 -> String
      required: true,
      choices: [
        { name: "📱 Telefon", value: "telefon" },
        { name: "🔪 Çakı", value: "çakı" },
        { name: "🔫 Luger P08 Pistol", value: "luger" },
        { name: "🔫 Arcus 94", value: "arcus" },
        { name: "🔫 Kel-tec PLR-16", value: "plr" },
        // Diğer ürünleri buraya ekleyin
      ],
    },
  ],

  run: async (client, interaction) => {
    const userId = interaction.user.id;
    const productName = interaction.options.getString("ürün");

    // Ürün fiyatlarını ve rolleri tanımlayalım
    const products = {
      "çakı": { price: 1000, role: "1134260641805385820", limit: 1 },
      "luger": { price: 5000, role: "1134260676274180186", limit: 1 },
      "arcus": { price: 12000, role: "1134260706624159794", limit: 1 },
      "plr": { price: 20000, role: "1134260733165707334", limit: 1 },
      "telefon": { price: 2000, role: "1134197058388111460", limit: 1 },
      // Diğer ürünleri buraya ekleyin
    };

    // Seçilen ürünü doğrulayalım
    if (!products.hasOwnProperty(productName)) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Geçersiz bir ürün seçtiniz.");

      return interaction.reply({ embeds: [embed] });
    }

    const product = products[productName];

    // Kullanıcının bakiyesini alalım
    const balance = await db.get(`money_${userId}`);

    if (!balance || balance < product.price) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Yeterli bakiyeniz yok veya ürün fiyatına eşit değil.");

      return interaction.reply({ embeds: [embed] });
    }

    // Kullanıcının daha önceden satın aldığı bu üründen kaç adet olduğunu kontrol edelim
    const userProductCount = await db.get(`products_${userId}.${productName}`) || 0;

    if (userProductCount >= product.limit) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("*Bu üründen zaten maksimum adette sahipsiniz.*");

      return interaction.reply({ embeds: [embed] });
    }

    // Kullanıcının bakiyesini düşürelim
    await db.sub(`money_${userId}`, product.price);

    // Kullanıcının sahip olduğu ürün sayısını arttıralım
    await db.add(`products_${userId}.${productName}`, 1);

    // Kullanıcıya rol verelim
    const user = await interaction.guild.members.fetch(userId);
    const roleToAdd = interaction.guild.roles.cache.get(product.role);
    await user.roles.add(roleToAdd);

    // Satın alındı mesajını ayarlayalım
    const satınAlındıMesajı = interaction.options.get("ürün").value;

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setDescription(`Ürün başarıyla satın alındı!`);

    interaction.reply({ embeds: [embed] });
  },
};
