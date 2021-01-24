const dotenv = require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

async function start() {
    await bot.once('ready', () => {
        console.log("Starting...");
    });
    
    //Login
    await bot.login(process.env.token);
    
    //Setting status
    bot.user.setPresence({
        status: 'online',
        activity: {
            name: 'GRRRRR',
            type: 'COMPETING',
        }
    })

}

start();



