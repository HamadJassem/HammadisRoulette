const Discord = require("discord.js");
const bot = new Discord.Client();
let gameOn = false; //determines if the game is on or not
let players = []; // stores the users' ID
let ammo = [0,0,1,0,0,0]; //the bullets in the gun
let bulletPos = 0; //bullet position in gun
let circle = 0; // displays current position of the gun


//shuffle function
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function addUser(player, msg){ //adds the ID of a player to the array
    if (gameOn == true) {
      msg.channel.send("Game is Full");
    }
    else{
      players.push(player);
      msg.reply("You're Added!");
    }
  }



function beginGame(msg)
{

  //Shuffle Players Array
  players = shuffle(players);

  //Actual Game
  msg.channel.send("Shuffling The Bullets");
  ammo = shuffle(ammo); //shuffling bullets
  msg.channel.send("In Order to Play The Game, Type !shoot when it is your turn");
  CallPlayer(players,msg);
  console.log(ammo);


}

function CallPlayer(players,msg){
  if(circle < players.length - 1){
    circle += 1;
  } else {
    circle = 0;
  }
  let member = msg.guild.members.cache.get(players[circle]);
  msg.channel.send(member.displayName + " it is your turn to shoot!");
}

function shootPlayer(msg){
  if(ammo[bulletPos] == 0){
    msg.reply("You Are Alive!");
    bulletPos+=1;
  }
  else {
    temp = []
    msg.reply("You Are Dead!");
    for (var i = 0; i < players.length; i++) {
      if (players[i] == players[circle]) {
        continue;
      }else{
        temp.push(players[i]);
      }
    }
    delete players;
    players = temp;
    delete temp;
    if (players.length != 1) {
      msg.channel.send("Shuffling The Bullets");
      ammo = shuffle(ammo); //shuffling bullets
      bulletPos = 0;
    }
  }
  if(players.length == 1){
    let member = msg.guild.members.cache.get(players[circle]);
    msg.channel.send(member.displayName + " Is The Russian Roulette Champion");
    stopGame(msg);
  }
  CallPlayer(players,msg);
}

function stopGame(msg) {
  if (gameOn == false) {
    msg.reply("Game is not on");
  } else {
    ammo = shuffle(ammo);
    circle = 0;
    gameOn = false;
    players = [];
    bulletPos = 0;
    msg.channel.send("Game is stopped completely!");
  }
}

bot.on('message', msg => {
  if (msg.channel.id === process.env.CHANNELID) { //replace process.env.channelid by your active channel
    if(msg.content.toLowerCase() === "!add"){ //command for !add
      if (players.includes(msg.author.id)) {
        msg.reply("You already exist in the queue");
      }

    else{
        addUser(msg.author.id, msg)
    }

    }
    else if (msg.content.toLowerCase() === "!play") { //command for !play
      if (gameOn == true) {
        msg.reply("Game is already On");
      }
      else {
        if (players.length < 2) {
          msg.reply("The Game Needs at least two players");
        }
        else
        {
          msg.channel.send("The Game Shall Begin");
          gameOn = true;
          beginGame(msg);
        }
      }
    }

    else if (msg.content.toLowerCase() === "!stop") { //stops the game
      stopGame(msg);
    }

    else if(msg.content.toLowerCase() === "!shoot"){
      if (gameOn == false) {
        msg.reply("game is not active");
      }
      else{
        if (players[circle] == msg.author.id) {
          shootPlayer(msg);
        }
        else {
          msg.reply("It is not your turn yet!");
        }
      }
    }

  }
})

bot.login(process.env.BOT_TOKEN); //replace process.env.BOT_TOKEN by the bot token
