module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  });

  return User;
};
