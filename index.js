const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { QuickDB } = require("quick.db");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);
const client = new Client({
  intents: INTENTS,
  allowedMentions: {
    parse: ["users"]
  },
  partials: PARTIALS,
  retryLimit: 3
});

const db = new QuickDB();

global.client = client;
client.commands = (global.commands = []);

const { readdirSync } = require("fs");
const { TOKEN } = require("./config.json");

const KATEGORI_KANAL_IDS = ["1134131471074996255", "1134203932093206559", "1133933559963463700", "1135109764238557244", "1134917769389949029", "1134885357343735929", "1133948794296340592", "1133946259649077368", "1135108071937552544", "1134360837969149952","1135981027710480434",];

const TARGET_CHANNEL_IDS = ["1134206079631364098", "1134406577164660786"]; // ❤ emoji eklemek istediğiniz kanalların ID'lerini buraya yazın

/* Slash Komutları Yüklüyoruz */
readdirSync('./commands').forEach(f => {
  if (!f.endsWith(".js")) return;

  const props = require(`./commands/${f}`);
  client.commands.push({
    name: props.name.toLowerCase(),
    description: props.description,
    options: props.options,
    dm_permission: props.dm_permission,
    type: 1
  });

  console.log(`[COMMAND] ${props.name} komutu yüklendi.`);
});
/* Slash Komutları Yüklüyoruz */

/* Eventleri Yüklüyoruz */
readdirSync('./events').forEach(e => {
  const eve = require(`./events/${e}`);
  const name = e.split(".")[0];

  client.on(name, (...args) => {
    eve(client, ...args);
  });

  console.log(`[EVENT] ${name} eventi yüklendi.`);
});
/* Eventleri Yüklüyoruz */

client.on("messageCreate", msg => {
  if (KATEGORI_KANAL_IDS.includes(msg.channel.parentId)) {
    const words = msg.content.split(" ").length;
    db.add(`point_${msg.author.id}`, words);
  }

  if (TARGET_CHANNEL_IDS.includes(msg.channel.id)) {
    try {
      msg.react("❤");
    } catch (error) {
      console.error(`Hata: ${error.message}`);
    }
  }
});

client.login(TOKEN).then(app => {
  console.log(`[BOT] Token girişi başarılı.`);
}).catch(app => {
  console.log(`[BOT] Token girşi başarısız.`);
});
