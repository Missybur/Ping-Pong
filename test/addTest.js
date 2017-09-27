// var app = require('../app'),
//     request = require('supertest'),
//     assert = require('assert')

// describe('when the test runs', function() {
//     it ('should insert 3 records in mongo db', function(done){
//         request(app)
//         .get('/')
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .end(function(err, res){
//             if (err) console.log(err);
//             else {
//                 console.log(res.text);
//                 var items = JSON.parse(res.text);
//                 for(var i = 0; i < items.length; i++) {
//                     var item = items[i];
//                     assert(_.has(item, 'username'));
//                     assert(_.has(item, 'email'));
//                     console.log(item.username);
//                     console.log(item.email);
//                 }
//             }
//             return done();
//         });
//     });
// });