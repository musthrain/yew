const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "mülksatınal",
  description: "Belirli bir ürünü satın alır ve rol verir",
  type: 1,

  options: [
    {
      name: "ürün",
      description: "Satın alınacak ürünü seçin",
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




        // Diğer ürünleri buraya ekleyin
      ],
    },
  ],

  run: async (client, interaction) => {
    const userId = interaction.user.id;
    const productName = interaction.options.getString("ürün");

    // Ürün fiyatlarını ve rolleri tanımlayalım
    const products = {
      "apartmandairesi": { price: 150000, role: "1134197305923354805" },
      "müstakilev": { price: 250000, role: "1134197426329239602" },
      "villa": { price: 500000, role: "1134197490351091712" },
      "malikane": { price: 1200000, role: "1134197571234046103" },
      "peugeot": { price: 30000, role: "1134197725836099805" },
      "fiat": { price: 55000, role: "1134207553312665833" },
      "passat": { price: 100000, role: "1134207651312566302" },
      "honda": { price: 155000, role: "1134207729028829256" },
      "mercedes": { price: 210000, role: "1134207896763244634" },
      "tesla": { price: 230000, role: "1134207992661823648" },
      "lexus": { price: 255000, role: "1134208339983749280" },
      "landrover": { price: 255000, role: "1134208158584291388" },
      "cadillac": { price: 275000, role: "1134208247985877165" },
      "dodge": { price: 350000, role: "1134208476458008698" },
      "lamborghini": { price: 400000, role: "1134208535970975785" },
      "ferrari": { price: 425000, role: "1134208605197975552" },
      "bentley": { price: 500000, role: "1134208676685680772" },
      "spacy": { price: 12000, role: "1134260257976242187" },
      "harley": { price: 12000, role: "1134260316952350720" },
      "suzuki": { price: 12000, role: "1134260286136782999" },
      "yamaha": { price: 12000, role: "1134260346559934494" },
      "kawasaki": { price: 12000, role: "1134260224904134676" },

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
