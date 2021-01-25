const fs = require('fs');
const args = process.argv;
const dotenv = require('dotenv').config();
const config = require('./config.json');
const commandHash = require('./commands.js');
const Discord = require('discord.js');

const bot = new Discord.Client();

async function handleMessages(message){
    //Test if message starts with prefix
    let messageData = message.content;

    if(messageData[0] == config.prefix){
        messageData = messageData.split(" ");
        let commandName = messageData[0];
        let params = messageData.slice(1);
        
        //Run command specified
        if(commandName in commandHash){
            commandHash[commandName](message, params, bot);
        }

    }
}


async function start() {
    await bot.once('ready', () => {
        console.log("Starting...");

        //List connected servers
        if(args.length > 1 && args[2] == 'servers'){
            let guildManager = bot.guilds;
            let guildList = guildManager.cache;

            console.log("List of Connected Servers: ")
            for(id of guildList){
                let guild = id[1];
                console.log(`Server: '${guild.name}', ID: '${id[0]}', Joined at: '${guild.joinedAt}', Is Admin: '${guild.me.permissions.has(8)}'`)
            }

            process.exit();
        }
    });
    
    //Login using token in .env
    await bot.login(process.env.token);
    
    //Setting status
    bot.user.setPresence({
        status: 'online',
        activity: {
            name: 'O Retorno',
            type: 'COMPETING'
        }
    })

    //Update Logs
    bot.on('guildCreate', async (guild) => {
        try{
            let newInfo = `(ADDED) Server: '${guild.name}', ID: '${guild.id}', Joined at: '${guild.joinedAt}', Is Admin: '${guild.me.permissions.has(8)}'\n`
            fs.appendFile('logs', newInfo, (err) => {
                if(err != null){
                    console.log(err);
                }
            })
        }catch(err){
            console.log("Error while reading or writing log.");
            console.log(err);
        }
    });

    bot.on('guildDelete', async (guild) => {
        console.log(`Someone kicked me from ${guild.name}`);
        try{
            let newInfo = `(KICKED) Server: '${guild.name}', ID: '${guild.id}'\n`
            fs.appendFile('logs', newInfo, (err) => {
                if(err != null){
                    console.log(err);
                }
            })
        }catch(err){
            console.log("Error while reading or writing log.");
            console.log(err);
        }
    });


    //Handling commands
    bot.on('message', async (message) => {
        handleMessages(message);
        bot.sweepMessages(1800);
    });

}

start();



