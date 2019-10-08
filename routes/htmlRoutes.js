var db = require("../models");
var bcrypt = require("bcryptjs");
var passport = require("passport");
var axios = require("axios");
var { ensureAuthenticated } = require("../config/auth");

module.exports = function(app) {
  // Load landing page
  app.get("/", function(req, res) {
    res.render("index");
  });

  //User dashboard page
  app.get("/dashboard", ensureAuthenticated, (req, res) => {
    db.Medication.findAll({
      where: {
        UserId: req.user.id
      }
    }).then(data => {
      var meds = data;
      var rxcuis = "";

      meds.forEach((med, i) => {
        if (meds.length === i + 1) {
          rxcuis = `${rxcuis} + ${med.rxNum}`;
        } else {
          rxcuis = `${rxcuis} + ${med.rxNum} + `;
        }
      });

      axios
        .get(
          `https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${rxcuis}`
        )
        .then(response => {
          res.render("dashboard", {
            name: req.user.firstname,
            id: req.user.id,
            meds: meds,
            interxtionTypes:
              response.data.fullInteractionTypeGroup[0].fullInteractionType
          });
        });
    });
  });

  //login page
  app.get("/login", (req, res) => {
    res.render("login", {});
  });

  //user registration page
  app.get("/register", (req, res) => {
    res.render("register", {});
  });

  //registers a new user
  app.post("/register", (req, res) => {
    var { firstname, lastname, email, password, password2 } = req.body;
    let errors = [];

    //blank field validation
    if (!firstname || !lastname || !email || !password || !password2) {
      errors.push({ msg: "Please fill in all fields" });
    }

    //password match validation
    if (password !== password2) {
      errors.push({ msg: "Passwords do not match" });
    }

    //Check PW length
    if (password.length < 6) {
      errors.push({ msg: "Password should be at least 6 characters" });
    }

    //Sends info back when register is re-rendered so that users do not have to re-type
    if (errors.length > 0) {
      res.render("register", {
        errors,
        firstname,
        lastname,
        email
      });
    } else {
      //Add user to DB
      db.User.findOne({
        where: {
          email: email
        }
      }).then(user => {
        if (user) {
          errors.push({ msg: "Email already has registered account" });
          res.render("register", {
            errors,
            firstname,
            lastname,
            email
          });
        } else {
          var newUser = new db.User({
            firstname,
            lastname,
            email,
            password
          });

          //user bcrypt to hash PW
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) {
                throw err;
              }

              newUser.password = hash;
              newUser
                .save()
                .then(() => {
                  //flash message that are sent when redirected to login
                  req.flash(
                    "success_msg",
                    "You are now registed, Please Login."
                  );
                  res.redirect("/login");
                })
                .catch(err => console.log(err));
            })
          );
        }
      });
    }
  });

  //Authenitcates user
  app.post("/login", (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/login",
      failureFlash: true
    })(req, res, next);
  });

  //logs out user
  app.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are now logged out");
    res.redirect("/login");
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
