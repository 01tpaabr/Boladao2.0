const scraping = require('./scraping.js');
const baseWiki = "https://pt.wikipedia.org/";
const fs = require('fs');
const { Client } = require('discord.js');
const randonWiki = "wiki/Especial:Aleat%C3%B3ria";
//List to store audio streams then, terminate them.
let streamList = []

const commands = {
    ['%oi']: async (messageObj, params) => {
        messageObj.channel.send(`Oi ${messageObj.author}`);
    },
    ['%fatos']: async (messageObj, params) => {
        let [url, content] = await scraping.loadPage(baseWiki + randonWiki, scraping.loadParagraphs);
        content = content[0] + content[1];
        messageObj.channel.send(`Toma:\n ${content}\n ${url}`);
    },
    ['%grava']: async (messageObj, params) => {
        //Joining message author voice channel
        const voiceChannel = messageObj.member.voice.channel;
        if (voiceChannel) {
            let membersList = voiceChannel.members;
            const connection = await voiceChannel.join();
            const audioReceiver = connection.receiver;
            for(m of membersList){
                //Do not record audio from bots
                if(!(m[1].user.bot)){
                    //Adding an audio stream for each user in the channel
                    streamList.push(audioReceiver.createStream(m[0], {mode: "pcm", end: "manual"}));

                }
            }
        }else{
            messageObj.channel.send(`Entra em um canal de voz`);
        }
    },
    ['%parou']: async (messageObj, params, client) => {
        const voiceChannel = messageObj.member.voice.channel;
        //List bot's voice connections to compare with author channel
        let sameChannel = false; 
        let currentChannel;
        for(e of client.voice.connections){
            if(e[1].channel.id === voiceChannel.id){            
                sameChannel = true;
                currentChannel = e[1];
            }
        } 
        if (voiceChannel) {
            //Test if message author is in the same channel as the bot
            if(sameChannel){
                //Terminate streams
                streamList.forEach(s => {
                    s.destroy();
                });
        
                //Resets array
                streamList = []
        
                //Leave channel
                currentChannel.disconnect();
            }
        }else{
            messageObj.channel.send(`Entra em um canal de voz`);
        }
    },
    ['%help']: async (messageObj, params) => {
        let resp = "Lista de Comandos: \n";
        for(key in commands){
            resp += key + ", ";
        }
        resp = resp.slice(0, resp.length-2);

        
        messageObj.channel.send(resp);
    }
};

module.exports = commands;
