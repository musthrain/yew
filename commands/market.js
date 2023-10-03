const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "market",
  description: "Sunucudaki farklı ürünlerin fiyat listesi.",
  type: 1,

  options: [
    {
      name: "kategori",
      description: "Bir kategori seçin (Evler / Araçlar)",
      type: 3,
      required: true,
      choices: [
        { name: "Evler", value: "Evler" },
        { name: "Araçlar", value: "Araçlar" },
        { name: "Silahlar", value: "Silahlar" },
        { name: "Motorsikletler", value: "Motorsikletler" },

      ],
    },
  ],

  run: async (client, interaction) => {
    const categories = [
      {
        name: "Evler",
        products: [
          { name: "🏘️ Apartman Dairesi", price: 150000 },
          { name: "🏠 Müstakil Ev", price: 250000 },
          { name: "🏡 Villa", price: 500000 },
          { name: "🏡 Malikane", price: 1200000 },
        ],
      },
      {
        name: "Araçlar",
        products: [
          { name: "🚗 Peugeot 206", price: 30000 },
          { name: "🚗 Fiat Linea", price: 55000 },
          { name: "🚗 Volkswagen Passat", price: 100000 },
          { name: "🚗 Honda Civic", price: 155000 },
          { name: "🚗 Mercedes Benz E 250", price: 210000 },
          { name: "🚗 Tesla Model X", price: 230000 },
          { name: "🚗 Lexus RX 300", price: 255000 },
          { name: "🚗 Land Rover Range Rover Sport 2.0", price: 255000 },
          { name: "🚗 Cadillac Escalade", price: 275000 },
          { name: "🚗 Dodge Challenger", price: 350000 },
          { name: "🚗 Lamborghini Huracan EVO", price: 400000 },
          { name: "🚗 Ferrari ROMA", price: 425000 },
          { name: "🚗 Bentley Continental", price: 500000 },
        ],
      },

      {
        name: "Silahlar",
        products: [
          { name: "🔪 Çakı", price: 1000 },
          { name: "🔫 Luger P08 Pistol", price: 5000 },
          { name: "🔫 Arcus 94", price: 12000 },
          { name: "🔫 Kel-tec PLR-16", price: 20000 },
        ],
      },
      
      {
        name: "Motorsikletler",
        products: [
          { name: "🏍️ Honda Spacy 110", price: 20000 },
          { name: "🏍️ Harley Davidson Fat Boy", price: 28000 },
          { name: "🏍️ Suzuki DR-Z400SM", price: 35000 },
          { name: "🏍️ Yamaha YZF-R6", price: 50000 },
          { name: "🏍️ Kawasaki Ninja H2", price: 65000 },
        ],
      },
      // Diğer kategorileri buraya ekleyin
    ];

    // Handle the user's choice of kategori
    const selectedCategory = interaction.options.getString("kategori");

    // Find the selected kategori in the array
    const kategori = categories.find((c) => c.name === selectedCategory);

    if (!kategori) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("Geçersiz bir kategori seçtiniz.");

      return interaction.reply({ embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setTitle(`${kategori.name} Fiyat Listesi`);

    const productInfo = kategori.products
      .map((product) => `${product.name} : ${product.price.toLocaleString()}€`)
      .join("\n");

    embed.setDescription(`*${productInfo}*`);

    await interaction.reply({ embeds: [embed] });
  },
};
