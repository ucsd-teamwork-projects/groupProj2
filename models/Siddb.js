module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("user", {
    firstName: {
      type: DataTypes.STRING
    },
    middleName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
  });

  User.associate = function(models) {
    User.hasMany(models.Medication, {
      onDelete: "cascade"
    });
  };
  return User;
};
