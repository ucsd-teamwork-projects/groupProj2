var db = require("../models");
var { ensureAuthenticated } = require("../config/auth");

module.exports = function(app) {
  //Delete Medication form DB
  app.delete("/api/del-med/:id", ensureAuthenticated, (req, res) => {
    var id = req.params.id;

    db.Medication.destroy({ where: { id } }).then(data => {
      res.json(data);
    });
  });

  //Add Medication to DB
  app.post("/api/add-meds/:id/:name", ensureAuthenticated, (req, res) => {
    var { rxNum, rxName } = req.body;
    let error = "";

    //checks if fields were blank
    if (!rxNum || !rxName) {
      error = "Please fill in all fields";
      req.flash("error_msg", error);
      res.redirect("/dashboard");
    } else {
      db.Medication.findOne({
        where: {
          rxNum,
          UserId: req.params.id
        }
      }).then(med => {
        if (med) {
          //errors if med already exists
          error = "You already have that medication listed";
          req.flash("error_msg", error);
          res.redirect("/dashboard");
        } else {
          var newMed = new db.Medication({
            rxName,
            rxNum,
            UserId: req.params.id
          });
          //adds med to DB
          newMed
            .save()
            .then(() => {
              req.flash("success_msg", rxName + " has been added");
              res.redirect("/dashboard");
            })
            .catch(err => console.log(err));
        }
      });
    }
  });
};
