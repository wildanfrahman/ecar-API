const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Car = sequelize.define(
    "cars",
    {
      car_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      car_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      car_img: {
        type: DataTypes.BLOB,
        allowNull: false,
      },
      car_desc: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      car_spec: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      car_price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Car;
};
