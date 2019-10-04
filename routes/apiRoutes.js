var db = require("../models");
var { ensureAuthenticated } = require("../config/auth");

module.exports = function(app) {
  // // Get all examples
  // app.get("/api/examples", function(req, res) {
  //   db.Example.findAll({}).then(function(dbExamples) {
  //     res.json(dbExamples);
  //   });
  // });

  // // Create a new example
  // app.post("/api/examples", function(req, res) {
  //   db.Example.create(req.body).then(function(dbExample) {
  //     res.json(dbExample);
  //   });
  // });

  // // Delete an example by id
  // app.delete("/api/examples/:id/:name", function(req, res) {
  //   db.Example.destroy({ where: { id: req.params.id } }).then(function(
  //     dbExample
  //   ) {
  //     res.json(dbExample);
  //   });
  // });

  //Delete Medication form DB
  app.delete("/api/del-med/:id", (req, res) => {
    var id = req.params.id;

    db.Medication.destroy({ where: { id } }).then(data => {
      res.json(data);
    });
  });

  //Add Medication to DB
  app.post("/api/add-meds/:id/:name", ensureAuthenticated, (req, res) => {
    var { rxNum, rxName } = req.body;
    let errors = [];

    if (!rxNum || !rxName) {
      errors.push({ msg: "Please fill in all fields" });
    }

    if (errors.length > 0) {
      req.flash("error_msg", rxName + "Please input all Medication Info");
      res.redirect("/dashboard");
    } else {
      var newMed = new db.Medication({
        rxName,
        rxNum,
        UserId: req.params.id
      });

      newMed
        .save()
        .then(() => {
          req.flash("success_msg", rxName + "has been added");
          res.redirect("/dashboard");
        })
        .catch(err => console.log(err));
    }
  });
};
