"use strict";
const { readdirSync } = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
import dbConfig from "../configs/config_db";

const sequelize = new Sequelize({
  database: dbConfig.database,
  host: dbConfig.host,
  username: dbConfig.username,
  password: dbConfig.password,
  port: dbConfig.port,
  dialect: "postgres",
});

const modelsDB = {};

readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file)).default(sequelize);
    modelsDB[model.name] = model;
  });

Object.keys(modelsDB).forEach((modelName) => {
  if (modelsDB[modelName].associate) {
    modelsDB[modelName].associate(modelsDB);
  }
});

modelsDB.sequelizeInst = sequelize;
modelsDB.Sequelize = Sequelize;

module.exports = modelsDB;
