import { DataTypes } from "sequelize";
import { pool } from "../configuration/database.configuration.js";
import { LayerGroup } from "./layer-group.model.js";
import { VisibilityGroup } from "./visibility-group.model.js";

export const Layer = pool.define(
    'layer', {
        layer_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        layer_identifier: {
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
                isIn: [['polygon', 'point']],
            }
        },
        layer_visibility: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: VisibilityGroup,
                key: 'id'
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