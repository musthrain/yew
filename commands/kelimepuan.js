const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "sıralama",
  description: "En fazla kelime yazan 10 kişiyi ve kendi puanınızı gösterir.",
  type: 1,

  options: [], // Gerekli değil, çünkü komut hiçbir argüman almıyor.

  run: async (client, interaction) => {
  	console.log(await db.all())  
  const allData = await db.all();
    const wordCounts = allData.filter(entry => entry.id.startsWith("point_"));
  	console.log(wordCounts)  
wordCounts.sort((a, b) => b.value - a.value);
    const user = interaction.user;
    const userId = user.id;
if(!allData) return message.channel.send({embeds: [ new EmbedBuilder().setAuthor(user.user.tag,user.user.avatarURL({dynamic: true})).setDescription(`Veriler bulunamadı.`)]})
    
const userWordCount = await db.get(`point_${userId}`) || 0;
  	console.log(userWordCount)  
    let topTen = "";
    for (let i = 0; i < Math.min(wordCounts.length, 10); i++) {
      const userData = wordCounts[i];
      const userMember = interaction.guild.members.cache.get(userData.id.split("_")[1]) || "Bilinmiyor";
      const wordCount = userData.value;
      topTen += `**${i + 1}.** ${userMember} - **${wordCount}** *kelime*\n`;
    }

    const embed = new EmbedBuilder()
      .setColor("#ffffff")
      .setTitle("En Fazla Rol Yazanlar")
      .setDescription(topTen)
      .addFields({name: `Sizin RolePlay Puanınız`, value: `Toplam Kelime: **${userWordCount}**`});

    await interaction.reply({ embeds: [embed] });
  },
};
