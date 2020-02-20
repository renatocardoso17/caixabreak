const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const axios = require('axios');
const setCookieParser = require('set-cookie-parser');
const cheerio = require('cheerio');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.get('/', async (req, res) => {

    const username = req.query.username || process.env.USERNAME;
    const password = req.query.password || process.env.PASSWORD;

    if (!username || !password) {
        res.status(400).send('please add username and password parameters on url. e.g. ?username=1234&password=4321');
        return;
    }

    const [getJsession, getSmsession] = await Promise.allSettled([
        axios('https://portalprepagos.cgd.pt/portalprepagos/login.seam', {
            method: 'get'
        }),
        axios('https://portalprepagos.cgd.pt/portalprepagos/auth/forms/login.fcc', {
            method: 'post',
            maxRedirects: 0,
            data: `target=%2Fportalprepagos%2Fprivate%2Fhome.seam&username=PPP${username}&userInput=${username}&passwordInput=*****&loginForm%3Asubmit=Entrar&password=${password}`
        })
    ]);

    if (getJsession.status !== 'fulfilled' || (getSmsession.status === 'rejected' && getSmsession.reason.response.status !== 302)) {
        res.status(500).send("CGD API changed");
        return;
    }
    const cookies = setCookieParser.parse(getJsession.value.headers['set-cookie']).concat(setCookieParser.parse(getSmsession.reason.response.headers['set-cookie']));

    const containsSMSession = cookies.some(cookie => cookie.name === 'SMSESSION');

    if (!containsSMSession) {
        res.status(401).send("Wrong login or blocked account");
        return;
    }

    const cookieStr = cookies.reduce((acc, cookie) => acc + cookie.name + '=' + cookie.value + ';', '');

    const page = await axios('https://portalprepagos.cgd.pt/portalprepagos/private/saldoMovimentos.seam', {
        method: 'get',
        headers: {
            'Cookie': cookieStr
        }
    });

    const $ = cheerio.load(page.data);

    const data = {};
    data.balance = $('label', 'p.valor').text();

    const table = $('table.bordertable.clear');
    const tableRows = $('tr', table);
    const tableHeader = tableRows.splice(0, 1);
    const tableBody = tableRows.splice(0, tableRows.length - 1);
    const tableHeaderColumns = [];
    const tableRowsColumns = [];
    $('td', tableHeader).each((headerColIdx, headerCol) => {
        tableHeaderColumns.push($(headerCol).text().replace(/\t/gi, "").replace(/\n/gi, ""));
    });

    tableBody.forEach((row) => {
        const rowColumns = [];
        $('td', row).each((colIdx, col) => {
            rowColumns.push($(col).text().replace(/\s\s+/g, ' ').trim());
        });
        tableRowsColumns.push(rowColumns);
    });

    data.columns = tableHeaderColumns;
    data.rows = tableRowsColumns.reverse();

    res.send(data);
});

module.exports = app;
