/* eslint-disable no-undef */
const assert = require('assert');
const card = require('./../routes/card.js');

describe('Card', () => {
	describe('formatDate()', () => {
		it('should return formated date', () => {
			assert.equal(card.formatDate('2020-08-12T00:00:00'), '12.8.2020');
		});
	});
});
