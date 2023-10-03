const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "mülkdevir",
  description: "Belirli bir mülkü başka bir kullanıcıya devreder.",
  type: 1,

  options: [
    {
      name: "kullanıcı",
      description: "Mülkü devredeceğiniz kullanıcıyı seçin",
      type: 6, // 6 -> User
      required: true,
    },
    {
      name: "mülk",
      description: "Devredilecek mülkü seçin",
      type: 3, // 3 -> String
      required: true,
      choices: [
        { name: "🏘️ Apartman Dairesi", value: "apartmandairesi" },
        { name: "🏠 Müstakil Ev", value: "müstakilev" },
        { name: "🏡 Villa", value: "villa" },
        { name: "🏡 Malikane", value: "malikane" },
        { name: "🚗 Peugeot 206", value: "peugeot" },
        { name: "🚗 Fiat Linea", value: "fiat" },
        { name: "🚗 Volkswagen Passat", value: "passat" },
        { name: "🚗 Honda Civic", value: "honda" },
        { name: "🚗 Mercedes Benz E 250", value: "mercedes" },
        { name: "🚗 Tesla Model X", value: "tesla" },
        { name: "🚗 Lexus RX 300", value: "lexus" },
        { name: "🚗 Land Rover Range Rover Sport 2.0", value: "landrover" },
        { name: "🚗 Cadillac Escalade", value: "cadillac" },
        { name: "🚗 Dodge Challenger", value: "dodge" },
        { name: "🚗 Lamborghini Huracan EVO", value: "lamborghini" },
        { name: "🚗 Ferrari ROMA", value: "ferrari" },
        { name: "🚗 Bentley Continental", value: "bentley" },
        { name: "🏍️ Honda Spacy 110", value: "spacy" },
        { name: "🏍️ Harley Davidson Fat Boy", value: "harley" },
        { name: "🏍️ Suzuki DR-Z400SM", value: "suzuki" },
        { name: "🏍️ Yamaha YZF-R6", value: "yamaha" },
        { name: "🏍️ Kawasaki Ninja H2", value: "kawasaki" },
      ],
    },
  ],

  run: async (client, interaction) => {
    const userId = interaction.user.id;
    const targetUserId = interaction.options.getUser("kullanıcı").id;
    const productName = interaction.options.getString("mülk");

    // Kullanıcının sahip olduğu mülkleri alalım
    const userProperties = await db.get(`products_${userId}`) || {};

    // Kullanıcının mülkleri devralacak kişinin sahip olduğu mülklere ekleyelim
    const targetUserProperties = await db.get(`products_${targetUserId}`) || {};

    // Seçilen mülkü doğrulayalım
    if (!userProperties[productName] || userProperties[productName] < 1) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Mülk devretmek istediğiniz ürüne sahip değilsiniz.");

      return interaction.reply({ embeds: [embed] });
    }

    let totalPrice = 5000; // İşlem ücreti olarak 5000

    // Eğer devredilen kullanıcının sahip olduğu mülk sayısı 1'den fazlaysa, mülkü devralan kullanıcıya eklemeyiz.
    if (!targetUserProperties[productName] || targetUserProperties[productName] < 1) {
      // Mülkü devredilen kullanıcının mülk sayısını azaltalım
      await db.sub(`products_${userId}.${productName}`, 1);

      // Mülkü devralan kullanıcının mülk sayısını arttıralım
      await db.add(`products_${targetUserId}.${productName}`, 1);
    } else {
      totalPrice += getProductPrice(productName); // Mülkü devralan kullanıcıya mülkün fiyatını da ekleyelim
    }

    // Kullanıcının bakiyesini düşürelim
    const userBalance = await db.get(`money_${userId}`);
    if (!userBalance || userBalance < totalPrice) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Yeterli bakiyeniz yok veya işlem ücretini karşılamıyorsunuz.");

      return interaction.reply({ embeds: [embed] });
    }

    await db.sub(`money_${userId}`, totalPrice);

    // Kullanıcının bakiyesini arttıralım
    await db.add(`money_${targetUserId}`, totalPrice);

    // Devir işlemi başarılı mesajını gönderelim
    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setDescription(`*Mülk başarıyla devredildi!*`);

    interaction.reply({ embeds: [embed] });
  },
};

function getProductPrice(product) {
  const products = {
    "apartmandairesi": 150000,
    "müstakilev": 250000,
    "villa": 500000,
    "malikane": 1200000,
    "peugeot": 30000,
    "fiat": 55000,
    "passat": 100000,
    "honda": 155000,
    "mercedes": 210000,
    "tesla": 230000,
    "lexus": 255000,
    "landrover": 255000,
    "cadillac": 275000,
    "dodge": 350000,
    "lamborghini": 400000,
    "ferrari": 425000,
    "bentley": 500000,
    "spacy": 12000,
    "harley": 12000,
    "suzuki": 12000,
    "yamaha": 12000,
    "kawasaki": 12000,
  };

  return products[product] || 0;
}
