var superagent = require('superagent');

describe('ping', function(){
	it('should respond to GET',function(){
		superagent
		.get('http://localhost:3000')
		.end(function(res){
			expect(res.status).to.equal(200);
		})
	})
});