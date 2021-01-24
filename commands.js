const scraping = require('./scraping.js');
const baseWiki = "https://pt.wikipedia.org/";
const randonWiki = "wiki/Especial:Aleat%C3%B3ria";



const commands = {
    ['%oi']: (messageObj, params) => {
        messageObj.channel.send(`Oi ${messageObj.author}`);
    },
    ['%fatos']: async (messageObj, params) => {
        let [url, content] = await scraping.loadPage(baseWiki + randonWiki, scraping.loadParagraphs);
        content = content[0] + content[1];
        messageObj.channel.send(`Toma:\n ${content}\n ${url}`);
    },
    ['%help']: (messageObj, params) => {
        let resp = "Lista de Comandos: \n";
        for(key in commands){
            resp += key + ", ";
        }
        resp = resp.slice(0, resp.length-2);

        console.log(resp);
    }
};

module.exports = commands;
