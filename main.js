const dotenv = require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const args = process.argv;

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
                console.log(`Server: '${guild.name}', ID: '${id[0]}', Joined at: '${guild.joinedAt}'`)
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

    bot.on('guildCreate', async (guild) => {
        console.log(`Someone added me to ${guild.name}`);
    });

    //Handling commands
    bot.on('message', async (message) => {
        
    });

}

start();



