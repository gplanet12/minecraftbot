const user = require('./user files/user.json')
const fs = require("fs")

let whitelistFile = fs.readFileSync('./user files/whitelist.csv')
let blacklistFile = fs.readFileSync('./user files/blacklist.csv')
console.log("Whitelist:\n" + whitelistFile + "\nBlacklist:\n" + blacklistFile)
var whitelisted = whitelistFile.toString().split('\n');
var blacklist = blacklistFile.toString().split('\n'); 

function bot() {
var coinflip = require('coinflip');
const fetch = require('node-fetch-commonjs')
const mineflayer = require('mineflayer')
const tpsPlugin = require('mineflayer-tps')(mineflayer)
const mineflayerViewer = require('prismarine-viewer').mineflayer
const { Movements, goals } = require('mineflayer-pathfinder')
const { GoalNear, GoalBlock, GoalXZ, GoalY, GoalInvert, } = require('mineflayer-pathfinder').goals
const pathfinder = require('mineflayer-pathfinder').pathfinder
const mcData = require('minecraft-data')("1.12.2")
const GoalFollow = goals.GoalFollow
var stop = 0
var cam = 0

//bot info
const bot = mineflayer.createBot({
  host: '0b0t.org', // optional
  port: 25565, // optional
  username: user.Email, // email
  password: user.Password, // pass
  version: "1.12.2", // ver
  auth: 'microsoft' // auth
})

//respawn
function respawn(message, username) {
  if (message.toString().includes("Your request was accepted")) {
      //let nz_date_string = new Date().toLocaleString("de-AT", { timeZone: "CET" });
      //var fs = require('fs'), str = nz_date_string + ", " + transationUser + '\n';
      //fs.open('./user files/usageLog.csv', 'a', 666, function (e, id) {
      //    fs.write(id, str, null, 'utf8', function () {
      //        fs.close(id);
      //    }, 500);
      //});
      setTimeout(() => bot.chat("/kill"), 1250);
      bot.removeListener('message', respawn);
  }
  else if (message.toString().includes("timed out") || message.toString().includes("denied")) {
      bot.chat(`/msg ${username} you didn't accept the tp`)
      bot.chat(`/kill`)
      bot.removeListener('message', respawn);
  }
}

//sleep
function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}

//on spawn
bot.once('spawn', async () => {
    bot.loadPlugin(tpsPlugin)
    bot.loadPlugin(pathfinder)
    const movements = new Movements(bot, mcData)
    bot.pathfinder.setMovements(movements)
    console.log('loged in')
    bot.setControlState('right', true);
    await sleep(1000)
    bot.setControlState('right', false);
    await sleep(1000)
    bot.setControlState('left', true);
    await sleep(1000)
    bot.setControlState('left', false);
})

//admin list
let aff = ["gplanet", "Lickitung", "Ninto1"]

//tpy admins
bot.chatAddPattern(/^([a-zA-Z0-9_]{3,16}) wants to teleport to you\.$/, "tpRequest", "tpa request");
bot.on('tpRequest', function (username) {
    if(!aff.includes(username)) return
    bot.chat(`/msg ${username} Auto Accepting..`),
    bot.chat(`/tpy ${username}`)
   })

