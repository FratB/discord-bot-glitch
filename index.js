const Discord = require("discord.js"); // discord.js

const commandHandler = require("./commandHandler.js"); // commandHandler
const tools = require("./tools.js"); // tool function
const Dice = require("./diceRoller.js"); // Dice roller functions
// const fetch = require('node-fetch');
// const utf8 = require('utf8');

const dersid = require('./ders/dersid.json'); // Ders idleri ve şifreleri
const program = require('./ders/program.json'); // Ders programı


const BOT_TOKEN = process.env.BOT_TOKEN; // Bot token from .env
const prefix = process.env.prefix; // command prefix
const rickroll = process.env.rickroll; // ricroll gif URL

const client = new Discord.Client();

const commands = {
  gir: {
    aliases: ["gir"],
    handler: message => {
      message
        .delete()
        .then(msg => msg.channel.send("İbi girilmiyi!"))
        .catch(err => console.error(err));
    }
  },

  slm: {
    aliases: ["slm"],
    handler: message => {
      if (message.guild.id != 700274176459538442) return;

      message
        .delete()
        .then(msg => msg.channel.send("Arkadaşlar slm"))
        .catch(err => console.error(err));
    }
  },

  clear: {
    aliases: ["clear", "c"],
    handler: message => {
      if (!message.member.hasPermission("MANAGE_MESSAGES")) return;

      let content = message.content;

      let deleteCount = tools.aliasDelete(
        content,
        commands["clear"]["aliases"]
      );
      deleteCount = parseInt(deleteCount);

      if (isNaN(deleteCount) || deleteCount <= 0) {
        message.channel.send("shut up");
        // message.channel.send("Please put a number only!");
        return;
      }

      if (deleteCount > 50) {
        message.channel.send("You can only delete 50 messages at a time!");
        return;
      }

      message.channel
        .bulkDelete(deleteCount + 1, true)
        .then(() => {
          return message.channel.send(`Deleted ${deleteCount} messages.`);
        })
        .then(sent_msg => {
          return sent_msg.delete({ timeout: 3000 });
        })
        .catch(err => console.error(err));
    }
  },

  avatar: {
    aliases: ["avatar"],
    handler: message => {
      message.channel.send(
        `${message.author} ${message.author.displayAvatarURL()}`
      );
    }
  },

  rickroll: {
    aliases: ["rick", "rickroll"],
    handler: message => {
      message
        .delete()
        .then(msg => msg.channel.send(rickroll))
        .catch(err => console.error(err));
    }
  },

  status: {
    aliases: ["status"],
    handler: message => {
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        message.channel.send(
          `${message.author} you don't have permission to do that!`
        );
        return;
      }

      const commandPart = message.content.substring(0, prefix.length + 6);
      const newStatus = message.content.replace(`${commandPart}`, "").trim();

      if (newStatus == "") {
        message.channel.send(`${message.author} New status can't be empty!`);
        return;
      }

      // if (newStatus == "null") {}

      if (newStatus.startsWith("L!")) {
        client.user
          .setPresence({
            activity: {
              name: newStatus.replace("L!", ""),
              type: "LISTENING"
            }
          })
          .then(() => {
            message.channel.send(
              `${message.author} has changed status of ${client.user} to \'${newStatus}\'.`
            );
          })
          .catch(err => console.error(err));
      } else if (newStatus.startsWith("P!")) {
        client.user
          .setPresence({
            activity: {
              name: newStatus.replace("P!", ""),
              type: "PLAYING"
            }
          })
          .then(() => {
            message.channel.send(
              `${message.author} has changed status of ${client.user} to \'${newStatus}\'`
            );
          })
          .catch(err => console.error(err));
      } else if (newStatus.startsWith("S!")) {
        client.user
          .setPresence({
            activity: {
              name: newStatus.replace("S!", ""),
              type: "STREAMING"
            }
          })
          .then(() => {
            message.channel.send(
              `${message.author} has changed status of ${client.user} to \'${newStatus}\'`
            );
          })
          .catch(err => console.error(err));
      } else if (newStatus.startsWith("W!")) {
        client.user
          .setPresence({
            activity: {
              name: newStatus.replace("W!", ""),
              type: "WATCHING"
            }
          })
          .then(() => {
            message.channel.send(
              `${message.author} has changed status of ${client.user} to \'${newStatus}\'`
            );
          })
          .catch(err => console.error(err));
      } else {
        client.user
          .setPresence({
            activity: {
              name: newStatus,
              type: "PLAYING"
            }
          })
          .then(() => {
            message.channel.send(
              `${message.author} has changed status of ${client.user} to \'${newStatus}\'`
            );
          })
          .catch(err => console.error(err));
      }

      // message.channel.send(`${message.author} has changed status of ${client.user} to \'${newStatus}\'`);
    }
  },

  roll: {
    aliases: ["roll", "r"],
    handler: message => {
      // message.delete();
      let content = message.content.toLowerCase();

      for (let i = 0; i < commands["roll"].aliases.length; i++) {
        if (content.startsWith(`${prefix}${commands["roll"].aliases[i]}`)) {
          content = message.content.replace(
            `${prefix}${commands["roll"].aliases[i]} `,
            ""
          );
          break;
        }
      }

      const result = Dice.rollDice(content);

      if (result == -1) {
        message.channel.send(
          `${message.author} Please use \"[count]d[dice] + [count]d[dice] + bonus\".`
        );
        return;
      } else if (result === -2) {
        message.channel.send(
          `${message.author} Dices must be a positive integer that smaller than 100!`
        );
        return;
      }

      let dicesStr = "";
      for (let i = 0; i < result[0].length; i++) {
        dicesStr += tools.makeStr(result[0][i]);
        dicesStr += ", ";
      }

      let s = 0;
      s += result[1];
      for (let i = 0; i < result[0].length; i++) {
        s += tools.sum(result[0][i]);
      }

      message.channel.send(
        `${message.author} Rolls: ${dicesStr} Bonus: ${result[1]}\nSum: ${s}`
      );
    }
  },
  
  "dersid": {
    aliases: [
      "dersid",
      "di"
    ],
    handler: message => {
      if (message.guild.id != 700274176459538442) return;
      
      const content = message.content.toLowerCase();
      
      let arg = tools.aliasDelete(content, commands["dersid"]["aliases"]);
      
      if (arg == '') {
        message.channel.send('Ders adı da yaz mrom.');
        return;
      }
  
      let dersler = Object.keys(dersid);

      dersler.forEach(dersName => {
        if (arg != dersName) return;
        
        let ders = dersid[arg];
        
        message.delete()
          .then(msg => {
            return message.channel.send(`Ders: ${arg}\n Id: ${ders["id"]}\n Şifre: ${ders["şifre"]}`)
          })
          .catch(err => console.error(err));
      });
    }
  },
  
  "ders": {
    aliases: [
      "ders",
      "d"
    ],
    handler: message => {
      if (message.guild.id != 700274176459538442) return;
      
      const date = new Date;
      const day = `${date.getDay()}`;

      let hours = `${date.getHours()}`;
      if (hours.length == 1) hours = `0${hours}`;

      let minutes = `${date.getMinutes()}`;
      if (minutes.length == 1) minutes = `0${minutes}`;

      const time = parseFloat(`${hours}.${minutes}`);

      if (day == 0) return message.channel.send("Bu gün okul yok!");
      
      let dersGünü = program[`${day}`];
      
      let dersSayısı = Object.keys(dersGünü).length;
      
      for (let i = 1; i <= dersSayısı; i++) {
        let ders = dersGünü[`${i}`];
        let sonrakiDers = parseFloat(dersGünü[`${i+1}`]);
        let dersBaşlangıç = parseFloat(ders["başlangıç"]);
        let dersBitiş = ders["bitiş"];
        
        if (time < parseFloat(dersGünü[`${i}`]["başlangıç"])) {
          message.channel.send(`Dersler bişlimidi!\nİlk dirsin '${dersGünü["1"]["ders"]}'.`);
          return;
        }
        
        if (time >= dersBaşlangıç && time < dersBitiş) {
          message.channel.send(`Zaten ${i}. derstesin. Ders ${ders["ders"]}. Saat ${ders["bitiş"]} olunca bitecek.`);
          return;
        }
        
        if (time >= dersBitiş) {
          if (sonrakiDers == undefined) {
            message.channel.send(`İbi bugün okul bitti zitin.`);
            return;
          }
          
          if (time < parseFloat(sonrakiDers["başlangıç"])) {
            message.channel.send(`Aradasın. Saat ${sonrakiDers["başlangıç"]} olunca ${i+1}. ders ${sonrakiDers["ders"]} başlayacak.`);
            return;
          }
        }
      }
    }    
  }
 
