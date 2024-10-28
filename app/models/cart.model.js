const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Cart = sequelize.define(
    "carts",
    {
      carts_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users", // Nama tabel users
          key: "id",
        },
      },
      car_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "cars", // Nama tabel cars
          key: "car_id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      total_price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  return Cart;
};
