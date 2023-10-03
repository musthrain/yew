const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "mülkler",
  description: "Kullanıcının veya etiketlenen kullanıcının sahip olduğu araçları ve evleri gösterir.",
  type: 1,

  options: [
    {
      name: "kullanıcı",
      description: "Mülklerini görmek istediğiniz kullanıcıyı etiketleyin (isteğe bağlı)",
      type: 6, // 6 -> USER
      required: false,
    },
  ],

  run: async (client, interaction) => {
    let userId;
    let userMülkler;

    const userParam = interaction.options.getUser("kullanıcı");
    if (userParam) {
      userId = userParam.id;
      userMülkler = await db.get(`products_${userId}`);
    } else {
      userId = interaction.user.id;
      userMülkler = await db.get(`products_${userId}`);
    }

    if (!userMülkler || Object.keys(userMülkler).length === 0) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Henüz hiçbir mülkünüz yok.");

      return interaction.reply({ embeds: [embed] });
    }

    const products = {
      "apartmandairesi": "🏘️ Apartman Dairesi",
      "müstakilev": "🏠 Müstakil Ev",
      "villa": "🏡 Villa",
      "malikane": "🏡 Malikane",
      "peugeot": "🚗 Peugeot 206",
      "fiat": "🚗 Fiat Linea",
      "passat": "🚗 Volkswagen Passat",
      "honda": "🚗 Honda Civic",
      "mercedes": "🚗 Mercedes Benz E 250",
      "tesla": "🚗 Tesla Model X",
      "lexus": "🚗 Lexus RX 300",
      "landrover": "🚗 Land Rover Range Rover Sport 2.0",
      "cadillac": "🚗 Cadillac Escalade",
      "dodge": "🚗 Dodge Challenger",
      "lamborghini": "🚗 Lamborghini Huracan EVO",
      "ferrari": "🚗 Ferrari ROMA",
      "bentley": "🚗 Bentley Continental",
      "spacy": "🏍️ Honda Spacy 110",
      "harley": "🏍️ Harley Davidson Fat Boy",
      "suzuki": "🏍️ Suzuki DR-Z400SM",
      "yamaha": "🏍️ Yamaha YZF-R6",
      "kawasaki": "🏍️ Kawasaki Ninja H2",

      // Diğer ürünleri buraya ekleyin
    };

    const filteredMülkler = Object.entries(userMülkler).filter(
      ([mülkAdı, miktar]) => miktar > 0 && !["telefon", "çakı", "luger", "arcus", "plr16"].includes(mülkAdı)
    );

    if (filteredMülkler.length === 0) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Henüz hiçbir mülkünüz yok.");

      return interaction.reply({ embeds: [embed] });
    }

    let kullanıcı = interaction.options.getUser('kullanıcı');
    if (!kullanıcı) kullanıcı = interaction.user;

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setDescription(`**${kullanıcı}** *'ın Sahip Olduğu Mülkler ve Eşyalar*\n\n` +
        filteredMülkler
          .map(([mülkAdı, miktar]) => `**${products[mülkAdı]}**: *${miktar}* adet`)
          .join("\n")
      );

    await interaction.reply({ embeds: [embed] });
  },
};
