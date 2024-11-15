const { DataTypes, Sequelize } = require('sequelize');
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const URI = process.env.POSTGRESURI;
const sequelize = new Sequelize(URI, {dialect:'postgres'});

const Sync = sequelize.define("Sync", {
    sync_id: DataTypes.STRING,
    data: DataTypes.STRING
})

module.exports = {Sync}