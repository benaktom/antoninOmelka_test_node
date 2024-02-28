const express = require('express');
const moment = require('moment'); 
const http = require('http');
const router = express.Router();

const formatDate = (date) => {
	// [CR] moment.js je deprecated https://www.npmjs.com/package/moment
	return moment(date).format('DD.M.YYYY');
};

router.get('/', (req, res) => {
	const cardId = req.config.cardId;

	const finalResponse = {};
	const statePromise = new Promise((resolve) => {

		const options = {
			// [CR] hostname by se hodilo dát do konfigurace
			hostname: 'private-264465-litackaapi.apiary-mock.com',
			port: 80,
			path: `/cards/${cardId}/state`,
			method: 'GET'
		};
		// [CR] nešla by použít nějaká lepší knihovna, třeba axios nebo fetch/undici?
		// [CR] co když se request nezdaří?
		const httpreq = http.get(options, response => {
			response.setEncoding('utf8');
			response.on('data', chunk => {
				const data = JSON.parse(chunk);
				// [CR] co když jsou data nevalidní?
				finalResponse.state = data.state_description;
				resolve(response);
			});
		});
		httpreq.end();
	});

	const validityPromise = new Promise((resolve) => {

		const options = {
			hostname: 'private-264465-litackaapi.apiary-mock.com',
			port: 80,
			path: `/cards/${cardId}/validity`,
			method: 'GET'
		};
		// [CR] nešla by použít nějaká lepší knihovna, třeba axios nebo fetch/undici?
		// [CR] co když se request nezdaří?
		const httpreq = http.get(options, response => {
			response.setEncoding('utf8');
			response.on('data', chunk => {
				const data = JSON.parse(chunk);
				// [CR] co když jsou data nevalidní?
				// [CR] co když se nevrátí datum?
				finalResponse.validity = formatDate(data.validity_end);
				resolve(response);
			});
		});
		httpreq.end();
	});

	// [CR] co se nějaký request nepovede?
	Promise.all([statePromise, validityPromise]).then(() => {
		res.json(finalResponse);
	});
});

module.exports = {router: router, formatDate: formatDate};
