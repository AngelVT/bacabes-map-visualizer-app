import { Layer } from "../models/layer.model.js";

export async function findAllLayers() {
    return await Layer.findAll({
        order: [
            ['layer_type', 'DESC']
        ],
        raw: true,
        nest: true
    });
}

export async function findLayerById(id) {
    return await Layer.findByPk(id, {
        raw: true,
        nest: true
    });
}

export async function saveNewLayer(newData) {
    const [NEW_LAYER, CREATED] = await Layer.findOrCreate({
        where: {
            layer_name: newData.layer_name
        },
        defaults: newData,
        raw: true,
        nest: true
    });

    return CREATED ? NEW_LAYER : null;
}

export async function saveLayer(id, newData) {
    const MODIFIED_LAYER = await Layer.findByPk(id);

    if (MODIFIED_LAYER == null) return MODIFIED_LAYER;

    await MODIFIED_LAYER.update(newData);

    return MODIFIED_LAYER;
}

export async function deleteLayer(id) {
    const DELETED_LAYER = await Layer.findByPk(id);

    if (DELETED_LAYER == null) return DELETED_LAYER;

    await DELETED_LAYER.destroy();

    return DELETED_LAYER;
}