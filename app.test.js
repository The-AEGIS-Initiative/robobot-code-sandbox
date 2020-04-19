var app = require('./app.js');

describe("app.js", () => {
	it('should exist', () => {
		expect(app).toBeDefined();
	});

	it('should have app.io (socket.io) initialized', ()=> {
		expect(app.io).toBeDefined();
	});
});