var db = require("../models");

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id/:name", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });

  //change to post
  app.post("/api/add-meds/:id/:name", (req, res) => {
    var { rxNum, rxName } = req.body;
    let errors = [];

    if (!rxNum || !rxName) {
      errors.push({ msg: "Please fill in all fields" });
    }

    if (errors.length > 0) {
      res.render("dashboard", {
        errors: errors,
        id: req.params.id,
        name: req.params.name
      });
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
