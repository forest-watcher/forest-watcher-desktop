// Pulls all current translations for all file

var fetch = require('node-fetch');
require('dotenv').config();
var fs = require('fs');

const languagesUrl = `${process.env.TRANSIFEX_URL}/${process.env.TRANSIFEX_PROJECT}/resource/${process.env.TRANSIFEX_SLUG}/?details`;
const translationsUrl = `${process.env.TRANSIFEX_URL}/${process.env.TRANSIFEX_PROJECT}/resource/${process.env.TRANSIFEX_SLUG}/translation`;

const fetchConfig = {
    headers: {
        Authorization: `Basic ${process.env.TRANSIFEX_API_TOKEN}`
    },
    method: 'GET'
}

console.log('Fetching available languages...');
fetch(languagesUrl, fetchConfig)
    .then(function(res) {
        console.log('Languages found!');        
        return res.json();
    })
    .then(function(json) {
        const languageKeys = json.available_languages.map((language) => {
            const lang = language.code;
            return lang;
        });
        return languageKeys;
    })
    .then(function(languageKeys) {
        languageKeys.forEach((lang) => {
            console.log(`Fetching translations for ${lang}`);    
            fetch(`${translationsUrl}/${lang}`, fetchConfig)
                .then(function(res) {
                    console.log(`${lang} translations found...`);
                    return res.json();
                })
                .then(function(json) {
                    console.log(`Saving to file ${lang}.json in ${process.env.LOCALES_PATH}`);
                    fs.writeFile(`${process.env.LOCALES_PATH}/${lang}.json`, JSON.stringify(JSON.parse(json.content), null, 4), (err) => {
                        if (err) throw err;
                        console.log(`Translations for ${lang} successfully saved!`);
                    }); 
                });
        });

    });