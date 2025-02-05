import { Router } from "express";
import * as layerControl from '../controllers/layer.controller.js';

import { fileUpload } from "../configuration/upload.configuration.js";

const router = Router();

router.get('/', [] ,layerControl.getLayers);

router.get('/:layerId', [] ,layerControl.getLayer);

router.post('/', [fileUpload.fields([{name: 'layer_file', maxCount: 1},{name: 'layer_styles_file', maxCount: 1}])], layerControl.createLayer);

router.put('/:layerId', [fileUpload.fields([{name: 'layer_file', maxCount: 1},{name: 'layer_styles_file', maxCount: 1}])] ,layerControl.updateLayer);

router.delete('/:layerId', [] ,layerControl.deleteLayer);

export default router;