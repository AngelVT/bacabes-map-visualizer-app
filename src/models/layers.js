import { DataTypes } from "sequelize";
import { pool } from "../configuration/database.configuration.js";

export const Layer = pool.define(
    'layer', {
        layer_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        layer_filename: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        layer_styles_filename: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        layer_field: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        layer_type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['polygon', 'point', 'line_chain']],
            }
        },
        layer_visibility: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['private', 'public']],
            }
        }
    }
);

(async () => {
    try {
        await pool.sync();
    } catch (error) {
        console.error(error)
    }
})();