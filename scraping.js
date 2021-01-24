const cheerio = require('cheerio');
const axios = require('axios');
const baseWiki = "https://pt.wikipedia.org/"
const startingWiki = 'wiki/Wikip%C3%A9dia:P%C3%A1gina_principal'
const functions = {
    loadPage(url, process){
        axios.get(url).then(res => {
            //Function used to process the data of the page
            process(res.data);
        })
    },
    loadLinks(data){
        const $ = cheerio.load(data);
        let links = $('a');
        $(links).each((i, link) => {
            console.log($(link).text() + ':\n  ' + $(link).attr('href'))
        })

    },
    loadRandomParagraph(data){

    }
}

functions.loadPage(baseWiki + startingWiki, functions.loadLinks);


module.exports = functions;