module.exports = function(sequelize, DataTypes) {
  var Medication = sequelize.define("Medication", {
    name: DataTypes.STRING,
    rx_num: DataTypes.STRING
  });

  Medication.associate = function(models){
    Medication.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Medication;
};