//chat thing's or samthing
bot.on('chat', async (username,message) => {

//whitelist add
if (message.includes("%whitelistAdd")) {
  if(arr.includes(username)){
    let user = message.split(' ')[1];
    console.log(user + " added to whitelist")
    bot.whisper(username, user + " added to whitelist")
    bot.whisper(user, user + "you got added to the whitelist")
    var fs = require('fs'), str = '\n' + user;
    fs.open('./user files/whitelist.csv', 'a', 666, function (e, id) {
        fs.write(id, str, null, 'utf8', function () {
            fs.close(id);
        });
    });
    whitelisted.push(user);
  }
}

//blacklist add
if (message.includes("%blacklistAdd")) {
  if(aff.includes(username)){
    let user = message.split(' ')[1];
    console.log(user + " added to blacklist")
    bot.whisper(username, user + " added to blacklist")
    bot.whisper(user, user + "you got added to the blacklist")
    var fs = require('fs'), str = '\n' + user;
    fs.open('./user files/blacklist.csv', 'a', 666, function (e, id) {
        fs.write(id, str, null, 'utf8', function () {
            fs.close(id);
        });
    });
    blacklist.push(user);
  }
}

//kits
if(message.startsWith("%kit")){
  if(whitelisted.includes(username)){
    var ign = username
    var kitnum = message.split(' ')[1]
      if(kitnum > 5 || kitnum <= 0){
        bot.chat(`/msg ${ign} plz use a valid kit number`)
      }
      else{
        bot.clearControlStates()
        bot.chat(`/msg ${ign} geting the kit ${kitnum}`)
        const x = (3089258-(kitnum*2))
        const y = (64)
        const z = (104329)
        const goal = new GoalBlock(x, y, z)
        bot.pathfinder.setGoal(goal)
        bot.on('playerCollect', async() => {
          bot.chat(`/tpa ${ign}`)
          console.log(`${username}`)
          bot.on('messagestr',(jsonMsg, position, sender, verified) => {
            respawn(jsonMsg, position, sender, verified)
        })
        bot.setControlState('right', true);
        await sleep(1000)
        bot.setControlState('right', false);
        await sleep(1000)
        bot.setControlState('left', true);
        await sleep(1000)
        bot.setControlState('left', false);
        })
      }
  }
  else if(blacklist.includes(username)) {
    bot.chat(`/msg ${username} you are blacklisted from the bot join the discord to get removed from the blacklist https://gplanet.me/discord`)
  }
  else{
    bot.chat(`/msg ${username} you are not whitelisted join the discord and apply for whitelist https://gplanet.me/discord`)
  }
}

if(message.includes("%help")){
  bot.chat(": Join the discord for all commands! https://gplanet.me/discord or chack out our site https://gplanet.me")
}

//random fact
if(message.includes("%fact")){
  if(blacklist.includes(username)){
    bot.chat(`/msg ${username} you are blacklisted from the bot join the discord to get removed from the blacklist https://gplanet.me/discord`)
  }
  else{
    let header = new fetch.Headers({
      "Accept": "application/json",
      "X-Api-Key": user.api-ninja
  });
  const response = await fetch('https://api.api-ninjas.com/v1/facts?limit=1', { method: 'GET', headers: header });
  const data = await response.json();
  bot.chat(": Fact: " + data[0].fact)
  }
}

//cock tail
if(message.includes("%cocktail")){
  if(blacklist.includes(username)){
    bot.chat(`/msg ${username} you are blacklisted from the bot join the discord to get removed from the blacklist https://gplanet.me/discord`)
  }
  else{
  var cocktail = message.split('l ')[1]
  let header = new fetch.Headers({
        "Accept": "application/json",
        "X-Api-Key": user.api-ninja
    });
    const response = await fetch(`https://api.api-ninjas.com/v1/cocktail?name=${cocktail}`, { method: 'GET', headers: header });
    const data = await response.json();
    bot.chat(": Ingredients: " + data[0].ingredients)
    await sleep(500)
    bot.chat(": Instructions: " + data[0].instructions)
  }
}

//random quote
if(message.includes("%quote")){
  if(blacklist.includes(username)){
    bot.chat(`/msg ${username} you are blacklisted from the bot join the discord to get removed from the blacklist https://gplanet.me/discord`)
  }
  else{
  let header = new fetch.Headers({
        "Accept": "application/json",
        "X-Api-Key": user.api-ninja
    });
    const response = await fetch('https://api.api-ninjas.com/v1/quotes', { method: 'GET', headers: header });
    const data = await response.json();
    bot.chat(": Quote: " + data[0].quote)
    await sleep(500)
    bot.chat(": Author: " + data[0].author)
  }
}

//coinflip
if(message.includes("%coinflip")){
  if(blacklist.includes(username)){
    bot.chat(`/msg ${username} you are blacklisted from the bot join the discord to get removed from the blacklist https://gplanet.me/discord`)
  }
  else{
  if (coinflip()) {
    bot.chat(': you got: Heads!');
  } else {
    bot.chat(': you got: Tails!');
  }
}
}

//namemc
if(message.startsWith("%namemc")){
  if(blacklist.includes(username)){
    bot.chat(`/msg ${username} you are blacklisted from the bot join the discord to get removed from the blacklist https://gplanet.me/discord`)
  }
  else{
  var ign = message.split(" ")[1];
  var ignlen = ign?.length || 0
  if(ignlen <= 0){
    bot.chat(`: namemc: https://namemc.com/profile/${username}`)
  }
  else {
    bot.chat(": namemc: https://namemc.com/profile/" + ign)
  }
}
}

//tps
if(message.startsWith("%tps")){
  if(blacklist.includes(username)){
    bot.chat(`/msg ${username} you are blacklisted from the bot join the discord to get removed from the blacklist https://gplanet.me/discord`)
  }
  else{
    bot.chat('Current tps: ' + bot.getTps())
  }
}

//ping
if(message.startsWith("%ping")){
  if(blacklist.includes(username)){
    bot.chat(`/msg ${username} you are blacklisted from the bot join the discord to get removed from the blacklist https://gplanet.me/discord`)
  }
  else{
  var ign = message.split(" ")[1];
  var ignlen = ign?.length || 0
  if(ignlen <= 0){
    bot.chat(username + " your ping is: " + bot.players[username].ping)
  }
  else {
    bot.chat(ign + " your ping is: " + bot.players[ign].ping)
  }
}
}

})

//on err or kick
bot.on('kicked', (reason) => console.log(reason))
bot.on('error', err => console.log(err))

bot.on('error', function (err) {
  console.log('Error attempting to reconnect: ' + err.errno + '.');
  if (err.code == undefined) {
      console.log('Invalid credentials OR bot needs to wait because it relogged too quickly.');
      console.log('Will retry to reconnect in 30 seconds. ');
      setTimeout(relog, 30000);
  }
})

//on end
bot.on('end', function () {
  console.log("Bot has ended");
  setTimeout(relog, 30000);
});
}

//relog
function relog() {
    console.log("Attempting to reconnect...");
    bot()
}

bot()