import * as layerRepo from '../repositories/layer.repository.js';
import * as layerValidate from '../validations/layer.validations.js';
import * as layerUtils from '../utilities/layer.utilities.js';

export async function requestAllLayers() {
    const LAYERS = await layerRepo.findAllLayers();

    if (LAYERS == null || LAYERS.length == 0) {
        return {
            status: 404,
            data: {
                msg: "There are no layers to display."
            },
            log: "Request completed but there are no records to display."
        }
    }

    return {
        status: 200,
        data: {
            layers: LAYERS
        },
        log: "Request completed all records requested"
    };
}

export async function requestLayerByID(id) {
    const LAYER = await layerRepo.findLayerById(id);

    if (LAYER == null) {
        return {
            status: 404,
            data: {
                msg: "Layer not found."
            },
            log: "Request completed, the requested layer does not exist."
        }
    }

    return {
        status: 200,
        data: {
            layer: LAYER
        },
        log: `Request completed layer requested ${LAYER.id}`
    };
}

export async function requestLayerRegistration(newData, files) {
    const { layer_name,
        layer_field,
        layer_type,
        layer_visibility } = newData;

    if (!layer_name ||
        !layer_field ||
        !layer_type ||
        !layer_visibility) {
            return {
                status: 400,
                data: {
                    msg: "Unable to register layer due to missing information."
                },
                log: "Request not completed unable to register layer due to missing information"
            }
    }

    if (!files.layer_file || !files.layer_styles_file) {
        return {
            status: 400,
            data: {
                msg: "Unable to register layer due to missing files."
            },
            log: "Request not completed, the required files were not provided."
        }
    }

    if (!layerValidate.validateFiles(files.layer_file[0], files.layer_styles_file[0])) {
        return {
            status: 400,
            data: {
                msg: "Unable to register layer due to invalid files provided."
            },
            log: "Request not completed, wrong file types provided."
        }
    }


    const LAYER_IDENTIFIER = layerUtils.generateLayerIdentifier();

    files.layer_file[0].originalname = `${LAYER_IDENTIFIER}_layer.geojson`;
    files.layer_styles_file[0].originalname = `${LAYER_IDENTIFIER}_styles.json`;

    newData.layer_identifier = LAYER_IDENTIFIER;

    if (!layerUtils.saveLayerFiles(files.layer_file[0], files.layer_styles_file[0], 'public')) {
        return {
            status: 500,
            data: {
                msg: "Unable to register layer due to error when saving files."
            },
            log: "Request not completed, error writing files."
        }
    }

    const NEW_LAYER = await layerRepo.saveNewLayer(newData);

    if (NEW_LAYER == null) {
        return {
            status: 400,
            data: {
                msg: `Unable to create, due to a layer named as ${layer_name} already exist.`
            },
            log: `Request not completed, layer with name ${layer_name} already exist`
        };
    }

    return {
        status: 200,
        data: {
            layer: NEW_LAYER
        },
        log: "Request completed new layer created"
    };
}

export async function requestLayerUpdate(id, newData, files) {
    const { layer_name, layer_field, layer_type } = newData;

    if (!layer_name && !layer_field && !layer_type && !files) {
            return {
                status: 400,
                data: {
                    msg: "Unable to update layer due to information not provided."
                },
                log: "Request not completed, unable to update layer due to information not provided"
            }
    }

    const LAYER = await layerRepo.findLayerById(id);

    if (LAYER == null) {
        return {
            status: 404,
            data: {
                msg: "There requested layer does not exist"
            },
            log: `Request not completed layer ${id} not found`
        };
    }

    if (files.layer_file || files.layer_styles_file || layer_type || layer_field) {
        if (!files.layer_file || !files.layer_styles_file || !layer_field || !layer_type) {
            return {
                status: 400,
                data: {
                    msg: "Unable to update layer due to missing files, or missing layer type/layer field."
                },
                log: "Request not completed, the required files were not provided or layer information was missing."
            }
        }

        files.layer_file[0].originalname = LAYER.layer_filename;
        files.layer_styles_file[0].originalname = LAYER.layer_styles_filename;

        if (!layerUtils.updateLayerFiles(files.layer_file[0], files.layer_styles_file[0], LAYER.layer_visibility)) {
            return {
                status: 500,
                data: {
                    msg: "Unable to register layer due to error when saving files."
                },
                log: "Request not completed, error writing files."
            }
        }
    }

    const DATA = { layer_name, layer_field, layer_type }

    const MODIFIED_LAYER = await layerRepo.saveLayer(LAYER.id, DATA);

    if (MODIFIED_LAYER == null) {
        return {
            status: 404,
            data: {
                msg: "There requested layer does not exist"
            },
            log: `Request not completed layer ${LAYER.id} not found`
        };
    }

    return {
        status: 200,
        data: {
            layer: MODIFIED_LAYER
        },
        log: `Request completed record modified ${MODIFIED_LAYER.id}:${MODIFIED_LAYER.layer_name}`
    };
}

export async function requestLayerDelete(id) {
    const LAYER = await layerRepo.findLayerById(id);

    if (LAYER == null) {
        return {
            status: 404,
            data: {
                msg: "There requested layer does not exist"
            },
            log: `Request not completed layer ${id} not found`
        };
    }

    
    if (!await layerUtils.deleteLayerFiles(LAYER.layer_identifier, 'public')) {
        return {
            status: 500,
            data: {
                msg: "Error deleting layer, unable to delete files"
            },
            log: `Request not completed due to unable to delete layer files`
        };
    }

    const DELETED_LAYER = await layerRepo.deleteLayer(LAYER.id);

    if (DELETED_LAYER == null) {
        return {
            status: 404,
            data: {
                msg: "The requested layer does not exist"
            },
            log: `Request not completed layer ${LAYER.id} not found`
        };
    }

    return {
        status: 200,
        data: {
            msg: `Layer ${DELETED_LAYER.layer_name} deleted successfully.`
        },
        log: `Request completed:
            ID -> ${DELETED_LAYER.id}
            Layer name -> ${DELETED_LAYER.layer_name}`
    }
}
