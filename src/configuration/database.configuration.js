import { Sequelize } from "sequelize";

const {
    MV_DB_PORT,
    MV_DB_HOST,
    MV_DB_DIALECT,
    MV_DB_DATABASE,
    MV_DB_USER,
    MV_DB_PASSWORD,
    MV_DB_TIMEZONE
} = process.env;

export const pool =  new Sequelize(MV_DB_DATABASE, MV_DB_USER, MV_DB_PASSWORD, {
    host: MV_DB_HOST,
    port: MV_DB_PORT,
    dialect: MV_DB_DIALECT,
    logging: false,
    timezone: MV_DB_TIMEZONE
});