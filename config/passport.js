const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("../models");

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: "email"}, (email, password, done) => {
            //check if user exists in DB
            db.User.findOne({
                where: {
                    email: email
                }
            }).then(user => {
                console.log(user)
                if(!user){
                    return done(null, false, {message: "This Email is not a registered account!"});
                }

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch){
                        return done(null, user);
                    }else{
                        return done(null, false, "Password Incorrect!");
                    }
                });
            })
            .catch(err => console.log(err));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id)
    });

    passport.deserializeUser((id, done) => {
        db.User.findOne({where: {id: id}}).then(function(user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });
}