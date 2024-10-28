const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.car = require("../models/car.model.js")(sequelize, Sequelize);
db.cart = require("../models/cart.model.js")(sequelize, Sequelize);

//relasi
db.role.hasMany(db.user, {
  foreignKey: "role_Id",
  as: "users",
});
db.user.belongsTo(db.role, {
  foreignKey: "role_Id",
  as: "role",
});
db.cart.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
});
db.cart.belongsTo(db.car, {
  foreignKey: "car_id",
  as: "car",
});
db.ROLES = ["user", "admin"];

module.exports = db;
