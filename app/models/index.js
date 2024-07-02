const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.business = require("./business.js")(sequelize, Sequelize);
db.category = require("./category.js")(sequelize, Sequelize);

db.business.hasMany(db.category, { as: "category", foreignKey: "id_business", });
db.category.belongsTo(db.business, {
  foreignKey: "id_business",
  as: "business",
});

module.exports = db;
