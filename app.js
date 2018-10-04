const Discord = require('discord.js');
const Token = require("./token.json");
const bot = new Discord.Client({disableEveryone: true});
const fs = require('fs');

const prefix = '.';
const ownerId = "279980858050347008";

const cash = JSON.parse(fs.readFileSync('cash.json', 'utf8'));

const talkedRecently = new Set();
const hackedRecently = new Set();

bot.on('message', message => {
  let sender = message.author;
  let args = message.content.slice(prefix.length).trim().split(' ');
  let cmd = args.shift().toLowerCase();
  let msg = message.content.toUpperCase();

  if(!cash[message.author.id]) cash[message.author.id] = {};
  if(!cash[message.author.id].money) cash[message.author.id].money = 1000;

  fs.writeFile('cash.json', JSON.stringify(cash), (err) => {
      if (err) console.error(err);
    })

  if(message.author.bot) return;



  if(!message.content.startsWith(prefix)) return

  if(msg === prefix + "BAL" || msg === prefix + "BALANCE"){
    message.channel.send({embed:{
      title: "BANK",
      color: 0xFF0000,
      fields: [{
        name: "Account Balance",
        value: cash[message.author.id].money
      }]
    }})
  }

  if(msg === prefix + "WORK"){


    if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 1 minute before you can work again. - " + message.author);
    } else {
          let gCash = Math.floor(Math.random()* 25 + 1)
          cash[message.author.id].money += gCash
          message.channel.send({embed:{
            title: "WORKED",
            color: 0x21F313,
            fields: [{
              name: "You have worked",
              value: "You worked and gained " + gCash + " cash!"
            }]
          }})
        }
        talkedRecently.add(message.author.id);
        setTimeout(() => {

          talkedRecently.delete(message.author.id);
        }, 60000);
    }
    if(msg.startsWith(prefix + "HACK")){
      if (hackedRecently.has(message.author.id)) {
              message.channel.send("You can only hack once a hour " + message.author);
      } else {
            let hackChance = Math.floor(Math.random()* 3)
            let hackedPlayer = message.guild.member(message.mentions.users.first())
            if(!hackedPlayer){
              return message.channel.send("could not find player")
            }
            let hackedCash = Math.floor(cash[hackedPlayer.id].money / 2)

            if(hackChance === 2){
              cash[message.author.id].money += hackedCash;
              cash[hackedPlayer.id].money -= hackedCash;
              message.channel.send({embed:{
                title: "HACKED",
                color:0XFF0000,
                fields: [{
                  name: "HACKED",
                  value: "You hacked " + hackedPlayer + "and took  " + hackedCash
                }]
              }})
            }
            else{
              message.channel.send("hack failed!")
            }


          }
          hackedRecently.add(message.author.id);
          setTimeout(() => {

            hackedRecently.delete(message.author.id);
          }, 60000 * 60);
    }
    if(msg.startsWith(prefix + "SETCLEAR")){
      if(message.author.id === ownerId){
        let clearuser = message.guild.member(message.mentions.users.first())
          hackedRecently.delete(clearuser.id);
          talkedRecently.delete(clearuser.id);
          message.channel.send('CLEARED')
      }else {
        message.channel.send('only PowerminsYT himself can use that command!')
      }
    }

  try{

    delete require.cache[require.resolve(`./commands/${cmd}.js`)]

    let ops = {
      ownerId: ownerId
    }

    let commandFile = require(`./commands/${cmd}.js`);
    commandFile.run(bot, message, args, ops)

  }catch(e){
    //console.log(e.stack)
  }


})




bot.on("ready", async () =>{
  console.log(`${bot.user.username} is online It's running on ${bot.guilds.size} servers!`);
  bot.user.setActivity("YOU!", {type: "WATCHING"});
});

bot.login(process.env.BOT_TOKEN);
