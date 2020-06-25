const functions = require('firebase-functions');
const when = require('when');
const axios = require('axios');
const setCookieParser = require('set-cookie-parser');
const cheerio = require('cheerio');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.api = functions.https.onRequest(async (request, response) => {
    const allowedCrossOrigins = ['http://localhost:5000'];
    if(allowedCrossOrigins.indexOf(request.headers.origin) > -1){
        response.set('Access-Control-Allow-Origin', request.headers.origin);
    }
    if (request.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        response.set('Access-Control-Allow-Methods', 'POST');
        response.set('Access-Control-Allow-Headers', 'Content-Type');
        response.set('Access-Control-Max-Age', '3600');
        response.status(204).send('');
        return;
    }
    const username = request.body.username || process.env.USERNAME;
    const password = request.body.password || process.env.PASSWORD;
    const period = request.body.period || 'UNBLD';

    if (!username || !password) {
        response.status(400).send('please add username and password on your post request');
        return;
    }

    const [getJsession, getSmsession] = await when.settle([
        axios('https://portalprepagos.cgd.pt/portalprepagos/login.seam', {
            method: 'get'
        }),
        axios('https://portalprepagos.cgd.pt/portalprepagos/auth/forms/login.fcc', {
            method: 'post',
            maxRedirects: 0,
            data: `target=%2Fportalprepagos%2Fprivate%2Fhome.seam&username=PPP${username}&userInput=${username}&passwordInput=*****&loginForm%3Asubmit=Entrar&password=${password}`
        })
    ]);

    if (getJsession.state !== 'fulfilled' || (getSmsession.state === 'rejected' && getSmsession.reason.response.status !== 302)) {
        response.status(500).send("CGD API changed");
        return;
    }
    const cookies = setCookieParser.parse(getJsession.value.headers['set-cookie']).concat(setCookieParser.parse(getSmsession.reason.response.headers['set-cookie']));

    const containsSMSession = cookies.some(cookie => cookie.name === 'SMSESSION');

    if (!containsSMSession) {
        response.status(401).send("Wrong login or blocked account");
        return;
    }

    const cookieStr = cookies.reduce((acc, cookie) => acc + cookie.name + '=' + cookie.value + ';', '');

    let movements = await axios('https://portalprepagos.cgd.pt/portalprepagos/private/saldoMovimentos.seam', {
        method: 'get',
        headers: {
            'Cookie': cookieStr
        }
    });

    if (period !== 'UNBLD') {
        // read default page
        const movementsTempPage = cheerio.load(movements.data);
        const cardId = movementsTempPage('option', '#consultaMovimentosCartoesPrePagos\\:selectedCard').attr('value');
        const javaxFace = movementsTempPage('#javax\\.faces\\.ViewState').attr('value');
        const body = `consultaMovimentosCartoesPrePagos=consultaMovimentosCartoesPrePagos&consultaMovimentosCartoesPrePagos%3AignoreFieldsComp=&consultaMovimentosCartoesPrePagos%3AselectedCard=${cardId}&consultaMovimentosCartoesPrePagos%3AextractDates=${encodeURI(period)}&javax.faces.ViewState=${javaxFace}`;
        movements = await axios('https://portalprepagos.cgd.pt/portalprepagos/private/saldoMovimentos.seam', {
            method: 'post',
            headers: {
                'Cookie': cookieStr
            },
            data: body
        });
    }

    const $ = cheerio.load(movements.data);

    const data = {};
    data.balance = $('label', 'p.valor').text().replace(",", ".");

    const table = $('table.bordertable.clear');
    const monthPeriods = $('option', '#consultaMovimentosCartoesPrePagos\\:extractDates');
    const tableRows = $('tr', table);

    //remove table header and footer
    const tableBody = tableRows.splice(1, tableRows.length - 2);
    const tableHeaderColumns = ["Data", "Descrição", "Valor"];
    const tableRowsColumns = [];
    const tablePeriods = [];

    monthPeriods.each((periodIdx, period) => {
        tablePeriods.push({
            key: $(period).attr('value'),
            value: $(period).text()
        });
    });

    tableBody.forEach(row => {
        const rowColumns = [];
        $('td', row).each((colIdx, col) => {
            //discard first row
            if (colIdx === 0) {
                return;
            }
            let value = $(col).text().replace(/\s\s+/g, ' ').trim().replace(",", ".") || 0;
            //Debit
            if (colIdx === 3 && value.length) {
                value = parseFloat("-" + value);
            }
            if (colIdx === 4 && value.length) {
                value = parseFloat(value);
            }
            if (value !== 0) {
                rowColumns.push(value);
            }
        });
        tableRowsColumns.push(rowColumns);
    });

    data.columns = tableHeaderColumns;
    data.rows = tableRowsColumns.reverse();
    data.periods = tablePeriods;
    data.lastUpdate = new Date();

    response.send(data);
});
