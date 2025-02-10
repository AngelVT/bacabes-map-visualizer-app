import { LayerGroup } from "../models/layer-group.model.js";
import { VisibilityGroup } from "../models/visibility-group.model.js";

export async function setDefaultValues() {
    try {
        await LayerGroup.sync();

        const LAYER_GROUP_COUNT = await LayerGroup.count();

        if (LAYER_GROUP_COUNT === 0) {
            await LayerGroup.create({ id: 1, group_name: 'General', group_description: 'Grupo de capas general' });

            console.info('Created default layer groups');
        }

        await VisibilityGroup.sync();

        const VISIBILITY_GROUP_COUNT = await VisibilityGroup.count();

        if (VISIBILITY_GROUP_COUNT === 0) {

            await Promise.all([
                VisibilityGroup.create({ id: 1, group_name: 'Publico', group_description: 'Visible para el publico en general, solo puede visualizar capas pertenecientes a este grupo.' }),
                VisibilityGroup.create({ id: 2, group_name: 'Privado', group_description: 'Visible para el instituto solamente, puede visualizar cualquier capa dentro del sistema.' })
            ]);

            console.info('Created default visibility groups');
        }
    } catch (error) {
        console.error('Error establishing default values on the DB', error)
    }
}