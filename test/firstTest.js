var app = require('../app'),
    request = require('supertest'),
    assert = require('assert')

describe('when the test runs', function() {
    it ('should insert username', function(done){
        request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
            if (err) console.log(err);
            else {
                console.log(res.text);
                var items = JSON.parse(res.text);
                for(var i = 0; i < items.length; i++) {
                    var item = items[i];
                    assert(_.has(item, 'username'));
                }
            }
            return done();
        });
    });

    it ('should insert email into mongodb', function(done){
        request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
            if (err) console.log(err);
            else {
                console.log(res.text);
                var items = JSON.parse(res.text);
                for(var i = 0; i < items.length; i++) {
                    var item = items[i];
                    assert(_.has(item, 'email'));
                }
            }
            return done();
        });
    });
});

