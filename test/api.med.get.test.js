var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var db = require("../models");
var expect = chai.expect;

// Setting up the chai http plugin
chai.use(chaiHttp);

var request;

describe("GET /api/all-med", function() {
  // Before each test begins, create a new request server for testing
  // & delete all examples from the db
  beforeEach(function() {
    request = chai.request(server);
    return db.sequelize.sync({ force: true });
  });

  it("should find all examples", function(done) {
    // Add some examples to the db to test with
    db.User.create({id: 123, firstname: "John", lastname: "Doe", dob: new Date(), password: "testPW", email: "mail@mail.com"}).then(data => {
      db.Medication.bulkCreate([
        { rxName: "med1", rxNum: "123456", UserId: data.id },
        { rxName: "med2", rxNum: "098765", UserId: data.id }
      ]).then(function(res) {
        console.log('BULK OP COMPLETE');
        // Request the route that returns all examples
        request.get("/api/all-meds").end(function(err, res) {
          var responseStatus = res.status;
          var responseBody = res.body;
  
          // Run assertions on the response
  
          expect(err).to.be.null;
  
          expect(responseStatus).to.equal(200);
  
          expect(responseBody)
            .to.be.an("array")
            .that.has.lengthOf(2);
  
          expect(responseBody[0])
            .to.be.an("object")
            .that.includes({ rxName: "med1", rxNum: "123456", UserId: 123 });
  
          expect(responseBody[1])
            .to.be.an("object")
            .that.includes({ rxName: "med2", rxNum: "098765", UserId: 123 });

          expect(data)
            .to.be.an("object")
            .that.includes({ id: 123, firstname: "John", lastname: "Doe", password: "testPW", email: "mail@mail.com" });
  
          // The `done` function is used to end any asynchronous tests
          done();
        });
      }).catch(function(err) {
        console.log('FAILED TO INSERT DATA')
        console.log('ERR', err);
        expect(true).to.equal(false);
        done();
      });
    });
  });
});
