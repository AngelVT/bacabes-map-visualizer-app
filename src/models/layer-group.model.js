import { DataTypes } from "sequelize";
import { pool } from "../configuration/database.configuration.js";

export const LayerGroup = pool.define(
    'layer_group', {
        group_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        group_description: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }
);