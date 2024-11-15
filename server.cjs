const { Sequelize } = require("sequelize");
const { Sync } = require("./modals.cjs");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const URI = process.env.POSTGRESURI;
const sequelize = new Sequelize(URI);

async function connectToDatabase() {
console.clear()

  try {
    await sequelize.authenticate();
    Sync.sync();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

module.exports = { connectToDatabase, sequelize };
