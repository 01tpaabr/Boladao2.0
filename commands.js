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
            const timeStamp = new Date();
            //Needs to play something before recording, because of discord.js bug
            connection.play('sim.mp3', { volume: 0.1 });

            for(m of membersList){
                //Do not record audio from bots
                if(!(m[1].user.bot)){
                    //Adding an audio stream for each user in the channel, and storing the channel id
                    let audioStream = audioReceiver.createStream(m[1].user, {mode: "pcm", end: "manual"});
                    //Naming file with descriminators
                    let writtenStream = audioStream.pipe(fs.createWriteStream(`./audios/User-${m[1].user.username}_Server-${voiceChannel.guild.name}_Channel-${voiceChannel.name}_Time-${timeStamp.getHours()}h${timeStamp.getMinutes()}min${timeStamp.getDate()}-${timeStamp.getMonth()}-${timeStamp.getFullYear()}.pcm`));
                    streamList.push([voiceChannel.id, audioStream]);

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
                for(i = 0; streamList.length; i ++){
                    currStream = streamList[i];
                    //Terminate only streams from that channel
                    if(currStream[0] == voiceChannel.id){
                        currStream[1].destroy();
                        streamList.splice(i, 1);
                        //stay in the same index
                        i += -1;
                    }
                }
        
                //Leave channel
                currentChannel.disconnect();
            }else{
                messageObj.channel.send(`Não está no meu canal de voz`);
            }
        }else{
            messageObj.channel.send(`Entra no meu canal de voz`);
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
