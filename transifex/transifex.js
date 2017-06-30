console.log('Transifex is so cool!');

var fetch = require('node-fetch');
require('dotenv').config();

const url = `${process.env.TRANSIFEX_URL}/${process.env.TRANSIFEX_PROJECT}/resource/${process.env.TRANSIFEX_SLUG}/?details`;
const fetchConfig = {
    headers: {
        Authorization: `Basic ${process.env.TRANSIFEX_API_TOKEN}`
    },
    method: 'GET'
}

fetch(url, fetchConfig)
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        console.log(json);
    });