import * as layerService from '../services/layer.service.js';

export const getLayers = async (req, res) => {
    try {
        const response = await layerService.requestAllLayers();

        res.status(response.status).json(response.data);

        console.log(response.log)
    } catch (error) {
        res.status(500).json({msg: "Internal server error"});
    }
}

export const getLayer = async (req, res) => {
    try {
        const ID = req.params.layerId;

        const response = await layerService.requestLayerByID(ID);

        res.status(response.status).json(response.data);

        console.log(response.log)
    } catch (error) {
        res.status(500).json({msg: "Internal server error"});
    }
}

export const createLayer = async (req, res) => {
    try {
        const DATA = req.body;

        const FILES = req.files;

        const response = await layerService.requestLayerRegistration(DATA, FILES);

        res.status(response.status).json(response.data);

        console.log(response.log)
    } catch (error) {
        res.status(500).json({msg: "Internal server error"});
        console.log(error)
    }
}

export const updateLayer = async (req, res) => {
    try {
        const ID = req.params.layerId;
        const DATA = req.body;
        const FILES = req.files;

        const response = await layerService.requestLayerUpdate(ID, DATA, FILES);

        res.status(response.status).json(response.data);

        console.log(response.log)
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"});
    }
}

export const deleteLayer = async (req, res) => {
    try {
        const ID = req.params.layerId;

        const response = await layerService.requestLayerDelete(ID);

        res.status(response.status).json(response.data);

        console.log(response.log)
    } catch (error) {
        res.status(500).json({msg: "Internal server error"});
    }
}