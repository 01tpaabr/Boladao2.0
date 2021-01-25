const cheerio = require('cheerio');
const axios = require('axios');

const functions = {
    async loadPage(url, process){
        let resolved = await axios.get(url).then(async res => {
            let currUrl = await res.request.connection._httpMessage._redirectable._currentUrl;
            //Function used to process the data of the page
            let response = await process(res.data);
            
            return [currUrl, response];
        })
        
        return resolved;
    },
    async loadLinks(data){
        const $ = cheerio.load(data);
        let links = $('a');
        let linksText = []
        $(links).each((i, link) => {
            linksText.push([$(link).text(), $(link).attr('href')]);
        })

        return linksText;

    },
    async loadParagraphs(data){   
        const $ = await cheerio.load(data);
        let paragraphs = $('p');
        let paragraphsText = []
        $(paragraphs).each((i, p) => {
            paragraphsText.push($(p).text());
        })

        return paragraphsText.slice(0, 2);
    }
}



module.exports = functions;