//   "gifSearch": {
//     aliases: [
//       "gifsearch",
//       "gs",
//       "gifs"
//     ],
//     handler: (message) => {
//       let content = message.content;

//       for (let i = 0; i < commands["gifSearch"].aliases.length; i++) {
//         if (content.startsWith(`${prefix}${commands["gifSearch"].aliases[i]}`)) {
//           content = content.replace(`${prefix}${commands["gifSearch"].aliases[i]}`, '').trim();
//           break;
//         }
//       }

//       if (content == '' || content == ' ') {
//         message.channel.send(`${message.author} olmaz!`);
//       }

//       let index;
//       let search;

//       if (content[1] == '!') {
//         let args = content.split('!');
//         search = args[1].replace(' ', '+');
//         index = parseInt(args[0]) - 1;
//       } else {
//         index = 0;
//         search = content.replace(' ', '+');
//       }

//       if (isNaN(index)) {
//         console.log("NaA");
//         return;
//       }

//       if (index > 15) {
//         message.channel.send(`${message.author} 15'den büyük olmaz!`);
//         return;
//       }


//       const URLBase = "http://api.giphy.com/v1/gifs/search?";
//       const API_KEY = `api_key=${process.env.GIPHY_API_KEY}&`;
//       const query = `q=${search}&`;
//       const limit = `limit=10`;
//       const searchURL = URLBase + query + API_KEY + limit;


//       fetch(utf8.encode(searchURL))
//         .then(result => result.json())
//         .then(data => {
//           return message.channel.send(`${data.data[index].images["original"].url}`);
//         })
//         .catch(err => console.error(err));

//     }
//   }
};


function berkayListener(message) {
  if (message.author.id != process.env.berkayID) return;

  const yanıtlar = [
    "Fuk yu!",
    "Anan nasıl?",
    "ArıKay",
    "Boş yapma!",
    rickroll,
    "Muşpiçka"
  ]

  let yanıt = yanıtlar[tools.random(0, yanıtlar.length)];

  message.reply(yanıt);
}



client.on("ready", () => {
  console.log(`${client.user.tag} is ready.`);
  client.user.setPresence({
    activity: {
    name: "O Tarz Mı?",
    type: 'LISTENING'
    }
  });
});


client.on("message", message => {
  
  berkayListener(message);
  
  
  let commandList = Object.keys(commands);
  commandList.forEach(command => {
    commandHandler(message, commands[command]);
  });
});


client.login(BOT_TOKEN);
