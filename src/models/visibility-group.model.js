import { DataTypes } from "sequelize";
import { pool } from "../configuration/database.configuration.js";

export const VisibilityGroup = pool.define(
    'visibility_group', {
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